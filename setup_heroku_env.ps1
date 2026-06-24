$appName = "your-heroku-app-name" # TODO: Replace this with your actual Heroku app name

Write-Host "Setting environment variables for Heroku app: $appName"

$envContent = Get-Content -Path "frontend\.env.local" -ErrorAction Stop

foreach ($line in $envContent) {
    $line = $line.Trim()
    # Skip comments and empty lines
    if ($line -match "^#" -or $line -eq "") { continue }
    
    $index = $line.IndexOf("=")
    if ($index -gt 0) {
        $key = $line.Substring(0, $index).Trim()
        $value = $line.Substring($index + 1).Trim()
        
        Write-Host "Setting $key..."
        
        # We wrap the value in quotes to handle special characters correctly
        $command = "heroku config:set ""$key=$value"" -a $appName"
        Invoke-Expression $command
    }
}

Write-Host "✅ Environment variables have been successfully applied to Heroku!"
