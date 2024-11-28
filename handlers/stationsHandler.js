
export async function handleChargingStationsList(bot, msg) {
const chatId = msg.chat.id;
const itChargeAPIToken = process.env.ITCHARGE_API_TOKEN;

// Информируем пользователя, что начинается запрос
bot.sendMessage(chatId, 'Запрашиваю данные с сервера...');

  const query = `
    {
      ChargingStationsList(page: {size: 5, number: 1}),
        {
        count
        rows {
          id
          name
        }
       }
      }
    `;
console.log(query);
const response = await fetch('https://api.testing.itcharge.ru/graphql/cp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'authorization': itChargeAPIToken
  },
  body: JSON.stringify({
    query: query,
  }),
});
console.log(response);
// Проверяем, есть ли ответ вообще
  if (!response) {
    throw new Error('Не удалось получить ответ от сервера.');
  }
  // Проверка статуса ответа
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}, StatusText: ${response.statusText}`);
  }

  // Попытка разобрать тело ответа
  const textResponse = await response.text();
  console.log(textResponse);
  // Проверяем, есть ли содержимое в ответе
  if (!textResponse) {
    throw new Error('Сервер вернул пустой ответ.');
  }

  // Парсим JSON
  const data = JSON.parse(textResponse);
  console.log(textResponse);

  if (data.errors) {
    throw new Error(`Ошибка GraphQL: ${JSON.stringify(data.errors)}`);
  }
  console.log('Успешный ответ:', data);
  const ChargingStationsList = data.data.ChargingStationsList;
  console.log(ChargingStationsList);  

  if (!ChargingStationsList || !ChargingStationsList.rows) {
    bot.sendMessage(chatId, 'Данные о зарядных станциях не найдены.');
    return;
  }
  const message = ChargingStationsList.rows
  .map(station => {
    return `ID: ${station.id || "ID отсутствует"},
    Название: ${station.name || "Название отсутствует"}`;
  })
  .join('\n');

  console.log(message);
  if (message.length > 4096) {
    bot.sendMessage(chatId, "Ответ слишком длинный для отправки. Попробуйте запросить меньший объем данных.");
  } else {
    bot.sendMessage(chatId, message);
  } 
} 