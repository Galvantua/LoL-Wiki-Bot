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

		const itemObj = JSON.parse(fs.readFileSync(`./loldata/items/${itemId}.json`).toString());

		embed.setTitle(itemObj.name).setThumbnail(itemObj.icon);
		// let statName;
		let statValue;
		let mythic;
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
			'Heal and Shield Power'
		];
		for (const stat in itemObj.stats) {
			for (const type in itemObj.stats[stat]) {
				if (itemObj.stats[stat][type] !== 0.0) {
					console.log(`itemID: ${itemId}`);

					let fuse = new Fuse(statNameArray);
					let results = fuse.search(stat);
					let result = fuse.search(stat)[0].item;

					if (
						result == 'Attack Speed' ||
						result == 'Armor Penetration' ||
						(type == 'percent' &&
							(result == 'Movement Speed' ||
								result == 'Magic Penetration' ||
								result == 'Critical Strike Chance'))
					) {
						statValue = `${itemObj.stats[stat][type]}%`;
					} else {
						statValue = itemObj.stats[stat][type];
					}

					embed.addFields({
						name: `${result}`,
						value: `${statValue}`,
						inline: true,
					});
				}
			}
		}
		for (const passive in itemObj.passives) {
			let passiveName;
			if (itemObj.passives[passive].name) {
				passiveName = itemObj.passives[passive].name;
			} else {
				passiveName = '';
			}
			let passiveEffects;
			if (itemObj.passives[passive].effects != null) {
				passiveEffects = encodeURIComponent(itemObj.passives[passive].effects.replace(
					/\+/g,
					'%2b',
				));
				const passiveUrl = `https://wiki.leagueoflegends.com/api.php?action=parse&text=${passiveEffects}&contentmodel=wikitext&format=json`;
				const passiveRequest = await fetch(passiveUrl).catch((err) => {
					console.log(err);
				});
				const passiveBody = await passiveRequest.text();
				let passivebodyJSON;
				try {
					passivebodyJSON = JSON.parse(passiveBody);
				} catch (error) {

					interaction.editReply('**Error parseing passive effect**');
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
			if (itemObj.passives[passive].cooldown != null) {
				passiveCooldown = encodeURIComponent(itemObj.passives[passive].cooldown);
				const passiveUrl = `https://wiki.leagueoflegends.com/api.php?action=parse&text=${passiveCooldown}&contentmodel=wikitext&format=json`;
				const passiveRequest = await fetch(passiveUrl).catch((err) => {
					console.log(err);
				});
				const passiveBody = await passiveRequest.text();
				let passivebodyJSON;
				try {
					passivebodyJSON = JSON.parse(passiveBody);
				} catch (error) {
					console.log(passiveBody)
					interaction.editReply('**Error parseing passive cooldown**');
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

			if (itemObj.passives[passive].mythic == true) {
				mythic = true;
			} else if (itemObj.passives[passive].unique == true) {
				mythic = false;
				embed.addFields({
					name: `Unique Passive: ${passiveName}`,
					value: `${passiveEffects} ${passiveCooldown}`,
				});
			} else if (itemObj.passives[passive].unique == false) {
				mythic = false;
				embed.addFields({
					name: `Passive: ${passiveName}`,
					value: `${passiveEffects} ${passiveCooldown}`,
				});
			}
		}

		for (const active in itemObj.active) {
			let activeName;
			if (itemObj.active[active].name) {
				activeName = itemObj.active[active].name;
			}
			let activeEffects;
			if (itemObj.active[active].effects != null) {
				activeEffects = encodeURIComponent(itemObj.active[active].effects.replace(
					/\+/g,
					'%2b',
				));
				const activeUrl = `https://wiki.leagueoflegends.com/api.php?action=parse&text=${activeEffects}&contentmodel=wikitext&format=json`;
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
			if (itemObj.active[active].cooldown != null) {
				activeCooldown = `**Cooldown:** ${itemObj.active[active].cooldown} seconds\n`;
			} else {
				activeCooldown = '';
			}
			let activeRange;
			if (
				itemObj.active[active].range != null &&
				itemObj.active[active].range != 0
			) {
				activeRange = `**Range:** ${itemObj.active[active].range}`;
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
			for (const passive in itemObj.passives) {
				if (itemObj.passives[passive].mythic == true) {
					for (const stat in itemObj.passives[passive].stats) {
						for (const type in itemObj.passives[passive].stats[
							stat
						]) {
							if (
								itemObj.passives[passive].stats[stat][type] !==
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
									statValue = `${itemObj.passives[passive].stats[stat][type]}%`;
								} else {
									statValue =
										itemObj.passives[passive].stats[stat][
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
