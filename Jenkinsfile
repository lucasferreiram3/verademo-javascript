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
                sh 'find . -name "*.js" -o -name "*.html" -o -name "*.ts" -o -name "*.json" -o -name "*.css" | tar --exclude=./uploadToVeracode --exclude=./.git --exclude=./.github --exclude=./.png --exclude=./.svg --exclude=./.md -cvzf verascan/upload.tar.gz .'
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