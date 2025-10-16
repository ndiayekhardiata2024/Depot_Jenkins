pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = 'ndiaye2024'
        KUBE_TOKEN = credentials('kube-token') // 🔐 Token Kubernetes injecté
    }

    stages {

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

        /* stage('Analyse SonarQube') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    withCredentials([string(credentialsId: 'jenkins-token', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                            -Dsonar.projectKey=Depot_Jenkins \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://172.17.0.2:9000 \
                            -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        } */

        stage('Build Backend Image') {
            steps {
                sh "docker build -t ${DOCKER_HUB_REPO}/backend:latest ./mon-projet-express"
            }
        }

        stage('Build Frontend Image') {
            steps {
                sleep 5
                sh "docker build -t ${DOCKER_HUB_REPO}/frontend:latest ./"
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
                sh "docker push ${DOCKER_HUB_REPO}/backend:latest"
                sh "docker push ${DOCKER_HUB_REPO}/frontend:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    echo "🔧 Configuration de kubectl pour Jenkins..."

                    kubectl config set-cluster kind-filrouge-cluster \
                        --server=https://filrouge-cluster-control-plane:6443 \
                        --insecure-skip-tls-verify=true

                    kubectl config set-credentials jenkins-user \
                        --token=$KUBE_TOKEN

                    kubectl config set-context jenkins-context \
                        --cluster=kind-filrouge-cluster \
                        --user=jenkins-user

                    kubectl config use-context jenkins-context

                    echo "🚀 Déploiement sur Kubernetes..."
                    kubectl apply -f k8s/ --validate=false
                    kubectl rollout status deployment/backend
                    kubectl rollout status deployment/frontend
                    kubectl rollout status deployment/mongo
                '''
            }
        }

        /* stage('Deploy with Docker Compose') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        } */
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
