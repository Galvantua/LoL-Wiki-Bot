import { inspect } from 'util';
import {
	ActionRowBuilder,
	SlashCommandBuilder,
	EmbedBuilder,
} from 'discord.js';
import fetch from 'node-fetch';
import jsdom from 'jsdom';
import { findAbilityName } from '../modules/nameFinders.mjs';
import handlers from '../modules/handlers.mjs';
const { JSDOM } = jsdom;
export default {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Evaluates code')
		.addStringOption((option) =>
			option
				.setName('code')
				.setDescription('Code to evaluate')
				.setRequired(true),
		),

	async execute(interaction) {
		try {
			if (
				interaction.user.id != '542159022229422096' &&
				interaction.user.id != '833819394432958474'
			) {
				await interaction.reply(
					'You are not authorized to use this command',
				);
				return;
			}
			var result = interaction.options.getString('code');
			let noResultArg = new EmbedBuilder();
			noResultArg
				.setColor('#e31212')
				.setDescription('ERROR: No valid eval args were provided ');
			if (!result) {
				await interaction.reply({ embeds: [noResultArg] });
				return;
			}
			let evaled = eval(result);
			console.log(result);

			let resultSuccess = new EmbedBuilder();
			resultSuccess
				.setColor('#8f82ff')
				.setTitle('Success')
				.addFields(
					{
						name: `Input:\n`,
						value:
							'```js\n' +
							`${result}` +
							'```\n <:stun:1049873684304769086>',
					},
					{
						name: `Output:\n`,
						value: '```js\n' + `${evaled}` + '```',
					},
				);

			await interaction.reply({ embeds: [resultSuccess] });
		} catch (error) {
			let resultError = new EmbedBuilder();
			resultError
				.setColor('#e31212')
				.setTitle('An error has occured')
				.addFields(
					{
						name: `Input:\n`,
						value: '```js\n' + `${result}` + '```',
					},
					{
						name: `Output:\n`,
						value: '```js\n' + `${error.message}` + '```',
					},
				);
			//.setDescription(`Output:\n\`\`\`${err}\`\`\``)
			await interaction.reply({ embeds: [resultError] });
		}
	},
};
