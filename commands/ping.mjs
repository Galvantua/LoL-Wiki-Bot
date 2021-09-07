//create a ping command based on a command handler
export async function run(bot, core, message, args) {

    //create an embed
    const embed = new core.MessageEmbed()
    embed.setTitle("Pong!")
    embed.setColor('#01eee8') 
    embed.addField(`🖥️ WebSocket`, `**${bot.ws.ping}**ms`)
    //create a red hex color embed

    //send the embed
    await message.channel.send({ embeds: [embed]});

}