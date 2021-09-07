//Joes discord bot

//Modules
const config = require('./config.json')
const { Client, Intents, MessageEmbed } = require('discord.js');
//Create bot object
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] }); 

//Create ready event
bot.once('ready', async () => {
   bot.user.setStatus('online'); //useless but looks cool 8)
   bot.user.setActivity(`for ${config.prefix}help`, { type: 'WATCHING' });  
   console.log(`woah the bot is running`); 
});

bot.on('message', async (message) => {

   //Ignore bot messages
   if(message.author.bot) return;
   if(!message.content.startsWith(config.prefix)) return;

   //Create a command handler
   const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
   const command = args.shift().toLowerCase();

   //Create a command handler
   try {
      let commandFile = require(`./commands/${command}.js`);
      commandFile.run(bot, message, args);
   } catch (err) {
      console.error(err);
   };

});

//Login to gateway
bot.login(config.token); 
