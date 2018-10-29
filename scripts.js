const {webFrame} = require('electron');

var remote = require('electron'); // Load remote compnent that contains the dialog dependency
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
var app = require('electron').remote; 
var dialog = app.dialog;

let dZoom, dImage, dZoomWidth, dZoomHeight;
dZoom = 1.0;
dZoomWidth = 0.0;
dZoomHeight = 0.0;
dImage = document.querySelector("#dImg");
dImage.onload = function(){
	dZoomWidth = (window.innerWidth)/dImage.width;
	dZoomHeight = (window.innerHeight)/dImage.height;
	dZoom = Math.min(dZoom,dZoomWidth,dZoomHeight);
	webFrame.setZoomFactor(dZoom);
	dCenter();
}
dScrollBarX = 0;
dScrollBarY = 0;
dImgX = 0;
dImgY = 0;
dCenterX = 0;
dCenterY = 0;

//console.log(dZoom);
/*dImgX = (window.innerWidth/2)-(dImage.width/2);
dImgY = (window.innerHeight/2)-(dImage.height/2);
dImage.style.left = dImgX;
dImage.style.top  = dImgY;
console.log([dImgX,(window.innerWidth/2),(dImage.height/2)]);
console.log([dImgY,(window.innerHeight/2),(dImage.height/2)]);
*/
//console.log(dZoom, window.innerHeight, dImage.height*dZoom,dImage.height);

function getDScrollBarX(){
	return dScrollBarX;
}
function getDScrollBarY(){
	return dScrollBarY;
}

function dCenter(){
	console.log("center: "+[dCenterX,dCenterY]);
	dScrollBarX = dImage.scrollWidth+dImgX>document.documentElement.clientWidth ? true : false;
	dScrollBarY = dImage.scrollHeight+dImgY>document.documentElement.clientHeight ? true : false;
	dImage.style.left = "0px";
	if(dScrollBarX){
		dScrollX = getDCenterX()-((window.innerWidth)/2);
		//dImage.style.left = "0px";
		dImgX = ((window.innerWidth)/2)-(dImage.width/2);
		if(dImgX<0) dImgX = 0;
		dImage.style.left = dImgX.toString()+"px";
	} else {
		dScrollX = 0;
		//setDCenterX((dImage.width/2));
		dImgX = ((window.innerWidth)/2)-(dImage.width/2);
		dImage.style.left = dImgX.toString()+"px";
	}
	if(dScrollBarY){
		dScrollY = getDCenterY()-((window.innerHeight)/2);
		//dImage.style.top = "0px";
		dImgY = (window.innerHeight/2)-(dImage.height/2);
		if(dImgY<0) dImgY=0;
		dImage.style.top = dImgY.toString()+"px";
	} else {
		dScrollY = 0;
		//setDCenterY((dImage.height/2));
		dImgY = (window.innerHeight/2)-(dImage.height/2);
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
	console.log([dImgX,(window.innerWidth/2),(dImage.height/2)]);
	console.log([dImgY,(window.innerHeight/2),(dImage.height/2)]);
	*/
	//console.log([window.outerWidth, window.innerWidth]);
}

function fitToWindow(){
	// fit image to window
	// get the native resolution of the image
	img_ = new Image();
	img_.onload = function(){
		var img_w = this.width,
		img_h = this.height;
		// window.innerWidth gives not the real px-width back, if zoomFactor is other than 1.0
		dZoomWidth = (window.innerWidth*dZoom)/img_w;
		dZoomHeight = (window.innerHeight*dZoom)/img_h;
		dZoom = 1.0;
		dZoom = Math.min(dZoom,dZoomWidth,dZoomHeight);
		webFrame.setZoomFactor(dZoom);
		img_ = null;
	}
	img_.src = dImage.src;
}

window.addEventListener ('resize', (evt)=>{
	dCenter();
})

document.addEventListener ('keydown', (evt) => {
	switch (evt.key) {
		// test key: center
		case "h":
			dialog.showOpenDialog(function (fileNames) {
                if(fileNames === undefined){
                    console.log("No file selected");
                }else{
                    //document.getElementById("actual-file").value = fileNames[0];
                    //readFile(fileNames[0]);
                    dImage.src = fileNames[0];
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
		// zoom in
		case "+":
		case "6":
		case "d":
			dZoom *= 1.40;
			if(dZoom>5)
				dZoom = 5.0;
			webFrame.setZoomFactor(dZoom);
			console.log(dZoom);
			console.log(dImage.width);
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
			
			break;
		case "ArrowRight":
			
			break;
		default:
			console.log(evt.key);
			break;
	}
})