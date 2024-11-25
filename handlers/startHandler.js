export function handleStart(bot, msg) {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'дорогой друг'; 

      bot.sendMessage(chatId, `Здравствуйте ${userName}, Вас приветствует бот управления зарядными станциями.
Для отправки Вашего номера телефона используйте команду /phone.
Для получения списка доступных вам зарядных станций команду /stations.
Для получения вашего chatId используйте команду /chatId.`);
    } 