export async function handleChargingStationsList(bot, msg) {
const chatId = msg.chat.id;

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
    'authorization': "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzZjk4MDhiMS00MTA5LTQ4NzAtOTM4My1iOWYyNWM0Nzk4NmQiLCJ0ZW5hbnQiOiJpdGNoYXJnZSIsInRlbmFudFNldHRpbmdzIjp7ImZlYXR1cmVCYWxhbmNlIjp0cnVlLCJjb3VudHJ5IjoiUlUiLCJwYXltZW50U2VydmljZSI6Inlvb2thc3NhIn0sImNvbXBhbnlJZCI6ImIzNzE4NmYzLTlmMzMtNDExZC05ZTUzLWQwZDMxZWMyZDhkYyIsImNvbXBhbnlUeXBlIjoiQ2hhcmdpbmcgU3RhdGlvbiBPcGVyYXRpb24iLCJlbWFpbCI6ImFsZXh0ZXN0aW5nQHRlc3RpbmcuY29tIiwicGhvbmUiOiIrNzc3Nzc3Nzc5OTAiLCJyb2xlIjoiU3VwZXIgQWRtaW4iLCJpYXQiOjE3MzAyODc4MDIsImV4cCI6MTgxNjY4NzgwMiwiYXVkIjoiYXBpLml0Y2hhcmdlLnJ1IiwiaXNzIjoiYXBpLml0Y2hhcmdlLnJ1In0.McDqVZNQDXaeelEwpKmGVwljuIYeenQn583ft9HixLnIb7FOVQB8aiu5fI-0quKR8ilGWLClepLIGaZco6lskQ",
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