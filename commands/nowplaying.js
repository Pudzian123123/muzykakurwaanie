const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "nowplaying",
    description: "Aby pokazać muzykę aktualnie odtwarzaną na tym serwerze",
    usage: "",
    aliases: ["np"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Na tym serwerze nic nie gra.", message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Teraz odtwarzane", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("Nazwa", song.title, true)
      .addField("Trwanie", song.duration, true)
      .addField("Na wniosek", song.req.tag, true)
      .setFooter(`Wyświetlenia: ${song.views} | ${song.ago}`)
    return message.channel.send(thing)
  },
};
