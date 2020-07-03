const electron= require('electron')
const {app, BrowserWindow, remote, BrowserView,ipcMain} = electron

// debug port
const port = 9008

function createWindow() {
    // create main window
    const winBounds = {
        width: 800,
        height: 600,
    }
    let win = new BrowserWindow({
        width: winBounds.width,
        height: winBounds.height,
        webPreferences: {
            nodeIntegration: true,
            //using webView Tag,this attr must be existed
            webviewTag: true
        }
    })

    win.loadFile('index.html')
    win.webContents.openDevTools({mode: 'detach'})
    const realContentHeight = win.getContentSize()[1]


    let view = new BrowserView({
        title:'devView',
        id:9
    })
    win.setBrowserView(view)
    view.setBounds({
        x: 0,
        y: parseInt(realContentHeight * 0.7),
        width: winBounds.width,
        height: parseInt(realContentHeight * 0.3)
    })

    //!!ATTENTION PLEASE!!
    // get webView contents
    // can not get webContents directly in main process ,because at this moment the webView dom may not be loaded
    // so the right way to get webContents is doing in icp

    ipcMain.on('dom-ready', () => {
        // find webview webContents
        const browserWebView=electron.webContents.getAllWebContents().find((item=>item.getURL().includes('http')))
        if (browserWebView) {
            browserWebView.setDevToolsWebContents(view.webContents)
            browserWebView.openDevTools()
        }
    });

}

app.whenReady().then(createWindow)
