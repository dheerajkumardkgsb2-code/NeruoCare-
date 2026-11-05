$base = "http://127.0.0.1:5002"

Write-Host "`n=== 1. HEALTH ===" -ForegroundColor Cyan
Invoke-RestMethod "$base/health" | Format-List

$body = @{
    responses = @(
        "test-user-001",
        "Male",
        21,
        "Mumbai",
        "Student",
        2,
        2,
        8.0,
        3,
        2,
        7.5,
        "Moderate",
        "Engineering",
        "No",
        6,
        2,
        "No"
    )
} | ConvertTo-Json

Write-Host "`n=== 2. PREDICT ===" -ForegroundColor Cyan
Invoke-RestMethod `
    -Uri "$base/predict" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body |
    ConvertTo-Json -Depth 10

Write-Host "`n=== 3. WELLNESS SCORE ===" -ForegroundColor Cyan
Invoke-RestMethod `
    -Uri "$base/predict/wellness-score" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body |
    ConvertTo-Json -Depth 10

Write-Host "`n=== 4. CLUSTER ===" -ForegroundColor Cyan
Invoke-RestMethod `
    -Uri "$base/predict/cluster" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body |
    ConvertTo-Json -Depth 10

$trendBody = @{
    scores = @(14, 12, 10, 8)
} | ConvertTo-Json

Write-Host "`n=== 5. TREND ===" -ForegroundColor Cyan
Invoke-RestMethod `
    -Uri "$base/predict/trend" `
    -Method POST `
    -ContentType "application/json" `
    -Body $trendBody |
    ConvertTo-Json -Depth 10

Write-Host "`n=== 6. CLUSTER ANALYSIS ===" -ForegroundColor Cyan
Invoke-RestMethod "$base/analysis/clusters" |
    ConvertTo-Json -Depth 10

Write-Host "`n=== 7. ASSOCIATIONS ===" -ForegroundColor Cyan
Invoke-RestMethod "$base/analysis/associations" |
    ConvertTo-Json -Depth 10

Write-Host "`n=== 8. FEATURE IMPORTANCE ===" -ForegroundColor Cyan
Invoke-RestMethod "$base/analysis/feature-importance" |
    ConvertTo-Json -Depth 10

Write-Host "`n=== ML TEST COMPLETE ===" -ForegroundColor Green