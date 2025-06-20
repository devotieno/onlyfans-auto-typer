const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { getFanEvents } = require('./src/api');
const { generateResponse } = require('./src/ai');
require('dotenv').config();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('save-persona', (event, persona) => {
  try {
    let personas = [];
    if (fs.existsSync('./data/personas.json')) {
      personas = JSON.parse(fs.readFileSync('./data/personas.json', 'utf8'));
    }
    personas.push(persona);
    fs.writeFileSync('./data/personas.json', JSON.stringify(personas, null, 2), 'utf8');
    event.reply('persona-saved', true);
  } catch (error) {
    console.error('Error saving persona:', error.message);
    event.reply('persona-saved', false);
  }
});

let messages = [];

ipcMain.on('start-automation', async (event) => {
  try {
    const events = await getFanEvents('creator123');
    let personas = [];
    try {
      if (fs.existsSync('./data/personas.json')) {
        personas = JSON.parse(fs.readFileSync('./data/personas.json', 'utf8'));
      }
    } catch (error) {
      console.error('Error reading personas:', error.message);
    }

    const creator = personas.find((c) => c.creatorId === 'creator123') || {
      creatorId: 'creator123',
      tone: 'flirty',
    };

    messages = [];
    for (const e of events) {
      try {
        const text = await generateResponse(creator.creatorId, e.fanName, e.event, creator.tone);
        messages.push({
          id: Date.now() + Math.random(),
          creatorId: 'creator123',
          fanId: e.fanId,
          fanName: e.fanName,
          text,
          status: 'pending',
        });
      } catch (error) {
        console.error(`Error generating response for ${e.fanName}:`, error.message);
      }
    }

    event.reply('display-events', events);
    event.reply('update-message-queue', messages);
  } catch (error) {
    console.error('Error in start-automation:', error.message);
    event.reply('display-events', []);
    event.reply('update-message-queue', []);
  }
});

ipcMain.on('approve-message', (event, messageId) => {
  // Handle message approval (to be implemented in Step 5)
});