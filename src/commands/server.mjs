import { SlashCommandBuilder } from "discord.js";

export const information = {
	name: "server",
	description: "Shows you some information about the server",
};

export default {

	data: new SlashCommandBuilder()
		.setName(`${this.information.name}`)
		.setDescription(`${this.information.name}`)
	, //end of SCB data

	async execute(interaction) {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},

};