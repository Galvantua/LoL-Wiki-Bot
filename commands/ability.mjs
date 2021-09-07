export async function run(bot, core, message, args) {

    const Http = new XMLHttpRequest();
    const url='https://leagueoflegends.fandom.com/wiki/${}/LoL';
    Http.open("GET", url);
	Http.send();

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
  
    //create an embed
    const embed = new core.MessageEmbed()
    embed.setTitle("Pong!")
    embed.setColor('#01eee8') 
    embed.addField(`🖥️ WebSocket`, `**${bot.ws.ping}**ms`)
    //create a red hex color embed

    //send the embed
    await message.channel.send({ embeds: [embed]});

}
