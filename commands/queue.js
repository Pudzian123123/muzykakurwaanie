const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "queue",
    description: "Aby wyświetlić kolejkę utworów na serwerze",
    usage: "",
    aliases: ["q", "list", "songlist", "song-list"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Na tym serwerze nic nie gra.", message.channel);

    let queue = new MessageEmbed()
    .setAuthor("Kolejka utworów na serwerze", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
    .setColor("BLUE")
    .addField("Teraz odtwarzane", serverQueue.songs[0].title, true)
    .addField("Kanał tekstowy", serverQueue.textChannel, true)
    .addField("Kanał głosowy", serverQueue.voiceChannel, true)
    .setDescription(serverQueue.songs.map((song) => {
      if(song === serverQueue.songs[0])return
      return `**-** ${song.title}`
    }).join("\n"))
    .setFooter("Currently Server Volume is "+serverQueue.volume)
    if(serverQueue.songs.length === 1)queue.setDescription(`No songs to play next add songs by \`\`${client.config.prefix}play <song_name>\`\``)
    message.channel.send(queue)
  },
};
