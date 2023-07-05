// jshint esversion:6
require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const token = process.env.telegramToken;
const bot = new TelegramBot(token, {polling: true});

// openai    
const { Configuration, OpenAIApi } = require("openai");

const API_KEY =process.env.openAI;
const configuration = new Configuration({
  apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);


bot.onText(/\/start/,(msg)=>{
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "how can i help you today");
});


bot.on('message',(msg)=>{
    const chatId = msg.chat.id;
    let input =msg.text;
    console.log(input);
    bot.sendMessage(chatId, "typing");

    let outputs =[];

    const response = openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content : input}],
        max_tokens: 700,
        temperature: 0,
      }).then((docs)=>{

        console.log(docs.data.choices);
        docs.data.choices.forEach(function(choice){
            outputs.push(choice);
           });

           outputs.forEach(function(output){
            // console.log(output.message.content);

            bot.sendMessage(chatId,  output.message.content );


            output =[];
           });
      });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
  });