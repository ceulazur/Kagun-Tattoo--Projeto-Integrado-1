"use strict";const{app:t,BrowserWindow:l,ipcMain:r}=require("electron"),n=require("path");function a(){const o=!t.isPackaged;let e=new l({width:800,height:600,webPreferences:{preload:o?n.join(__dirname,"preload.js"):n.join(t.getAppPath(),"dist-electron","preload","preload.js"),nodeIntegration:!1,contextIsolation:!0,enableRemoteModule:!1}});e.setMenuBarVisibility(!1),o?e.loadURL("http://localhost:5173"):e.loadFile(n.join(t.getAppPath(),"dist","index.html")),e.webContents.on("did-fail-load",(s,i,d)=>{console.error(`Failed to load: ${d} (${i})`)}),e.webContents.on("did-finish-load",()=>{e.webContents.executeJavaScript(`
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; img-src 'self' data:; connect-src 'self' http://localhost:3000";
      document.getElementsByTagName('head')[0].appendChild(meta);
    `)}),e.on("closed",()=>{e=null})}r.on("toMain",(o,e)=>{console.log("Dados recebidos do renderer:",e);const s=`Processado pelo processo principal: ${e}`;o.reply("fromMain",s)});t.whenReady().then(a);t.on("window-all-closed",()=>{process.platform!=="darwin"&&t.quit()});t.on("activate",()=>{l.getAllWindows().length===0&&a()});
