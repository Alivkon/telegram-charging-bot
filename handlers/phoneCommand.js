export function handlePhoneCommand(bot, msg) {
    const chatId = msg.chat.id;
  
    bot.sendMessage(chatId, 'Пожалуйста, поделитесь своим номером телефона.', {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Отправить номер телефона',
              request_contact: true, // Эта опция запрашивает контакт
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }
  