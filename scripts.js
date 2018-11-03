const {webFrame} = require('electron');

var remote = require('electron'); // Load remote component that contains the dialog dependency
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
var app = require('electron').remote; 
var dialog = app.dialog;
var path = require('path');

let dZoom, dImage, dZoomWidth, dZoomHeight, dScrollBarX, dScrollBarY, dImgX, dImgY;
let dFileList, dValidExtensionsImg, dValidExtensionsVid, dValidExtensions, dI, dDirectory, dImageName;
let dVideo,dIsImg, dIsFullscreen, dZoom_;
// global zoom level
dZoom = 1.0;
// the zoom level needed to fit the image horizontally in the window
dZoomWidth = 0.0;
// the zoom level needed to fit the image horizontally in the window
dZoomHeight = 0.0;
// boolean, is a horizontal or vertical Scrollbar visible?
dScrollBarX = false;
dScrollBarY = false;
// if the image fits in the window, these values tell how far it should be positioned from the top left corner of the viewport
dImgX = 0;
dImgY = 0;
// File List
dFileList = [];
// All Extensions this app can show
dValidExtensionsImg = [".jpg", ".jpeg", ".jpe", ".jif", ".jfif", ".jfi", ".webp", ".png", ".apng", ".gif", ".tif", ".tiff", ".bmp", ".dib", ".ico"];
dValidExtensionsVid = [".mp4",".webm", ".ogg", ".ogv", ".avi"];
dValidExtensions = dValidExtensionsImg.concat(dValidExtensionsVid);
// Variable, storing the index of the image viewed
dI = 0;
// directory path, eg "C:\Users\TomTom\My Pictures\"
dDirectory = "";
// name of the image, eg "universe.png"
dImageName = "";
// boolean, is it an image (or video)
dIsImg = true;
// boolean, is the video in fullscreen?
dIsFullscreen = false;
// save the current zoom for later
dZoom_ = 1.0;
// the image object
dImage = document.querySelector("#dImg");
dVideo = document.querySelector('#dVid');
dVideoSrc = document.querySelector('#dVidSrc');

dImage.onload = function(){
	console.log("Image loaded.");
	//dZoom = 1.0;
	
	dScrollBarX = false;
	dScrollBarY = false;
	dImgX = 0;
	dImgY = 0;
	setDCenterX(dImage.naturalWidth/2)
	setDCenterY(dImage.naturalHeight/2)
	dCenter();
	fitToWindow();
	setTimeout(function() {dImage.hidden = false;}, 0);
	//dImage.hidden = false;
}

dVideo.addEventListener( "loadedmetadata", function (e) {
    dVideo.width = dVideo.videoWidth;
    dVideo.width = dVideo.width>380 ? dVideo.width : 380;
    dVideo.height = dVideo.videoHeight;
    dVideo.height = dVideo.height>240 ? dVideo.height : 240;
    dScrollBarX = false;
	dScrollBarY = false;
	dImgX = 0;
	dImgY = 0;
	setDCenterX(dImage.naturalWidth/2)
	setDCenterY(dImage.naturalHeight/2)
	dCenter();
	fitToWindow();
}, false );

function newImage(path){
	dImage.hidden = true;
	dImage.src = path;
	document.title = path + " - " + dImage.naturalWidth + " x " + dImage.naturalHeight;
	if(dIsFullscreen){
		if (dVideo.webkitExitFullscreen) {
			dVideo.webkitExitFullscreen();
			dIsFullscreen = false;
		}
	}
}

function getDScrollBarX(){
	console.log("gotDScrollBarX");
	return dScrollBarX;
}
function getDScrollBarY(){
	console.log("gotDScrollBarY");
	return dScrollBarY;
}

function dCenter(){
	if(dIsImg){
		console.log("Image center start");
		dScrollBarX = dImage.scrollWidth+dImgX>document.documentElement.clientWidth ? true : false;
		dScrollBarY = dImage.scrollHeight+dImgY>document.documentElement.clientHeight ? true : false;
		dImage.style.left = "0px";
		if(dScrollBarX){
			dScrollX = getDCenterX()-((window.innerWidth)/2);
			//dImage.style.left = "0px";
			dImgX = ((window.innerWidth)/2)-(dImage.naturalWidth/2);
			if(dImgX<0) dImgX = 0;
			dImage.style.left = dImgX.toString()+"px";
		} else {
			dScrollX = 0;
			//setDCenterX((dImage.naturalWidth/2));
			dImgX = ((window.innerWidth)/2)-(dImage.naturalWidth/2);
			dImage.style.left = dImgX.toString()+"px";
		}
		if(dScrollBarY){
			dScrollY = getDCenterY()-((window.innerHeight)/2);
			//dImage.style.top = "0px";
			dImgY = (window.innerHeight/2)-(dImage.naturalHeight/2);
			if(dImgY<0) dImgY=0;
			dImage.style.top = dImgY.toString()+"px";
		} else {
			dScrollY = 0;
			//setDCenterY((dImage.naturalHeight/2));
			dImgY = (window.innerHeight/2)-(dImage.naturalHeight/2);
			dImage.style.top = dImgY.toString()+"px";
		}
		window.scrollTo(dScrollX,dScrollY);
		console.log("Image center done");
	} else {
		console.log("Video center start");
		dScrollBarX = dVideo.scrollWidth+dImgX>document.documentElement.clientWidth ? true : false;
		dScrollBarY = dVideo.scrollHeight+dImgY>document.documentElement.clientHeight ? true : false;
		dVideo.style.left = "0px";
		if(dScrollBarX){
			dScrollX = getDCenterX()-((window.innerWidth)/2);
			//dVideo.style.left = "0px";
			dImgX = ((window.innerWidth)/2)-(dVideo.width/2);
			if(dImgX<0) dImgX = 0;
			dVideo.style.left = dImgX.toString()+"px";
		} else {
			dScrollX = 0;
			//setDCenterX((dVideo.naturalWidth/2));
			dImgX = ((window.innerWidth)/2)-(dVideo.width/2);
			dVideo.style.left = dImgX.toString()+"px";
		}
		if(dScrollBarY){
			dScrollY = getDCenterY()-((window.innerHeight)/2);
			//dVideo.style.top = "0px";
			dImgY = (window.innerHeight/2)-(dVideo.height/2);
			if(dImgY<0) dImgY=0;
			dVideo.style.top = dImgY.toString()+"px";
		} else {
			dScrollY = 0;
			//setDCenterY((dVideo.naturalHeight/2));
			dImgY = (window.innerHeight/2)-(dVideo.height/2);
			dVideo.style.top = dImgY.toString()+"px";
		}
		window.scrollTo(dScrollX,dScrollY);
		console.log("Video center done");
	}
}


function fitToWindow(){
	// fit image to window
	// get the native resolution of the image
	if(dIsImg){
		console.log("Image fit to window start");
		// window.innerWidth gives not the real px-width back, if zoomFactor is other than 1.0
		dZoomWidth = (window.innerWidth*dZoom)/dImage.naturalWidth;
		dZoomHeight = (window.innerHeight*dZoom)/dImage.naturalHeight;
		dZoom = 1.0;
		dZoom = Math.min(dZoom,dZoomWidth,dZoomHeight);
		dZoom = dZoom<0.25 ? 0.25 : dZoom;
		webFrame.setZoomFactor(dZoom);
		console.log("fitToWindow: Zoom set to : " + dZoom);
		console.log("Image fit to window done");
	} else {
		console.log("Video fit to window start");
		// window.innerWidth gives not the real px-width back, if zoomFactor is other than 1.0
		dZoomWidth = (window.innerWidth*dZoom)/dVideo.width;
		dZoomHeight = (window.innerHeight*dZoom)/dVideo.height;
		dZoom = 5.0;
		dZoom = Math.min(dZoom,dZoomWidth,dZoomHeight);
		dZoom = dZoom<0.25 ? 0.25 : dZoom;
		webFrame.setZoomFactor(dZoom);
		console.log("fitToWindow: Zoom set to : " + dZoom);
		console.log("Video fit to window done");
	}
}

function fitWindowToImage(){
	/*
	img_ = new Image();
	img_.onload = function(){
		var img_w = this.width,
		img_h = this.height;
		// window.innerWidth gives not the real px-width back, if zoomFactor is other than 1.0
		if(Math.ceil(img_h*dZoom)+(window.outerHeight-Math.floor(window.innerHeight*dZoom))<1000)
			window.resizeTo(Math.ceil(img_w*dZoom)+(window.outerWidth-Math.floor(window.innerWidth*dZoom)),Math.ceil(img_h*dZoom)+(window.outerHeight-Math.floor(window.innerHeight*dZoom)));
		else
			window.resizeTo(34+Math.ceil(img_w*dZoom)+(window.outerWidth-Math.floor(window.innerWidth*dZoom)),Math.ceil(img_h*dZoom)+(window.outerHeight-Math.floor(window.innerHeight*dZoom)));
		console.log([window.outerWidth,window.innerWidth,dZoom]);
		img_ = null;
	}
	img_.src = dImage.src;*/

	// window.innerWidth gives not the real px-width back, if zoomFactor is other than 1.0
		if(Math.ceil(dImage.naturalHeight*dZoom)+(window.outerHeight-Math.floor(window.innerHeight*dZoom))<1000)
			window.resizeTo(Math.ceil(dImage.naturalWidth*dZoom)+(window.outerWidth-Math.floor(window.innerWidth*dZoom)),Math.ceil(dImage.naturalHeight*dZoom)+(window.outerHeight-Math.floor(window.innerHeight*dZoom)));
		else
			window.resizeTo(34+Math.ceil(dImage.naturalWidth*dZoom)+(window.outerWidth-Math.floor(window.innerWidth*dZoom)),Math.ceil(dImage.naturalHeight*dZoom)+(window.outerHeight-Math.floor(window.innerHeight*dZoom)));
		console.log([window.outerWidth,window.innerWidth,dZoom]);
}

function newVideo(path){
	dZoom = 1.0;
	webFrame.setZoomFactor(dZoom);
	dVideo.src = path;
	document.title = path;
}

dVideo.addEventListener('click', function(){
	if(dVideo.paused === true)
		dVideo.play();
	else
		dVideo.pause();
});

function dChangeContent(dI_){
	let dExt = path.extname(dFileList[dI_]);
	if(dValidExtensionsImg.includes(dExt)){
		dVideo.hidden = true;
		dVideo.pause();
		dIsImg = true;
		newImage(dFileList[dI_]);
	} else {
		dImage.hidden = true;
		dVideo.hidden = false;
		dIsImg = false;
		newVideo(dFileList[dI_]);
	}
}

function dToggleFullscreen(){
	if(dIsFullscreen){
		if (dVideo.webkitExitFullscreen) {
			dVideo.webkitExitFullscreen();
			dIsFullscreen = false;
			dZoom = dZoom_;
			webFrame.setZoomFactor(dZoom);
		}
	} else {
		if (dVideo.webkitRequestFullscreen) {
			dVideo.webkitRequestFullscreen();
			dIsFullscreen = true;
			dZoom_ = dZoom;
			dZoom = 1.0;
			webFrame.setZoomFactor(dZoom);
		}
	}
}

window.addEventListener ('resize', (evt)=>{
	console.log("Event: window resize");
	dCenter();
})

document.addEventListener ('keydown', (evt) => {
	console.log("Event: keydown :" + evt.key);
	switch (evt.key) {
		// test key: center
		case "h":
			dialog.showOpenDialog(function (fileName) {
                if(fileName === undefined){
                    console.log("No file selected");
                }else{
                    //document.getElementById("actual-file").value = fileNames[0];
                    //readFile(fileNames[0]);
                    newImage(fileName[0]);
                    console.log(fileName[0]);

                    // from https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j
                    dDirectory = path.dirname(fileName[0]);
                    console.log(dDirectory);
                    dImageName = path.basename(fileName[0]);
                    console.log(dImageName);
					fs.readdir(dDirectory, (err, files) => {
						dFileList = [];
						console.log(files);
					  	files.forEach(file => {
					  		if(fs.statSync(path.join(dDirectory,file)).isFile()){
					  			console.log("is file: " + file);
					  			let dExt = path.extname(file);
					  			console.log(dExt);
					  			if(dValidExtensions.includes(dExt)){
					  				dFileList.push(path.join(dDirectory,file));
					  				console.log(file + " added to list.");
					  			}
					  		}
					  	});
					  	console.log("All Files: " + files);
					  	console.log("Only Images: " + dFileList);
					  	dI = dFileList.indexOf(path.join(dDirectory,dImageName));
					  	console.log(dFileList.indexOf(path.join(dDirectory,dImageName)));
					})
                    //fit to screen
                }
            });
 
			// Note that the previous example will handle only 1 file, if you want that the dialog accepts multiple files, then change the settings:
			// And obviously , loop through the fileNames and read every file manually
			/*dialog.showOpenDialog({ 
			    properties: [ 
			        'openFile', 'multiSelections', (fileNames) => {
			            console.log(fileNames);
			        }
			    ]
			});*/
			break;
		case "j":
			dZoom = 4.0;
			webFrame.setZoomFactor(dZoom);
			break;
		case "k":
			dVideo.width++;
			console.log(dVideo.width);
			//console.log(dFileList);
			//console.log("readyState: " + document.readyState);
			//console.log("Center : "+[getDCenterX(),getDCenterY()]);
			break;
		case "p":
			console.log("img w*h:"+[dImage.width,dImage.height]);
			console.log("img natural w*h:"+[dImage.naturalWidth,dImage.naturalHeight]);
			console.log("img w*h:"+[window.innerWidth,window.innerHeight]);
			break;
		// zoom in
		case "+":
		case "6":
			dZoom *= 1.40;
			if(dZoom>5)
				dZoom = 5.0;
			webFrame.setZoomFactor(dZoom);
			console.log(dZoom);
			break;
		// zoom out
		case "-":
		case "9":
			dZoom /= 1.40;
			if(dZoom<0.25)
				dZoom = 0.25;
			webFrame.setZoomFactor(dZoom);
			console.log(dZoom);
			break;
		// set zoom to 1 / view image in native resolution
		case " ":
			evt.preventDefault();
			evt.stopPropagation();
			if(dIsImg === false){
				if(dVideo.paused === true)
					dVideo.play();
				else
					dVideo.pause();
			}
			break;
		case "0":
			dZoom = 1.0;
			webFrame.setZoomFactor(dZoom);
			break;
		// zoom levels
		case "1":
			dZoom = 1.9938;
			//dZoom = 1.7242;
			webFrame.setZoomFactor(dZoom);
			break;
		case "4":
			dZoom = 3.3271;
			webFrame.setZoomFactor(dZoom);
			break;
		case "7":
			dZoom = 5.0;
			webFrame.setZoomFactor(dZoom);
			break;
		case "2":
			dZoom = 0.6944;
			webFrame.setZoomFactor(dZoom);
			break;
		case "5":
			dZoom = 0.4444;
			webFrame.setZoomFactor(dZoom);
			break;
		case "8":
			dZoom = 0.250;
			webFrame.setZoomFactor(dZoom);
			break;
		// set zoom so image fits window
		case ",":
			// fit image to window
			fitToWindow();
			break;
		// fit window to image
		case "Enter":
			if(evt.altKey){
				dToggleFullscreen();
			} else {
				fitWindowToImage();
			}
			break;
		case "ArrowLeft":
			dI--;
			if(dI<0){
				dI = dFileList.length - 1;
			}
			dChangeContent(dI);
			//newImage(dFileList[dI]);
			break;
		case "ArrowRight":
			dI++;
			if(dI == dFileList.length){
				dI = 0;
			}
			dChangeContent(dI);
			//newImage(dFileList[dI]);
			break;
		default:
			console.log(evt.key);
			break;
	}
})

//make images fullscreenable