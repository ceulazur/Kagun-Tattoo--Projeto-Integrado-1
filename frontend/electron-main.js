const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.setMenuBarVisibility(false);

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  }

  win.webContents.on("did-finish-load", () => {
    win.webContents.executeJavaScript(`
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; img-src 'self' data:; connect-src 'self' http://localhost:3000";
      document.getElementsByTagName('head')[0].appendChild(meta);
    `);
  });

  win.on("closed", () => {
    win = null;
  });
}

// Adicione manipuladores IPC
ipcMain.on("toMain", (event, args) => {
  // Processar dados recebidos do renderer
  console.log("Dados recebidos do renderer:", args);

  // Lógica do processo principal
  const resultado = `Processado pelo processo principal: ${args}`;

  // Enviar resposta de volta ao renderer
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
