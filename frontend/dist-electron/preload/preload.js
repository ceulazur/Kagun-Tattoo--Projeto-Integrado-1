"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    const validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vcHJlbG9hZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyIH0gPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7XHJcblxyXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKFwiYXBpXCIsIHtcclxuICBzZW5kOiAoY2hhbm5lbCwgZGF0YSkgPT4ge1xyXG4gICAgLy8gQ2FuYWlzIHBlcm1pdGlkb3NcclxuICAgIGNvbnN0IHZhbGlkQ2hhbm5lbHMgPSBbXCJ0b01haW5cIl07XHJcbiAgICBpZiAodmFsaWRDaGFubmVscy5pbmNsdWRlcyhjaGFubmVsKSkge1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKGNoYW5uZWwsIGRhdGEpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgcmVjZWl2ZTogKGNoYW5uZWwsIGZ1bmMpID0+IHtcclxuICAgIGNvbnN0IHZhbGlkQ2hhbm5lbHMgPSBbXCJmcm9tTWFpblwiXTtcclxuICAgIGlmICh2YWxpZENoYW5uZWxzLmluY2x1ZGVzKGNoYW5uZWwpKSB7XHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKGNoYW5uZWwsIChldmVudCwgLi4uYXJncykgPT4gZnVuYyguLi5hcmdzKSk7XHJcbiAgICB9XHJcbiAgfSxcclxufSk7XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxFQUFFLGVBQWUsWUFBVyxJQUFLLFFBQVEsVUFBVTtBQUV6RCxjQUFjLGtCQUFrQixPQUFPO0FBQUEsRUFDckMsTUFBTSxDQUFDLFNBQVMsU0FBUztBQUV2QixVQUFNLGdCQUFnQixDQUFDLFFBQVE7QUFDL0IsUUFBSSxjQUFjLFNBQVMsT0FBTyxHQUFHO0FBQ25DLGtCQUFZLEtBQUssU0FBUyxJQUFJO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDRCxTQUFTLENBQUMsU0FBUyxTQUFTO0FBQzFCLFVBQU0sZ0JBQWdCLENBQUMsVUFBVTtBQUNqQyxRQUFJLGNBQWMsU0FBUyxPQUFPLEdBQUc7QUFDbkMsa0JBQVksR0FBRyxTQUFTLENBQUMsVUFBVSxTQUFTLEtBQUssR0FBRyxJQUFJLENBQUM7QUFBQSxJQUMxRDtBQUFBLEVBQ0Y7QUFDSCxDQUFDOyJ9
