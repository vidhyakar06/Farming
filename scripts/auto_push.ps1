# Auto-push script for Farming repository
# Watches workspace directory and pushes changes automatically to GitHub

$Watcher = New-Object System.IO.FileSystemWatcher
$Watcher.Path = $PSScriptRoot + "\.."
$Watcher.IncludeSubdirectories = $true
$Watcher.EnableRaisingEvents = $true
$Watcher.Filter = "*.*"

Write-Host "Auto-push watcher started. Watching for changes in Farming repository..." -ForegroundColor Green

$action = {
    $path = $Event.SourceEventArgs.FullPath
    if ($path -like "*\.git\*" -or $path -like "*\node_modules\*" -or $path -like "*\dist\*") {
        return
    }
    Write-Host "Change detected in: $path" -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    Set-Location -Path (Join-Path $PSScriptRoot "..")
    git add .
    $status = git status --porcelain
    if ($status) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "Auto-commit: $timestamp"
        git pull --rebase origin main
        git push origin main
        Write-Host "Changes successfully pushed to GitHub at $timestamp" -ForegroundColor Green
    }
}

Register-ObjectEvent $Watcher 'Changed' -Action $action | Out-Null
Register-ObjectEvent $Watcher 'Created' -Action $action | Out-Null
Register-ObjectEvent $Watcher 'Deleted' -Action $action | Out-Null

while ($true) {
    Start-Sleep -Seconds 5
}
