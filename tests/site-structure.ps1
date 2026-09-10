$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$failures = [System.Collections.Generic.List[string]]::new()

function Assert-True {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { $failures.Add($Message) }
}

function Read-RepoFile {
    param([string]$Path)
    return Get-Content -Raw (Join-Path $repoRoot $Path)
}

$requiredFiles = @(
    '_data/profile.yml',
    '_data/projects.yml',
    '_includes/site-header.html',
    '_includes/site-footer.html',
    'assets/css/site-shell.css',
    'assets/js/site-shell.js',
    '.github/workflows/jekyll-build.yml'
)

foreach ($path in $requiredFiles) {
    Assert-True (Test-Path (Join-Path $repoRoot $path)) "Missing required file: $path"
}

$navigation = Read-RepoFile '_data/navigation.yml'
Assert-True (([regex]::Matches($navigation, '(?m)^- title:')).Count -eq 4) 'Primary navigation must contain exactly four items.'

$defaultLayout = Read-RepoFile '_layouts/default.html'
Assert-True ($defaultLayout.Contains('{% include site-header.html %}')) 'Default layout must use the shared site header.'
Assert-True ($defaultLayout.Contains('{% include site-footer.html %}')) 'Default layout must use the shared site footer.'
Assert-True (-not $defaultLayout.Contains('sidebar-left')) 'Default layout must not use the legacy left sidebar.'

$homePage = Read-RepoFile 'index.html'
Assert-True ($homePage.StartsWith("---`n")) 'Home must contain Jekyll front matter.'
Assert-True ($homePage.Contains('{% include site-header.html %}')) 'Home must use the shared site header.'
Assert-True ($homePage.Contains('site.data.projects')) 'Home must render projects from shared data.'
Assert-True ($homePage.Contains('site.posts')) 'Home must render recent posts or an empty state.'

$cv = Read-RepoFile 'cv/index.html'
Assert-True ($cv.StartsWith("---`n")) 'CV must contain Jekyll front matter.'
Assert-True ($cv.Contains('{% include site-header.html %}')) 'CV must use the shared site header.'
foreach ($id in @('langEnBtn', 'langKoBtn', 'themeToggleBtn', 'printBtn', 'exportPdfBtn', 'cvContent')) {
    Assert-True (([regex]::Matches($cv, "id=`"$id`"")).Count -eq 1) "CV control id must occur exactly once: $id"
}

$portfolioScript = Read-RepoFile 'assets/js/portfolio.js'
foreach ($obsolete in @('createParticles', 'contactForm', 'lazyImages', 'createDarkModeToggle', 'data-target')) {
    Assert-True (-not $portfolioScript.Contains($obsolete)) "Portfolio script still contains obsolete feature: $obsolete"
}

$allSource = Get-ChildItem $repoRoot -Recurse -File |
    Where-Object { $_.FullName -notmatch '\\.git\\|Gemfile\.lock$|docs\\superpowers\\|tests\\' } |
    ForEach-Object { Get-Content -Raw $_.FullName -ErrorAction SilentlyContinue }
$joinedSource = $allSource -join "`n"
Assert-True (-not $joinedSource.Contains('Welcome to Not Pure Poole')) 'Upstream demo post is still present.'
Assert-True (-not $joinedSource.Contains('google_site_verification: xxxxx')) 'Placeholder search verification value is still present.'

if ($failures.Count -gt 0) {
    $failures | ForEach-Object { Write-Error $_ -ErrorAction Continue }
    exit 1
}

Write-Output 'Site structure checks passed.'
