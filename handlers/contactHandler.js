export function handleContact(bot, msg) {
    const chatId = msg.chat.id;
  
    if (msg.contact) {
      const phoneNumber = msg.contact.phone_number; // Номер телефона пользователя
      bot.sendMessage(chatId, `Спасибо, Ваш номер телефона: ${phoneNumber}`);
    } else {
      bot.sendMessage(chatId, 'Не удалось получить номер телефона.');
    }
  }
  