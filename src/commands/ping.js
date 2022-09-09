const { SlashCommandBuilder } = require('discord.js');

module.exports = {

	information: {
		name: "ping",
		description: "Replies with Pong",
	},

	data: new SlashCommandBuilder()
		.setName(`${this.information.name}`)
		.setDescription(`${this.information.name}`)
	, //end of SCB data

	async execute(interaction) {
		await interaction.reply('Pong!');
	},

};