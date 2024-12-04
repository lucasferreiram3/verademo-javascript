pipeline {
    agent any 
    environment {
        caminhoPacote = 'verascan/upload.tar.gz'
        wrapperVersion = '24.10.15.0'
        appProfile = 'verademo-javascript'
    }
    stages {
        stage('Packaging') { 
            steps {
                sh 'rm -rf verascan'
                sh 'mkdir verascan'
                sh 'find . -name "*.js" -o -name "*.html" -o -name "*.ts" -o -name "*.json" -o -name "*.css" | tar --exclude=./verascan --exclude=./*.git* --exclude=./*.github* --exclude=./*.png* --exclude=./*.svg* --exclude=./*.md* --exclude=./*.min* -cvzf verascan/upload.tar.gz .'
            }
        }

        stage('Veracode SAST Pipeline Scan') { 
            steps {
                withCredentials([usernamePassword(credentialsId: 'veracode-credentials', passwordVariable: 'VKEY', usernameVariable: 'VID')]) {
                    sh 'curl -sSO https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip'
                    sh 'unzip -o pipeline-scan-LATEST.zip'
                    sh 'java -jar pipeline-scan.jar --veracode_api_id "${VID}"  --veracode_api_key "${VKEY}" --file ${caminhoPacote} --issue_details true || true'
                }
            }
        }

        stage('Build Image') { 
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) { {
                    sh 'docker build -t verademo-javascript:v"${BUILD_NUMBER}" .'
                    sh 'docker images | grep verademo-javascript:v"${BUILD_NUMBER}"'
                    sh 'docker image push verademo-javascript:v"${BUILD_NUMBER}"'
                }
            }
        }

        stage('Aqua Image Scan') { 
            steps {
                withCredentials([string(credentialsId: 'AQUA_USER', variable: 'AQUA_USER'), string(credentialsId: 'AQUA_PASSWORD', variable: 'AQUA_PASS'), string(credentialsId: 'AQUA_HOST', variable: 'AQUA_HOST'), string(credentialsId: 'AQUA_SCANNER', variable: 'AQUA_SCANNER')]) {
                    sh 'docker login registry.aquasec.com -u ${AQUA_USER} -p ${AQUA_PASS}'
                    sh 'docker pull registry.aquasec.com/scanner:latest-saas'
                    sh 'docker run -v /var/run/docker.sock:/var/run/docker.sock registry.aquasec.com/scanner:latest-saas scan -H https://${AQUA_HOST}.cloud.aquasec.com -A ${AQUA_SCANNER} --local verademo:v"${BUILD_NUMBER}" '
                }
            }
        }

        stage("clean workspace") {
            steps {
                script {
                    sh 'ls'
                    sh 'docker rmi verademo-javascript:v"${BUILD_NUMBER}"'
                    cleanWs()
                    sh 'ls'
                }
            }
        }
    }
}