import fs from 'node:fs';
import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "../config.json" assert {type: "json"};


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '9' }).setToken(config.token);

//Register commands and events
client.slashCommands = new Map();

async function loadSlashCommands() {

	console.log('[⌛] Loading slash commands...');

	const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.mjs'));

	for (const file of commandFiles) {

		const command = await import(`./commands/${file}`);
		const commandData = command.default.data.toJSON();
		client.slashCommands.set(commandData.name, commandData);

	};

	console.log(`[✔️] Loaded ${client.slashCommands.length} slash commands.`);

	return;

};

async function registerSlashCommands() {

	console.log(`Attempting to load and register slash commands for ${client.user.tag}`);

	try { 

		await loadSlashCommands();

		console.log(`[⌛] Trying to register slash commands....`);

		try {

			//Get all slash commands
			let slashCommands = [];
			client.slashCommands.forEach(command => {

				if (command.options.length > 0) {
					slashCommands.push({
						name: command.name,
						description: command.description,
						options: command.options
					});
				} else {
					slashCommands.push({
						name: command.name,
						description: command.description,
					});
				};

			});

			//Register global slash commands
			await rest.put(
				Routes.applicationCommands(client.user.id),
				{ body: slashCommands },
			);

			console.log(`[✔️] Successfully registered global slash commands.`);

			//Register per-guild slash commands [DEV ONLY]
			if (process.env.NODE_ENV === "dev") {

				console.log(`[⌛] Registering per-guild (${config.testingGuilds.length}) slash commands...`);

				for (const guild of config.testingGuilds) {

					await rest.put(
						Routes.applicationGuildCommands(client.user.id, guild.id),
						{ body: slashCommands },
					);

					console.log(`[✔️] Successfully registered slash commands for guild ${guild.name}.`);

				};

			};

		} catch (err) {

			console.log('[❌] Failed to register slash commands.');
			console.error(err);

		};

	} catch (err) {

		console.log('[❌] Failed to load slash commands.');
		console.error(err);
		process.exit(1);

	};

};

//Bot ready event 
client.on("ready", async () => {

	console.log(`Logged in as '${client.user.tag}'!`);

	await registerSlashCommands();

	console.log(`✅ Bot is ready!`);
	
});

client.on("interactionCreate", async (interaction) => {

	if (interaction.isChatInputCommand()) {

		try {

			const command = client.slashCommands.get(interaction.commandName);

			if (!command) return;

			await command.execute(interaction, interaction.channel);

		} catch (error) {

			console.log(`[⚠️] Error executing command '${interaction.commandName}'`);
			
			const interactionInformation = {
				guild: {
					id: interaction.guild.id,
					name: interaction.guild.name,
				},
				channel: {
					id: interaction.channel.id,
					name: interaction.channel.name,
				},
				user: {
					id: interaction.user.id,
					name: interaction.user.tag,
				},
				interaction: {
					id: interaction.id,
					name: interaction.commandName,
					options: interaction.options,
				},
			};
			console.log(interactionInformation);

			console.error(error);

			//Embed 
			const embed = new EmbedBuilder();
			embed.setColor('#ff0000');
			embed.setTitle('❌ Error during command execution');
			embed.setDescription(`An error occured while executing the command '${interaction.commandName}'.`);
			embed.setFooter({ text: 'Our team has been notified of this error. Still having issues? Contact us! Check /help for more info.'});
			
			//Send embed
			await interaction.reply({ embeds: [embed], ephemeral: true });

		};

	};

});

//App clilogs
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'dev') throw new Error('NODE_ENV is not set to "dev" or "production"');
console.log(`------------------------------------------------------`);
console.log(`|                                                    |`);
console.log(`|                                                    |`);
console.log(`|                   LoL Wiki Bot                     |`);
console.log(`|                                                    |`);
console.log(`|                                                    |`);
console.log(`------------------------------------------------------`);
console.log(``);
console.log(`Starting Lol Wiki bot running version ${process.version} in ${process.env.NODE_ENV} mode.`);
console.log(``);
console.log(`==================================================================`);

//Login to Discord
client.login(config.token);
