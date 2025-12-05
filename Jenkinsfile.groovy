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
          int exitCode = sh(
            script: '''
              set -eux

              # Make sure any old container with the same name is gone
              docker rm -f pw-tests || true

              docker run --name pw-tests --pull=missing \
                -e CI=1 \
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

                  # Generate HTML report only (no server, thanks to CI=1)
                  npx playwright test tests/login.spec.ts --reporter=html
                "
            ''',
            returnStatus: true
          )

          // Tests failed? Mark build as UNSTABLE, but KEEP GOING so we can still get the report
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

            echo "Workspace: $PWD"

            # Copy the HTML report from the test container into this workspace
            docker cp pw-tests:/work/playwright-report ./playwright-report || echo "No report directory to copy"

            echo "Contents of workspace after docker cp:"
            ls -R .
          '''

          // Archive whatever we have under playwright-report (if it's there)
          archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true, allowEmptyArchive: true
        }
      }
      post {
        always {
          // Clean up the container after we're done
          sh 'docker rm -f pw-tests || true'
        }
      }
    }
  }
}
