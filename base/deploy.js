// This script is used to deploy slash commands to Discord.
// Run: npm run deploy

const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const config = require("../config.js");
const log = require("./log.js").log;

const clientId = config.clientId;
const token = config.token;

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "../", "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      log(
        `The command at ${filePath} is missing a required "data" or "execute" property.`,
        "warn",
      );
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
  try {
    log(
      `Started refreshing ${commands.length} application (/) commands.`,
      "info",
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    log(
      `Successfully reloaded ${data.length} application (/) commands.` + "\n",
      "info",
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
