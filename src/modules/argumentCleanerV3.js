const tests = function () {};

tests.nameAbilityTEST = function (input) {
	let excList = {
		aph: "Aphelios",
		asol: "Aurelion_Sol",
		bel: "Bel'Veth",
		belveth: "Bel'Veth",
		blitz: "Blitzcrank",
		givemeyourlux: "Blitzcrank",
		cass: "Cassiopeia",
		cho: "Cho'Gath",
		chogath: "Cho'Gath",
		eve: "Evelynn",
		fiddle: "Fiddlesticks",
		fortune: "Miss_Fortune",
		mf: "Miss_Fortune",
		gp: "Gangplank",
		heimer: "Heimerdinger",
		j4: "Jarvan_IV",
		jarvan: "Jarvan_IV",
		jarvaniv: "Jarvan_IV",
		lamp: "Jax",
		four: "Jhin",
		4: "Jhin",
		kaisa: "Kai'Sa",
		kass: "Kassadin",
		kat: "Katarina",
		kata: "Katarina",
		kha: "Kha'Zix",
		khazix: "Kha'Zix",
		kog: "Kog'Maw",
		kogmaw: "Kog'Maw",
		pogmaw: "Kog'Maw",
		eep: "Lillia",
		deer: "Lillia",
		rock: "Malphite",
		dwayne: "Malphite",
		mord: "Mordekaiser",
		morde: "Mordekaiser",
		morg: "Morgana",
		mundo: "Dr._Mundo",
		drmundo: "Dr._Mundo",
		willump: "Nunu",
		nunuwillump: "Nunu",
		nunuandwillump: "Nunu",
		reksai: "Rek'Sai",
		dio: "Sett",
		konodioda: "Sett",
		clown: "Shaco",
		equilibrium: "Shen",
		banana: "Soraka",
		trynd: "Tryndamere",
		tf: "Twisted_Fate",
		shotgunknees: "Urgot",
		vel: "Vel'Koz",
		velkoz: "Vel'Koz",
		emo: "Vex",
		billieeilish: "Vex",
		monkey: "Wukong",
		xin: "Xin_Zhao",
		yonesbrother: "Yasuo",
		tendeathspowerspike: "Yasuo",
		yasuosbrother: "Yone",
		q: "Master_Yi",
		yi: "Master_Yi",
		tutorial: "Master_Yi",
	}; //list of exceptions

	let randomList = {
		beyblade: ["Garen", "Katarina", "Tryndamer"],
		bird: ["Anivia", "Azir", "Quinn", "Rakan", "Xayah"],
		cancer: [
			"Morgana",
			"Quinn",
			"Shaco",
			"Teemo",
			"Vladimir",
			"Yasuo",
			"Yone",
			"Yuumi",
			"Irelia",
		],
		cat: ["Rengar", "Yuumi"],
		dog: ["Nasus", "Warwick"],
		dragon: ["Aurelion_Sol", "Shyvana"],
		fish: ["Fizz", "Nami"],
		legs: ["Camille", "Urgot"],
		mute: ["Aphelios", "Sona"],
		shadow: ["Vex", "Zed"],
		tree: ["Ivern", "Maokai"],
	}; //arrays of champs that will be randomized

	//regex and return taken from eramsorgr. I'm too lazy to type those
	args = input.trim().split(/\s+/);
	let championName = "";

	for (let i = 0; i < args.length; i++) {
		args[i] = args[i].toLowerCase().replace(/['"^_.\s]/gm, "");
		args[i] = args[i].charAt(0).toUpperCase() + args[i].slice(1);
		championName += args[i] + "_";
	} //reformat the champ name
	championName = championName.slice(0, -1); //removes the excess underscore
	let nameCheck = championName.replace(/[_]/gm, "").toLowerCase();
	if (excList.hasOwnProperty(nameCheck)) {
		championName = excList[nameCheck];
	} //check the exception list
	else if (randomList.hasOwnProperty(nameCheck)) {
		championName =
			randomList[nameCheck][
				Math.floor(Math.random() * randomList[nameCheck].length)
			];
	} //check if cancer
	console.log(championName);

	//console.log(championName);
	//console.log(championAbility);
	//args = [championName, championAbility];
	return championName; // need to rewrite to spit out array
};
//export default helpers;
module.exports = tests;
