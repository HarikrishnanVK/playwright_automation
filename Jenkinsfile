/* groovylint-disable-next-line CompileStatic */
pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.27.0-focal'
    }
  }
  stages {
    stage('install playwright') {
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

