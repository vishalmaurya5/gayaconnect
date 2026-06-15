Write-Host "🚀 Starting Gaya Connect Frontend Fix..." -ForegroundColor Cyan

# 1. Cleanup
Write-Host "🧹 Cleaning up old files..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" -ErrorAction SilentlyContinue }
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue }
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue }

# 2. Install
Write-Host "📦 Installing modern dependencies (Next.js Latest)..." -ForegroundColor Yellow
npm install --force

# 3. Run
Write-Host "✨ Everything is ready! Starting dev server..." -ForegroundColor Green
npm run dev
