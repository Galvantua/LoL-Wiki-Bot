import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const information = {
	name: 'help',
	description: 'Shows you all the commands',
};

export default {
	data: new SlashCommandBuilder()
		.setName(`${information.name}`)
		.setDescription(`${information.name}`)

		.addStringOption((option) =>
			option
				.setName('command')
				.setDescription('Command Name')
				.setRequired(false)
				.addChoices(
					{ name: 'Ability', value: 'ability' },
					{ name: 'Champion', value: 'champion' },
				),
		), //end of SCB data
	async execute(interaction) {
		let command = interaction.options.getString('command');
		let embed = new EmbedBuilder();

		switch (command) {
			case 'ability':
				embed
					.setTitle('Ability')
					.setDescription(
						'Queries an Ability based on Champion name and Ability slot.',
					);
				break;

			case 'champion':
				embed
					.setTitle('Champion')
					.setDescription(
						"Queries Champion stats based on Champion name, Stat name, and level. Level 'n' displays the base value and the growth value.",
					);
				break;

			default:
				embed.setTitle('Help').addFields(
					{
						name: 'Ability',
						value: 'Queries an Ability based on Champion name and Ability slot.',
					},
					{
						name: 'Champion',
						value: "Queries Champion stats based on Champion name, Stat name, and level. Level 'n' displays the base value and the growth value.",
					},
				);

				break;
		}
		embed.addFields({
			name: `​`,
			value: 'If you have a bug or feature request, go to https://discord.gg/XxXTpdDphN',
		});
		await interaction.reply({ embeds: [embed] });
	},
};
