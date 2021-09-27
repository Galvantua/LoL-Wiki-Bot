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
	let document, abilityMain, abilityCode, abilityDetails, abilityNumber;

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
	if (
		abilityAndName[1].toLowerCase() === "p" ||
		abilityAndName[1].toLowerCase() === "passive"
	) {
		abilityCode = "innate";
		abilityNumber = 0;
	} else {
		abilityAndName[1].toLowerCase();
		if (abilityAndName[1].toLowerCase() === "q") {
			abilityCode = "q";
			abilityNumber = 1;
		} else if (abilityAndName[1].toLowerCase() === "w") {
			abilityCode = "w";
			abilityNumber = 2;
		} else if (abilityAndName[1].toLowerCase() === "e") {
			abilityCode = "e";
			abilityNumber = 3;
		} else if (abilityAndName[1].toLowerCase() === "r") {
			abilityCode = "r";
			abilityNumber = 4;
		} else {
			//error for invalid ability
		}
	}

	const request = await fetch(
		"https://leagueoflegends.fandom.com/wiki/Template:Data_Aurelion_Sol/Celestial_Expansion"
		//`https://leagueoflegends.fandom.com/wiki/${abilityAndName[0]}/LoL`
	).catch((err) => {
		console.log(err);
	});

	const body = await request.text();
	const dom = new jsdom.JSDOM(body, {
		contentType: "text/html",
		resources: "usable",
	});
	document = dom.window.document;
	abilityMain = document.getElementsByClassName(
		`skill skill_${abilityCode}`
	)[0];
	abilityDetails =
		document.getElementsByClassName("tabbertab-bordered")[abilityNumber];
	console.log(abilityMain);
	//scraps through html to find header information

	const abilityName =
		abilityMain.getElementsByClassName("mw-headline")[0].innerText;
	const abilityCastTime = abilityMain
		.getElementsByClassName("champion-ability__header")[0]
		.getElementsByTagName("section")[0]
		.querySelector('div[data-source="cast time"]').innerText;
	console.log(abilityCastTime);
	const abilityTargetRange = abilityMain
		.getElementsByClassName("champion-ability__header")[0]
		.getElementsByTagName("section")[0]
		.querySelector('div[data-source="target range"]').innerText;
	const abilityRange = abilityMain
		.getElementsByClassName("champion-ability__header")[0]
		.getElementsByTagName("section")[0]
		.querySelector('div[data-source="range"]').innerText;
	const abilityCost = abilityMain
		.getElementsByClassName("champion-ability__header")[0]
		.getElementsByTagName("section")[0]
		.querySelector('div[data-source="cost"]').innerText;
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
}
