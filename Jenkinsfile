/* groovylint-disable-next-line CompileStatic */
pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.26.1-focal'
    }
  }
  stages {
    stage('install playeright') {
      steps {
        sh '''
  npm i -D @playwright/test
  npx playwright install
  '''
      }
    }
    stage('help') {
      steps {
        sh 'npx playwright test --help'
      }
    }
    stage('test') {
      steps {
        sh '''
  npx playwright test --list
  npx playwright test
  '''
      }
    }
  }
}

