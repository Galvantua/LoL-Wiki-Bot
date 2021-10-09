/*jshint esversion: 6 */
import { nameAbilityTEST } from "../src/modules/argumentCleanerV2.mjs";
import DOMParser from "jsdom-global";
import jsdom from "jsdom";
import fetch from "node-fetch";
export async function run(bot, core, message, args) {
	//requires args to be ["ability", "champion", "{q,w,e,r,p}"

	//create parser for HTML
	const embed = new core.MessageEmbed();
	const parser = new DOMParser();
	let document,
		abilityMain,
		abilityCode,
		abilityDetails,
		abilityNumber,
		abilityLetter;

	let abilityAndName = await nameAbilityTEST(args);
	// for (let i = 0; i < args.length; i++) {
	// 	const element = args[i];
	// 	console.log(element);
	// }
	if (abilityAndName[0] === "Invalid Ability") {
		embed.setTitle("Invalid Ability!");
		embed.setColor("#ff0000");
		//create a red hex color embed
		//send the embed
		await message.channel.send({ embeds: [embed] });
		return "error";
	}

	//assign value to vars according to the ability selected.
	//add .toLowercase() back in if this doesn't work
	switch(abilityAndName[1]){
		case "p":
		case "passive":
			abilityCode = "innate";
			abilityLetter = "I";
			abilityNumber = 0;
			break;
		case "q":
			abilityLetter = "Q";
			abilityCode = "q";
			abilityNumber = 1;
			break;
		case "w":
			abilityCode = "w";
			abilityLetter = "W";
			abilityNumber = 2;
			break;
		case "e":
			abilityCode = "e";
			abilityLetter = "E";
			abilityNumber = 3;
			break;
		case "r":
			abilityCode = "r";
			abilityLetter = "R";
			abilityNumber = 4;
			break;
		default:
			//error for invalid ability
			break;
	}


	const url = `https://leagueoflegends.fandom.com/api.php?action=parse&text={{Grouped%20ability|${abilityAndName[0]}|${abilityLetter}}}&contentmodel=wikitext&format=json`;
	const request = await fetch(
		url
		//`https://leagueoflegends.fandom.com/wiki/${abilityAndName[0]}/LoL`
	).catch((err) => {
		console.log(err);
	});

	const body = await request.text();
	const bodyJSON = JSON.parse(body);
	//console.log(bodyJSON.parse.text["*"]);

	const dom = new jsdom.JSDOM(bodyJSON.parse.text["*"], {
		contentType: "text/html",
	});
	document = dom.window.document;
	//console.log(document);

	abilityMain = document.getElementsByClassName(
		`skill skill_${abilityCode}`
	)[0];
	// console.log(
	// 	abilityMain
	// 		.getElementsByClassName("ability-info-container")[0]
	// 		.getElementsByTagName("div")[1].textContent
	// );
	embed.setColor("#01eee8");

	abilityDetails =
		document.getElementsByClassName("tabbertab-bordered")[abilityNumber];
	//scraps through html to find header information
	//console.log(abilityName);
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
	let abilityTables = abilityMain.getElementsByTagName("table");
	let abilityHeaders = document
		.getElementsByClassName(`skill_${abilityCode}`)[0]
		.getElementsByClassName("champion-ability__header");
	if (abilityHeaders.length > 1) {
		if (
			abilityHeaders[0].getElementsByClassName("mw-headline")[0]
				.textContent ===
			abilityHeaders[1].getElementsByClassName("mw-headline")[0]
				.textContent
		) {
			abilityHeaders.pop();
		}
	}
	for (let i = 0; i < abilityHeaders.length; i++) {
		const element = abilityHeaders[i];
		//console.log(i);
		const abilityName =
			element.getElementsByClassName("mw-headline")[0].textContent;
		embed.setTitle(`**${abilityName}**`);
		let abilitySection = element.getElementsByTagName("aside")[0];
		if (abilitySection) {
			for (let i = 0; i < abilityProperties.length; i++) {
				const element = abilitySection.querySelector(
					`div[data-source="${abilityProperties[i]}"]`
				);
				if (element) {
					const elementText = element.textContent.split(":");
					embed.addField(
						`${elementText[0]}`,
						`**${elementText[1]}**`
					);
				}
			}
		}
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
					embed.addField(`${header}`, `${data}`);
				}
			}
			//console.log(tableText);
			//embed.addField(`${tableText[0]}`, `${tableText[1]}`);
		}
	}
	//.getElementsByTagName("section")[0];

	//send the embed
	await message.channel.send({ embeds: [embed] });
}
