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
                sh 'find . -name "*.js" -o -name "*.html" -o -name "*.ts" -o -name "*.json" -o -name "*.css" | tar --exclude=./verascan --exclude=./*.git* --exclude=./*.github* --exclude=./*.png* --exclude=./*.svg* --exclude=./*.md* --exclude=./*.min* --exclude=./*.zip* -cvzf verascan/upload.tar.gz .'
            }
        }

        stage('Veracode SAST Pipeline Scan') { 
            steps {
                withCredentials([usernamePassword(credentialsId: 'veracode-credentials', passwordVariable: 'VKEY', usernameVariable: 'VID')]) {
                    sh 'curl -sSO https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip'
                    sh 'unzip -o pipeline-scan-LATEST.zip'
                    sh 'java -jar pipeline-scan.jar --veracode_api_id "${VID}"  --veracode_api_key "${VKEY}" --file ${caminhoPacote} --issue_details true || true'
                    sh 'rm -rf pipeline-scan-LATEST.zip pipeline-scan.jar README results.json filtered_results.json'
                }
            }
        }

        stage('Protecting Source files JSCrambler') { 
            steps {
                withCredentials([string(credentialsId: 'JSCRAMBLER_ACCESS_KEY', variable: 'JSCRAMBLER_ACCESS_KEY'), string(credentialsId: 'JSCRAMBLER_ACCESS_SECRET', variable: 'JSCRAMBLER_ACCESS_SECRET'), string(credentialsId: 'JSCRAMBLER_APP_ID', variable: 'JSCRAMBLER_APP_ID')]){
                    sh 'docker pull lucasferreiram3/jscrambler-cli:latest'
                    sh 'docker run --rm -v ${PWD}/${PWD} lucasferreiram3/jscrambler-cli -a "${JSCRAMBLER_ACCESS_KEY}" -s "${JSCRAMBLER_ACCESS_SECRET}" -i "${JSCRAMBLER_APP_ID}" -c jscrambler.json -o protected'
                }
            }
        }

        stage('Build Image') { 
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh 'docker build -t verademo-javascript:v"${BUILD_NUMBER}" .'
                    sh 'docker tag verademo-javascript:v"${BUILD_NUMBER}" lucasferreiram3/verademo-javascript:v"${BUILD_NUMBER}"'
                    sh 'docker login -u "${DOCKER_USER}" -p "${DOCKER_PASS}"'
                    sh 'docker image push lucasferreiram3/verademo-javascript:v"${BUILD_NUMBER}"'
                }
            }
        }

        stage('Aqua Image Scan') { 
            steps {
                withCredentials([string(credentialsId: 'AQUA_USER', variable: 'AQUA_USER'), string(credentialsId: 'AQUA_PASSWORD', variable: 'AQUA_PASS'), string(credentialsId: 'AQUA_HOST', variable: 'AQUA_HOST'), string(credentialsId: 'AQUA_SCANNER', variable: 'AQUA_SCANNER')]) {
                    sh 'docker login registry.aquasec.com -u ${AQUA_USER} -p ${AQUA_PASS}'
                    sh 'docker pull registry.aquasec.com/scanner:latest-saas'
                    sh 'docker run -v /var/run/docker.sock:/var/run/docker.sock registry.aquasec.com/scanner:latest-saas scan -H https://${AQUA_HOST}.cloud.aquasec.com -A ${AQUA_SCANNER} --local lucasferreiram3/verademo-javascript:v"${BUILD_NUMBER}" '
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