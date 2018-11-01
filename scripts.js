const {webFrame} = require('electron');

var remote = require('electron'); // Load remote component that contains the dialog dependency
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
var app = require('electron').remote; 
var dialog = app.dialog;
var path = require('path');

let dZoom, dImage, dZoomWidth, dZoomHeight, dScrollBarX, dScrollBarY, dImgX, dImgY;
let dFileList, dValidExtensions, dI, dDirectory, dImageName;
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
dValidExtensions = [".jpg", ".jpeg", ".jpe", ".jif", ".jfif", ".jfi", ".webp", ".png", ".apng", ".gif", ".tif", ".tiff", ".bmp", ".dib", ".ico"];
// Variable, storing the index of the image viewed
dI = 0;
// directory path, eg "C:\Users\TomTom\My Pictures\"
dDirectory = "";
// name of the image, eg "universe.png"
dImageName = "";
// the image object
dImage = document.querySelector("#dImg");
dImageHelper = document.querySelector("#dImgHelper");
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
}

function newImage(path){
	dImage.hidden = true;
	dImage.src = path;
	document.title = path + " - " + dImage.naturalWidth + " x " + dImage.naturalHeight;
}


//console.log(dZoom);
/*dImgX = (window.innerWidth/2)-(dImage.width/2);
dImgY = (window.innerHeight/2)-(dImage.height/2);
dImage.style.left = dImgX;
dImage.style.top  = dImgY;
console.log([dImgX,(window.innerWidth/2),(dImage.width/2)]);
console.log([dImgY,(window.innerHeight/2),(dImage.height/2)]);
*/
//console.log(dZoom, window.innerHeight, dImage.height*dZoom,dImage.height);

function getDScrollBarX(){
	console.log("gotDScrollBarX");
	return dScrollBarX;
}
function getDScrollBarY(){
	console.log("gotDScrollBarY");
	return dScrollBarY;
}

function dCenter(){
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
	//dScrollX = (dImage.width/2)-((window.innerWidth)/2);
	//dScrollY = (dImage.height/2)-((window.innerHeight)/2);
	window.scrollTo(dScrollX,dScrollY);
	//console.log((dImage.width/2),((window.innerWidth)/2));
	//console.log("scroll.px "+[dScrollX,dScrollY]);
	/*dImgX = (window.innerWidth/2)-(dImage.width/2);
	dImgY = (window.innerHeight/2)-(dImage.height/2);
	dImage.style.left = dImgX.toString()+"px";
	dImage.style.top  = dImgY.toString()+"px";
	console.log([dImgX,(window.innerWidth/2),(dImage.width/2)]);
	console.log([dImgY,(window.innerHeight/2),(dImage.height/2)]);
	*/
	//console.log([window.outerWidth, window.innerWidth]);
	console.log("Image center done");
}

function fitToWindow(){
	// fit image to window
	// get the native resolution of the image
	console.log("Image fitted to window start");
	// window.innerWidth gives not the real px-width back, if zoomFactor is other than 1.0
	console.log("ftw1 img w*h:"+[dImage.naturalWidth,dImage.naturalHeight]);
	dZoomWidth = (window.innerWidth*dZoom)/dImage.naturalWidth;
	console.log("dZoomWidth: " + dZoomWidth + " = (" + window.innerWidth + "*" + dZoom + ")/" + dImage.naturalWidth);
	dZoomHeight = (window.innerHeight*dZoom)/dImage.naturalHeight;
	console.log("dZoomHeight: " + dZoomHeight + " = (" + window.innerHeight + "*" + dZoom + ")/" + dImage.naturalHeight);
	dZoom = 1.0;
	console.log("ftw2 img w*h:"+[dImage.naturalWidth,dImage.naturalHeight]);
	console.log("Z, Zw, Zh: " + [dZoom,dZoomWidth,dZoomHeight]);
	dZoom = Math.min(dZoom,dZoomWidth,dZoomHeight);
	dZoom = dZoom<0.25 ? 0.25 : dZoom;
	webFrame.setZoomFactor(dZoom);
	console.log("fitToWindow: Zoom set to : " + dZoom);
	console.log("Image fitted to window done");
}

/*function fitToWindow(){
	// fit image to window
	// get the native resolution of the image
	console.log("start Image fitted to window.");
	img_ = new Image();
	img_.onload = function(){
		console.log("Image loaded in fitToWindow");
		var img_w = this.width,
		img_h = this.height;
		// window.innerWidth gives not the real px-width back, if zoomFactor is other than 1.0
		dZoomWidth = (window.innerWidth*dZoom)/img_w;
		dZoomHeight = (window.innerHeight*dZoom)/img_h;
		dZoom = 1.0;
		dZoom = Math.min(dZoom,dZoomWidth,dZoomHeight);
		webFrame.setZoomFactor(dZoom);
		img_ = null;
		console.log("Image fitted to window.");
	}
	img_.src = dImage.src;
}*/

window.addEventListener ('resize', (evt)=>{
	console.log("Event: window resize");
	window.requestAnimationFrame(dCenter);
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
			console.log(dFileList);
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
		case "d":
			dZoom *= 1.40;
			if(dZoom>5)
				dZoom = 5.0;
			webFrame.setZoomFactor(dZoom);
			console.log(dZoom);
			break;
		// zoom out
		case "-":
		case "9":
		case "e":
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
		case "0":
			dZoom = 1.0;
			webFrame.setZoomFactor(dZoom);
			break;
		// zoom levels
		case "1":
		case "y":
			dZoom = 1.9938;
			//dZoom = 1.7242;
			webFrame.setZoomFactor(dZoom);
			break;
		case "4":
		case "a":
			dZoom = 3.3271;
			webFrame.setZoomFactor(dZoom);
			break;
		case "7":
		case "q":
			dZoom = 5.0;
			webFrame.setZoomFactor(dZoom);
			break;
		case "2":
		case "x":
			dZoom = 0.6944;
			webFrame.setZoomFactor(dZoom);
			break;
		case "5":
		case "s":
			dZoom = 0.4444;
			webFrame.setZoomFactor(dZoom);
			break;
		case "8":
		case "w":
			dZoom = 0.250;
			webFrame.setZoomFactor(dZoom);
			break;
		// set zoom so image fits window
		case ",":
		case "c":
			// fit image to window
			fitToWindow();
			break;
		// fit window to image
		case "Enter":
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
			img_.src = dImage.src;
			break;
		case "ArrowLeft":
			dI--;
			if(dI<0){
				dI = dFileList.length - 1;
			}
			newImage(dFileList[dI]);
			break;
		case "ArrowRight":
			dI++;
			if(dI == dFileList.length){
				dI = 0;
			}
			newImage(dFileList[dI]);
			break;
		default:
			console.log(evt.key);
			break;
	}
})