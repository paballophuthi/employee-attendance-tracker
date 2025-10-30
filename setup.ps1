Write-Host "🚀 Employee Attendance Tracker - Complete Setup" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location "backend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend dependencies installation failed!" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "../frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend dependencies installation failed!" -ForegroundColor Red
    exit 1
}

Set-Location ".."

Write-Host "`n✅ Setup completed successfully!" -ForegroundColor Green
Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start XAMPP and run MySQL" -ForegroundColor White
Write-Host "2. Start backend: npm run dev:backend" -ForegroundColor White
Write-Host "3. Start frontend: npm run dev:frontend" -ForegroundColor White
Write-Host "`n🌐 Deployment Ready:" -ForegroundColor Cyan
Write-Host "• Backend: Configure Railway with MySQL" -ForegroundColor White
Write-Host "• Frontend: Configure Vercel with environment variables" -ForegroundColor White
Write-Host "`n📁 Project Structure Created:" -ForegroundColor Cyan
Get-ChildItem -Recurse -Name | ForEach-Object { Write-Host "  📄 $_" -ForegroundColor Gray }
