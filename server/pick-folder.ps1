Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$owner = New-Object System.Windows.Forms.Form
$owner.Text = 'Lantern folder picker'
$owner.StartPosition = 'CenterScreen'
$owner.Size = New-Object System.Drawing.Size(1, 1)
$owner.ShowInTaskbar = $false
$owner.TopMost = $true
$owner.Opacity = 0
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = 'Choose a folder containing your shows for Lantern'
$dialog.ShowNewFolderButton = $false
try {
    $owner.Show()
    $owner.Activate()
    if ($dialog.ShowDialog($owner) -eq [System.Windows.Forms.DialogResult]::OK) {
        [Console]::Out.Write($dialog.SelectedPath)
    }
} finally {
    $dialog.Dispose()
    $owner.Dispose()
}
