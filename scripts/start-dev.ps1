<#
Start both backend and frontend in separate PowerShell windows.
Usage:
  .\start-dev.ps1            # start servers (assumes deps already installed)
  .\start-dev.ps1 -Install  # run npm install before starting
#>
param(
    [switch]$Install
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = Resolve-Path (Join-Path $scriptDir '..')
$backendPath = Join-Path $repoRoot 'backend'
$frontendPath = Join-Path $repoRoot 'frontend'

Write-Host "Repository root: $repoRoot"

if ($Install) {
    Write-Host "Installing backend dependencies..."
    Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command',"Set-Location -Path '$backendPath'; npm install"

    Write-Host "Installing frontend dependencies..."
    Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command',"Set-Location -Path '$frontendPath'; npm install"

    Start-Sleep -Seconds 2
}

Write-Host "Starting backend (npm start) in new window..."
Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command',"Set-Location -Path '$backendPath'; npm start"

Start-Sleep -Seconds 1

Write-Host "Starting frontend (npm run dev) in new window..."
Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command',"Set-Location -Path '$frontendPath'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "Opening frontend in default browser: http://localhost:3000/"
Start-Process 'http://localhost:3000/'
