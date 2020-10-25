const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "stop",
    description: "Aby zatrzymać muzykę i wyczyścić kolejkę",
    usage: "",
    aliases: [],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("Przepraszam, ale aby odtwarzać muzykę, musisz być na kanale głosowym!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("Nie ma nic, co mógłbym dla ciebie zatrzymać.", message.channel);
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("Zatrzymaj muzykę");
    message.react("✅")
  },
};
