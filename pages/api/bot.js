import TelegramBot from 'node-telegram-bot-api';
import {handleStart} from '../../handlers/startHandler';
import { handlePhoneCommand } from '../../handlers/phoneCommand';
import { handleContact } from '../../handlers/contactHandler';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

// Обработка команды /phone
bot.onText(/\/start/, (msg) => handleStart(bot, msg));

// Обработка команды /phone
bot.onText(/\/phone/, (msg) => handlePhoneCommand(bot, msg));

// Обработка контактов
bot.on('contact', (msg) => handleContact(bot, msg));

// Общий обработчик для других сообщений
// bot.on('message', (msg) => {
//  const chatId = msg.chat.id;
//  bot.sendMessage(chatId, `Hello, ${msg.from.first_name || 'friend'}! Вы сказали: "${msg.text}`);
// });

// Обработчик команды /stations
bot.onText(/\/stations/, async (msg) => {
  const chatId = msg.chat.id;

  // Информируем пользователя, что начинается запрос
  await bot.sendMessage(chatId, 'Запрашиваю данные с сервера...');

  try {
    const query = `
{
  ChargingStations(page: { size: 2, number: 1 }) {
    address
    company {
      name
    }
  }
}
    `;

    const response = await fetch('https://api.testing.itcharge.ru/graphql/cp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzZjk4MDhiMS00MTA5LTQ4NzAtOTM4My1iOWYyNWM0Nzk4NmQiLCJ0ZW5hbnQiOiJpdGNoYXJnZSIsInRlbmFudFNldHRpbmdzIjp7ImZlYXR1cmVCYWxhbmNlIjp0cnVlLCJjb3VudHJ5IjoiUlUiLCJwYXltZW50U2VydmljZSI6Inlvb2thc3NhIn0sImNvbXBhbnlJZCI6ImIzNzE4NmYzLTlmMzMtNDExZC05ZTUzLWQwZDMxZWMyZDhkYyIsImNvbXBhbnlUeXBlIjoiQ2hhcmdpbmcgU3RhdGlvbiBPcGVyYXRpb24iLCJlbWFpbCI6ImFsZXh0ZXN0aW5nQHRlc3RpbmcuY29tIiwicGhvbmUiOiIrNzc3Nzc3Nzc5OTAiLCJyb2xlIjoiU3VwZXIgQWRtaW4iLCJpYXQiOjE3MzAyODc4MDIsImV4cCI6MTgxNjY4NzgwMiwiYXVkIjoiYXBpLml0Y2hhcmdlLnJ1IiwiaXNzIjoiYXBpLml0Y2hhcmdlLnJ1In0.McDqVZNQDXaeelEwpKmGVwljuIYeenQn583ft9HixLnIb7FOVQB8aiu5fI-0quKR8ilGWLClepLIGaZco6lskQ",
      },
      body: JSON.stringify({
        query: query,
        variables: {
          page: {
            size: 2,
            number: 1,
          },
        },
      }),
    });

    // Проверка статуса ответа
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, StatusText: ${response.statusText}`);
    }

    // Попытка разобрать тело ответа
    const textResponse = await response.text();

    // Проверяем, есть ли содержимое в ответе
    if (!textResponse) {
      throw new Error('Сервер вернул пустой ответ.');
    }

    // Парсим JSON
    const data = JSON.parse(textResponse);
    console.log(textResponse);
    
    if (data.errors) {
      throw new Error(`Ошибка GraphQL: ${JSON.stringify(data.errors)}`);
    }

    const ChargingStations = data.data.ChargingStations;
console.log(ChargingStations);  
    if (!ChargingStations) {
      bot.sendMessage(chatId, 'Данные о транзакции не найдены.');
      return;
    }

     const message =   ChargingStations.map((station) => {
         return `Адрес: ${station.address|| "Address not available"},
          Компания: ${station.company.name|| "Company not available"}`;
       }).join('\n');

console.log(message);
//После организации получения ответа до 4096 символов раскомментировать следующую строку, эту строку сжечь.
   // bot.sendMessage(chatId, message);
  } catch (error) {
    console.error('Ошибка при запросе данных:', error.message);
    bot.sendMessage(chatId, `Произошла ошибка: ${error.message}`);
  }
});

export default function handler(req, res) {
  res.status(200).json({ message: 'Telegram bot is running' });
}
