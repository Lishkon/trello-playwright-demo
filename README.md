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

## 🔐 Environment Variables Setup

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
Here is the template you should include in your README:
```bash
# ------------------------------
# Playwright Test Environment
# ------------------------------

# Trello/Atlassian Test Account
INVALID_USER_EMAIL=your-invalid-email
INVALID_USER_PASSWORD=your-invalid-password
USER_EMAIL=your-valid-email
USER_PASSWORD=your-invalid-password

# 2FA / TOTP (if applicable)
TOTP_SECRET=your-base32-secret-key
```

3. Save the file — nothing else is needed

Playwright loads `.env` automatically via dotenv (or via your helper functions loading from `process.env`).

> ⚠️ IMPORTANT: Never commit .env
 
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

- Pipeline -> Pipeline script from SCM -> SCM: Git
- Expand the Repositories:
- Repo URL: `https://github.com/Lishkon/trello-playwright-demo.gi`
- Add the new credentials and make sure they show in the Credentials field
- Enter `*/master` as a Branch Specifier
- Provide `Jenkinsfile.groovy` asthe Script Path option

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

✔ 5. Run the Pipeline
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