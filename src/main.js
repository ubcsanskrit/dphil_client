import { app, BrowserWindow, Menu } from 'electron'
import util from 'util'
import * as _ from 'lodash'
import appMenu from './menu'

// A few globals
global.util = util
global._ = _

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let defaultMenu

const isDevMode = process.execPath.match(/[\\/]node_modules[\\/]electron[\\/]/)

if (isDevMode) {
  require('electron-compile').enableLiveReload()
}

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600
  })

  // Open the DevTools.
  if (isDevMode) {
    const edt = require('electron-devtools-installer')
    const installExtension = edt.default
    const VUEJS_DEVTOOLS = edt.VUEJS_DEVTOOLS
    installExtension(VUEJS_DEVTOOLS)
    .then((name) => mainWindow.webContents.openDevTools())
  }

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    Menu.setApplicationMenu(defaultMenu)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', (launchInfo) => {
  defaultMenu = Menu.getApplicationMenu()
  createWindow()
  Menu.setApplicationMenu(appMenu)
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
  Menu.setApplicationMenu(defaultMenu)
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
app.on('browser-window-blur', (window) => {
  Menu.setApplicationMenu(defaultMenu)
})

app.on('browser-window-focus', (window) => {
  Menu.setApplicationMenu(appMenu)
})
