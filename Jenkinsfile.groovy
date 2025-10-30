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
          find /host_project/tests -maxdepth 2 -type f -printf "%P\n" 2>/dev/null || true
        '''
      }
    }

    stage('Install & Test in Playwright image') {
      steps {
        sh """
          set -eu
          docker run --rm --pull=missing \\
            -v "/host_project":/work \\
            -w /work \\
            ${PW_IMAGE} \\
            bash -lc '
              set -euxo pipefail
              node -v; npm -v

              # Prefer ci; fall back to install if lockfile format mismatches
              (npm ci) || (echo "[info] npm ci failed; falling back to npm install" && npm install)

              # Ensure browsers present
              npx playwright install --with-deps

              # Run the same spec you run locally
              npx playwright test tests/Login.spec.ts --reporter=html
            '
        """
      }
    }

    stage('Publish & Archive') {
      steps {
        sh '''
          rm -rf playwright-report || true
          if [ -d /host_project/playwright-report ]; then
            cp -r /host_project/playwright-report ./ || true
          fi
          echo "--- workspace report listing ---"
          find playwright-report -type f -printf "%P\n" 2>/dev/null || true
        ''' 

        sh '''
            echo "=== verify playwright report contents ==="
            if [ -f /host_project/playwright-report/data/test-results.json ]; then
                wc -c /host_project/playwright-report/data/test-results.json || true
                # show first keys to confirm it’s not empty
                head -n 5 /host_project/playwright-report/data/test-results.json || true
            else
                echo "No test-results.json found in playwright-report/data"
            fi

            echo "=== list tests dir ==="
            find /host_project/tests -maxdepth 2 -type f -name "*.spec.*" -printf "%P\n" 2>/dev/null || true

            echo "=== playwright lists discovered tests ==="
            npx --yes playwright list 2>/dev/null || true
            '''


        publishHTML target: [
          reportDir: 'playwright-report',
          reportFiles: 'index.html',
          reportName: 'Playwright HTML Report',
          keepAll: true,
          alwaysLinkToLastBuild: true
        ]

        archiveArtifacts artifacts: 'playwright-report/**', onlyIfSuccessful: false, fingerprint: true
      }
    }
  }
}
