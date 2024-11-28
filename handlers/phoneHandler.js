import sqlite3 from "sqlite3";

const mainServerToken = process.env.ITCHARGE_API_MAIN_TOKEN;

// Создаем или подключаемся к базе данных
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Ошибка подключения к базе данных пользователей:", err.message);
  } else {
    console.log("Подключение к базе данных пользователей установлено.");
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

export async function handleContact(bot, msg) {
  const chatId = msg.chat.id;
 const phoneNumber = msg.contact.phone_number;
  if (msg.contact) {
   } else {
     bot.sendMessage(chatId, "Не удалось получить номер телефона.");
   }

  // Уведомляем пользователя о начале запроса
  bot.sendMessage(chatId, "Запрашиваю данные с сервера авторизации...");
    
  const query = `
    mutation {
      AuthTelegramGetCustomerToken(
        phoneNumber: "${phoneNumber}",
        chatId: "${chatId}",
        tenant: "itcharge"
      ) {
        token
        customerId
      }
    }
  `;
  console.log(query);

    // Выполняем запрос
    const response = await fetch("https://api.itcharge.ru/graphql/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: mainServerToken,
      },
      body: JSON.stringify({query}),
    });
console.log(response);
    // Проверяем статус ответа
    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status}, StatusText: ${response.statusText}`
      );
    }

    // Парсим тело ответа
    const data = await response.json();
    console.log("Ответ от сервера:", data);

    // Проверяем на наличие ошибок GraphQL
    if (data.errors) {
      // Ищем поле description в первой ошибке (если оно существует)
      const description = data.errors[0]?.extensions?.description || "Неизвестная ошибка";
      
      // Отправляем описание ошибки пользователю
      bot.sendMessage(chatId, `Ошибка авторизации: ${description}`);
      throw new Error(`Ошибка GraphQL: ${description}`);}
    const tokenData = data.data?.AuthTelegramGetCustomerToken;

    if (!tokenData || !tokenData.token) {
      bot.sendMessage(chatId, "Не удалось получить токен авторизации.");
      return;
    }
    
    // Отправляем пользователю подтверждение и токен
      bot.sendMessage(
      chatId,
      `Успешная регистрация!\nВаш токен: ${tokenData.token}\nВаш ID клиента: ${tokenData.customerId}`
    );
    const token = tokenData.token;
    const customerId = tokenData.customerId;
  // Записываем данные в базу данных
        const queryUserDB = `
  INSERT INTO users (phone_number, chat_id, token, customerId)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(phone_number) 
  DO UPDATE SET 
    chat_id = excluded.chat_id,
    token = excluded.token,
    customerId = excluded.customerId;
  `;
console.log(queryUserDB);

 db.run(queryUserDB, [phoneNumber, chatId, token, customerId], function (err) {
    if (err) {
      console.error('Ошибка при выполнении SQL-запроса:', err.message);
    } else {
      console.log('Запись успешно добавлена или обновлена.');
    }
  });
}