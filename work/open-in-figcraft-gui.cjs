const fs = require('fs');
const { spawn } = require('child_process');

const child = spawn('D:/Programs/FigCraft/figcraft-cli.exe', ['mcp', '--attach', '8080'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let buf = '';
const pending = new Map();
let nextId = 1;

child.stdout.on('data', chunk => {
  buf += chunk.toString('utf8');
  let lines = buf.split('\n');
  buf = lines.pop();
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    } catch (e) {}
  }
});

function rpc(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
}

(async () => {
  try {
    await rpc('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'agy', version: '1.0' }
    });
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

    // Check currently open documents in the GUI window
    const docsRes = await rpc('tools/call', {
      name: 'run_command',
      arguments: { command: 'doc.list', params: {} }
    });
    console.log('Current docs in FigCraft GUI:', docsRes.content?.[0]?.text);

    // Open SMA-Widya-Darma.figcraft using base64 data so it works even without read-root
    const b64 = fs
      .readFileSync('e:/semester 7/Computing Project/WEB Widya Darma/SMA-Widya-Darma.figcraft')
      .toString('base64');
    const openRes = await rpc('tools/call', {
      name: 'run_command',
      arguments: {
        command: 'file.open',
        params: {
          name: 'SMA-Widya-Darma.figcraft',
          data: b64
        }
      }
    });
    console.log('Opened in FigCraft GUI:', openRes.content?.[0]?.text);

    // Zoom to fit all 8 screens and show Prototype panel
    await rpc('tools/call', {
      name: 'run_command',
      arguments: { command: 'view.zoomToFit', params: {} }
    });
    await rpc('tools/call', {
      name: 'run_command',
      arguments: { command: 'view.prototype', params: {} }
    });

    // Take screenshot of the live FigCraft GUI window!
    const shotRes = await rpc('tools/call', {
      name: 'screenshot',
      arguments: { window: true, maxSize: 1600 }
    });
    const imgItem = (shotRes.content || []).find(c => c.type === 'image');
    if (imgItem && imgItem.data) {
      fs.writeFileSync(
        'C:/Users/LENOVO/.gemini/antigravity/brain/a830dbf4-d525-42c7-b6d1-d3ab49446039/figcraft_live_window.png',
        Buffer.from(imgItem.data, 'base64')
      );
      console.log('Saved live window screenshot to figcraft_live_window.png!');
    } else {
      console.log('Screenshot response:', JSON.stringify(shotRes).slice(0, 300));
    }

    child.kill();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    child.kill();
    process.exit(1);
  }
})();
