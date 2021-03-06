const electron = require('electron');
const {app, BrowserWindow, Menu, protocol, ipcMain} = require('electron');
const log = require("electron-log");
const {autoUpdater} = require("electron-updater");
//const ipcMain = require('electron').ipcMain;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App start');

let win;

function createWindow(){
	// Erstelle das Browser Fenster
	win = new BrowserWindow({width: 800, height: 600,/*frame: false*/})
	
	// und Laden der index.html der App.
	win.loadFile('index.html')
	
	// Öffnen der DevTools
	//win.webContents.openDevTools()
	
	// Ausgegeben, wenn das Fenster geschlossen wird.
	win.on('closed', () => {
		// Dereferenzieren des Fensterobjekts, normalerweise würden Sie das Fenster in einem
		// Array speichern, falls Ihre App mehrere Fenster unterstützt. Das ist der Zeitpunkt, an
		// dem Sie das zugehörige Element löschen sollten.
		win = null
	})
}

app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
// Diese Methode wird aufgerufen, wenn Electron mit der
// Initialisierung fertig ist und Browserfenster erschaffen kann.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.on('ready', createWindow)

// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------
app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});

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

// read the file and send data to the render process
ipcMain.on('get-file-path', function(event) {
  var dFilePath = null;
  if (process.platform == 'win32' && process.argv.length >= 2 && process.argv[1].length >= 3) {
    dFilePath = process.argv[1];
  }
  event.returnValue = dFilePath;
})

/*ipcMain.on('open-dev-tools', function(event) {
	win.webContents.openDevTools();
})*/