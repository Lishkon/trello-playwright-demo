    # Trello Playwright Demo - UI Test Automation + Dockerized Jenkins CI

    This project is a real-world demonstration of building a modern UI test automation framework using Playwright, combined with DevOps practices such as:

    - Containerized Jenkins (Dockerized CI environment)
    - Automated test execution inside Playwright Linux images
    - HTML reporting + artifact archiving
    - Pipeline debugging, permission handling, and report publishing
    - Automatic build (scheduled and triggered)

    ## 📑 Table of Contents
    - [Trello Playwright Demo - UI Test Automation + Dockerized Jenkins CI](#-trello-playwright-demo---ui-test-automation--dockerized-jenkins-ci)
      - [Table of Contents](#-table-of-contents)
      - [Features](#-features)
        - [Playwright Test Automation](#-playwright-test-automation)
        - [DevOps / CI/CD](#-devops--cicd)
        - [Stability Improvements](#-stability-improvements)
      - [Prerequisites](#️-prerequisites)
      - [Project Structure](#project-structure)
      - [Environment Variables Setup - Local execution only](#-environment-variables-setup---local-execution-only)
      - [Running Tests Locally (Optional, No Docker/Jenkins required)](#-running-tests-locally-optional-no-dockerjenkins-required)
      - [Running the Jenkins CI Pipeline](#-running-the-jenkins-ci-pipeline)
      - [Troubleshooting \& Challenges Solved](#️-troubleshooting--challenges-solved)
      - [Maintenance Commands](#maintenance-commands)
      - [Example Output](#-example-output)
      - [Next Steps](#-next-steps)
      - [Contributing](#contributing)


    ---

    ## Features

    ### Playwright Test Automation

    - Page Object Model
    - TOTP helper for authentication
    - Stable selector architecture
    - Cross-browser testing (Chromium, Firefox, WebKit)

    ### DevOps / CI/CD

    - Jenkins running inside Docker
    - CI-mode Playwright runs (no GUI server, no hanging)
    - Automated HTML report publishing
    - Test artifact collection
    - Clean pipeline retry logic & container isolation

    ### Stability Improvements

    - Consistent error handling
    - Corrected report duplication
    - Fixed CI `reporter` behavior
    - Resolved Jenkins <docker.sock> permission limitations

    ---

    ## Prerequisites

    You need the following installed locally:

    - [ ] Docker Desktop
    - [ ] Jenkins (Dockerized version)
    - [ ] Node.js
    - [ ] Git
    - [ ] Docker Desktop
    - [ ] Jenkins (Dockerized version)
    - [ ] Node.js
    - [ ] Git

    👉 You do NOT need Playwright installed locally.
    The tests run fully inside Dockerized Playwright images.

    ---
    ## Project Structure

    ``` bash
    trello-playwright-demo/
    ├── .env # Environment variables (local only, gitignored)
    ├── Dockerfile.jenkins # Custom Jenkins image
    ├── Jenkinsfile.groovy # CI/CD pipeline definition
    ├── playwright.config.js # Playwright configuration
    ├── data/ # Test data constants
    ├── helpers/ # TOTP and utility helpers
    ├── pages/ # Page Object Model classes
    ├── selectors/ # Centralized selectors
    └── tests/ # Test specifications
    ```

    ---

    ## Environment Variables Setup - Local execution only

    This project requires a `.env` file to store sensitive configuration values such as login credentials used by Playwright tests.
    The `.env` file is not included in source control (it's ignored through `.gitignore`), so you must create it manually before running tests.

    1. Create a .env file in the project root:
    ```bash
    trello-playwright-demo/
    │
    ├── .env        ← create this file here
    ├── tests/
    ├── pages/
    ├── helpers/
    ...
    ```
    2. Add the required environment variables
            
    Store your credentials within the `.env` file:

    ```bash
    # ------------------------------
    # Playwright Test Environment
    # ------------------------------

    # Trello/Atlassian Test Account
    INVALID_USER_EMAIL=your-invalid-email
    INVALID_USER_PASSWORD=your-invalid-password
    USER_EMAIL=your-valid-email
    USER_PASSWORD=your-valid-password

    # 2FA / TOTP (if applicable)
    TOTP_SECRET=your-base32-secret-key
    ```

    3. Save the file — nothing else is needed

    Playwright loads `.env` automatically via dotenv (or via your helper functions loading from `process.env`).

    > ⚠️ IMPORTANT: Never commit .env
    > Use the Jenkin's Credentials to run the tests in CI/CD
    
    4. Set up the Jenkins Credentials - needed for running the tests in CI/CD:

    Open the pipeline -> Configure -> Proceed to Pipeline section -> In the Repositories subsection, click on "+ Add" next to the Credentials field

    Examples for this Trello project:
    - `trello-e2e-user` – type: “Username with password”
    - `trello-e2e-totp-secret` – type: “Secret text”
    - Any API keys, etc. – also “Secret text”

    Jenkins will encrypt these at rest and mask them in logs.

    Inject the secrets into the Jenkinsfile in the 'Install & Test in Playwright image' stage:

    ```bash
    steps{
      script {
          withCredentials([
          usernamePassword(
              credentialsId: 'trello-e2e-valid-user',
              usernameVariable: 'E2E_VALID_USER',
              passwordVariable: 'E2E_VALID_PASS'
          ),
          usernamePassword(
              credentialsId: 'trello-e2e-invalid-user',
              usernameVariable: 'E2E_INVALID_USER',
              passwordVariable: 'E2E_INVALID_PASS'
          ),
          string(
              credentialsId: 'TOTP_SECRET',
              variable: 'TOTP_SECRET'
          )
        ]) {
            // sh(...) here
        }
      }
    }
    ```

    Update the shell script to use the variables as parameters:

    ```bash
    steps{
      script {
          withCredentials([
            // ...
            // Credential variables
            // ...
        ]) {
            sh '''
                  set -eux

                  docker rm -f pw-tests || true

                  docker run --name pw-tests --pull=missing \
                    -e CI=1 \
                    -e USER_EMAIL=${E2E_VALID_USER} \
                    -e USER_PASSWORD=${E2E_VALID_PASS} \
                    -e INVALID_USER_EMAIL=${E2E_INVALID_USER} \
                    -e INVALID_USER_PASSWORD=${E2E_INVALID_PASS} \
                    -e TOTP_SECRET=${TOTP_SECRET} \
                    // ...
                    // rest of the script
                    // ...
                    "
                '''
        }
      }
    }
    ```
    Commit the changes and push to the origin branch.

    --- 

    ## Running Tests Locally (Optional, No Docker/Jenkins required)

    1. Install dependencies: `npm install`
    2. Run all tests: `npx playwright test`
    3. Run only login tests: `npx playwright test tests/login.spec.ts`
    4. View Playwright HTML Report: `npx playwright show-report`

    ---

    ## Running the Jenkins CI Pipeline

    5. Build Jenkins image

    ```bash
    docker build -t trello-playwright-demo-jenkins -f Dockerfile.jenkins .
    ```

    6. Run Jenkins container

    ```bash
    docker run -d ^
      --name trello-jenkins ^
      -u root ^
      -p 4000:8080 ^
      -p 50000:50000 ^
      -v jenkins-data:/var/jenkins_home ^
      -v //var/run/docker.sock:/var/run/docker.sock ^
      -v "C:\Users\<YOU>\trello-playwright-demo":/host_project ^
      trello-playwright-demo-jenkins
    ```

    7. Open Jenkins

    Go to:
    ```bash
    http://localhost:4000
    ```

    8. Create a Pipeline

    Choose:

    - Pipeline -> Pipeline script from SCM -> SCM: Git
    - Expand the Repositories:
    - Repo URL: `https://github.com/Lishkon/trello-playwright-demo.git`
    - Add the new credentials and make sure they show in the Credentials field - Refer to step 4 of the previous section
    - Enter `*/main` as a Branch Specifier
    - Provide `Jenkinsfile.groovy` as the Script Path option

    Jenkins will automatically:
    - Launch Playwright test container
    - Install dependencies
    - Run tests in CI mode
    - Copy out `playwright-report`
    - Publish it as a clickable HTML report 🎉

    ---

    ## Troubleshooting & Challenges Solved

    1. Docker socket permission denied

    Solved by running Jenkins as root inside the container (`-u root`).

    2. Playwright HTML report not generating

    Playwright GUI server was stuck -> fixed by using:

    ```bash
    CI=1 npx playwright test
    ```

    3. Reporter path duplication

    Playwright sometimes generated nested `/playwright-report/playwright-report` folders.
    Solution: clean workspace & enforce correct output directory.

    4. HTML Publisher plugin showing empty page

    Caused by incorrect path.
    Fixed by publishing:
    ```bash
    playwright-report/index.html
    ```

    5. Run the Pipeline
    In Jenkins → open your job → click Build Now

    You’ll see:

    📦 Containerized Playwright test execution
    ✅ Test result summary in Jenkins
    🖥 Full Playwright HTML report available as an artifact

    ##  Maintenance Commands
    | Command	                                      | Description                |
    | --------------------------------------------- | -------------------------- |
    | docker compose ps	                            | Show running containers    |
    | docker compose down	                          | Stop Jenkins               |
    | docker exec -it trello-jenkins bash	          | Open Jenkins shell         |
    | docker logs trello-jenkins --tail=50          | View Jenkins logs          |
    | docker volume rm jenkins-data               	| Reset Jenkins completely   |

    ## 🧾 Example Output
    ```java
    Running 54 tests using 8 workers
    ✓ Login functionality › loads correctly (11.8s)
    ✓ Login functionality › invalid password shows error (10.2s)
    ...
    ```
    In Jenkins:
    - “Test Result” tab → shows passed/failed test counts
    - “Playwright HTML Report” → opens full visual dashboard in new tab

    ## 💡 Next Steps
    - Integrate with GitHub SCM for automatic builds
    - Add Slack/email notifications
    - Extend pipeline with Docker-based test runners
    - Deploy Jenkins to a cloud VM (AWS, Azure, or DigitalOcean)

    ## Contributing

    See [COMMITS.md](./COMMITS.md) for commit message conventions used in this project.