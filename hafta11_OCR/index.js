const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron')

const path = require("path")
const url = require("url")
let win
let progressInterval
const INCREMENT = 0.03
const INTERVAL_DELAY = 100
let islemDevam = false;
let tray = null;



const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  })

  //win.loadFile('veritabani.html')
  win.loadURL(url.format({
    pathname: path.join(__dirname, "dosya_yukle.html"),
    protocol: 'file',
    slashes: true
  }))
  win.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }
  });
  win.on('minimize', function (event) {
    event.preventDefault();
    win.hide();

  });

  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow()
  tray = new Tray('./simge.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Kapat', type: 'normal', click: () => { app.exit() } },
    { label: 'Item2', type: 'normal' },
    { label: 'Item3', type: 'normal', checked: true },
    { label: 'Item4', type: 'normal' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)

  tray.on("double-click", (e) => {
    win.show();
  })
  let c = 0

  ipcMain.on("islemBasladi", (e, args) => {
    console.log(args);
    islemDevam = true;
    progressInterval = setInterval(() => {
      if (!islemDevam) {
        clearInterval(progressInterval)
        win.setProgressBar(0);
      }
      // update progress bar to next value
      // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%
      win.setProgressBar(c)

      // increment or reset progress bar
      if (c < 2) {
        c += INCREMENT
      } else {
        c = (-INCREMENT * 5) // reset to a bit less than 0 to show reset state
      }
    }, INTERVAL_DELAY)
  })
  ipcMain.on("islemBitti", (e, args) => {
    islemDevam = false;
    setTimeout()
  })

})