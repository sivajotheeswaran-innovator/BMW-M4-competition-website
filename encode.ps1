# encode.ps1 – Re-encode all 12 clips for scroll scrubbing
# Must be run from the project root (m4-site/)
# Requires ffmpeg on PATH (or set $ffmpeg below)

param(
    [string]$ffmpeg = "ffmpeg",
    [int[]]$clips = 1..12
)

$raw    = ".\raw"
$videos = ".\videos"

foreach ($i in $clips) {
    $n   = $i.ToString("D2")
    $src = "$raw\v$n.mp4"
    $dst = "$videos\v$n.mp4"
    $mob = "$videos\v${n}_m.mp4"

    if (-not (Test-Path $src)) { Write-Warning "Missing: $src"; continue }

    Write-Host "`n=== Encoding v$n desktop ===" -ForegroundColor Cyan
    & $ffmpeg -y -i $src -vf scale=1280:-2 -c:v libx264 -g 1 -crf 23 -an -movflags +faststart $dst

    Write-Host "`n=== Encoding v$n mobile ===" -ForegroundColor Cyan
    & $ffmpeg -y -i $src -vf scale=720:-2 -c:v libx264 -g 1 -crf 26 -an -movflags +faststart $mob
}

Write-Host "`nAll done. Files in $videos\" -ForegroundColor Green
