const sendError = require("../util/error");

module.exports = {
  info: {
    name: "skip",
    description: "Aby pominąć bieżącą muzykę",
    usage: "",
    aliases: ["s"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("Przepraszam, ale aby odtwarzać muzykę, musisz być na kanale głosowym!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("Nie ma nic, co mógłbym dla ciebie pominąć.", message.channel);
    serverQueue.connection.dispatcher.end("Opuściłem muzykę");
    message.react("✅")
  },
};
