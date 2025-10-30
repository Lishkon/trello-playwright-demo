# Playwright Test Automation Framework

This is a modular, scalable Playwright testing framework designed for end-to-end testing of modern web apps.

## 🚀 Features
- Page Object Model
- Test data generation and parameterization
- Environment-based test execution
- HTML and Allure reporting
- CI-friendly configuration

## 📁 Structure
- `tests/` – Test specs
- `pages/` – Page Object files
- `selectors/` – Page Object related selectors
- `utils/` – Helpers and utilities
- `playwright.config.ts` – Main config file

## 🧪 How to Run Locally
```bash
npm install
npx playwright test
npx playwright show-report
```
## 🧩 Running the Framework with Jenkins (Docker CI/CD Setup)
This section explains how to run the same framework using a local Jenkins CI/CD pipeline inside Docker.
It’s designed for demonstration, learning, or portfolio purposes.

## 🐋 Prerequisites

- Docker Desktop
- Git
- (Optional) Node.js for local debugging

Check versions:
```bash
docker -v
docker compose version
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