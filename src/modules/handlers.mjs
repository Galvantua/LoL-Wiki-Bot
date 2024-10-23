import fetch from 'node-fetch';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js';

//Define the handler
export default class handler {
	constructor() {}

	wikiFormat(element) {
		const icons = element.querySelectorAll('img');

		icons.forEach((icon) => {
			switch (icon.getAttribute('data-image-name')) {
				case 'Hybrid resistances icon.png':
					icon.parentElement.innerHTML =
						'<:hybridresist:1049873538355576924>';
					break;
				case 'Gold.png':
					icon.parentElement.innerHTML =
						'<:gold:1049873537462173797>';
					break;
				case 'Ranged role.png':
					icon.parentElement.innerHTML =
						'<:ranged:1049873680555065354>';
					break;
				case 'Melee role.png':
					icon.parentElement.innerHTML =
						'<:melee:1049873678424350780>';
					break;
				case 'Slow icon.png':
					icon.parentElement.innerHTML =
						'<:slow:1049873681704304712>';
					break;
				case 'Champion icon.png':
					icon.parentElement.innerHTML =
						'<:champion:1049873534765236318>';
					break;
				case 'Stun icon.png':
					icon.parentElement.innerHTML =
						'<:stun:1049873684304769086>';
					break;
				case 'Movement speed icon.png':
					icon.parentElement.innerHTML =
						'<:movespeed:1049873679447756861>';
					break;
				case 'Heal power icon.png':
					icon.parentElement.innerHTML =
						'<:Heal:1049873210461655071>';
					break;
			}
		});

		for (const node of element.querySelectorAll('b')) {
			if (node.textContent) node.innerHTML = `​**​${node.innerHTML}​**​`;
		}
		for (const node of element.querySelectorAll('a')) {
			if (
				node.parentElement.nodeName !== 'B' &&
				node.textContent &&
				!node.textContent.match(/:.+:/g)
			)
				node.textContent = `​**​${node.textContent}​**​`;
		}
		for (const node of element.querySelectorAll('.template_sbc')) {
			if (
				node.childElementCount === 1 &&
				node.children[0].nodeName === 'B'
			)
				node.innerHTML = `​*​${node.innerHTML.toUpperCase()}​*​`;
			else if (node.textContent)
				node.innerHTML = `​_​${node.innerHTML.toUpperCase()}​_​`;
		}
		for (const node of element.querySelectorAll('ul')) {
			if (node.textContent) node.textContent = node.textContent + '\n';
		}
		for (const node of element.querySelectorAll('ol')) {
			if (node.textContent) node.textContent = node.textContent + '\n';
		}
		for (const node of element.querySelectorAll('li')) {
			if (node.textContent) node.textContent = '\n• ' + node.textContent;
		}

		return element;
	}

	wikiLinkify(element) {
		const links = element.querySelectorAll('a');
		links.forEach((link) => {
			if (link.textContent && !link.textContent.match(/:.+:/g))
				link.textContent = `[${link.textContent}](https://wiki.leagueoflegends.com${link.href})`;
		});

		return element;
	}

	//Special handler for aphelios weapon system
	async apheliosHandler(abilityLetter, interaction) {
		//Prevent discord from ending the interaction
		await interaction.deferReply();

		let document, aphAbilities;
		let myEmbeds = [];
		let buttons = [];

		let abilityProperties = [
			'cast time',
			'target range',
			'range',
			'cost',
			'cooldown',
			'speed',
			'effect radius',
			'width',
		];

		//Emojis for weapons and 'props'
		let emojis = [
			'<:Aphelios_The_Hitman_and_the_Seer:1049873532185755718>',
			'<:Aphelios_Weapons_of_the_Faithful:1049873533506957333>',
			'<:Aphelios_Calibrum:1049873197564174396>',
			'<:Aphelios_Moonshot:1049873204056965230>',
			'<:Aphelios_Severum:1049873206909083699> ',
			'<:Aphelios_Onslaught:1049873205415915531>',
			'<:Aphelios_Gravitum:1049873202022727701>',
			'<:Aphelios_Binding_Eclipse:1049873195915804736>',
			'<:Aphelios_Infernum:1049873202718969930>',
			'<:Aphelios_Duskwave:1049873200202395718>',
			'<:Aphelios_Crescendum:1049873198923141120>',
			'<:Aphelios_Sentry:1049873531158134855>',
		];

		if (abilityLetter == 'I') {
			aphAbilities = [0, 2, 4, 6, 8, 10];
		} else {
			aphAbilities = [1, 3, 5, 7, 9, 11];
		}

		const url = `https://wiki.leagueoflegends.com/Aphelios`;
		const request = await fetch(url).catch((err) => {
			console.log(err);
		});

		const body = await request.text();

		const dom = new JSDOM(body, {
			contentType: 'text/html',
		});

		document = dom.window.document;

		for (let i = 0; i < aphAbilities.length; i++) {
			let aphAbility = aphAbilities[i];

			let ability = document.getElementsByClassName(
				'ability-info-container',
			)[aphAbility];

			const embed = new EmbedBuilder();

			let abilityHeader =
				ability.getElementsByClassName('mw-headline')[0].textContent;

			embed.setTitle(`**${abilityHeader}**`);

			let abilityStats = ability.getElementsByTagName('aside')[0];

			if (abilityStats) {
				for (let i = 0; i < abilityProperties.length; i++) {
					const element = abilityStats.querySelector(
						`div[data-source="${abilityProperties[i]}"]`,
					);

					if (element) {
						const elementText = element.textContent.split(':');

						embed.addFields({
							name: `${elementText[0].trim()}`,
							value: `${elementText[1].trim()}`,
							inline: true,
						});
					}
				}
			}

			//grabs the array of tables in the ability
			let abilityTables = ability.getElementsByTagName('table');

			//process the tables in the array and create fields for each subtable
			for (let i = 0; i < abilityTables.length; i++) {
				const table = abilityTables[i];

				const subTables = table.getElementsByTagName('dl');

				for (let i = 0; i < subTables.length; i++) {
					const subTable = subTables[i];
					const subTableHeaders = subTable.getElementsByTagName('dt');
					const subTableData = subTable.getElementsByTagName('dd');

					for (let i = 0; i < subTableHeaders.length; i++) {
						const header = subTableHeaders[i].textContent;
						const data = subTableData[i].textContent;

						embed.addFields({
							name: `${header.trim()}`,
							value: `${data.trim()}`,
							inline: true,
						});
					}
				}
			}

			let abilityDetails = ability.querySelectorAll('p, ul');
			let detailText = '';

			for (let i = 0; i < abilityDetails.length; i++) {
				const detail = abilityDetails[i];
				detailText = detail.textContent;

				if (detailText) {
					embed.addFields({
						name: `​`,
						value: `${detailText}`,
					});
				}
			}

			let abilityImage = ability
				.getElementsByTagName('img')[0]
				.getAttribute('src');

			embed.setThumbnail(abilityImage);
			myEmbeds.push(embed);

			buttons.push(
				new ButtonBuilder()
					.setCustomId(i.toString())
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(emojis[aphAbility]),
			);
		}

		return {
			embeds: myEmbeds,
			buttons: buttons,
		};
	}
}
