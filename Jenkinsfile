pipeline {
    agent any 
    environment {
        caminhoPacote = 'verascan/upload.tar.gz'
        wrapperVersion = '24.10.15.0'
        appProfile = 'verademo-javascript'
    }
    stages {
        stage('Protecting Source files JSCrambler') { 
            steps {
                withCredentials([string(credentialsId: 'JSCRAMBLER_ACCESS_KEY', variable: 'JSCRAMBLER_ACCESS_KEY'), string(credentialsId: 'JSCRAMBLER_ACCESS_SECRET', variable: 'JSCRAMBLER_ACCESS_SECRET'), string(credentialsId: 'JSCRAMBLER_APP_ID', variable: 'JSCRAMBLER_APP_ID')]){
                    sh 'docker pull lucasferreiram3/jscrambler-cli:latest'
                    sh 'docker run --rm -v ${PWD}/${PWD} lucasferreiram3/jscrambler-cli -a "${JSCRAMBLER_ACCESS_KEY}" -s "${JSCRAMBLER_ACCESS_SECRET}" -i "${JSCRAMBLER_APP_ID}" -c jscrambler.json -o protected'
                }
            }
        }

        stage("clean workspace") {
            steps {
                script {
                    sh 'ls'
                    sh 'rm -rf pipeline-scan.jar pipeline-scan.jar README '
                    sh 'docker rmi verademo-javascript:v"${BUILD_NUMBER}" -f'
                    sh 'docker rmi lucasferreiram3/verademo-javascript:v"${BUILD_NUMBER}" -f'
                    cleanWs()
                    sh 'ls'
                }
            }
        }
    }
}