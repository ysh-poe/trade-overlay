/* eslint-disable */

var electronInstaller = require('electron-winstaller')

resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: './dist/App-win32-x64',
  outputDirectory: './build/installer',
  authors: 'My App Inc.',
  exe: 'App.exe',
  description: 'aa'
})

resultPromise.then(() => console.log('It worked!'), (e) => console.log(`No dice: ${e.message}`))
