pipeline {
  agent any

  environment {
    PW_IMAGE = 'mcr.microsoft.com/playwright:v1.53.2-jammy'
  }

  options { timestamps() }

  stages {
    stage('Verify mount') {
      steps {
        sh '''
          set -eux
          rm -rf playwright-report
          echo "--- tests under /host_project/tests ---"
          find /host_project/tests -maxdepth 2 -type f -printf '%P\n' || true
        '''
      }
    }


    stage('Install & Test in Playwright image') {
      steps {
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
                mcr.microsoft.com/playwright:v1.53.2-jammy \
                bash -lc "
                  set -euxo pipefail
                  if ! command -v git >/dev/null 2>&1; then
                    apt-get update
                    apt-get install -y git
                  fi
                  git clone --branch main --single-branch https://github.com/Lishkon/trello-playwright-demo.git /work
                  cd /work
                  npm install
                  CI=1 npx playwright test tests/login.spec.ts --reporter=html
                "
            '''
          }
        }
      }
    }


    stage('Publish & Archive') {
      steps {
        script {
          sh '''
            set -eux

            echo "Workspace: $PWD"

            # Copy the HTML report from the test container into this workspace
            docker cp pw-tests:/work/playwright-report ./playwright-report || echo "No report directory to copy"

            echo "Contents of workspace after docker cp:"
            ls -R .
          '''

          // Archive the raw report files (optional but useful)
          archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true, allowEmptyArchive: true

          // Publish HTML report so it shows as a tab in Jenkins
          publishHTML(target: [
            reportDir: 'playwright-report',
            reportFiles: 'index.html',
            reportName: 'Playwright HTML Report',
            keepAll: true,
            alwaysLinkToLastBuild: true,
            allowMissing: true
          ])
        }
      }
      post {
        always {
          sh 'docker rm -f pw-tests || true'
        }
      }
    }
  }
}
