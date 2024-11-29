// Этот код сейчас не используется, функционал неренесён в phoneCommand.js
const mainServerToken = process.env.ITCHARGE_API_MAIN_TOKEN;

export async function handleRegistration(bot, msg) {
  const chatId = msg.chat.id;

  // Уведомляем пользователя о начале запроса
  bot.sendMessage(chatId, "Запрашиваю данные с сервера...");

  const query = `
    mutation {
      AuthTelegramGetCustomerToken(
        phoneNumber: "+79086103928",
        chatId: "${chatId}",
        tenant: "itcharge"
      ) {
        token
        customerId
      }
    }
  `;
  try {
    // Выполняем запрос
    const response = await fetch("https://api.itcharge.ru/graphql/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: mainServerToken,
      },
      body: JSON.stringify({ query }),
    });

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
      throw new Error(`Ошибка GraphQL: ${JSON.stringify(data.errors)}`);
    }

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
  } catch (error) {
    console.error("Ошибка при запросе:", error.message);
    bot.sendMessage(chatId, `Произошла ошибка: ${error.message}`);
  }
}
