"use strict";const{contextBridge:a,ipcRenderer:i}=require("electron");a.exposeInMainWorld("api",{send:(e,n)=>{["toMain"].includes(e)&&i.send(e,n)},receive:(e,n)=>{["fromMain"].includes(e)&&i.on(e,(l,...d)=>n(...d))}});
