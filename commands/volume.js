const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "volume",
    description: "Aby zmienić głośność kolejki utworów na serwerze",
    usage: "[volume]",
    aliases: ["v", "vol"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("Przepraszam, ale aby odtwarzać muzykę, musisz być na kanale głosowym!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Na tym serwerze nic nie gra.", message.channel);
    if (!args[0])return message.channel.send(`Bieżąca głośność to: **${serverQueue.volume}**`);
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    let xd = new MessageEmbed()
    .setDescription(`Ustawiłem głośność na: **${args[0]/5}/5**(zostanie podzielona przez 5)`)
    .setAuthor("Menedżer woluminów serwera", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
    .setColor("BLUE")
    return message.channel.send(xd);
  },
};
