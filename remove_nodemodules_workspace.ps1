$workspace = Get-Location

Get-ChildItem -Path $workspace -Directory -Recurse -Force -Filter "node_modules" |
Where-Object {
    Test-Path (Join-Path $_.Parent.FullName "package.json")
} |
ForEach-Object {
    Write-Host "Elimino: $($_.FullName)"
    Remove-Item -Path $_.FullName -Recurse -Force
}

Write-Host "Pulizia completata."
Pause