export async function run(bot, core, message, args) {
	//requires args to be ["ability", "champion", "{q,w,e,r,p}"
	
	//create parser for HTML
	const parser = new DOMParser();
	var document, abilityMain, abilityDetails, abilityNumber;
	
	if (args[1] == "kogmaw") {
		args[1] = "kog'maw";
	} //add exceptions here
	
	//clean inputs
	if (args[2] == "Q" || args[2] == "q"){
		args[2] = "q";
		abilityNumber = 1;
	} else if (args[2] == "W" || args[2] == "w"){
		args[2] = "w";
		abilityNumber = 2;
	} else if (args[2] == "E" || args[2] == "e"){
		args[2] = "e";
		abilityNumber = 3;
	} else if (args[2] == "R" || args[2] == "r"){
		args[2] = "r";
		abilityNumber = 4;
	} else if (args[2] == "P" || args[2] == "p" || args[2] == "passive" || args[2] == "Passive"){
		args[2] = "innate";
		abilityNumber = 0;
	} //else throw error?
	
    const Http = new XMLHttpRequest(); //create new request
    const url='https://leagueoflegends.fandom.com/wiki/${args[1]}/LoL'; 
    Http.open("GET", url);
	Http.send();

	//if i have to write everything inside this I can but i feel like im not supposed to...
    Http.onreadystatechange = (e) => {
        if (this.readyState==4 && this.status==200){
			document = parser.parseFromString(Http.responseText, "text/html"); //parse the response into a document for scraping
			abilityMain = document.getElementsByClassName('skill skill_${args[2]}');
			abilityDetails = document.getElementsByClassName('tabbertab-bordered')[abilityNumber];
		} /*else if (this.readyState==4 && this.status!=200) {
			throw error due to http error
		}*/			
    }
  
    //create an embed
    const embed = new core.MessageEmbed()
    embed.setTitle("Pong!")
    embed.setColor('#01eee8') 
    embed.addField(`🖥️ WebSocket`, `**${bot.ws.ping}**ms`)
    //create a red hex color embed

    //send the embed
    await message.channel.send({ embeds: [embed]});

}
