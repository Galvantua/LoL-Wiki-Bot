import { SlashCommandBuilder } from 'discord.js';

export const information = {
	name: 'user',
	description: 'Replies with user info!',
};

export default {
	data: new SlashCommandBuilder()
		.setName(`${information.name}`)
		.setDescription(`${information.name}`), //end of SCB data
	async execute(interaction) {
		await interaction.reply(
			`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`,
		);
	},
};
