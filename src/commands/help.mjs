import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const information = {
	name: 'help',
	description: 'Shows you all the commands',
};
let commandList = {
	ability: {
		displayName: 'Ability',
		description:
			'Queries an Ability based on Champion name and Ability slot.',
	},
	champion: {
		displayName: 'Champion',
		description:
			"Queries Champion stats based on Champion name, Stat name, and level. Level 'n' displays the base value and the growth value.",
	},
	item: {
		displayName: 'Item',
		description: 'Queries Item info based on Item name.',
	},
	help: {
		displayName: 'Help',
		description: 'Shows you all the commands.',
	},
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
					{ name: 'Item', value: 'item' },
					{ name: 'Help', value: 'help' },
				),
		), //end of SCB data
	async execute(interaction) {
		let command = interaction.options.getString('command');
		let embed = new EmbedBuilder();

		if (command) {
			embed
				.setTitle(commandList[`${command}`].displayName)
				.setDescription(`${commandList[`${command}`].description}`);
		} else {
			embed.setTitle('Help');
			for (let command in commandList) {
				embed.addFields({
					name: commandList[`${command}`].displayName,
					value: commandList[`${command}`].description,
				});
			}
		}

		embed.addFields({
			name: `​`,
			value: 'If you have a bug or feature request, go to https://discord.gg/XxXTpdDphN',
		});
		await interaction.reply({ embeds: [embed] });
	},
};
