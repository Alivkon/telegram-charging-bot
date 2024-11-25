export function handleChatId(bot, msg) {
    const chatId = msg.chat.id; // Получение ID чата
    bot.sendMessage(chatId, `Ваш чат-ID: ${chatId}`)
}
