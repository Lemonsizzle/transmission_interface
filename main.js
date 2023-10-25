const { app, ipcMain, BrowserWindow } = require("electron");
const fs = require("fs");
const Transmission = require("transmission");

// Create a new BrowserWindow when the app is ready
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 1000,
    height: 600,
  });

  // Load an HTML file into the window
  mainWindow.loadFile("index.html");

  // Open the DevTools (optional)
  mainWindow.webContents.openDevTools();
});

// Quit the app when all windows are closed (on macOS, this keeps the app running)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Create a new BrowserWindow when the app is activated (on macOS)
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
    });

    mainWindow.loadFile("index.html");

    // Open the DevTools (optional)
    mainWindow.webContents.openDevTools();
  }
});

let configPath = "config.json";
let config = {
  "address": "127.0.0.1",
  "port": 9091,
  "username": "",
  "password": ""
};

ipcMain.on("request-data", (event, arg) => {
  if (!fs.existsSync(configPath)){
    fs.writeFileSync(configPath, '', 'utf-8');
    console.log(`File "${configPath}" created.`);
    event.reply("response-data", null);
  }
  // Read the JSON file
  const jsonData = fs.readFileSync(configPath, "utf-8");

  // Parse the JSON data into a JavaScript object
  const data = JSON.parse(jsonData);

  if (data.hasOwnProperty("settings")){
    for (var key in data['settings']){
      config[key] = data['settings'][key];
    }
  }

  // Send the data back to the renderer process.
  event.reply("response-data", data['paths']);
});

ipcMain.on("download", (event, arg) => {
  let transmission = new Transmission({host: config['address'], port: config['port'], user: config['username'], password: config['password'], ssl:false});
  console.log(arg);
  transmission.addUrl(arg["url"], {"download-dir": arg["dir"]}, function(err, arg){if (err) console.error(err)});
  event.reply("download", "");
});
