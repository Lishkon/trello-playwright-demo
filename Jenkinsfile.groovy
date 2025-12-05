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
          // Run tests in a named container so we can docker cp from it
          def exitCode = sh(
            script: '''
              set -eux

              # Clean up any previous container with same name
              docker rm -f pw-tests || true

              docker run --name pw-tests --pull=missing \
                mcr.microsoft.com/playwright:v1.53.2-jammy \
                bash -lc "
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

                  # Generate HTML report
                  npx playwright test tests/login.spec.ts --reporter=html
                "
            ''',
            returnStatus: true
          )

          // Mark build result but don’t abort pipeline; we still want the report
          if (exitCode != 0) {
            currentBuild.result = 'UNSTABLE'
          }
        }
      }
    }


    stage('Publish & Archive') {
      steps {
        script {
          sh '''
            set -eux

            # Copy report from the test container to Jenkins workspace
            # (workspace is the CWD when this runs)
            docker cp pw-tests:/work/playwright-report ./playwright-report || echo "No report directory to copy"
          '''

          // Now archive from Jenkins workspace
          archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true, allowEmptyArchive: true
        }
      }
      post {
        always {
          // Clean up the test container
          sh 'docker rm -f pw-tests || true'
        }
      }
    }
  }
}
