/*jshint esversion: 6 */
export async function nameAbilityTEST(args) {
	let excList = {
		aph: "Aphelios",
		aurelionsol: "Aurelion_Sol",
		asol: "Aurelion_Sol",
		blitz: "Blitzcrank",
		cass: "Cassiopeia",
		chogath: "Cho'Gath",
		fiddle: "Fiddlesticks",
		fortune: "Miss_Fortune",
		gp: "Gangplank",
		heimer: "Heimerdinger",
		jarvan: "Jarvan_IV",
		jarvaniv: "Jarvan_IV",
		four: "Jhin",
		kaisa: "Kai'Sa",
		kat: "Katarina",
		kata: "Katarina",
		khazix: "Kha'Zix",
		kog: "Kog'Maw",
		kogmaw: "Kog'Maw",
		rock: "Malphite",
		mundo: "Dr._Mundo",
		drmundo: "Dr._Mundo",
		nunuwillump: "Nunu",
		nunuandwillump: "Nunu",
		reksai: "Rek'Sai",
		trynd: "Tryndamere",
		tf: "Twisted_Fate",
		velkoz: "Vel'Koz",
		monkey: "Wukong",
		xin: "Xin_Zhao",
		yi: "Master_Yi",
	}; //list of exceptions

	//regex and return taken from eramsorgr. I'm too lazy to type those
	let championAbility = args[args.length - 1].toLowerCase();
	//console.log(championAbility);
	if (
		!/(q{1}|w{1}|e{1}|r{1}|p{1})/gm.test(championAbility) &&
		championAbility !== "passive"
	) {
		console.log("Invalid Ability\n" + championAbility);
		return "Invalid ability";
	} //checks if the input is valid

	//args = args.filter((a) => a); //remove the empty arrays
	// for (let i = 0; i < args.length; i++) {
	// 	const element = args[i];
	// 	console.log(element);
	// }
	let championName = "";
	for (let i = 0; i < args.length - 1; i++) {
		args[i] = args[i].toLowerCase().replace(/['"^_.\s]/gm, "");
		args[i] = args[i].charAt(0).toUpperCase() + args[i].slice(1);
		championName += args[i] + "_";
	} //reformat the champ name
	championName = championName.slice(0, -1); //removes the excess underscore
	let nameCheck = championName.replace(/[_]/gm, "").toLowerCase();
	if (excList.hasOwnProperty(nameCheck)) {
		championName = excList[nameCheck];
	} //check the exception list

	//console.log(championName);
	//console.log(championAbility);
	//args = [championName, championAbility];
	return [championName, championAbility]; // need to rewrite to spit out array
}

//let testarray = ["kO g_.","","", "mAW", "Passive"];
//let testarray2 = ["tWiSTed","","", "fAte", "Q"];
//let testarray3 = ["JaRVan_","","", "iV", "passive"];
//let testability = nameAbilityTEST(testarray);
//let testability2 = nameAbilityTEST(testarray2);
//let testability3 = nameAbilityTEST(testarray3);
