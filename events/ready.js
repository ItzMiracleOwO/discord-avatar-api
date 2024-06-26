// Ready handler

const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    try {
      client.log(`Ready! Logged in as ${client.user.tag}`, "info");
    } catch (e) {
      client.log(e, "error");
    }
  },
};
