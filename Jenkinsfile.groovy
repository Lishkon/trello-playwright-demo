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
        sh '''
          # Outer shell is /bin/sh (dash) -> no pipefail support here
          set -eux

          docker run --rm --pull=missing \
            mcr.microsoft.com/playwright:v1.53.2-jammy \
            bash -lc '
              # Inner shell is bash -> pipefail is fine
              set -euxo pipefail

              # Ensure git is available (Playwright image may already have it, but this is safe)
              if ! command -v git >/dev/null 2>&1; then
                apt-get update
                apt-get install -y git
              fi

              # Clone the repo fresh inside the container
              git clone --branch master --single-branch \
                https://github.com/Lishkon/trello-playwright-demo.git /work

              cd /work


              node -v; npm -v

              # Prefer ci; fall back to install if lockfile missing/old
              npm install

              # Ensure browsers present
              # npx playwright install --with-deps

              # NOTE: your file is login.spec.ts (lowercase L), not Login.spec.ts
              npx playwright test tests/login.spec.ts
            '
        '''
      }
    }


    stage('Publish & Archive') {
      steps {
        // Archive the HTML report as a build artifact
        archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
      }
    }

  }
}
