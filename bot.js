//Joes discord bot

//Modules
const config = require('./config.json')
const { Client, Intents, MessageEmbed } = require('discord.js');
//Create bot object
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] }); 

//Create ready event
bot.once('ready', async () => {
   bot.user.setStatus('online'); //useless but looks cool 8)
   bot.user.setActivity('for PREFIXhelp', { type: 'WATCHING' });  
   console.log(`woah the bot is running`); 
});

//Login to gateway
bot.login(config.json); 
