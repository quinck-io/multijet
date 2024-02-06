pipeline {
  agent { label 'master' }

  tools {
    nodejs "nodejs18.12.1"
  }

  options {
    disableConcurrentBuilds()
  }

  stages {

    stage('Project Init') {
      steps {
        script {
          lastRunningStage="Project Init"
        }
        sh 'npm ci'
      }
    }

    stage('SonarQube analysis') {
      steps {
        script {
          lastRunningStage="SonarQube Analysis"
          def scannerHome = tool 'Sonar Scanner';
          withSonarQubeEnv(credentialsId: "sonarcloud-quinck-token", installationName: 'QuinckSonarcloud') {
              sh "${scannerHome}/bin/sonar-scanner -Dsonar.branch.name=${env.BRANCH_NAME}"
          }
        }
      }
    }


    stage('Quality Gate') {
      steps {
        script {
          lastRunningStage="Quality Gate"
          timeout(time: 1, unit: 'HOURS') {
            withSonarQubeEnv(credentialsId: "sonarcloud-quinck-token", installationName: 'QuinckSonarcloud') {
              def qualitygate = waitForQualityGate()
              if (qualitygate.status != "OK") {
                error "Pipeline aborted due to quality gate coverage failure: ${qualitygate.status}"
              }
            }
          }
        }
      }
    }
    

    stage("Build core") {
      when {
        anyOf {
          branch 'develop';
          branch 'master'
        }
      }
      steps {
        script {
          lastRunningStage = 'Build core'
        }
        sh 'cd core && npm ci && npm run build'
      }
    }

    stage("Publish") {
      when {
        anyOf {
          branch 'master'
        }
      }
      steps {
        script {
          lastRunningStage = 'Publish'
          withCredentials([string(credentialsId: 'quinck-npm-token', variable: 'NPM_TOKEN')]) {
            sh '''
              set +x
              echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
              npm whoami
              
              PUBLISHED_VERSION=$(npm show multijet version)
              PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')
              if [ "${PUBLISHED_VERSION}" = "${PACKAGE_VERSION}" ]; then
                echo "The current package version has already been published"
              else
                echo "Do pubblication"
                npm publish --access public
              fi
              
              rm .npmrc
            '''
          }
        }
      }
    }
  }

  post {
    always {
      script {
        deleteDir() /* clean up our workspace */
        }
    }
    failure {
      script {
        sh 'exit 1'
      }
    }
  }
}
