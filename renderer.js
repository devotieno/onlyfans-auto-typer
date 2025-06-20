const { ipcRenderer } = require('electron');

function savePersona() {
  const creatorName = document.getElementById('creator-name').value;
  const tone = document.getElementById('tone').value;
  const template = document.getElementById('template').value;
  if (creatorName && tone && template) {
    ipcRenderer.send('save-persona', {
      creatorId: 'creator123', // Hardcoded for testing
      name: creatorName,
      tone,
      templates: [{ trigger: 'fan_online', text: template }],
    });
  } else {
    alert('Please fill all fields.');
  }
}

function startAutomation() {
  ipcRenderer.send('start-automation');
}

ipcRenderer.on('update-message-queue', (event, messages) => {
  const queue = document.getElementById('message-queue');
  queue.innerHTML = messages
    .map(
      (m) => `<li>${m.text} <button onclick="approveMessage('${m.id}')">Approve</button></li>`
    )
    .join('');
});

function approveMessage(messageId) {
  ipcRenderer.send('approve-message', messageId);
}

ipcRenderer.on('display-events', (event, events) => {
  const eventList = document.getElementById('fan-events');
  eventList.innerHTML = events
    .map((e) => `<li>${e.fanName} - ${e.event} at ${new Date(e.timestamp).toLocaleString()}</li>`)
    .join('');
});

ipcRenderer.on('persona-saved', (event, success) => {
  alert(success ? 'Persona saved!' : 'Error saving persona.');
});