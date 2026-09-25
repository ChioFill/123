import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// In-memory store for real-time RSVP & status
interface RSVPData {
  status: 'pending' | 'accepted' | 'rescheduled' | 'declined';
  date: string;
  time: string;
  location: string;
  notes?: string;
  alternativePreferences?: {
    atmosphere?: string;
    cuisine?: string;
    activity?: string;
  };
  updatedAt: string;
  confirmedBy?: string;
}

let currentRSVP: RSVPData = {
  status: 'pending',
  date: '2026-10-03',
  time: '20:00',
  location: 'Секретное романтическое место (Сюрприз для тебя 🤫✨)',
  notes: 'С нетерпением жду нашей встречи ❤️',
  updatedAt: new Date().toISOString(),
};

// SSE Subscribers for real-time phone / dashboard sync
type SSEClient = {
  id: number;
  res: Response;
};
let sseClients: SSEClient[] = [];

function broadcastSSE(eventType: string, data: any) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(message);
    } catch (e) {
      // client disconnected
    }
  });
}

// API Routes
app.get('/api/rsvp', (req: Request, res: Response) => {
  res.json({ success: true, data: currentRSVP });
});

app.post('/api/rsvp', (req: Request, res: Response) => {
  const body = req.body;
  currentRSVP = {
    ...currentRSVP,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  // Broadcast to all connected clients (e.g. boyfriend's phone)
  broadcastSSE('rsvp_update', currentRSVP);

  res.json({
    success: true,
    message: 'RSVP успешно сохранён и синхронизирован',
    data: currentRSVP,
  });
});

// Real-time notification endpoint (can optionally relay to Telegram)
app.post('/api/notify', async (req: Request, res: Response) => {
  const { title, message, phone, telegramBotToken, telegramChatId, urgency } = req.body;

  const payload = {
    id: Date.now().toString(),
    title: title || 'Новое действие от любимой ❤️',
    message: message || 'Она открыла приглашение или обновила статус встречи!',
    urgency: urgency || 'normal',
    timestamp: new Date().toISOString(),
  };

  // 1. Broadcast via SSE to connected phone/laptop
  broadcastSSE('notification', payload);

  // 2. If Telegram credentials provided or available in env, send instant Telegram alert
  const botToken = telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = telegramChatId || process.env.TELEGRAM_CHAT_ID;

  let telegramSent = false;
  if (botToken && chatId) {
    try {
      const text = `💌 *${payload.title}*\n\n${payload.message}\n\n⏰ _${new Date().toLocaleString('ru-RU')}_`;
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      });
      telegramSent = true;
    } catch (err) {
      console.warn('Telegram send failed:', err);
    }
  }

  res.json({
    success: true,
    broadcasted: true,
    telegramSent,
    payload,
  });
});

// SSE endpoint for live phone notifications
app.get('/api/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial handshake
  res.write(`event: connected\ndata: ${JSON.stringify({ clientId, timestamp: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString(), rsvpStatus: currentRSVP.status });
});

// Start server function
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
