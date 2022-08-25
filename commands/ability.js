const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { DOMParser } = require("jsdom-global");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require("node-fetch");
const fs = require("node:fs");
const path = require("node:path");
//const { nameAbilityTEST } = require("../src/modules/argumentCleanerV3");
const tests = require("../src/modules/argumentCleanerV3");
const handlers = require("../src/modules/apheliosHandler");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ability")
		.setDescription("gets ability info from the LoL wiki")
		.addStringOption((option) =>
			option
				.setName("champion")
				.setDescription("Champions Name")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("ability")
				.setDescription("Ability Code")
				.setRequired(true)
				.addChoices(
					{ name: "Passive", value: "innate" },
					{ name: "Q", value: "q" },
					{ name: "W", value: "w" },
					{ name: "E", value: "e" },
					{ name: "R", value: "r" }
				)
		),

	async execute(interaction) {
		await interaction.deferReply();
		//requires args to be ["ability", "champion", "{q,w,e,r,p}"
		let champion = interaction.options.getString("champion");
		let ability = interaction.options.getString("ability");
		//create parser for HTML
		//const parser = new DOMParser();
		let document, abilityMain, abilitySub, abilityCode, abilityLetter;

		let championName = await tests.nameAbilityTEST(champion);

		//assign value to vars according to the ability selected.
		//add .toLowercase() back in if this doesn't work
		switch (ability) {
			case "innate":
				abilityCode = "innate";
				abilityLetter = "I";
				break;
			case "q":
				abilityLetter = "Q";
				abilityCode = "q";
				break;
			case "w":
				abilityCode = "w";
				abilityLetter = "W";
				break;
			case "e":
				abilityCode = "e";
				abilityLetter = "E";
				break;
			case "r":
				abilityCode = "r";
				abilityLetter = "R";
				break;
			default:
				//error for invalid ability
				break;
		}
		// if (championName == "Aphelios" && abilityCode == "innate") {
		// 	abilityCode = "aphelios";
		// }
		let myEmbeds = [];
		if (
			championName == "Aphelios" &&
			(abilityLetter == "I" || abilityLetter == "Q")
		) {
			myEmbeds = await handlers.apheliosHandler(abilityLetter);
		} else {
			const url = `https://leagueoflegends.fandom.com/api.php?action=parse&text={{Grouped%20ability|${championName}|${abilityLetter}}}&contentmodel=wikitext&format=json`;
			const request = await fetch(url).catch((err) => {
				console.log(err);
			});

			const body = await request.text();
			const bodyJSON = JSON.parse(body);

			const dom = new JSDOM(bodyJSON.parse.text["*"], {
				contentType: "text/html",
			});
			document = dom.window.document;

			//console.log(document);
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
			//full ability including all forms
			abilityMain = document.getElementsByClassName(
				`skill skill_${abilityCode}`
			)[0];
			//array of each form of an ability (grabs transformed abilities from champs like jayce)
			abilitySub = abilityMain.getElementsByClassName(
				"ability-info-container"
			);

			for (let i = 0; i < abilitySub.length; i++) {
				const embed = new EmbedBuilder();
				//name of ability
				const ability = abilitySub[i];
				let abilityHeader =
					ability.getElementsByClassName("mw-headline")[0]
						.textContent;
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
						const subTableHeaders =
							subTable.getElementsByTagName("dt");
						const subTableData =
							subTable.getElementsByTagName("dd");
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
			}
		}
		await interaction.editReply({ embeds: myEmbeds });
	},
};
