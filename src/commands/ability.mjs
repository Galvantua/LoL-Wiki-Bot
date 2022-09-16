import { ActionRowBuilder, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import jsdom from "jsdom";
import { findAbilityName } from "../modules/nameFinders.mjs";
import handlers from "../modules/handlers.mjs";
const { JSDOM } = jsdom;

export const information = {
	name: "ability",
	description: "Gets the information fo ran ability from the wiki",
};

export default {

	data: new SlashCommandBuilder()
		.setName(`${information.name}`)
		.setDescription(`${information.name}`)

		.addStringOption((option) => option
			.setName("champion")
			.setDescription("Champions Name")
			.setRequired(true)
		)

		.addStringOption((option) => option
			.setName("ability")
			.setDescription("Which ability to fetch info for?")
			.setRequired(true)
			.addChoices(
				{ name: "Passive", value: "innate" },
				{ name: "Q", value: "q" },
				{ name: "W", value: "w" },
				{ name: "E", value: "e" },
				{ name: "R", value: "r" }
			)
		)
	, //end of SCB data

	async execute(interaction, channel) {
		//defer to give time for slow api calls

		//parse options from command
		let champion = interaction.options.getString("champion");
		let championName = await findAbilityName(champion, interaction);
		let ability = interaction.options.getString("ability");
		let abilityProperties = [
			"cast time",
			"target range",
			"range",
			"cost",
			"cooldown",
			"speed",
			"effect radius",
			"width",
			"recharge",
			"collision radius",
		];
		let myEmbeds = [];
		let document,
			abilityMain,
			abilitySub,
			abilityCode,
			abilityLetter,
			abilityHeader,
			abilityStats,
			abilityTables,
			abilityDetails,
			abilityImage,
			detailText;

		//assign value to vars according to the ability selected.
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
				//TODO error for invalid ability
				break;
		};

		//check if we are getting info for aphelios.
		if (championName == "Aphelios" &&  (abilityLetter == "I" || abilityLetter == "Q")) {

			const components = await new handlers().apheliosHandler(abilityLetter, interaction);

			let tempButtons = [];

			for (let i = 0; i < components.buttons.length; i++) {
				tempButtons[i] = components.buttons[i];
			};

			tempButtons.splice(0, 1);

			let row = new ActionRowBuilder().addComponents(tempButtons);

			await interaction.editReply({
				embeds: [components.embeds[0]],
				components: [row],
			});

			const filter = (btnInt) => {
				return interaction.user.id === btnInt.user.id;
			};

			const collector = channel.createMessageComponentCollector({
				filter,
				time: 15000,
			});

			collector.on("collect", async (i) => {

				await i.deferUpdate();

				if (process.env.NODE_ENV === 'dev') console.log(parseInt(i.customId));

				let intId = parseInt(i.customId);

				if (process.env.NODE_ENV === 'dev') console.log(i.user.id, typeof i.customId);

				tempButtons = [];

				for (i = 0; i < components.buttons.length; i++) {
					tempButtons[i] = components.buttons[i];
				};

				tempButtons.splice(intId, 1);

				row = new ActionRowBuilder().addComponents(tempButtons);

				if (process.env.NODE_ENV === 'dev') console.log(components.embeds[intId]);

				let finalEmbeds = components.embeds[intId];
				await interaction.editReply({
					embeds: [finalEmbeds],
					components: [row],
				});

			});

			collector.on("end", async (collection) => {

				await interaction.editReply({
					components: [],
				});

			});

			return;
		};

		await interaction.deferReply();

		//TODO convert to custom solution
		//send request to wiki based on champ and ability
		const url = `https://leagueoflegends.fandom.com/api.php?action=parse&text={{Grouped%20ability|${championName}|${abilityLetter}}}&contentmodel=wikitext&format=json`;
		const request = await fetch(url).catch((err) => {
			console.log(err);
		});

		//process response to get workable dom object
		const body = await request.text();
		let bodyJSON;
		try {
			bodyJSON = JSON.parse(body);
		} catch (error) {
			interaction.editReply("**Please choose a valid Champion Name**");
			return;
		};

		const dom = new JSDOM(bodyJSON.parse.text["*"], {
			contentType: "text/html",
		});

		document = dom.window.document;

		//full ability including all forms
		abilityMain = document.getElementsByClassName(
			`skill skill_${abilityCode}`
		)[0];

		//array of each form of an ability (grabs transformed abilities from champs like jayce)
		abilitySub = abilityMain.getElementsByClassName(
			"ability-info-container"
		);

		if (abilitySub.length > 1 &&abilitySub[0].getElementsByClassName("mw-headline")[0].textContent == abilitySub[1].getElementsByClassName("mw-headline")[0].textContent) abilitySub[1].parentNode.removeChild(abilitySub[1]);

		for (let i = 0; i < abilitySub.length; i++) {

			const embed = new EmbedBuilder();
			//name of ability

			const ability = abilitySub[i];

			abilityHeader = ability.getElementsByClassName("mw-headline")[0].textContent;

			embed.setTitle(`**${abilityHeader}**`);

			abilityStats = ability.getElementsByTagName("aside")[0];

			if (abilityStats) {

				for (let i = 0; i < abilityProperties.length; i++) {

					const element = abilityStats.querySelector(`div[data-source="${abilityProperties[i]}"]`);

					if (element) {

						const elementText = element.textContent.split(":");

						embed.addFields({
							name: `${elementText[0].trim()}`,
							value: `${elementText[1].trim()}`,
							inline: true,
						});

					};
				};
			};

			//grabs the array of tables in the ability
			abilityTables = ability.getElementsByTagName("table");

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

					};
				};
			};

			abilityDetails = ability.querySelectorAll("p, ul");
			detailText = "";

			for (let i = 0; i < abilityDetails.length; i++) {

				const detail = abilityDetails[i];

				detailText = detail.textContent;
				// console.log(detailText);

				if (detailText) {

					embed.addFields({
						name: `​`,
						value: `${detailText}`,
					});

				};
			};

			abilityImage = ability
				.getElementsByTagName("img")[0]
				.getAttribute("src");
			embed.setThumbnail(abilityImage);

			myEmbeds.push(embed);

		};

		try {

			await interaction.editReply({ embeds: myEmbeds });

		} catch (error) {

			//TODO add actual error handling
			await interaction.editReply("**Please select a valid champion/ability pair**");

		};

	},

};
