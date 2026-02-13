#!/bin/bash

echo "🚀 Laravel + Angular Starter - Quick Setup"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker found"

# Setup backend
echo ""
echo "📦 Setting up Laravel backend..."
cd backend

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
fi

echo "✅ Backend ready"

# Build and start
echo ""
echo "🐳 Building Docker containers..."
cd ..
docker-compose build

echo ""
echo "🏃 Starting containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Setup Laravel
echo ""
echo "⚙️  Running Laravel setup..."
docker-compose exec backend composer install --no-interaction
docker-compose exec backend php artisan key:generate
docker-compose exec backend php artisan jwt:secret
docker-compose exec backend php artisan migrate --force
docker-compose exec backend php artisan db:seed --force

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Access your application:"
echo "   - Frontend: http://localhost:4200"
echo "   - API: http://localhost:8000/api"
echo "   - phpMyAdmin: http://localhost:8080"
echo ""
echo "📚 Run tests:"
echo "   Backend: docker-compose exec backend php artisan test"
echo ""
