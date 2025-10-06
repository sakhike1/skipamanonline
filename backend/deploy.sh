#!/bin/bash

# Skipaman Store - Production Deployment Script
# This script automates the deployment process

echo "🚀 Starting Skipaman Store Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Please install it first:"
    echo "npm install -g pm2"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the backend directory."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build the application
print_status "Building application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed. Please fix the errors and try again."
    exit 1
fi

# Check if ecosystem.config.js exists
if [ ! -f "ecosystem.config.js" ]; then
    print_error "ecosystem.config.js not found. Please ensure it exists."
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Start/restart the application with PM2
print_status "Starting application with PM2..."
pm2 reload ecosystem.config.js --env production

if [ $? -eq 0 ]; then
    print_status "Deployment successful!"
    echo ""
    echo "📊 Application Status:"
    pm2 status
    echo ""
    echo "🔧 Useful Commands:"
    echo "  View logs: npm run pm2:logs"
    echo "  Monitor: npm run pm2:monit"
    echo "  Restart: npm run pm2:restart"
    echo "  Stop: npm run pm2:stop"
    echo ""
    print_warning "Don't forget to:"
    echo "  1. Set up your production environment variables"
    echo "  2. Configure your reverse proxy (Nginx)"
    echo "  3. Set up SSL certificates"
    echo "  4. Configure your domain DNS"
else
    print_error "Deployment failed. Check the logs above for errors."
    exit 1
fi









