pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "413027378314"
        ECR_REPO = "student-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
        IMAGE_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Gurraiah123/student-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $ECR_REPO .
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds'
                ]]) {
                    sh '''
                    aws sts get-caller-identity

                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                    '''
                }
            }
        }

        stage('Create ECR Repo (if not exists)') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds'
                ]]) {
                    sh '''
                    aws ecr describe-repositories \
                    --repository-names $ECR_REPO \
                    --region $AWS_REGION || \

                    aws ecr create-repository \
                    --repository-name $ECR_REPO \
                    --region $AWS_REGION
                    '''
                }
            }
        }

        stage('Tag & Push Image') {
            steps {
                sh '''
                docker tag $ECR_REPO:latest $IMAGE_URI
                docker push $IMAGE_URI
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
