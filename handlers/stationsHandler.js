import sqlite3 from "sqlite3";
//import { open } from "sqlite3";

export async function handleChargingStationsList(bot, msg) {

  const chatId = msg.chat.id;

console.log(chatId);






    
// Создаем или подключаемся к базе данных
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Ошибка подключения к базе данных пользователей:", err.message);
  } else {
    console.log("Подключение station к базе данных пользователей установлено.");
  }
});

// Создаем таблицу, если она еще не существует
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    phone_number TEXT PRIMARY KEY, 
    chat_id INTEGER NOT NULL,
    token TEXT
    customerId TEXT
  )
`);

    // Запрос для получения токена по номеру телефона
    const row = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE chat_id = ?", chatId, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    let token;
    if (row && row.token) {
      token = row.token; // Сохраняем токен в переменную
      console.log(`Токен для ${chatId}: ${token}`);
      bot.sendMessage(chatId, `Токен для чата ${chatId}: ${token}`);
    } else {
      console.log(`Токен для  ${chatId} не найден.`);
      return null;
    }
    
    // Закрываем соединение с базой данных
    db.close((err) => {
      if (err) {
        console.error("Ошибка закрытия базы данных:", err.message);
      } else {
        console.log("Соединение с базой данных успешно закрыто.");
      }
    });

// Информируем пользователя, что начинается запрос
//bot.sendMessage(chatId, 'Запрашиваю данные с сервера...');

  const query = `
    {
      ChargingStationsList(page: {size: 5, number: 1}),
        {
        rows {
          id
          name
        }
       }
      }
    `;
console.log(query);
const response = await fetch('https://api.testing.itcharge.ru/graphql/cp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    query: query,
  }),
});
  console.log(response);
  // Проверяем, есть ли ответ вообще
  if (!response) {
    throw new Error('Не удалось получить ответ от сервера.');
  }
  // Проверка статуса ответа
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}, StatusText: ${response.statusText}`);
  }

  // Попытка разобрать тело ответа
  const textResponse = await response.text();
  console.log(textResponse);
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
  console.log('Успешный ответ:', data);
  const ChargingStationsList = data.data.ChargingStationsList;
  console.log(ChargingStationsList);  

  if (!ChargingStationsList || !ChargingStationsList.rows) {
    bot.sendMessage(chatId, 'Данные о зарядных станциях не найдены.');
    return;
  }
  const message = ChargingStationsList.rows
  .map(station => {
    return `ID: ${station.id || "ID отсутствует"},
    Название: ${station.name || "Название отсутствует"}`;
  })
  .join('\n');

  console.log(message);
  if (message.length > 4096) {
    bot.sendMessage(chatId, "Ответ слишком длинный для отправки. Попробуйте запросить меньший объем данных.");
  } else {
    bot.sendMessage(chatId, `Доступные Вам зарядные станции: \n${message}`);
  } 
} 