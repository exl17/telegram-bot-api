const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');

const bot = new TelegramBot('6723360232:AAFuB4WOMDWhUK9EAreaDspkvWoGiWR5V80', { polling: true });

async function checkPage(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Получаем заголовок, описание и h1 с использованием JavaScript на странице
    const result = await page.evaluate(() => {
      return {
        title: document.querySelector('title') ? document.querySelector('title').innerText.trim() : '',
        description: document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]').content.trim() : '',
        h1: document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : '',
      };
    });

    await browser.close();

    return result;
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

async function sendResults(chatId, url) {
  const pageResult = await checkPage(url);

  let message = `Результаты проверки для ${url}:\n`;
  message += `Title: ${pageResult.title}\nDescription: ${pageResult.description}\nH1: ${pageResult.h1 || 'Отсутствует'}`;

  bot.sendMessage(chatId, message);
}

setInterval(() => {
  const chatId = '362969254';
  const urlsToCheck = [
    'https://ispace.ua/ua/',
    'https://ispace.ua/ua/iphone',
    // Добавьте другие URL-адреса для проверки
  ];

  for (const url of urlsToCheck) {
    sendResults(chatId, url);
  }
}, 60 * 60 * 1000);

bot.onText(/\/check/, (msg) => {
  const chatId = msg.chat.id;
  const urlsToCheck = [
    'https://ispace.ua/ua/',
    'https://ispace.ua/ua/iphone',
    // Добавьте другие URL-адреса для проверки
  ];

  for (const url of urlsToCheck) {
    sendResults(chatId, url);
  }
});
