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
          // Run Playwright tests in a named container so we can docker cp from it
          int exitCode = sh(
            script: '''
              set -eux

              # Make sure any old container with the same name is gone
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

                  # Generate HTML report alongside the list reporter
                  npx playwright test tests/login.spec.ts --reporter=html
                "
            ''',
            returnStatus: true
          )

          // Mark build result based on test outcome, but DO NOT abort the pipeline
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

            # Show current workspace location for sanity
            echo "Jenkins workspace is: $PWD"

            # Copy the Playwright HTML report from the test container into the workspace
            docker cp pw-tests:/work/playwright-report ./playwright-report || echo "No report directory to copy"

            # List what we just copied (helps debug if path is wrong)
            ls -R .
          '''

          // Now archive artifacts from the workspace
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
