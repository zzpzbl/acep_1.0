const electron = require('electron')
// Module to control application life.
const app = electron.app

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const {
    ipcMain, ipcRenderer
} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let sp;//要打开的端口

console.log(process.versions.node);
console.log(process.versions.electron);
console.log(process.versions.modules);


function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            // preload: path.join(__dirname, 'preload.js')
            enableRemoteModule: true
        }
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

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
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    app.quit()
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// ipcMain.on('ping-event', (event, arg) => {
//     console.log('shoudaole!');
//     mainWindow.webContents.send('pong-event', arg);
// })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// 打开串口并确认型号
// function openport(event, comName) {
//     // console.log(222);
//     sp = new serialport(comName, {
//         baudRate: 115200
//     });

//     sp.pipe(parser);

//     //确认是否成功打开串口
//     sp.on('error', (err) => {
//         console.log(err.message);
//     });

//     //进入配置模式并确认型号
//     sp.write('+++\r\n');
//     sp.write('AT+MODEL?\r\n');

//     let body = '';

//     const pattern = /<AT>(.*)<\/AT>/;
//     let array;
//     let res;

//     parser.on('data', (data) => {

//         data = data.trim();
//         body += data;
//         array = pattern.exec(body);
//         if (array !== null) {
//             // console.log('555555');
//             res = array[1];
//             console.log('res: ' + res);
//             body = '';
//             event.sender.send('asynchronous-reply', res);
//             // mainWindow.webContents.send('send-model', res);
//         }
//     });

// }

// ipcMain.on('asynchronous-message', (event, cmd) => { //主进程接收渲染进程的请求事件
//     // console.log(event);
//     openport(event, cmd);
// });

// ipcMain.on('ping-event', (event, cmd) => {
//     console.log(555);
//     mainWindow.webContents.send('pong-event', 'something');
// })