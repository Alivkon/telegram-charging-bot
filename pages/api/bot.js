import TelegramBot from 'node-telegram-bot-api';
import {handleStart} from '../../handlers/startHandler';
import { handlePhoneCommand } from '../../handlers/phoneCommand';
import { handleContact } from '../../handlers/phoneHandler';
import { handleChargingStationsList } from '../../handlers/stationsHandler';
import { handleChatId } from '../../handlers/chatIDHandler';
import {handleRegistration} from '../../handlers/registrationHandler';
import fs from 'fs/promises'; // Для работы с файлами

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

// Обработка команды /phone
bot.onText(/\/start/, async(msg) => handleStart(bot, msg));

// Обработка команды /phone
bot.onText(/\/phone/, async(msg) => handlePhoneCommand(bot, msg));

// Обработка контактов
bot.on('contact', async(msg) => handleContact(bot, msg));

// Обработчик команды /stations
bot.onText(/\/stations/, async (msg) => handleChargingStationsList(bot, msg));

bot.onText(/\/chatId/, (msg) => { handleChatId(bot, msg);});

bot.onText(/\/registration/, async (msg) => handleRegistration(bot, msg));
// Общий обработчик для других сообщений
// bot.on('message', (msg) => {
//  const chatId = msg.chat.id;
//  bot.sendMessage(chatId, `Hello, ${msg.from.first_name || 'friend'}! Вы сказали: "${msg.text}`);
// });
  
// Обработчик для фото
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const photoId = msg.photo[msg.photo.length - 1].file_id;
  const file = await bot.getFile(photoId);
  const filePath = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;
  const photo = await fs.readFile(filePath);
  await bot.sendPhoto(chatId, photo);
}); 


export default function handler(req, res) {
  res.status(200).json({ message: 'Telegram bot is running' });
}
