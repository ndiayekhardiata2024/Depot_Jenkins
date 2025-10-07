pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = 'ndiaye2024'
    }

    stages {

         stage('Init Docker Socket') {
            steps {
                script {
                    // S'assurer que Jenkins peut accéder au socket Docker
                    sh '''
                    if [ -S /var/run/docker.sock ]; then
                        echo "🔧 Correction des permissions du socket Docker"
                        sudo chown root:docker /var/run/docker.sock || true
                        sudo chmod 660 /var/run/docker.sock || true
                    else
                        echo "⚠️ Pas de socket Docker détecté !"
                    fi
                    '''
                }
            }
        }       
        stage('Checkout') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/main']],
                    extensions: [],
                    userRemoteConfigs: [[
                        credentialsId: 'github-jenkins',
                        url: 'https://github.com/ndiayekhardiata2024/Depot_Jenkins.git'
                    ]]
                )
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_HUB_REPO}/backend:latest ./mon-projet-express"
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_HUB_REPO}/frontend:latest ./"
                }
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'jenkinaute',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    sh "docker push ${DOCKER_HUB_REPO}/backend:latest"
                    sh "docker push ${DOCKER_HUB_REPO}/frontend:latest"
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    sh 'docker compose down || true'
                    sh 'docker compose up -d'
                }
            }
        }
    }

    post {
        success {
            emailext(
                subject: "✅ BUILD REUSSI - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """<html>
                    <body>
                        <p>Bonjour,</p>
                        <p>Le job <b>${env.JOB_NAME}</b> (build #${env.BUILD_NUMBER}) a été exécuté avec succès.</p>
                        <p>Consultez les logs ici : <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    </body>
                </html>""",
                to: 'ndiayekhardiata2024@gmail.com',
                from: 'ndiayekhardiata2024@gmail.com',
                replyTo: 'ndiayekhardiata2024@gmail.com',
                mimeType: 'text/html'
            )
        }

        failure {
            emailext(
                subject: "❌ BUILD ECHOUE - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """<html>
                    <body>
                        <p>Bonjour,</p>
                        <p>Le job <b>${env.JOB_NAME}</b> (build #${env.BUILD_NUMBER}) a échoué.</p>
                        <p>Consultez les logs ici : <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    </body>
                </html>""",
                to: 'ndiayekhardiata2024@gmail.com',
                from: 'ndiayekhardiata2024@gmail.com',
                replyTo: 'ndiayekhardiata2024@gmail.com',
                mimeType: 'text/html'
            )
        }

        always {
            sh 'docker logout'
        }
    }
}
