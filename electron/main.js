const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let serverProcess;

// Get the correct path for the server
const getServerPath = () => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'app', 'server', 'dist', 'index.js');
  }
  return path.join(__dirname, '..', 'server', 'dist', 'index.js');
};

// Get the correct path for the client
const getClientPath = () => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'app', 'client', 'dist', 'index.html');
  }
  return 'http://localhost:3000';
};

// Start the backend server
const startServer = () => {
  return new Promise((resolve, reject) => {
    const serverPath = getServerPath();

    if (app.isPackaged && !fs.existsSync(serverPath)) {
      console.error('Server file not found:', serverPath);
      reject(new Error('Server file not found'));
      return;
    }

    console.log('Starting server from:', serverPath);

    // Set environment variables
    const env = { ...process.env };
    env.PORT = '3001';
    env.NODE_ENV = app.isPackaged ? 'production' : 'development';

    // Use embedded database in production
    if (app.isPackaged) {
      const userData = app.getPath('userData');
      const dbPath = path.join(userData, 'database.db');
      env.DATABASE_PATH = dbPath;
      console.log('Using database at:', dbPath);
    }

    serverProcess = spawn('node', [serverPath], {
      env,
      stdio: 'inherit'
    });

    serverProcess.on('error', (err) => {
      console.error('Failed to start server:', err);
      reject(err);
    });

    // Wait for server to be ready
    setTimeout(() => {
      console.log('Server started');
      resolve();
    }, 3000);
  });
};

// Create the main window
const createWindow = async () => {
  // Start the server first
  try {
    await startServer();
  } catch (err) {
    console.error('Failed to start server:', err);
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'Ben-COMET Financial Monitor',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    backgroundColor: '#f8fafc',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 }
  });

  // Load the app
  const clientPath = getClientPath();
  console.log('Loading client from:', clientPath);

  if (app.isPackaged) {
    mainWindow.loadFile(clientPath);
  } else {
    mainWindow.loadURL(clientPath);
    mainWindow.webContents.openDevTools();
  }

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Create application menu
const createMenu = () => {
  const template = [
    {
      label: 'Ben-COMET',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'GitHub Repository',
          click: async () => {
            await shell.openExternal('https://github.com/Ben-noncodingceo/Ben-COMET');
          }
        },
        {
          label: 'Report Issue',
          click: async () => {
            await shell.openExternal('https://github.com/Ben-noncodingceo/Ben-COMET/issues');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// App lifecycle events
app.whenReady().then(() => {
  createMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Kill the server process
  if (serverProcess) {
    serverProcess.kill();
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
