import TelegramBot from 'node-telegram-bot-api';
import {handleStart} from '../../handlers/startHandler';
import { handlePhoneCommand } from '../../handlers/phoneCommand';
import { handleContact } from '../../handlers/phoneHandler';
import { handleChargingStationsList } from '../../handlers/stationsHandler';
import { handleChatId } from '../../handlers/chatIDHandler';
//import {handleRegistration} from '../../handlers/registrationHandler';

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

bot.onText(/\/registration/, async (msg) => handlePhoneCommand(bot, msg));
// Общий обработчик для других сообщений
// bot.on('message', (msg) => {
//  const chatId = msg.chat.id;
//  bot.sendMessage(chatId, `Hello, ${msg.from.first_name || 'friend'}! Вы сказали: "${msg.text}`);
// });
  

export default function handler(req, res) {
  res.status(200).json({ message: 'Telegram bot is running' });
}
