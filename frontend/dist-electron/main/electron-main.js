"use strict";
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  }
  win.on("closed", () => {
    win = null;
  });
}
ipcMain.on("toMain", (event, args) => {
  console.log("Dados recebidos do renderer:", args);
  const resultado = `Processado pelo processo principal: ${args}`;
  event.reply("fromMain", resultado);
});
app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
//# sourceMappingURL=electron-main.js.map
