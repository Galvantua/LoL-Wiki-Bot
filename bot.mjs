//Joes discord bot

//Modules
import fs from 'fs';
import { Client, Intents, MessageEmbed } from 'discord.js';
//Create bot object
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] }); 

const core = {
   MessageEmbed: MessageEmbed //allow to use embeds from the bot object
}

const configFile = await fs.promises.readFile('./config.json', 'utf8');
const config = JSON.parse(configFile);


//Create ready event
bot.once('ready', async () => {
   bot.user.setStatus('online'); //useless but looks cool 8)
   bot.user.setActivity(`for ${config.prefix}help`, { type: 'WATCHING' });  
   console.log(`woah the bot is running`); 
});

bot.on('messageCreate', async (message) => {

   //Ignore bot messages
   if(message.author.bot) return;
   if(!message.content.startsWith(config.prefix)) return;

   //Create a command handler
   const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
   const command = args.shift().toLowerCase();

   //Create a command handler
   try {
      const commandFile = await import(`./commands/${command}.mjs`);
      commandFile.run(bot, core, message, args);
   } catch (err) {
      console.error(err);
   };

});

//Login to gateway
bot.login(config.token); 
