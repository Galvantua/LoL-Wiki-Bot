import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import { findChampionName, findAbilityName } from '../modules/nameFinders.mjs';

export const information = {
	name: 'champion',
	description: 'Gets a champion info from the wiki',
};

export default {
	data: new SlashCommandBuilder()
		.setName(`${information.name}`)
		.setDescription(`${information.name}`)

		.addStringOption((option) =>
			option
				.setName('champion')
				.setDescription('Champions Name')
				.setRequired(true),
		)

		.addStringOption((option) =>
			option
				.setName('stat')
				.setDescription('Statistic Wanted')
				.setRequired(true)
				.addChoices(
					{ name: 'Health', value: '0' },
					{ name: 'Health Regen', value: '1' },
					{ name: 'Mana', value: '2' },
					{ name: 'Mana Regen', value: '3' },
					{ name: 'Armor', value: '4' },
					{ name: 'Magic Resist', value: '5' },
					{ name: 'Attack Damage', value: '6' },
					{ name: 'Bonus Attack Speed', value: '7' },
					{ name: 'Attack Speed', value: '8' },
					{ name: 'Attack Speed Ratio', value: '9' },
					{ name: 'Attack Range', value: '10' },
					{ name: 'Move Speed', value: '11' },
					{ name: 'All', value: 'all' },
				),
		)

		.addStringOption((option) =>
			option
				.setName('level')
				.setDescription('Champion Level')
				.setRequired(false)
				.addChoices(
					{ name: 'n', value: 'n' },
					{ name: '1', value: '1' },
					{ name: '2', value: '2' },
					{ name: '3', value: '3' },
					{ name: '4', value: '4' },
					{ name: '5', value: '5' },
					{ name: '6', value: '6' },
					{ name: '7', value: '7' },
					{ name: '8', value: '8' },
					{ name: '9', value: '9' },
					{ name: '10', value: '10' },
					{ name: '11', value: '11' },
					{ name: '12', value: '12' },
					{ name: '13', value: '13' },
					{ name: '14', value: '14' },
					{ name: '15', value: '15' },
					{ name: '16', value: '16' },
					{ name: '17', value: '17' },
					{ name: '18', value: '18' },
				),
		),

	async execute(interaction) {
		await interaction.deferReply();

		let champion = interaction.options.getString('champion');

		let displayName = await findAbilityName(champion, interaction);
		let championName = await findChampionName(displayName, interaction);

		let stat = interaction.options.getString('stat');
		let level = interaction.options.getString('level');

		if (!level) level = 'n'; //n is the default level

		const embed = new EmbedBuilder();

		//TODO convert to custom solution
		const request = await fetch(
			`https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions/${championName}.json`,
		).catch((err) => {
			interaction.editReply('Please choose a valid Champion name');
			return;
		});

		const body = await request.text();

		let bodyJSON = '';
		try {
			bodyJSON = JSON.parse(body);
		} catch (error) {
			console.log(error);
			interaction.editReply('**Please choose a valid Champion name**');
			return;
		}

		const stats = bodyJSON.stats;

		embed.setTitle(displayName).setThumbnail(bodyJSON['icon']);

		let statNames = [
			'Health',
			'Health Regen',
			'Mana',
			'Mana Regen',
			'Armor',
			'Magic Resist',
			'Attack Damage',
			'Bonus Attack Speed',
			'Base Attack Speed',
			'Attack Speed Ratio',
			'Attack Range',
			'Move Speed',
		];

		let flatStats = [
			stats.health['flat'],
			stats.healthRegen['flat'],
			stats.mana['flat'],
			stats.manaRegen['flat'],
			stats.armor['flat'],
			stats.magicResistance['flat'],
			stats.attackDamage['flat'],
			0,
			stats.attackSpeed['flat'],
			stats.attackSpeedRatio['flat'],
			stats.attackRange['flat'].toString(),
			stats.movespeed['flat'].toString(),
		];

		let growthStats = [
			stats.health['perLevel'],
			stats.healthRegen['perLevel'],
			stats.mana['perLevel'],
			stats.manaRegen['perLevel'],
			stats.armor['perLevel'],
			stats.magicResistance['perLevel'],
			stats.attackDamage['perLevel'],
			stats.attackSpeed['perLevel'],
		];

		flatStats[8] = (
			Math.round((flatStats[8] + Number.EPSILON) * 1000) / 1000
		).toString();

		flatStats[9] = (
			Math.round((flatStats[9] + Number.EPSILON) * 1000) / 1000
		).toString();

		if (level != 'n') {
			for (let i = 0; i < growthStats.length; i++) {
				const growth = growthStats[i];

				flatStats[i] =
					flatStats[i] +
					growth * (level - 1) * (0.7025 + 0.0175 * (level - 1));

				flatStats[i] =
					Math.round((flatStats[i] + Number.EPSILON) * 100) / 100;

				flatStats[i] = flatStats[i].toString();

				if (i == 7) flatStats[i] = flatStats[i] + '%';
			}
		} else {
			for (let i = 0; i < growthStats.length; i++) {
				flatStats[i] =
					flatStats[i].toString() + ' + ' + growthStats[i].toString();
			}
		}
		embed.addFields({
			name: 'Level',
			value: level,
		});

		if (stat != 'all') {
			// console.log(statNames);
			// console.log(flatStats);
			// console.log(stat);
			embed.addFields({
				name: statNames[stat],
				value: flatStats[stat],
			});
		} else {
			for (let i = 0; i < flatStats.length; i++) {
				// console.log(statNames[i]);
				// console.log(flatStats[i]);

				embed.addFields({
					name: statNames[i],
					value: flatStats[i],
					inline: true,
				});
			}
		}

		await interaction.editReply({ embeds: [embed] });
	},
};
