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
          echo "--- tests under /host_project/tests ---"
          find /host_project/tests -maxdepth 2 -type f -printf '%P\n' || true
        '''
      }
    }

    stage('Install & Test in Playwright image') {
      steps {
        script {
          catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
            sh '''
              set -eux

              docker run --rm --pull=missing \
                mcr.microsoft.com/playwright:v1.53.2-jammy \
                bash -lc '
                  set -euxo pipefail

                  if ! command -v git >/dev/null 2>&1; then
                    apt-get update
                    apt-get install -y git
                  fi

                  git clone --branch master --single-branch \
                    https://github.com/Lishkon/trello-playwright-demo.git /work
                  cd /work

                  node -v; npm -v
                  npm install

                  # IMPORTANT: enable HTML reporter in CI
                  CI=1 npx playwright test tests/login.spec.ts --reporter=html
                '
            '''
          }
        }
      }
    }



    stage('Publish & Archive') {
      steps {
        // /host_project is visible inside the Jenkins container
        dir('/host_project') {
          archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true, allowEmptyArchive: true
        }
      }
    }


  }
}
