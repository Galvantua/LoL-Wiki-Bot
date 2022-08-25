const handler = function () {};
const { DOMParser } = require("jsdom-global");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require("node-fetch");
const { EmbedBuilder } = require("discord.js");

handler.apheliosHandler = async function (abilityLetter) {
	let document, bodyJSON, aphAbilities;
	let myEmbeds = [];
	let abilityProperties = [
		"cast time",
		"target range",
		"range",
		"cost",
		"cooldown",
		"speed",
		"effect radius",
		"width",
	];

	if (abilityLetter == "I") {
		aphAbilities = [0, 2, 4, 6, 8, 10];
	} else {
		aphAbilities = [1, 3, 5, 7, 9, 11];
	}
	const url = `https://leagueoflegends.fandom.com/wiki/Aphelios/LoL`;
	const request = await fetch(url).catch((err) => {
		console.log(err);
	});

	const body = await request.text();

	const dom = new JSDOM(body, {
		contentType: "text/html",
	});

	document = dom.window.document;
	for (const aphAbility of aphAbilities) {
		ability = document.getElementsByClassName("ability-info-container")[
			aphAbility
		];

		const embed = new EmbedBuilder();

		let abilityHeader =
			ability.getElementsByClassName("mw-headline")[0].textContent;
		console.log(abilityHeader + "\n");

		embed.setTitle(`**${abilityHeader}**`);
		let abilityStats = ability.getElementsByTagName("aside")[0];

		if (abilityStats) {
			for (let i = 0; i < abilityProperties.length; i++) {
				const element = abilityStats.querySelector(
					`div[data-source="${abilityProperties[i]}"]`
				);
				if (element) {
					const elementText = element.textContent.split(":");
					embed.addFields({
						name: `${elementText[0].trim()}`,
						value: `${elementText[1].trim()}`,
						inline: true,
					});
				}
			}
		}
		//grabs the array of tables in the ability
		let abilityTables = ability.getElementsByTagName("table");

		//process the tables in the array and create fields for each subtable
		for (let i = 0; i < abilityTables.length; i++) {
			const table = abilityTables[i];
			const subTables = table.getElementsByTagName("dl");
			for (let i = 0; i < subTables.length; i++) {
				const subTable = subTables[i];
				const subTableHeaders = subTable.getElementsByTagName("dt");
				const subTableData = subTable.getElementsByTagName("dd");
				for (let i = 0; i < subTableHeaders.length; i++) {
					const header = subTableHeaders[i].textContent;
					const data = subTableData[i].textContent;
					//console.log(header + " " + data);
					embed.addFields({
						name: `${header.trim()}`,
						value: `${data.trim()}`,
						inline: true,
					});
				}
			}
		}

		let abilityDetails = ability.querySelectorAll("p, ul");
		let detailText = "";
		for (let i = 0; i < abilityDetails.length; i++) {
			const detail = abilityDetails[i];
			detailText = detail.textContent;
			// console.log(detailText);
			if (detailText) {
				embed.addFields({
					name: `​`,
					value: `${detailText}`,
				});
			}
		}
		//embed.setDescription(`${detailText}`);

		let abilityImage = ability
			.getElementsByTagName("img")[0]
			.getAttribute("src");

		embed.setThumbnail(abilityImage);
		myEmbeds.push(embed);

		for (const embed of myEmbeds) {
			console.log(embed);
		}
	}
	return myEmbeds;
};

module.exports = handler;
