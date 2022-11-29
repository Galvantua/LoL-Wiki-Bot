import { SlashCommandBuilder } from 'discord.js';

export const information = {
	name: 'ping',
	description: 'Replies with Pong',
};

export default {
	data: new SlashCommandBuilder()
		.setName(`${information.name}`)
		.setDescription(`${information.name}`), //end of SCB data
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
