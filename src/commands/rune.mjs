import {
	ActionRowBuilder,
	SlashCommandBuilder,
	EmbedBuilder,
	EmbedAssertions,
	ButtonBuilder,
	ButtonStyle,
	CommandInteractionOptionResolver,
} from 'discord.js';
import { JSDOM } from 'jsdom';
import { findRune } from '../modules/nameFinders.mjs';
import handlers from '../modules/handlers.mjs';

export const informaton = {
	name: 'rune',
	description: 'Gets the information for a rune / rune tree from the wiki',
};

export default {
	data: new SlashCommandBuilder()
		.setName(`${informaton.name}`)
		.setDescription(`${informaton.description}`)
		.addStringOption((option) => {
			option
				.setName('rune')
				.setDescription('Rune / Rune tree Name')
				.setRequired(true);
			return option;
		}),
	async execute(interaction, channel) {
		let rtnEmbeds = [];
		let embed = new EmbedBuilder();

		if (!interaction.override) await interaction.deferReply();

		try {
			let ref = { isRune: true };
			let givenRune =
				interaction.override || interaction.options.getString('rune');
			let rune = await findRune(givenRune, ref);

			if (rune === undefined) {
				embed.setTitle('**Error getting rune or rune tree**');
				embed.setColor(0xf7a4a4);
				rtnEmbeds.push(embed);
				await interaction.editReply({ embeds: rtnEmbeds });
				return;
			}
			if (rune === null) {
				embed.setTitle('**Rune or rune tree not found**');
				embed.setColor(0xfebe8c);
				rtnEmbeds.push(embed);
				await interaction.editReply({ embeds: rtnEmbeds });
				return;
			}

			embed.setColor(0xb6e2a1);

			if (!ref.isRune) {
				const treeDescriptions = {
					precision: 'Improved attacks and sustained damage.',
					domination: 'Burst damage and target access.',
					sorcery: 'Empowered abilities and resource manipulation.',
					inspiration: 'Creative tools and rule bending.',
					resolve: 'Durability and crowd control.',
				};

				const url = `https://leagueoflegends.fandom.com/api.php?action=parse&text={{Rune%20path%20infobox/${rune.name}}}&contentmodel=wikitext&format=json`;
				const body = await fetch(url)
					.then(async (res) => await res.json())
					.catch((err) => {
						throw err;
					});
				const dom = new JSDOM(body.parse.text['*'], {
					contentType: 'text/html',
				});
				const document = dom.window.document;

				embed.setTitle(rune.name);
				embed.setThumbnail(
					`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`,
				);
				embed.setDescription(
					`_${treeDescriptions[rune.name.toLowerCase()] || ''}_`,
				);

				const slots = new ActionRowBuilder();
				let index = 0;
				while (
					document.getElementsByClassName(
						'pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background',
					)[index] !== undefined &&
					document.getElementsByClassName(
						`pi-smart-group-body pi-border-color`,
					)[index] !== undefined &&
					document
						.getElementsByClassName(
							`pi-smart-group-body pi-border-color`,
						)
						[index].textContent.trim()
				) {
					embed.addFields({
						name: document.getElementsByClassName(
							'pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background',
						)[index].textContent,
						value: document
							.getElementsByClassName(
								`pi-smart-group-body pi-border-color`,
							)
							[index].textContent.trim()
							.replace(/\n/g, ' ')
							.replace(/ {2,}/g, ', '),
					});
					slots.addComponents(
						new ButtonBuilder()
							.setCustomId(`${index}`)
							.setLabel(
								document.getElementsByClassName(
									'pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background',
								)[index].textContent,
							)
							.setStyle(ButtonStyle.Primary),
					);
					index++;
				}

				rtnEmbeds.push(embed);
				interaction.editReply({
					embeds: rtnEmbeds,
					components: [slots],
				});

				const filter = (btnInt) => {
					return interaction.user.id === btnInt.user.id;
				};

				const collector = channel.createMessageComponentCollector({
					filter,
					time: 15000,
				});

				let selectedSlot = 0;
				collector.on('collect', async (i) => {
					await i.deferUpdate();

					if (i.customId < 10) {
						const runeButtons = new ActionRowBuilder();
						document
							.getElementsByClassName(
								`pi-smart-group-body pi-border-color`,
							)
							[i.customId].textContent.trim()
							.replace(/\n/g, ' ')
							.replace(/ {2,}/g, '||')
							.split('||')
							.map((r, ind) => {
								runeButtons.addComponents(
									new ButtonBuilder()
										.setCustomId(`${10 + ind}`)
										.setLabel(r)
										.setStyle(ButtonStyle.Primary),
								);
							});

						await interaction.editReply({
							components: [runeButtons],
						});
					} else {
						interaction.editReply({ components: [] });
						interaction.override = document
							.getElementsByClassName(
								`pi-smart-group-body pi-border-color`,
							)
							[selectedSlot].textContent.trim()
							.replace(/\n/g, ' ')
							.replace(/ {2,}/g, '||')
							.split('||')[i.customId - 10];
						this.execute(interaction, channel);
					}
				});

				collector.on('end', async () => {
					await interaction.editReply({
						components: [],
					});
				});

				return;
			} else {
				const url = `https://leagueoflegends.fandom.com/api.php?action=parse&text={{rune%20header|${rune.name}}}&contentmodel=wikitext&format=json`;
				const body = await fetch(url)
					.then(async (res) => await res.json())
					.catch((err) => {
						throw err;
					});
				let dom = new JSDOM(body.parse.text['*'], {
					contentType: 'text/html',
				});
				let document = dom.window.document;

				if (
					document.getElementsByClassName(
						'pi-item pi-data pi-item-spacing pi-border-color',
					)[0] === undefined
				) {
					embed.setTitle('**Error getting rune or rune tree**');
					rtnEmbeds.push(embed);
					await interaction.editReply({ embeds: rtnEmbeds });
					return;
				}

				embed.setTitle(`**${rune.name}**`);
				embed.setThumbnail(
					`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`,
				);

				let index = 0;
				while (
					document.getElementsByClassName(
						'pi-item pi-data pi-item-spacing pi-border-color',
					)[index + 1] !== undefined
				) {
					if (
						document.getElementsByClassName(
							'pi-item pi-data pi-item-spacing pi-border-color',
						)[index].childElementCount === 2
					)
						embed.addFields({
							name: document.getElementsByClassName(
								'pi-item pi-data pi-item-spacing pi-border-color',
							)[index].children[0].textContent,
							value: document.getElementsByClassName(
								'pi-item pi-data pi-item-spacing pi-border-color',
							)[index].children[1].textContent,
						});
					else {
						const linkless = handlers.wikiFormat(
							document.getElementsByClassName(
								'pi-item pi-data pi-item-spacing pi-border-color',
							)[index],
							false,
						).textContent;
						const content = handlers.wikiFormat(
							document.getElementsByClassName(
								'pi-item pi-data pi-item-spacing pi-border-color',
							)[index],
							true,
						).textContent;
						if (content.length > 1024)
							embed.addFields({ name: '​', value: linkless });
						else embed.addFields({ name: '​', value: content });
						//console.log(content);
					}
					index++;
				}

				rtnEmbeds.push(embed);
				interaction.editReply({ embeds: rtnEmbeds });
				return;
			}
		} catch (error) {
			console.error(error);
			embed = new EmbedBuilder();
			embed.setTitle('**Error getting rune or rune tree**');
			embed.setColor(0xf7a4a4);
			rtnEmbeds = [embed];
			interaction.editReply({ embeds: rtnEmbeds });
			return;
		}
	},
};
