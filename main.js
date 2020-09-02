// handle setupevents as quickly as possible
const setupEvents = require('./setupevents')
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return
}

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, session } = require('electron')
const os = require('os')
const path = require('path')
const url = require('url')
const SerialPort = require('serialport')
const Store = require('electron-store')
const log = require('electron-log')
const io = require('socket.io')
const ip = require('ip')
const server = io.listen(29170)

const store = new Store()

// store.set('unicorn', '🦄')
// console.log('Unicorn Stored ', store.get('unicorn'))

// Initiate socket, userid, connection string and iniate serialPortLists
var socket
var userid = ''
var connString = ''
var serialPort
var serialPortLists = []

// require('./main-process/wifiList').then(data => console.log(data)).catch(err => console.log(err))

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null

// console.log('App Version', require('./main-process/appVersion'))

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1080,
		height: 720,
    webPreferences: {
      // nodeIntegration: true,
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'Icon.png'),
    'min-width': 500,
    'min-height': 200,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden'
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })

  /* if (mainWindow) {
    setInterval(function () {
      SerialPort.list()
      .then(ports => {
        if (JSON.stringify(ports) !== JSON.stringify(serialPortLists)) {
          // console.log('Ports ', ports)
          // console.log('SerialPort Lists ', serialPortLists)
          serialPortLists = ports
          mainWindow.webContents.send('fromMain', {
            elementid: 'serialport-list',
            value: ports
          })
        }
      })
      .catch(err => {
        console.error(err)
        log.error(err)
      })
    }, 1000)
  } */

})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('toMain', (event, args) => {
  console.log('Event', event)
  console.log('Args', args)
  if (args.state === 'window is ready') {
    server.on('connection', function (socket) {
      console.log('User Connected')
      socket.emit('welcome', 'Welcome to Pandaya+ Apps')
    })
  } else if (args.state === 'searching devices') {
    console.log('Data Serial ', args.data)
    if (args.data.length > 0) {
      setInterval(function () {
        SerialPort.list()
        .then(ports => {
          if (JSON.stringify(ports) !== JSON.stringify(serialPortLists)) {
            // console.log('Ports ', ports)
            // console.log('SerialPort Lists ', serialPortLists)
            serialPortLists = ports
            mainWindow.webContents.send('fromMain', {
              elementid: 'serialport-list',
              value: ports
            })
          }
        })
        .catch(err => {
          console.error(err)
          // log.error(err)
        })
      }, 1000)
    } else {
      SerialPort.list()
      .then(ports => {
        // serialPortLists = ports
        mainWindow.webContents.send('fromMain', {
          elementid: 'serialport-list',
          value: ports
        })
      })
      .catch(err => {
        console.error(err)
        // log.error(err)
      })
    }
  } else if (args.state === 'upload wifi config') {
    var wifiConfig = {
      ssid: args.data.ssid,
      psk: args.data.psk,
      appsAddress: ip.address()
    }
    console.log('Wifi Config ', wifiConfig)
    if (serialPort) {
      if (serialPort.isOpen) {
        serialPort.flush()
        serialPort.close()
      }
      serialPort = new SerialPort(args.data.path, {
        baudRate: 19200
      },
      function (err) {
        if (err) {
          console.error(err)
          mainWindow.webContents.send('fromMain', {
            elementid: 'notification',
            value: 'Failed to Send Config to Device'
          })
        } else {
          console.log('Serial Port is Open ', serialPort.isOpen)
          serialPort.write(JSON.stringify(wifiConfig))
          serialPort.on('data', function (data) {
            // get buffered data and parse it to an utf-8 string
            console.log('Data ', data.toString('utf-8'))
            /* mainWindow.webContents.send('fromMain', {
              elementid: 'notification',
              value: data.toString('utf-8')
            }) */
          })
        }
      })
    } else {
      serialPort = new SerialPort(args.data.path, {
        baudRate: 19200
      },
      function (err) {
        if (err) {
          console.error(err)
          mainWindow.webContents.send('fromMain', {
            elementid: 'notification',
            value: 'Failed to Send Config to Device'
          })
        } else {
          console.log('Serial Port is Open ', serialPort.isOpen)
          serialPort.write(JSON.stringify(wifiConfig))
          serialPort.on('data', function (data) {
            // get buffered data and parse it to an utf-8 string
            console.log('Data ', data.toString('utf-8'))
            /* mainWindow.webContents.send('fromMain', {
              elementid: 'notification',
              value: data.toString('utf-8')
            }) */
          })
        }
      })
    }
  }
})
