# 🎯 Trello Playwright Demo - UI Test Automation + Dockerized Jenkins CI

This project is a real-world demonstration of building a modern UI test automation framework using Playwright, combined with DevOps practices sush as:

- Containerized Jenkins (Dockerized CI environment)
- Automated test execution inside Playwright Linux images
- HTML reporting + artifact archiving
- Pipeline debugging, permission handling, and report publishing

---

## 🚀 Features

### ✔ Playwright Test Automation

- Page Object Model
- TOTP helper for authentication
- Stable selector architecture
- Cross-browser testing (Chromium, Firefox, WebKit)

### ✔ DevOps / CI/CD

- Jenkins running inside Docker
- CI-mode Playwright runs (no GUI server, no hanging)
- Automated HTML report publishing
- Test artifact collection
- Clean pipeline retry logic & container isolation

### ✔ Stability Improvements

- Consistent error handling
- Corrected report duplication
- Fixed CI `reporter` brhavior
- Resolved Jenkins <docker.sock> permission limitations

---

## ⚙️ Prerequisites

You need the following installed locally:

- [] Docker Desktop
- [] Jenkins (Dockerized version)
- [] Node.js
- [] Git

👉 You do NOT need Playwright installed locally.
The tests run fully inside Dockerized Playwright images.

--- 

## 🧪 Running Tests Locally (Optional, No Docker/Jenkins reqiored)

1. Install dependencies: `npm install`
2. Run all tests: `npx playwright test`
3. Run only login tests: `npx playwright test tests/login.spec.ts`
4. View Playwrght HTML Report: `npx playwright show-report`

---

## 🐳 Running the Jenkins CI Pipeline

1. Build Jenkins image

```bash
docker build -t trello-playwright-demo-jenkins -f Dockerfile.jenkins .
```

2. Run Jenkins container

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

3. Open Jenkins

Go to:
```bash
http://localhost:4000
```

4. Create a Pipeline

Choose:

Pipeline -> Pipeline script from SCM
Repo URL: `https://github.com/Lishkon/trello-playwright-demo.gi`

Jenkins will automatically:
- Launch Playwright test container
- Install dependencies
- Run tests in CI mode
- Copy out `playwright-report`
- Publish it as a clickable HTML report 🎉

---

## 🛠️ Troubleshooting & Challenges Solved

✔ 1. Docker socket permission denied

Solved by running Jenkins as root inside the container (`-u root`).

✔ 2. Playwright HTML report not generating

Playwright GUI server was stuck -> fixed by using:

```bash
CI=1 npx playwright test
```

✔ 3. Reporter path duplication

Playwright sometimes generated nested `/playwright-report/playwright-report` folders.
Solution: clean workspace & enforce correct output directory.

✔ 4. HTML Publisher plugin showing empty page

Caused by incorrect path.
Fixed by publishing:
```bash
playwright-report/index.html
```

## ⚙️ Step-by-Step Jenkins Setup
1️⃣ Create a `docker-compose.yml`
```yaml
version: '3.9'

services:
  jenkins:
    image: jenkins/jenkins:lts-jdk17
    container_name: jenkins
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - .:/host_project
    environment:
      - JAVA_OPTS=-Dhudson.model.DirectoryBrowserSupport.CSP=sandbox\ allow-scripts;\ default-src\ 'self'\ 'unsafe-inline'\ 'unsafe-eval'\ data:\ blob:;\ img-src\ 'self'\ data:\ blob:;\ style-src\ 'self'\ 'unsafe-inline';\ connect-src\ 'self'\ data:\ blob:

volumes:
  jenkins_home:
```
## 2️⃣ Start Jenkins
```bash
docker compose up -d
```

Open Jenkins at:
👉 http://localhost:8080

Retrieve the admin password:
```bash
docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```
Finish setup → install recommended plugins → create an admin account.

Plugins:
- ✅ _Pipeline_ (`workflow-aggregator`)
- ✅ _Git_
- ✅ _NodeJS_
- ✅ _JUnit_
- ✅ _HTML Publisher_

## 3️⃣ Create a Jenkins Pipeline Job
1. In Jenkins → click New Item
2. Name it (e.g., Playwright_CI)
3. Choose Pipeline
4. Under Pipeline:
    - Definition: “Pipeline script”
    - Script Path: `Jenkinsfile.groovy` (if stored in repo)

## 4️⃣ Example Jenkinsfile.groovy
```groovy
pipeline {
  agent any

  stages {
    stage('Verify mount') {
      steps {
        sh 'ls -la /host_project'
      }
    }

    stage('Install & Test in Playwright image') {
      steps {
        sh '''
          docker run --rm -v /host_project:/work -w /work mcr.microsoft.com/playwright:v1.53.2-jammy bash -lc "
            node -v &&
            npm ci &&
            npx playwright install --with-deps &&
            npx playwright test ||
            EXIT_CODE=1;
            mkdir -p reports/html;
            npx playwright show-report reports/html --print-config > /dev/null 2>&1 || true;
            exit 0"
        '''
      }
    }

    stage('Publish Reports') {
      steps {
        junit allowEmptyResults: true, testResults: 'reports/junit/results.xml'
        publishHTML([
          reportDir: 'playwright-report',
          reportFiles: 'index.html',
          reportName: 'Playwright HTML Report',
          keepAll: true,
          alwaysLinkToLastBuild: true,
          linkTarget: '_blank'
        ])
      }
    }
  }
}
```
## 5️⃣ Run the Pipeline
In Jenkins → open your job → click Build Now

You’ll see:

📦 Containerized Playwright test execution
✅ Test result summary in Jenkins
🖥 Full Playwright HTML report available as an artifact

## 7️⃣ Maintenance Commands
| Command	                                    | Description                |
| --------------------------------------------- | -------------------------- |
| docker compose ps	                            | Show running containers    |
| docker compose down	                        | Stop Jenkins               |
| docker exec -it jenkins bash	                | Open Jenkins shell         |
| docker logs jenkins --tail=50                 | View Jenkins logs          |
| docker volume rm playwright-demo_jenkins_home	| Reset Jenkins completely   |

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