import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import { findItemName } from '../modules/nameFinders.mjs';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
import handlers from '../modules/handlers.mjs';
import Fuse from 'fuse.js';
import fs from 'node:fs'
export const information = {
	name: 'item',
	description: 'Queries Item info from the LoL wiki',
};

export default {
	data: new SlashCommandBuilder()
		.setName(`${information.name}`)
		.setDescription(`${information.description}`)
		.addStringOption((option) =>
			option
				.setName('item')
				.setDescription("Item's Name")
				.setRequired(true),
		),

	async execute(interaction) {
		await interaction.deferReply();

		const item = interaction.options.getString('item');
		const itemId = await findItemName(item, interaction);
		const embed = new EmbedBuilder();

		// const request = await fetch(
		// 	`https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/items/${itemId}.json`,
		// ).catch((err) => {
		// 	interaction.editReply('Please choose a valid item name');
		// 	return;
		// });

		// const body = await request.text();

		// let bodyJSON;
		// try {
		// 	bodyJSON = JSON.parse(body);
		// } catch (error) {
		// 	console.log(error);
		// 	interaction.editReply('**Please choose a valid Item name**');
		// 	return;
		// }

		const items = JSON.parse(fs.readFileSync(`./loldata/items/${itemId}.json`).toString());

		embed.setTitle(items.name).setThumbnail(items.icon);
		let statName;
		let statValue;
		let statNameArray = [
			'Attack Damage',
			'Ability Power',
			'Armor',
			'Magic Resist',
			'Health',
			'Health Regen',
			'Mana',
			'Mana Regen',
			'Ability Haste',
			'Lethality',
			'Armor Penetration',
			'Magic Penetration',
			'Critical Strike Chance',
			'Life Steal',
			'Movement Speed',
			'Attack Speed',
		];
		for (const stat in items.stats) {
			for (const type in items.stats[stat]) {
				if (items.stats[stat][type] !== 0.0) {
					let fuse = new Fuse(statNameArray);
					let result = fuse.search(stat)[0].item;

					if (
						result == 'Attack Speed' ||
						result == 'Armor Penetration' ||
						(type == 'percent' &&
							(result == 'Movement Speed' ||
								result == 'Magic Penetration' ||
								result == 'Critical Strike Chance'))
					) {
						statValue = `${items.stats[stat][type]}%`;
					} else {
						statValue = items.stats[stat][type];
					}

					embed.addFields({
						name: `${result}`,
						value: `${statValue}`,
						inline: true,
					});
				}
			}
		}
		let mythic;
		for (const passive in items.passives) {
			let passiveName;
			if (items.passives[passive].name) {
				passiveName = items.passives[passive].name;
			} else {
				passiveName = '';
			}
			let passiveEffects;
			if (items.passives[passive].effects != null) {
				passiveEffects = items.passives[passive].effects.replace(
					/\+/g,
					'%2b',
				);
				const passiveUrl = `https://leagueoflegends.fandom.com/api.php?action=parse&text=${passiveEffects}&contentmodel=wikitext&format=json`;
				const passiveRequest = await fetch(passiveUrl).catch((err) => {
					console.log(err);
				});
				const passiveBody = await passiveRequest.text();
				let passivebodyJSON;
				try {
					passivebodyJSON = JSON.parse(passiveBody);
				} catch (error) {
					interaction.editReply('**Error parseing passive**');
					return;
				}

				const passivedom = new JSDOM(passivebodyJSON.parse.text['*'], {
					contentType: 'text/html',
				});

				let passiveDocument = passivedom.window.document;
				passiveEffects = new handlers().wikiFormat(
					passiveDocument.querySelector('p'),
				).textContent;
			}
			let passiveCooldown;
			if (items.passives[passive].cooldown != null) {
				passiveCooldown = items.passives[passive].cooldown;
				const passiveUrl = `https://leagueoflegends.fandom.com/api.php?action=parse&text=${passiveCooldown}&contentmodel=wikitext&format=json`;
				const passiveRequest = await fetch(passiveUrl).catch((err) => {
					console.log(err);
				});
				const passiveBody = await passiveRequest.text();
				let passivebodyJSON;
				try {
					passivebodyJSON = JSON.parse(passiveBody);
				} catch (error) {
					interaction.editReply('**Error parseing passive**');
					return;
				}

				const passivedom = new JSDOM(passivebodyJSON.parse.text['*'], {
					contentType: 'text/html',
				});

				let passiveDocument = passivedom.window.document;
				passiveCooldown = `Cooldown: ${passiveDocument
					.querySelector('p')
					.textContent.trim()} seconds`;
			} else {
				passiveCooldown = '';
			}

			if (items.passives[passive].mythic == true) {
				mythic = true;
			} else if (items.passives[passive].unique == true) {
				mythic = false;
				embed.addFields({
					name: `Unique Passive: ${passiveName}`,
					value: `${passiveEffects} ${passiveCooldown}`,
				});
			} else if (items.passives[passive].unique == false) {
				mythic = false;
				embed.addFields({
					name: `Passive: ${passiveName}`,
					value: `${passiveEffects} ${passiveCooldown}`,
				});
			}
		}

		for (const active in items.active) {
			let activeName;
			if (items.active[active].name) {
				activeName = items.active[active].name;
			}
			let activeEffects;
			if (items.active[active].effects != null) {
				activeEffects = items.active[active].effects.replace(
					/\+/g,
					'%2b',
				);
				const activeUrl = `https://leagueoflegends.fandom.com/api.php?action=parse&text=${activeEffects}&contentmodel=wikitext&format=json`;
				const activeRequest = await fetch(activeUrl).catch((err) => {
					console.log(err);
				});
				const activeBody = await activeRequest.text();
				let activebodyJSON;
				try {
					activebodyJSON = JSON.parse(activeBody);
				} catch (error) {
					interaction.editReply('**Error parseing active**');
					return;
				}

				const activedom = new JSDOM(activebodyJSON.parse.text['*'], {
					contentType: 'text/html',
				});

				let activeDocument = activedom.window.document;
				activeEffects = new handlers().wikiFormat(
					activeDocument.querySelector('p'),
				).textContent;
			}
			let activeCooldown;
			if (items.active[active].cooldown != null) {
				activeCooldown = `**Cooldown:** ${items.active[active].cooldown} seconds\n`;
			} else {
				activeCooldown = '';
			}
			let activeRange;
			if (
				items.active[active].range != null &&
				items.active[active].range != 0
			) {
				activeRange = `**Range:** ${items.active[active].range}`;
			} else {
				activeRange = '';
			}
			embed.addFields({
				name: `Active: ${activeName}`,
				value: `${activeEffects.trim()}\n${activeCooldown}${activeRange}`,
			});
		}
		if (mythic) {
			embed.addFields({
				name: `Mythic Passive: `,
				value: `Embues each of your legendary items with:`,
			});
			for (const passive in items.passives) {
				if (items.passives[passive].mythic == true) {
					for (const stat in items.passives[passive].stats) {
						for (const type in items.passives[passive].stats[
							stat
						]) {
							if (
								items.passives[passive].stats[stat][type] !==
								0.0
							) {
								let fuse = new Fuse(statNameArray);
								let result = fuse.search(stat)[0].item;

								if (
									result == 'Attack Speed' ||
									result == 'Armor Penetration' ||
									(type == 'percent' &&
										(result == 'Movement Speed' ||
											result == 'Magic Penetration' ||
											result == 'Critical Strike Chance'))
								) {
									statValue = `${items.passives[passive].stats[stat][type]}%`;
								} else {
									statValue =
										items.passives[passive].stats[stat][
											type
										];
								}
								embed.setColor(0xb6e2a1);
								embed.addFields({
									name: `${result}`,
									value: `${statValue}`,
									inline: true,
								});
							}
						}
					}
					continue;
				}
			}
		}

		await interaction.editReply({ embeds: [embed] });
	},
};
