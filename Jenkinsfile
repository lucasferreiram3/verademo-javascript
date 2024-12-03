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
                sh 'mkdir verascan'
                sh 'find . -name "*.js" -o -name "*.html" -o -name "*.ts" -o -name "*.json" -o -name "*.css" | tar --exclude=./verascan --exclude=./*.git* --exclude=./*.github* --exclude=./*.png* --exclude=./*.svg* --exclude=./*.md* -cvzf verascan/upload.tar.gz .'
            }
        }

        stage('Veracode SAST - Pipeline Scan') { 
            steps {
                withCredentials([usernamePassword(credentialsId: 'veracode-credentials', passwordVariable: 'VKEY', usernameVariable: 'VID')]) {
                    sh 'curl -sSO https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip'
                    sh 'unzip -o pipeline-scan-LATEST.zip'
                    sh 'java -jar pipeline-scan.jar --veracode_api_id "${VID}"  --veracode_api_key "${VKEY}" --file ${caminhoPacote}'
                }
            }
        }    
        stage("clean workspace") {
            steps {
                script {
                    sh "ls"
                    cleanWs()
                    sh "ls"
                }
            }
        }
    }
}