const {webFrame} = require('electron');

var remote = require('electron'); // Load remote component that contains the dialog dependency
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
var app = require('electron').remote; 
var dialog = app.dialog;
var path = require('path');

let dZoom, dImage, dZoomWidth, dZoomHeight, dScrollBarX, dScrollBarY, dImgX, dImgY;
let dFileList, dValidExtensionsImg, dValidExtensionsVid, dValidExtensions, dI, dDirectory, dImageName;
let dVideo,dIsImg, dIsFullscreen, dZoomPre, dZoomArray;
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
dValidExtensionsImg = [".jpg", ".jpeg", ".jpe", ".jif", ".jfif", ".jfi", ".webp", ".png", ".apng", ".gif", ".bmp", ".dib", ".ico"];
dValidExtensionsVid = [".mp4",".webm", ".ogg", ".ogv"];
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
dZoomPre = 1.0;
// array containing the "curated" zoom levels
dZoomArray = [0.25,0.333,0.5,0.667,1.0,1.5,2.0,3.0,4.0,5.0];
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
	console.log("Video loaded.");
    dVideo.width = dVideo.videoWidth>380 ? dVideo.videoWidth : 380;
    dVideo.height = dVideo.videoHeight>240 ? dVideo.videoHeight : 240;
    dScrollBarX = false;
	dScrollBarY = false;
	dImgX = 0;
	dImgY = 0;
	setDCenterX(dVideo.width/2)
	setDCenterY(dVideo.height/2)
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
			dZoomPre = 1.0;
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
			dImgX = ((window.innerWidth)/2)-(dImage.naturalWidth/2);
			if(dImgX<0) dImgX = 0;
			dImage.style.left = dImgX.toString()+"px";
		} else {
			dScrollX = 0;
			dImgX = ((window.innerWidth)/2)-(dImage.naturalWidth/2);
			dImage.style.left = dImgX.toString()+"px";
		}
		if(dScrollBarY){
			dScrollY = getDCenterY()-((window.innerHeight)/2);
			dImgY = (window.innerHeight/2)-(dImage.naturalHeight/2);
			if(dImgY<0) dImgY=0;
			dImage.style.top = dImgY.toString()+"px";
		} else {
			dScrollY = 0;
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
			dImgX = ((window.innerWidth)/2)-(dVideo.width/2);
			if(dImgX<0) dImgX = 0;
			dVideo.style.left = dImgX.toString()+"px";
		} else {
			dScrollX = 0;
			dImgX = ((window.innerWidth)/2)-(dVideo.width/2);
			dVideo.style.left = dImgX.toString()+"px";
		}
		if(dScrollBarY){
			dScrollY = getDCenterY()-((window.innerHeight)/2);
			dImgY = (window.innerHeight/2)-(dVideo.height/2);
			if(dImgY<0) dImgY=0;
			dVideo.style.top = dImgY.toString()+"px";
		} else {
			dScrollY = 0;
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
	if(dIsImg){
		// window.innerWidth gives not the real px-width back, if zoomFactor is other than 1.0
		if(Math.ceil(dImage.naturalHeight*dZoom)+(window.outerHeight-Math.floor(window.innerHeight*dZoom))<1000)
			window.resizeTo(Math.ceil(dImage.naturalWidth*dZoom)+(window.outerWidth-Math.floor(window.innerWidth*dZoom)),Math.ceil(dImage.naturalHeight*dZoom)+(window.outerHeight-Math.floor(window.innerHeight*dZoom)));
		else
			window.resizeTo(34+Math.ceil(dImage.naturalWidth*dZoom)+(window.outerWidth-Math.floor(window.innerWidth*dZoom)),Math.ceil(dImage.naturalHeight*dZoom)+(window.outerHeight-Math.floor(window.innerHeight*dZoom)));
		console.log([window.outerWidth,window.innerWidth,dZoom]);
	} else {
		// window.innerWidth gives not the real px-width back, if zoomFactor is other than 1.0
		if(Math.ceil(dVideo.height*dZoom)+(window.outerHeight-Math.floor(window.innerHeight*dZoom))<1000)
			window.resizeTo(Math.ceil(dVideo.width*dZoom)+(window.outerWidth-Math.floor(window.innerWidth*dZoom)),Math.ceil(dVideo.height*dZoom)+(window.outerHeight-Math.floor(window.innerHeight*dZoom)));
		else
			window.resizeTo(34+Math.ceil(dVideo.width*dZoom)+(window.outerWidth-Math.floor(window.innerWidth*dZoom)),Math.ceil(dVideo.height*dZoom)+(window.outerHeight-Math.floor(window.innerHeight*dZoom)));
		console.log([window.outerWidth,window.innerWidth,dZoom]);
	}
}

function dZoomIn(){
	if(dZoom >= dZoomArray[dZoomArray.length-1])
		return;
	var dZAI = 0;
	for(var i = 0; i < dZoomArray.length;i++){
		if(dZoomArray[i] < dZoom){
			dZAI = i;
		}
	}
	if(dZAI>dZoomArray.length-2){
		return;
	}
	var ratioToTop = dZoomArray[dZAI+1]/dZoom;
	var ratioToBot = dZoom/dZoomArray[dZAI];
	if(ratioToTop<ratioToBot){
		if(ratioToTop>1.1){
			dZAI++;
		} else {
			dZAI = dZAI+2;
		}
	} else {
			dZAI++;
	}
	if(dZAI>dZoomArray.length-1){
		dZAI = dZoomArray.length-1;
	}
	dSetZoom(dZoomArray[dZAI]);
}

function dZoomOut(){
	if(dZoom <= dZoomArray[0])
		return;
	var dZAI = 0;
	for(var i = 0; i < dZoomArray.length;i++){
		if(dZoomArray[i] < dZoom){
			dZAI = i;
		}
	}
	if(dZAI>dZoomArray.length-2){
		dSetZoom(dZoomArray[dZAI-1]);
		return;
	}
	var ratioToTop = dZoomArray[dZAI+1]/dZoom;
	var ratioToBot = dZoom/dZoomArray[dZAI];
	if(ratioToTop>ratioToBot){
		if(ratioToBot<1.1){
			dZAI--;
		}
	}
	if(dZAI<0){
		dZAI = 0;
	}
	dSetZoom(dZoomArray[dZAI]);
}

function dSetZoom(dZoom_){
	// clamp to min, max zoom
	dZoom = Math.min(5.0, Math.max(dZoom_, 0.25));
	webFrame.setZoomFactor(dZoom);
	console.log("Set Zoom to: " + dZoom);
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
	let dExt = path.extname(dFileList[dI_]).toLowerCase();
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
	if(!dIsImg){
		if(dIsFullscreen){
			if (dVideo.webkitExitFullscreen) {
				dVideo.webkitExitFullscreen();
				dIsFullscreen = false;
				dZoom = dZoomPre;
				webFrame.setZoomFactor(dZoom);
			}
		} else {
			if (dVideo.webkitRequestFullscreen) {
				dVideo.webkitRequestFullscreen();
				dIsFullscreen = true;
				dZoomPre = dZoom;
				dZoom = 1.0;
				webFrame.setZoomFactor(dZoom);
			}
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
						// the for loop is notably faster than the .forEach function
						for(var i = 0; i<files.length;i++){
							var file = files[i];
							if(fs.statSync(path.join(dDirectory,file)).isFile()){
					  			console.log("is file: " + file);
					  			let dExt = path.extname(file).toLowerCase();
					  			console.log(dExt);
					  			if(dValidExtensions.includes(dExt)){
					  				dFileList.push(path.join(dDirectory,file));
					  				console.log(file + " added to list.");
					  			}
					  		}
						}
					  	/*files.forEach(file => {
					  		if(fs.statSync(path.join(dDirectory,file)).isFile()){
					  			console.log("is file: " + file);
					  			let dExt = path.extname(file).toLowerCase();
					  			console.log(dExt);
					  			if(dValidExtensions.includes(dExt)){
					  				dFileList.push(path.join(dDirectory,file));
					  				console.log(file + " added to list.");
					  			}
					  		}
					  	});*/
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
			console.log(dFileList);
			break;
		case "k":
			dSetZoom(0.248);
			break;
		case "p":
			dSetZoom(0.252);
			break;
		// zoom in
		case "+":
			if(evt.ctrlKey){
				dSetZoom(dZoom*1.03);
			} else{
				dZoomIn();
			}
			break;
		// zoom out
		case "-":
			if(evt.ctrlKey){
				dSetZoom(dZoom/1.03);
			} else{
				dZoomOut();
			}
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
			break;
		// zoom levels
		case "1":
			dSetZoom(1.0);
			break;
		case "2":
			if(evt.ctrlKey){
				dSetZoom(0.667);
			} else{
				dSetZoom(2.0);
			}
			break;
		case "3":
			if(evt.ctrlKey){
				dSetZoom(0.5);
			} else{
				dSetZoom(3.0);
			}
			break;
		case "4":
			if(evt.ctrlKey){
				dSetZoom(0.333);
			} else{
				dSetZoom(4.0);
			}
			break;
		case "5":
			if(evt.ctrlKey){
				dSetZoom(0.25);
			} else{
				dSetZoom(5.0);
			}
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
			evt.preventDefault();
			evt.stopPropagation();
			dI--;
			if(dI<0){
				dI = dFileList.length - 1;
			}
			dChangeContent(dI);
			//newImage(dFileList[dI]);
			break;
		case "ArrowRight":
			evt.preventDefault();
			evt.stopPropagation();
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