export function handlePhoneCommand(bot, msg) {
  const chatId = msg.chat.id;

  if (msg.text === "/phone") {
    bot.sendMessage(chatId, "Пожалуйста, отправьте ваш номер телефона, используя кнопку ниже.", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Отправить номер телефона",
              callback_data: "request_contact"
            }
          ]
        ]
      }
    });
  }

  // Обработчик нажатия на inline-кнопку
  bot.on("callback_query", async query => {
    if (query.data === "request_contact") {
      const callbackChatId = query.message.chat.id;

      // Здесь мы отправляем пользователю сообщение о необходимости поделиться контактом
      bot.sendMessage(callbackChatId, "Пожалуйста, отправьте ваш контакт через кнопку клавиатуры.", {
        reply_markup: {
          keyboard: [
            [
              {
                text: "Отправить номер телефона",
                request_contact: true // Эта кнопка позволяет отправить контакт
              }
            ]
          ],
          resize_keyboard: true, // Уменьшаем клавиатуру
          one_time_keyboard: true // Клавиатура исчезнет после нажатия
        }
      });

      // Уведомляем Telegram, что запрос обработан
      bot.answerCallbackQuery(query.id);
    }
  });
}

  