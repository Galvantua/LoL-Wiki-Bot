import fs from 'node:fs';
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "../config.json" assert {type: "json"};


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '9' }).setToken(config.token);

//Register commands and events
client.slashCommands = [];

async function loadSlashCommands() {

	console.log('[⌛] Loading slash commands...');

	const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.mjs'));

	for (const file of commandFiles) {

		const command = await import(`./commands/${file}`);
		client.slashCommands.push(command.default.data.toJSON());

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

			//Register global slash commands
			await rest.put(
				Routes.applicationCommands(client.user.id),
				{ body: client.slashCommands },
			);

			console.log(`[✔️] Successfully registered global slash commands.`);

			//Register per-guild slash commands [DEV ONLY]
			if (process.env.NODE_ENV === "dev") {

				console.log(`[⌛] Registering per-guild (${config.testingGuilds.length}) slash commands...`);

				for (const guild of config.testingGuilds) {

					await rest.put(
						Routes.applicationGuildCommands(client.user.id, guild.id),
						{ body: client.slashCommands },
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
	
});

client.on("interactionCreate", async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction, interaction.channel);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	}
});

//App clilogs
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'dev') throw new Error('NODE_ENV is not set to "dev" or "production"');
console.log(`--------------------------------------------`);
console.log(`|                                          |`)
console.log(`|                                          |`)
console.log(`|              LoL Wiki Bot                |`)
console.log(`|                                          |`)
console.log(`|                                          |`)
console.log(`--------------------------------------------`);

//Login to Discord
client.login(config.token);
