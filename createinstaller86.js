const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
.then(createWindowsInstaller)
.catch((error) => {
  console.log('Error ', error.message || error)
  process.exit(1)
})

function getInstallerConfig () {
  console.log('Creating Windows Installer ...')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, '.build')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'pandaya-apps-win32-ia32/'),
    authors: '4DS',
    noMsi: true,
    outputDirectory: outPath,
    exe: 'pandaya-apps.exe',
    setupExe: 'PandayaAppsInstaller.exe',
    setupIcon: path.join(rootPath, 'Icon.ico')
  })
}
