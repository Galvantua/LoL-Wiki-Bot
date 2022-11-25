import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import { findItemName } from "../modules/nameFinders.mjs";

export const information = {
	name: "item",
	description: "Queries Item info from the LoL wiki",
};

export default {
	data: new SlashCommandBuilder()
		.setName(`${information.name}`)
		.setDescription(`${information.description}`)
		.addStringOption((option) =>
			option
				.setName("item")
				.setDescription("Item's Name")
				.setRequired(true)
		),

	async execute(interaction) {
		await interaction.deferReply();

		const item = interaction.options.getString("item");
		const itemId = await findItemName(item, interaction);
		const embed = new EmbedBuilder();

		const request = await fetch(
			`https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/items/${itemId}.json`
		).catch((err) => {
			interaction.editReply("Please choose a valid item name");
			return;
		});

		const body = await request.text();

		let bodyJSON;
		try {
			bodyJSON = JSON.parse(body);
		} catch (error) {
			console.log(error);
			interaction.editReply("**Please choose a valid Item name**");
			return;
		}

		embed.setTitle(bodyJSON.name).setThumbnail(bodyJSON.icon);

		for (const stat in bodyJSON.stats) {
			for (const type in bodyJSON.stats[stat]) {
				if (bodyJSON.stats[stat][type] !== 0.0) {
					embed.addFields({
						name: `${type} ${stat}`,
						value: `${bodyJSON.stats[stat][type]}`,
					});
				}
			}
		}

		await interaction.editReply({ embeds: [embed] });
	},
};
