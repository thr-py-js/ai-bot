const http = require('http');
const { Telegraf } = require('telegraf');
const OpenAI = require('openai');

// Инициализация бота Telegram
const bot = new Telegraf(process.env.BOT_TOKEN);

// Инициализация OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ответ на команду /start
bot.start((ctx) => {
  const userName = ctx.from.first_name || 'друг';
  ctx.reply(
    `Привет, ${userName}! 🧠 Я твой личный ChatGPT.\nНапиши мне любой вопрос, и я отвечу с помощью нейросети.`
  );
});

// Обработка любых текстовых сообщений
bot.on('text', async (ctx) => {
  try {
    // Показываем статус "печатает..."
    await ctx.sendChatAction('typing');

    const userMessage = ctx.message.text;

    // Отправляем запрос к OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: userMessage }],
    });

    // Получаем и отправляем ответ
    const botReply = completion.choices[0].message.content;
    await ctx.reply(botReply);

  } catch (error) {
    console.error('Ошибка:', error);
    await ctx.reply('Произошла ошибка при обращении к OpenAI. Проверь логи.');
  }
});

// Запуск самого бота
bot.launch();
console.log('Бот успешно запущен и ждет сообщений!');

// Запуск фейкового веб-сервера, чтобы Railway не выдавал Crash
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running!');
}).listen(process.env.PORT || 3000);
