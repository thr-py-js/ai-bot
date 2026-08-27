const { Telegraf } = require('telegraf');
const OpenAI = require('openai');

// Вставь сюда свой токен от BotFather вместо заглушки внутри кавычек
const bot = new Telegraf(process.env.BOT_TOKEN
);

// Вставь сюда свой ключ OpenAI вместо заглушки внутри кавычек
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
,
});

bot.start((ctx) => {
  const userName = ctx.from.first_name || 'друг';
  ctx.reply(
    `Привет, ${userName}! 🧠 Я твой личный ChatGPT в Telegram.\n\n` +
    `Напиши мне любой вопрос, и я отвечу с помощью искусственного интеллекта!`
  );
});

bot.on('text', async (ctx) => {
  try {
    await ctx.sendChatAction('typing');
    
    const userMessage = ctx.message.text;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: userMessage }],
    });

    const botReply = completion.choices[0].message.content;
    await ctx.reply(botReply);
  } catch (error) {
    console.error('Ошибка:', error);
    await ctx.reply('Произошла ошибка при обращении к искусственному интеллекту.');
  }
});

bot.launch();
console.log('Бот успешно запущен!');
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running!');
}).listen(process.env.PORT || 3000);
