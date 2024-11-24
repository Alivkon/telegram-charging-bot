export function handleStart(bot, msg) {
    const chatId = msg.chat.id;

      bot.sendMessage(chatId, `Здравствуйте, Вас приветствует бот управления зарядными станциями.
Для отправки Вашего номера телефона используйте команду /phone.
Для получения списка доступных вам зарядных станций команду /stations `);
    } 