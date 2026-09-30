$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

$LogPath = Join-Path $PSScriptRoot 'github-bootstrap.log'
$RepoDefault = 'pipemark-studio'

function Write-Step([string]$Message) { Write-Host "[CHECK] $Message" -ForegroundColor Cyan }
function Write-Ok([string]$Message)   { Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-Warn([string]$Message) { Write-Host "[WARN] $Message" -ForegroundColor Yellow }
function Stop-WithError([string]$Message) { throw $Message }
function Has-Command([string]$Name) { return [bool](Get-Command $Name -ErrorAction SilentlyContinue) }

# Some GitHub CLI checks are expected to return a non-zero exit code (for example,
# when a repository or Pages configuration does not exist yet).  PowerShell 7 can
# promote native stderr/non-zero exits into errors when ErrorActionPreference is Stop.
# Run those probes in a non-terminating scope and return only the exit code.
function Invoke-Probe {
    param(
        [Parameter(Mandatory=$true)][scriptblock]$Command
    )
    $OldErrorActionPreference = $ErrorActionPreference
    $HadNativePreference = Test-Path variable:PSNativeCommandUseErrorActionPreference
    if ($HadNativePreference) { $OldNativePreference = $PSNativeCommandUseErrorActionPreference }
    try {
        $ErrorActionPreference = 'Continue'
        if ($HadNativePreference) { $PSNativeCommandUseErrorActionPreference = $false }
        & $Command 2>$null | Out-Null
        $Code = $LASTEXITCODE
        if ($null -eq $Code) { $Code = 0 }
        return [int]$Code
    }
    finally {
        $ErrorActionPreference = $OldErrorActionPreference
        if ($HadNativePreference) { $PSNativeCommandUseErrorActionPreference = $OldNativePreference }
    }
}

function Run-External {
    param(
        [Parameter(Mandatory=$true)][string]$File,
        [Parameter(ValueFromRemainingArguments=$true)][string[]]$Arguments
    )
    & $File @Arguments
    $Code = $LASTEXITCODE
    if ($null -eq $Code) { $Code = 0 }
    return $Code
}

try {
    try { Start-Transcript -Path $LogPath -Append -Force | Out-Null } catch {}

    Write-Step 'Checking project folder'
    if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'index.html'))) {
        Stop-WithError 'index.html was not found. Run this file inside the extracted project folder.'
    }
    Write-Ok $PSScriptRoot

    Write-Step 'Checking Git'
    if (-not (Has-Command 'git')) {
        Stop-WithError 'Git is not installed or not in PATH. Install Git for Windows, reopen this folder, and run again.'
    }
    git --version
    if ($LASTEXITCODE -ne 0) { Stop-WithError 'Git could not be started.' }
    Write-Ok 'Git is available'

    Write-Step 'Checking GitHub CLI (gh)'
    if (-not (Has-Command 'gh')) {
        Stop-WithError 'GitHub CLI (gh) is not installed or not in PATH. Install GitHub CLI, then run again.'
    }
    gh --version | Select-Object -First 1
    if ($LASTEXITCODE -ne 0) { Stop-WithError 'GitHub CLI could not be started.' }
    Write-Ok 'GitHub CLI is available'

    Write-Step 'Checking GitHub login'
    $AuthCode = Invoke-Probe { & gh auth status -h github.com }
    if ($AuthCode -ne 0) {
        Write-Warn 'GitHub login is required. A browser login will start now.'
        & gh auth login -h github.com -p https -w
        if ($LASTEXITCODE -ne 0) { Stop-WithError 'GitHub browser login did not complete successfully.' }
    }

    & gh auth status -h github.com
    if ($LASTEXITCODE -ne 0) { Stop-WithError 'GitHub login status is still invalid.' }

    $User = (& gh api user --jq '.login').Trim()
    $UserId = (& gh api user --jq '.id').Trim()
    if ([string]::IsNullOrWhiteSpace($User)) { Stop-WithError 'Could not read the GitHub account name.' }
    Write-Ok "GitHub account: $User"

    $Repo = Read-Host "Repository name [$RepoDefault]"
    if ([string]::IsNullOrWhiteSpace($Repo)) { $Repo = $RepoDefault }
    if ($Repo -notmatch '^[A-Za-z0-9._-]+$') {
        Stop-WithError 'Repository name may contain only letters, numbers, dot, underscore, and hyphen.'
    }

    $FullRepo = "$User/$Repo"
    $SiteUrl = "https://$User.github.io/$Repo/"

    Write-Step "Applying site URL: $SiteUrl"
    $ReplaceFiles = @('index.html','robots.txt','sitemap.xml','manifest.webmanifest','README.md')
    foreach ($FileName in $ReplaceFiles) {
        $Target = Join-Path $PSScriptRoot $FileName
        if (Test-Path -LiteralPath $Target) {
            $Content = Get-Content -LiteralPath $Target -Raw -Encoding UTF8
            $Content = $Content.Replace('__SITE_URL__', $SiteUrl)
            $Content = $Content.Replace('__REPOSITORY__', $Repo)
            $Content = $Content.Replace('__GITHUB_USER__', $User)
            Set-Content -LiteralPath $Target -Value $Content -Encoding UTF8
        }
    }
    Write-Ok 'Site metadata updated'

    if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot '.git'))) {
        Write-Step 'Initializing Git repository'
        & git init
        if ($LASTEXITCODE -ne 0) { Stop-WithError 'git init failed.' }
        & git branch -M main
        if ($LASTEXITCODE -ne 0) { Stop-WithError 'Could not set main branch.' }
    } else {
        Write-Step 'Using existing Git repository'
        & git branch -M main
        if ($LASTEXITCODE -ne 0) { Stop-WithError 'Could not set main branch.' }
        Write-Ok 'Existing .git folder detected'
    }

    $GitName = (& git config --get user.name 2>$null)
    $GitEmail = (& git config --get user.email 2>$null)
    if ([string]::IsNullOrWhiteSpace($GitName)) {
        & git config user.name $User
        if ($LASTEXITCODE -ne 0) { Stop-WithError 'Could not configure Git user.name.' }
    }
    if ([string]::IsNullOrWhiteSpace($GitEmail)) {
        & git config user.email "$UserId+$User@users.noreply.github.com"
        if ($LASTEXITCODE -ne 0) { Stop-WithError 'Could not configure Git user.email.' }
    }

    Write-Step 'Preparing commit'
    & git add -A
    if ($LASTEXITCODE -ne 0) { Stop-WithError 'git add failed.' }

    & git diff --cached --quiet
    $DiffCode = $LASTEXITCODE
    if ($DiffCode -eq 1) {
        & git commit -m 'feat: publish PipeMark Studio v6'
        if ($LASTEXITCODE -ne 0) { Stop-WithError 'git commit failed.' }
        Write-Ok 'Commit created'
    } elseif ($DiffCode -eq 0) {
        Write-Warn 'No new changes to commit'
    } else {
        Stop-WithError 'Could not check staged changes.'
    }

    Write-Step "Checking GitHub repository: $FullRepo"
    # A 404 here is expected for a first publish and must NOT terminate the script.
    $RepoCheckCode = Invoke-Probe { & gh api "repos/$FullRepo" --silent }
    $RepoExists = ($RepoCheckCode -eq 0)

    if (-not $RepoExists) {
        Write-Ok 'Repository does not exist yet; this is normal for the first publish.'
        Write-Step "Creating public repository: $FullRepo"
        & gh repo create $Repo --public --source . --remote origin
        if ($LASTEXITCODE -ne 0) { Stop-WithError 'GitHub repository creation failed.' }
        Write-Ok "Repository created: https://github.com/$FullRepo"
    } else {
        Write-Warn "Repository already exists: $FullRepo"
        $Answer = Read-Host 'Push this project to the existing repository? (Y/N)'
        if ($Answer -notmatch '^[Yy]') { Stop-WithError 'Publishing was cancelled by the user.' }

        # Do not call `git remote get-url origin` until we know that origin exists.
        # On Windows PowerShell, Git's "No such remote" stderr can become a terminating
        # NativeCommandError when ErrorActionPreference is Stop.
        $RemoteNames = @(& git remote)
        if ($LASTEXITCODE -ne 0) { Stop-WithError 'Could not read Git remotes.' }

        if ($RemoteNames -notcontains 'origin') {
            Write-Step 'Adding missing Git remote: origin'
            & git remote add origin "https://github.com/$FullRepo.git"
            if ($LASTEXITCODE -ne 0) { Stop-WithError 'Could not add Git remote origin.' }
            Write-Ok "origin added: https://github.com/$FullRepo.git"
        } else {
            $Origin = ((& git remote get-url origin) | Out-String).Trim()
            if ($LASTEXITCODE -ne 0) { Stop-WithError 'Could not read Git remote origin.' }
            if ($Origin -notmatch [regex]::Escape($FullRepo)) {
                Write-Warn "Current origin: $Origin"
                $ChangeOrigin = Read-Host "Replace origin with https://github.com/$FullRepo.git ? (Y/N)"
                if ($ChangeOrigin -notmatch '^[Yy]') { Stop-WithError 'Publishing stopped because origin points to another repository.' }
                & git remote set-url origin "https://github.com/$FullRepo.git"
                if ($LASTEXITCODE -ne 0) { Stop-WithError 'Could not update Git remote origin.' }
                Write-Ok 'origin URL updated'
            }
        }

        Write-Step 'Connecting this project folder to the existing main branch'
        $FetchCode = Invoke-Probe { & git fetch origin main }
        if ($FetchCode -eq 0) {
            $BaseCode = Invoke-Probe { & git merge-base HEAD origin/main }
            if ($BaseCode -ne 0) {
                Write-Warn 'The extracted folder has a new local Git history. Re-attaching its files on top of the existing GitHub history.'
                & git reset --soft origin/main
                if ($LASTEXITCODE -ne 0) { Stop-WithError 'Could not attach the local files to the existing remote history.' }
                & git add -A
                if ($LASTEXITCODE -ne 0) { Stop-WithError 'Could not stage the project after attaching remote history.' }
                & git diff --cached --quiet
                if ($LASTEXITCODE -eq 1) {
                    & git commit -m 'feat: update PipeMark Studio v6'
                    if ($LASTEXITCODE -ne 0) { Stop-WithError 'Could not create the update commit.' }
                    Write-Ok 'Update commit created on top of the existing GitHub history'
                }
            } else {
                Write-Ok 'Local and remote Git histories are already related'
                $AncestorCode = Invoke-Probe { & git merge-base --is-ancestor origin/main HEAD }
                if ($AncestorCode -ne 0) {
                    Write-Step 'Rebasing local update on the latest origin/main'
                    & git rebase origin/main
                    if ($LASTEXITCODE -ne 0) { Stop-WithError 'Rebase failed. Run git rebase --abort, review the conflict, then publish again.' }
                    Write-Ok 'Local update rebased on origin/main'
                }
            }
        } else {
            Write-Warn 'Could not fetch origin/main. The repository may be empty; continuing with the local commit.'
        }
    }

    Write-Step 'Updating GitHub repository details'
    $RepoDescription = 'Visual industrial label editor for pipe markers, safety signs and equipment labels with direct SVG/text manipulation, UI+label style packs, undo/redo, groups and A4/A3 print layouts. Local-first and GitHub Pages ready.'
    & gh api --method PATCH "repos/$FullRepo" -f description=$RepoDescription -f homepage=$SiteUrl -F has_issues=true -F has_projects=false -F has_wiki=false | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Warn 'Repository description/homepage could not be updated automatically.'
    } else {
        Write-Ok 'Description and Website were added to Repository details'
    }

    $TopicJson = @{ names = @('github-pages','label-maker','svg-editor','pipe-markers','safety-signs','industrial-design','local-first','print-tools','design-editor') } | ConvertTo-Json -Compress
    $TopicJson | & gh api --method PUT "repos/$FullRepo/topics" --input - | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Warn 'Repository topics could not be updated automatically.'
    } else {
        Write-Ok 'Repository topics were added'
    }

    Write-Step 'Pushing main branch to GitHub'
    & git push -u origin main
    if ($LASTEXITCODE -ne 0) {
        Stop-WithError 'git push failed. Review the Git error shown above and github-bootstrap.log.'
    }
    Write-Ok 'Push completed'

    Write-Step 'Configuring GitHub Pages for GitHub Actions'
    # A missing Pages configuration returns 404 on first publish. Treat that as a
    # normal state, then create the Pages configuration instead of throwing.
    $PagesCheckCode = Invoke-Probe { & gh api "repos/$FullRepo/pages" --silent }
    if ($PagesCheckCode -eq 0) {
        $PagesUpdateCode = Invoke-Probe { & gh api --method PUT "repos/$FullRepo/pages" -f build_type=workflow --silent }
        if ($PagesUpdateCode -eq 0) {
            Write-Ok 'GitHub Pages is configured for Actions'
        } else {
            Write-Warn 'Pages already exists, but the build type could not be changed automatically.'
        }
    } else {
        $PagesCreateCode = Invoke-Probe { & gh api --method POST "repos/$FullRepo/pages" -f build_type=workflow --silent }
        if ($PagesCreateCode -eq 0) {
            Write-Ok 'GitHub Pages enabled'
        } else {
            Write-Warn 'Automatic Pages setup failed. Open Repository > Settings > Pages and choose GitHub Actions.'
        }
    }

    Write-Step 'Checking deployment workflow'
    Start-Sleep -Seconds 4
    $RunId = (& gh run list --repo $FullRepo --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId' 2>$null).Trim()
    if (-not [string]::IsNullOrWhiteSpace($RunId)) {
        Write-Host "[INFO] Workflow run id: $RunId"
        & gh run watch $RunId --repo $FullRepo --exit-status
        if ($LASTEXITCODE -eq 0) {
            Write-Ok 'GitHub Pages deployment succeeded'
        } else {
            Write-Warn "The deployment workflow failed. Open https://github.com/$FullRepo/actions"
        }
    } else {
        Write-Warn 'No deployment run was found yet. Open the Actions page after a few seconds.'
    }

    Write-Host ''
    Write-Host '==============================================================' -ForegroundColor Green
    Write-Host "Repository : https://github.com/$FullRepo"
    Write-Host "Actions    : https://github.com/$FullRepo/actions"
    Write-Host "Pages      : $SiteUrl"
    Write-Host "Log        : $LogPath"
    Write-Host '==============================================================' -ForegroundColor Green

    try { Stop-Transcript | Out-Null } catch {}
    exit 0
}
catch {
    Write-Host ''
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "[INFO] Log file: $LogPath"
    Write-Host '[INFO] The CMD window will remain open so you can read this error.'
    try { Stop-Transcript | Out-Null } catch {}
    exit 1
}
