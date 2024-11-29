export function handlePhoneCommand(bot, msg) {
  const chatId = msg.chat.id;

  if (msg.text === "/phone") {
    bot.sendMessage(chatId, "Пожалуйста, отправьте ваш номер телефона, используя кнопку ниже.", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Отправить номер телефона",
              request_contact: true // Эта кнопка позволяет пользователю отправить свой контакт
            }
          ]
        ],
        resize_keyboard: true, // Уменьшаем клавиатуру для удобства
        one_time_keyboard: true // Клавиатура исчезает после нажатия
      }
    });
  }
}

//Обработка контакта пользователя
export function handlePhone(bot, msg) {
  const chatId = msg.chat.id;

  // Проверяем, что сообщение содержит контакт
  if (msg.contact) {
    const phoneNumber = msg.contact.phone_number;
    const firstName = msg.contact.first_name;

    bot.sendMessage(chatId, `Спасибо, ${firstName}! Мы получили ваш номер телефона: ${phoneNumber}`);

    
  }
}
