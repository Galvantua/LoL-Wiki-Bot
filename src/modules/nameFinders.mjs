import { underscore } from 'discord.js';
import Fuse from 'fuse.js';
import fetch from 'node-fetch';
import { version } from '../index.mjs';

export async function findRune(input, ref) {
	try {
		input = input.toLowerCase().replace(/([^a-z])/g, '');
		let rtn = false;

		let excList = {
			mana: 'Manaflow Band',
		};

		let randomList = {
			cash: ['First Strike', "Future's Market"],
		};

		if (excList[input]) input = excList[input];
		else if (randomList[input])
			input =
				randomList[input][
					Math.floor(Math.random() * randomList[input].length)
				];
		input = input.toLowerCase().replace(/([^a-z])/g, '');

		const runes = await fetch(
			`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/runesReforged.json`,
		)
			.then(async (res) => {
				return await res.json();
			})
			.catch((err) => {
				console.error(err);
				rtn = true;
			});
		if (rtn) return undefined;

		const tree = runes.find(
			(t) => t.name.toLowerCase().replace(/([^a-z])/g, '') === input,
		);
		if (tree) {
			ref.isRune = false;
			return tree;
		}

		let rune;
		runes.forEach((t) => {
			t.slots.forEach((s) => {
				s.runes.forEach((r) => {
					if (
						r.name.toLowerCase().replace(/([^a-z])/g, '') === input
					) {
						rune = r;
					}
				});
			});
		});

		if (rune) {
			ref.isRune = true;
			return rune;
		}

		return null;
	} catch (error) {
		console.error(error);
		return undefined;
	}
}

export async function findAbilityName(input, interaction) {
	let excList = {
		aph: 'Aphelios',
		asol: 'Aurelion_Sol',
		bel: "Bel'Veth",
		belveth: "Bel'Veth",
		blitz: 'Blitzcrank',
		givemeyourlux: 'Blitzcrank',
		cass: 'Cassiopeia',
		cho: "Cho'Gath",
		chogath: "Cho'Gath",
		eve: 'Evelynn',
		fiddle: 'Fiddlesticks',
		fortune: 'Miss_Fortune',
		mf: 'Miss_Fortune',
		gp: 'Gangplank',
		heimer: 'Heimerdinger',
		j4: 'Jarvan_IV',
		jarvan: 'Jarvan_IV',
		jarvaniv: 'Jarvan_IV',
		lamp: 'Jax',
		four: 'Jhin',
		4: 'Jhin',
		kaisa: "Kai'Sa",
		kass: 'Kassadin',
		kat: 'Katarina',
		kata: 'Katarina',
		kha: "Kha'Zix",
		khazix: "Kha'Zix",
		kog: "Kog'Maw",
		kogmaw: "Kog'Maw",
		pogmaw: "Kog'Maw",
		eep: 'Lillia',
		deer: 'Lillia',
		rock: 'Malphite',
		dwayne: 'Malphite',
		mord: 'Mordekaiser',
		morde: 'Mordekaiser',
		morg: 'Morgana',
		mundo: 'Dr._Mundo',
		nid: 'Nidalee',
		drmundo: 'Dr._Mundo',
		willump: 'Nunu',
		nunuwillump: 'Nunu',
		nunuandwillump: 'Nunu',
		reksai: "Rek'Sai",
		dio: 'Sett',
		konodioda: 'Sett',
		clown: 'Shaco',
		equilibrium: 'Shen',
		banana: 'Soraka',
		trynd: 'Tryndamere',
		tf: 'Twisted_Fate',
		shotgunknees: 'Urgot',
		vel: "Vel'Koz",
		velkoz: "Vel'Koz",
		emo: 'Vex',
		billieeilish: 'Vex',
		monkey: 'Wukong',
		xin: 'Xin_Zhao',
		yonesbrother: 'Yasuo',
		tendeathspowerspike: 'Yasuo',
		yasuosbrother: 'Yone',
		q: 'Master_Yi',
		yi: 'Master_Yi',
		tutorial: 'Master_Yi',
	}; //list of exceptions

	let randomList = {
		beyblade: ['Garen', 'Katarina', 'Tryndamer'],
		bird: ['Anivia', 'Azir', 'Quinn', 'Rakan', 'Xayah'],
		cancer: [
			'Morgana',
			'Quinn',
			'Shaco',
			'Teemo',
			'Vladimir',
			'Yasuo',
			'Yone',
			'Yuumi',
			'Irelia',
		],
		cat: ['Rengar', 'Yuumi'],
		dog: ['Nasus', 'Warwick'],
		dragon: ['Aurelion_Sol', 'Shyvana'],
		fish: ['Fizz', 'Nami'],
		legs: ['Camille', 'Urgot'],
		mute: ['Aphelios', 'Sona'],
		shadow: ['Vex', 'Zed'],
		tree: ['Ivern', 'Maokai'],
	}; //arrays of champs that will be randomized

	//regex and return taken from eramsorgr. I'm too lazy to type those
	let args = input.trim().split(/\s+/);
	let championName = '';

	for (let i = 0; i < args.length; i++) {
		args[i] = args[i].toLowerCase().replace(/['"^_.\s]/gm, '');
		args[i] = args[i].charAt(0).toUpperCase() + args[i].slice(1);
		championName += args[i] + '_';
	} //reformat the champ name
	championName = championName.slice(0, -1); //removes the excess underscore
	let nameCheck = championName.replace(/[_]/gm, '').toLowerCase();
	if (excList.hasOwnProperty(nameCheck)) {
		championName = excList[nameCheck];
	} //check the exception list
	else if (randomList.hasOwnProperty(nameCheck)) {
		championName =
			randomList[nameCheck][
				Math.floor(Math.random() * randomList[nameCheck].length)
			];
	} //check if cancer
	//console.log(championName);

	const champReq = await fetch(
		`https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json`,
	).catch((err) => {
		interaction.editReply('Error getting champion names');
		return;
	});
	const champBody = await champReq.text();
	let bodyJSON;
	try {
		bodyJSON = JSON.parse(champBody);
	} catch (error) {
		console.log(error);
		interaction.editReply('**Error getting champion names**');
		return;
	}

	const champs = [];
	for (const champ in bodyJSON) {
		if (Object.hasOwnProperty.call(bodyJSON, champ)) {
			champs.push(champ);
		}
	}

	const fuse = new Fuse(champs);
	const result = fuse.search(championName);

	const final = bodyJSON[result[0].item].name;
	//console.log(final);
	//console.log(result[0]);

	return final; // need to rewrite to spit out array
}

export async function findChampionName(input, interaction) {
	let excList = {
		aph: 'Aphelios',
		asol: 'Aurelion_Sol',
		bel: 'Belveth',
		belveth: 'Belveth',
		blitz: 'Blitzcrank',
		givemeyourlux: 'Blitzcrank',
		cass: 'Cassiopeia',
		cho: 'Chogath',
		chogath: 'Chogath',
		eve: 'Evelynn',
		fiddle: 'Fiddlesticks',
		fortune: 'Miss_Fortune',
		mf: 'Miss_Fortune',
		gp: 'Gangplank',
		heimer: 'Heimerdinger',
		j4: 'Jarvan_IV',
		jarvan: 'Jarvan_IV',
		jarvaniv: 'Jarvan_IV',
		lamp: 'Jax',
		four: 'Jhin',
		4: 'Jhin',
		kaisa: 'Kaisa',
		kass: 'Kassadin',
		kat: 'Katarina',
		kata: 'Katarina',
		kha: 'Khazix',
		khazix: 'Khazix',
		kog: 'Kogmaw',
		kogmaw: 'Kogmaw',
		pogmaw: 'Kogmaw',
		eep: 'Lillia',
		deer: 'Lillia',
		rock: 'Malphite',
		dwayne: 'Malphite',
		mord: 'Mordekaiser',
		morde: 'Mordekaiser',
		morg: 'Morgana',
		mundo: 'Dr._Mundo',
		nid: 'Nidalee',
		drmundo: 'Dr._Mundo',
		willump: 'Nunu',
		nunuwillump: 'Nunu',
		nunuandwillump: 'Nunu',
		reksai: 'Reksai',
		dio: 'Sett',
		konodioda: 'Sett',
		clown: 'Shaco',
		equilibrium: 'Shen',
		banana: 'Soraka',
		trynd: 'Tryndamere',
		tf: 'Twisted_Fate',
		shotgunknees: 'Urgot',
		vel: 'Velkoz',
		velkoz: 'Velkz',
		emo: 'Vex',
		billieeilish: 'Vex',
		monkey: 'Wukong',
		xin: 'Xin_Zhao',
		yonesbrother: 'Yasuo',
		tendeathspowerspike: 'Yasuo',
		yasuosbrother: 'Yone',
		q: 'Master_Yi',
		yi: 'Master_Yi',
		tutorial: 'Master_Yi',
	}; //list of exceptions

	let randomList = {
		beyblade: ['Garen', 'Katarina', 'Tryndamer'],
		bird: ['Anivia', 'Azir', 'Quinn', 'Rakan', 'Xayah'],
		cancer: [
			'Morgana',
			'Quinn',
			'Shaco',
			'Teemo',
			'Vladimir',
			'Yasuo',
			'Yone',
			'Yuumi',
			'Irelia',
		],
		cat: ['Rengar', 'Yuumi'],
		dog: ['Nasus', 'Warwick'],
		dragon: ['Aurelion_Sol', 'Shyvana'],
		fish: ['Fizz', 'Nami'],
		legs: ['Camille', 'Urgot'],
		mute: ['Aphelios', 'Sona'],
		shadow: ['Vex', 'Zed'],
		tree: ['Ivern', 'Maokai'],
	}; //arrays of champs that will be randomized

	//regex and return taken from eramsorgr. I'm too lazy to type those
	let args = input.trim().split(/\s+/);
	let championName = '';

	for (let i = 0; i < args.length; i++) {
		args[i] = args[i].toLowerCase().replace(/['"^_.\s]/gm, '');
		args[i] = args[i].charAt(0).toUpperCase() + args[i].slice(1);
		championName += args[i] + '_';
	} //reformat the champ name
	championName = championName.slice(0, -1); //removes the excess underscore
	let nameCheck = championName.replace(/[_]/gm, '').toLowerCase();
	if (excList.hasOwnProperty(nameCheck)) {
		championName = excList[nameCheck];
	} //check the exception list
	else if (randomList.hasOwnProperty(nameCheck)) {
		championName =
			randomList[nameCheck][
				Math.floor(Math.random() * randomList[nameCheck].length)
			];
	}

	const champReq = await fetch(
		`https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json`,
	).catch((err) => {
		interaction.editReply('Error getting champion names');
		return;
	});
	const champBody = await champReq.text();
	let bodyJSON;
	try {
		bodyJSON = JSON.parse(champBody);
	} catch (error) {
		console.log(error);
		interaction.editReply('**Error getting champion names**');
		return;
	}

	const champs = [];
	for (const champ in bodyJSON) {
		if (Object.hasOwnProperty.call(bodyJSON, champ)) {
			champs.push(champ);
		}
	}

	const fuse = new Fuse(champs);
	const result = fuse.search(championName);
	//console.log(result[0].item);

	return result[0].item; // need to rewrite to spit out array
}

export async function findItemName(input, interaction) {
	const itemReq = await fetch(
		`https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/items.json`,
	).catch((err) => {
		interaction.editReply('Error getting items names');
		return;
	});
	const itemBody = await itemReq.text();
	let bodyJSON;
	try {
		bodyJSON = JSON.parse(itemBody);
	} catch (error) {
		console.log(error);
		interaction.editReply('**Error getting item names**');
		return;
	}
	const itemNames = [];
	const itemObj = [];
	for (const item in bodyJSON) {
		if (Object.hasOwnProperty.call(bodyJSON, item)) {
			itemObj.push(item);
		}
	}

	for (let i = 0; i < itemObj.length; i++) {
		const item = itemObj[i];
		itemNames.push(bodyJSON[item].name);
	}

	const fuse = new Fuse(itemNames);
	const result = fuse.search(input);
	if (result.length === 0) {
		await interaction.editReply('**Item not found**');
		return;
	}
	return itemObj[itemNames.indexOf(result[0].item)];
}

export default {};
