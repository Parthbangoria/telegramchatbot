// jshint esversion:6
require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const token = process.env.telegramToken;
const bot = new TelegramBot(token, { polling: true });


// gemini--ai

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });


bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "how can i help you today");
});


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  let input = msg.text;
  console.log(input);
  bot.sendMessage(chatId, "typing");


  const result = await model.generateContent(input);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  bot.sendMessage(chatId, text);

});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});