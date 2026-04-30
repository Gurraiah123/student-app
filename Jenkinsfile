pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "413027378314"
        ECR_REPO = "student-app"
        IMAGE_TAG = "latest"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Gurraiah123/student-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t student-app .'
            }
        }

       stage('Login to ECR') {
    steps {
        withCredentials([[
            $class: 'AmazonWebServicesCredentialsBinding',
            credentialsId: 'aws-creds'
        ]]) {
            sh '''
            aws ecr get-login-password --region ap-south-1 | \
            docker login --username AWS --password-stdin 413027378314.dkr.ecr.ap-south-1.amazonaws.com
            '''
        }
    }
}

        stage('Tag & Push') {
            steps {
                sh '''
                docker tag student-app:latest \
                $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG

                docker push \
                $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy to ECS') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds'
                ]]) {
                    sh '''
                    aws ecs update-service \
                    --region $AWS_REGION \
                    --cluster student-cluster \
                    --service student-service \
                    --force-new-deployment
                    '''
                }
            }
        }
    }
}
