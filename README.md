# LoL-Wiki-Bot

A Discord bot that allows you to search for League of Legends champions, items, runes, and more.

## Documentation

Can be found [here]().

## Contributing

If you would like to contribute to this project, please read the [contributing guidelines](CONTRIBUTING.md).

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Running the bot

⚠️ Starting version 1.0.0, you will need to use the src/index.js file to run the bot. ⚠️

To build and run the bot, you will need to have [Node.js](https://nodejs.org/en/) installed. Supported version: v18.9.0

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Fill out the `config.json` as described in the [configuration](#configuration) section
4. Run `npm run start:dev` to start the bot in development mode (verbose logs) or `npm run start` to start the bot in production mode (no logs)

## Configuration

The bot uses a `config.json` file to store configuration options. The `config.example.json` file contains all the options that can be configured.

-   `token` - The bot token. You can get this from the [Discord Developer Portal](https://discord.com/developers/applications).
-   `testingGuilds` - An array of objects that the bot will MANUALLY register slash commands for. This is useful for testing slash commands in a testing server. The object should contain the name and ID of the guild:
    ```json
    ...: {
        "name": "Guild Name",
        "id": "123456789012345678"
    }
    ```
