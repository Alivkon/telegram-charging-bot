export async function handleRegistration(bot, msg) {
  const chatId = msg.chat.id;

  // Информируем пользователя, что начинается запрос
  bot.sendMessage(chatId, "Запрашиваю данные с сервера...");

  const query = `
{
  AuthTelegramGetCustomerTokenRequest(
    phoneNumber: "+79086103928",
    chatId: 1232578036,
    tenant: "itcharge"
  ) {
    token
    customerId
  }
}`;

  console.log(query);
  //     const response = await fetch('https://api.testing.itcharge.ru/graphql/cp', {
  const response = await fetch("https://api.itcharge.ru//graphql/cp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization:
        "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnQiOiJpdGNoYXJnZSIsInRva2VuVHlwZSI6Ik0yTSIsInJvbGUiOiJNMk0iLCJpYXQiOjE3MzI1NzczNTgsImV4cCI6MTc2NDExMzM1OCwiYXVkIjoiaXRjaGFyZ2UudGVsZWdyYW0uYXBwIiwiaXNzIjoibTJtLWF1dGguaXRjaGFyZ2UucnUifQ.dICB66tPNp6Nl88Jrs0yYZK-QegVfSzz1Iav4fFBtGp279e0a0ncoxVoxqwUdH-xoGrK0aHHw3gyrda56tb5_Q",
    },
    body: JSON.stringify({
      query: query,
    }),
  });
  console.log(response);
  // Проверяем, есть ли ответ вообще
  if (!response) {
    throw new Error("Не удалось получить ответ от сервера.");
  }
  // Проверка статуса ответа
  if (!response.ok) {
    throw new Error(
      `HTTP error! Status: ${response.status}, StatusText: ${response.statusText}`
    );
  }

  // Попытка разобрать тело ответа
  const textResponse = await response.text();
  console.log(textResponse);
  // Проверяем, есть ли содержимое в ответе
  if (!textResponse) {
    throw new Error("Сервер вернул пустой ответ.");
  }

  // Парсим JSON
  const data = JSON.parse(textResponse);
  console.log(textResponse);

  if (data.errors) {
    throw new Error(`Ошибка GraphQL: ${JSON.stringify(data.errors)}`);
  }
  console.log("Успешный ответ:", data);
  const AuthTelegramGetCustomerTokenRequest =
    data.data.AuthTelegramGetCustomerTokenRequest;
  console.log(AuthTelegramGetCustomerTokenRequest);

  if (
    !AuthTelegramGetCustomerTokenRequest ||
    !AuthTelegramGetCustomerTokenRequest
  ) {
    bot.sendMessage(chatId, "Данные о зарядных станциях не найдены.");
    return;
  }
  const message = AuthTelegramGetCustomerTokenRequest.map((station) => {
    return `ID: ${station.id || "ID отсутствует"},
        Название: ${station.name || "Название отсутствует"}`;
  }).join("\n");

  console.log(message);
  if (message.length > 4096) {
    bot.sendMessage(
      chatId,
      "Ответ слишком длинный для отправки. Попробуйте запросить меньший объем данных."
    );
  } else {
    bot.sendMessage(chatId, message);
  }
}
