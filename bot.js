const { Telegraf } = require('telegraf');
const OpenAI = require('openai');

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

bot.start((ctx) => {
  ctx.reply('Привет! Я твой ChatGPT бот. Напиши мне что-нибудь.');
});

bot.on('text', async (ctx) => {
  try {
    await ctx.sendChatAction('typing');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: ctx.message.text }],
    });
    await ctx.reply(completion.choices[0].message.content);
  } catch (error) {
    console.error('Ошибка:', error);
    await ctx.reply('Произошла ошибка при обращении к OpenAI.');
  }
});

bot.launch();
console.log('Бот запущен!');
