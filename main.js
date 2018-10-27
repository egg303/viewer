const electron = require('electron')
const {app, BrowserWindow} = require('electron')

let win

function createWindow(){
	// Erstelle das Browser Fenster
	win = new BrowserWindow({width: 800, height: 600})
	
	// und Laden der index.html der App.
	win.loadFile('index.html')
	
	// Öffnen der DevTools
	//win.webContents.openDevTools()
	
	//let dZoom = 1.0
	//let dSize
	//dSize = win.getContentSize()
	//dZoomWidth = dSize[0]/550
	//dZoomHeight = dSize[1]/776
	//dZoom = Math.min(dZoom,dZoomWidth,dZoomHeight)
	//console.log(dZoom)
	//console.log(dSize)
	//win.webContents.getZoomFactor(console.log)
	////win.document.body.style.zoom = dZoom
	//win.webContents.setZoomFactor(2.0)
	//console.log(dZoom)
	//win.webContents.getZoomFactor(console.log)
	
	// Ausgegeben, wenn das Fenster geschlossen wird.
	win.on('closed', () => {
		// Dereferenzieren des Fensterobjekts, normalerweise würden Sie das Fenster in einem
		// Array speichern, falls Ihre App mehrere Fenster unterstützt. Das ist der Zeitpunkt, an
		// dem Sie das zugehörige Element löschen sollten.
		win = null
	})
}

// Diese Methode wird aufgerufen, wenn Electron mit der
// Initialisierung fertig ist und Browserfenster erschaffen kann.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.on('ready', createWindow)

// Verlassen, wenn alle Fenster geschlossen sind.
app.on('window-all-closed', () => {
	// Unter macOS ist es üblich für Apps und ihre Menu Bar
	// aktiv zu bleiben bis der Nutzer explizit mit Cmd + Q die App beendet.
	if (process.platform != 'darwin'){
		app.quit()
	}
})

app.on('activate', () => {
	// Unter macOS ist es üblich ein neues Fenster der App zu erstellen, wenn
	// das Dock Icon angeklickt wird und keine anderen Fenster offen sind.
	if (win === null) {
		createWindow()
	}
})

// In dieser Datei können Sie den Rest des App-spezifischen
// Hauptprozess-Codes einbinden, Sie können den Code auch
// auf mehreren Dateien aufteilen und diese hier einbinden.