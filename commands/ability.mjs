/*jshint esversion: 6 */
import { nameAbilityTEST } from "../src/modules/argumentCleanerV2.mjs";
import DOMParser from "jsdom-global";
export async function run(bot, core, message, args) {
	//requires args to be ["ability", "champion", "{q,w,e,r,p}"

	//create parser for HTML

	const parser = new DOMParser();
	let document, abilityMain, abilityCode, abilityDetails, abilityNumber;

	args = nameAbilityTEST(args);
	for (let i = 0; i < args.length; i++) {
		const element = args[i];
		console.log(element);
	}
	if (args[1].toLowerCase() === "p" || args[1].toLowerCase() === "passive") {
		abilityCode = "innate";
		abilityNumber = 0;
	} else {
		args[1].toLowerCase();
		if (args[1].toLowerCase() === "q") {
			abilityCode = "q";
			abilityNumber = 1;
		} else if (args[1].toLowerCase() === "w") {
			abilityCode = "w";
			abilityNumber = 2;
		} else if (args[1].toLowerCase() === "e") {
			abilityCode = "e";
			abilityNumber = 3;
		} else if (args[1].toLowerCase() === "r") {
			abilityCode = "r";
			abilityNumber = 4;
		} else {
			//error for invalid ability
		}
	}

	const Http = new XMLHttpRequest(); //create new request
	const url = `https://leagueoflegends.fandom.com/wiki/${args[0]}/LoL`;
	Http.open("GET", url);
	Http.send();

	//if i have to write everything inside this I can but i feel like im not supposed to...
	Http.onreadystatechange = (e) => {
		if (this.readyState == 4 && this.status == 200) {
			document = parser.parseFromString(Http.responseText, "text/html"); //parse the response into a document for scraping
			abilityMain = document.getElementsByClassName(
				`skill skill_${abilityCode}`
			)[0];
			abilityDetails =
				document.getElementsByClassName("tabbertab-bordered")[
					abilityNumber
				];
		} /*else if (this.readyState==4 && this.status!=200) {
			throw error due to http error
		}*/
	};

	//scraps through html to find header information
	const abilityName =
		abilityMain.getElementsByClassName("mw-headline")[0].innerText;
	const abilityRange = abilityMain
		.getElementsByClassName("champion-ability__header")[0]
		.getElementsByTagName("section")[0]
		.querySelector('div[data-source="range"]').innerText;
	const abilityCost = abilityMain
		.getElementsByClassName("champion-ability__header")[0]
		.getElementsByTagName("section")[0]
		.querySelector('div[data-source="cost"]').innerText;
	const abilityCastTime = abilityMain
		.getElementsByClassName("champion-ability__header")[0]
		.getElementsByTagName("section")[0]
		.querySelector('div[data-source="cast time"]').innerText;
	const abilityCooldown = abilityMain
		.getElementsByClassName("champion-ability__header")[0]
		.getElementsByTagName("section")[0]
		.querySelector('div[data-source="cooldown"]').innerText;
	const abilitySpeed = abilityMain
		.getElementsByClassName("champion-ability__header")[0]
		.getElementsByTagName("section")[0]
		.querySelector('div[data-source="speed"]').innerText;
	const abilityEffectRadius = abilityMain
		.getElementsByClassName("champion-ability__header")[0]
		.getElementsByTagName("section")[0]
		.querySelector('div[data-source="effect radius"]').innerText;
	const abilityWidth = abilityMain
		.getElementsByClassName("champion-ability__header")[0]
		.getElementsByTagName("section")[0]
		.querySelector('div[data-source="width"]').innerText;

	//create an embed
	const embed = new core.MessageEmbed();
	embed.setTitle("Pong!");
	embed.setColor("#01eee8");
	embed.addField(`Name`, `${abilityName000}`);
	//create a red hex color embed

	//send the embed
	await message.channel.send({ embeds: [embed] });
}
