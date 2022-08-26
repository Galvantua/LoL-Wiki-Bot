const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require("node-fetch");
const tests = require("../src/modules/tests");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("champion")
		.setDescription("gets champion stats from the LoL wiki")
		.addStringOption((option) =>
			option
				.setName("champion")
				.setDescription("Champions Name")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("stat")
				.setDescription("Statistic Wanted")
				.setRequired(true)
				.addChoices(
					{ name: "Health", value: "0" },
					{ name: "Health Regen", value: "1" },
					{ name: "Mana", value: "2" },
					{ name: "Mana Regen", value: "3" },
					{ name: "Armor", value: "4" },
					{ name: "Magic Resist", value: "5" },
					{ name: "Attack Damage", value: "6" },
					{ name: "Attack Range", value: "7" },
					{ name: "Attack Speed", value: "8" },
					{ name: "Attack Speed Ratio", value: "9" },
					{ name: "Move Speed", value: "10" },
					{ name: "All", value: "all" }
				)
		)
		.addStringOption((option) =>
			option
				.setName("level")
				.setDescription("Champion Level")
				.setRequired(false)
				.addChoices(
					{ name: "n", value: "n" },
					{ name: "1", value: "1" },
					{ name: "2", value: "2" },
					{ name: "3", value: "3" },
					{ name: "4", value: "4" },
					{ name: "5", value: "5" },
					{ name: "6", value: "6" },
					{ name: "7", value: "7" },
					{ name: "8", value: "8" },
					{ name: "9", value: "9" },
					{ name: "10", value: "10" },
					{ name: "11", value: "11" },
					{ name: "12", value: "12" },
					{ name: "13", value: "13" },
					{ name: "14", value: "14" },
					{ name: "15", value: "15" },
					{ name: "16", value: "16" },
					{ name: "17", value: "17" },
					{ name: "18", value: "18" }
				)
		),
	async execute(interaction) {
		await interaction.deferReply();
		let champion = interaction.options.getString("champion");
		let championName = await tests.nameAbilityTEST(champion);
		let stat = interaction.options.getString("stat");
		let level = interaction.options.getString("level");

		if (!level) {
			level = "n";
		}
		const embed = new EmbedBuilder();

		const request = await fetch(
			`https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions/${championName}.json`
		).catch((err) => {
			console.log("err");
		});
		const body = await request.text();
		const bodyJSON = JSON.parse(body);
		const stats = bodyJSON.stats;

		embed.setTitle(championName).setThumbnail(bodyJSON["icon"]);

		let statNames = [
			"Health",
			"Health Regen",
			"Mana",
			"Mana Regen",
			"Armor",
			"Magic Resist",
			"Attack Damage",
			"Bonus Attack Speed",
			"Base Attack Speed",
			"Attack Speed Ratio",
			"Attack Range",
			"Move Speed",
		];
		let flatStats = [
			stats.health["flat"],
			stats.healthRegen["flat"],
			stats.mana["flat"],
			stats.manaRegen["flat"],
			stats.armor["flat"],
			stats.magicResistance["flat"],
			stats.attackDamage["flat"],
			0,
			stats.attackSpeed["flat"].toString(),
			stats.attackSpeedRatio["flat"].toString(),
			stats.attackRange["flat"].toString(),
			stats.movespeed["flat"].toString(),
		];

		let growthStats = [
			stats.health["perLevel"],
			stats.healthRegen["perLevel"],
			stats.mana["perLevel"],
			stats.manaRegen["perLevel"],
			stats.armor["perLevel"],
			stats.magicResistance["perLevel"],
			stats.attackDamage["perLevel"],
			stats.attackSpeed["perLevel"],
		];

		if (level != "n") {
			for (let i = 0; i < growthStats.length; i++) {
				const growth = growthStats[i];
				flatStats[i] =
					flatStats[i] +
					growth * (level - 1) * (0.7025 + 0.0175 * (level - 1));
				flatStats[i] =
					Math.round((flatStats[i] + Number.EPSILON) * 100) / 100;
				flatStats[i] = flatStats[i].toString();
			}
		} else {
			for (let i = 0; i < growthStats.length; i++) {
				flatStats[i] =
					flatStats[i].toString() + " + " + growthStats[i].toString();
			}
		}
		if (stat != "all") {
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
		//await interaction.reply("done");
	},
};
