import TelegramBot from 'node-telegram-bot-api';
import {handleStart} from '../../handlers/startHandler';
import { handlePhoneCommand } from '../../handlers/phoneCommand';
import { handleContact } from '../../handlers/contactHandler';
import { handleChargingStationsList } from '../../handlers/stationsHandler';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

// Обработка команды /phone
bot.onText(/\/start/, (msg) => handleStart(bot, msg));

// Обработка команды /phone
bot.onText(/\/phone/, (msg) => handlePhoneCommand(bot, msg));

// Обработка контактов
bot.on('contact', (msg) => handleContact(bot, msg));

// Обработчик команды /stations
bot.onText(/\/stations/, async (msg) => handleChargingStationsList(bot, msg));

// Общий обработчик для других сообщений
// bot.on('message', (msg) => {
//  const chatId = msg.chat.id;
//  bot.sendMessage(chatId, `Hello, ${msg.from.first_name || 'friend'}! Вы сказали: "${msg.text}`);
// });

export default function handler(req, res) {
  res.status(200).json({ message: 'Telegram bot is running' });
}
