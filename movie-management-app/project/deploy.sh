#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Variables
PROJECT_ID="movie-management-mpp"
REGION="us-central1"
SERVICE_NAME="movie-management-app"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Build the Docker image
echo "Building Docker image..."
docker build -t ${IMAGE_NAME} .

# Push the image to Google Container Registry
echo "Pushing image to Google Container Registry..."
docker push ${IMAGE_NAME}

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
    --image ${IMAGE_NAME} \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --set-env-vars="NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL},NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}"

echo "Deployment completed successfully!" 