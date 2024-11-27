import sqlite3 from "sqlite3";

// Создаем или подключаемся к базе данных
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Ошибка подключения к базе данных:", err.message);
  } else {
    console.log("Подключение к базе данных установлено.");
  }
});

// Создаем таблицу, если она еще не существует
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    phone_number TEXT PRIMARY KEY, 
    chat_id INTEGER NOT NULL,
    token TEXT
  )
`);

export function handleContact(bot, msg) {
  const chatId = msg.chat.id;

  if (msg.contact) {
    const phoneNumber = msg.contact.phone_number;

    // Сохраняем или обновляем запись в БД
    const query = `
      INSERT INTO users (phone_number, chat_id)
      VALUES (?, ?)
      ON CONFLICT(phone_number) DO UPDATE SET chat_id = excluded.chat_id
    `;

    db.run(query, [phoneNumber, chatId], function (err) {
      if (err) {
        console.error("Ошибка при записи в базу данных:", err.message);
        bot.sendMessage(chatId, "Произошла ошибка при сохранении вашего номера телефона.");
      } else {
        bot.sendMessage(chatId, `Спасибо, Ваш номер телефона: ${phoneNumber}`);
      }
    });
  } else {
    bot.sendMessage(chatId, "Не удалось получить номер телефона.");
  }
}