const { SlashCommandBuilder } = require('discord.js');

module.exports = {

	information: {
		name: "user",
		description: "Replies with user info!",
	},

	data: new SlashCommandBuilder()
		.setName(`${this.information.name}`)
		.setDescription(`${this.information.name}`)
	, //end of SCB data

	async execute(interaction) {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	},

};