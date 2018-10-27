const {webFrame} = require('electron');

dZoom = 1.0;
dImage = document.querySelector("#dImg");
dZoomWidth = window.innerWidth/dImage.width;
dZoomHeight = window.innerHeight/dImage.height;
dZoom = Math.min(dZoom,dZoomWidth,dZoomHeight);
webFrame.setZoomFactor(dZoom);
console.log(dZoom);