const { SlashCommandBuilder } = require('discord.js');

module.exports = {

	information: {
		name: "server",
		description: "Shows you some information about the server",
	},

	data: new SlashCommandBuilder()
		.setName(`${this.information.name}`)
		.setDescription(`${this.information.name}`),

	async execute(interaction) {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},

};