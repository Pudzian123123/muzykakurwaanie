const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "play",
    description: "Aby odtwarzać piosenki :D",
    usage: "<song_name>",
    aliases: ["p"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("Przepraszam, ale aby odtwarzać muzykę, musisz mieć dostęp do kanału głosowego!", message.channel);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))return sendError("Nie mogę połączyć się z Twoim kanałem głosowym, upewnij się, że mam odpowiednie uprawnienia!", message.channel);
    if (!permissions.has("SPEAK"))return sendError("Nie mogę mówić w tym kanale głosowym, upewnij się, że mam odpowiednie uprawnienia!", message.channel);

    var searchString = args.join(" ");
    if (!searchString)return sendError("Nie chciałeś, abym chciał grać", message.channel);

    var serverQueue = message.client.queue.get(message.guild.id);

    var searched = await yts.search(searchString)
    if(searched.videos.length === 0)return sendError("Wygląda na to, że nie mogłem znaleźć utworu na YouTube", message.channel)
    var songInfo = searched.videos[0]

    const song = {
      id: songInfo.videoId,
      title: Util.escapeMarkdown(songInfo.title),
      views: String(songInfo.views).padStart(10, ' '),
      url: songInfo.url,
      ago: songInfo.ago,
      duration: songInfo.duration.toString(),
      img: songInfo.image,
      req: message.author
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      let thing = new MessageEmbed()
      .setAuthor("Utwór został dodany do kolejki", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setThumbnail(song.img)
      .setColor("YELLOW")
      .addField("Nazwa", song.title, true)
      .addField("Trwanie", song.duration, true)
      .addField("Na wniosek", song.req.tag, true)
      .setFooter(`Wyświetlenia: ${song.views} | ${song.ago}`)
      return message.channel.send(thing);
    }

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 2,
      playing: true,
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const play = async (song) => {
      const queue = message.client.queue.get(message.guild.id);
      if (!song) {
        sendError("Leaving the voice channel because I think there are no songs in the queue. If you like the bot stay 24/7 in voice channel go to `commands/play.js` and remove the line number 61\n\nThank you for using my code! [GitHub](https://github.com/SudhanPlayz/Discord-MusicBot)", message.channel)
        queue.voiceChannel.leave();//Jeśli chcesz, aby twój bot pozostawał w vc 24/7, usuń tę linię :D
        message.client.queue.delete(message.guild.id);
        return;
      }

      const dispatcher = queue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
          queue.songs.shift();
          play(queue.songs[0]);
        })
        .on("error", (error) => console.error(error));
      dispatcher.setVolumeLogarithmic(queue.volume / 5);
      let thing = new MessageEmbed()
      .setAuthor("Zaczął grać muzykę!", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("Nazwa", song.title, true)
      .addField("Trwanie", song.duration, true)
      .addField("Na wniosek", song.req.tag, true)
      .setFooter(`Wyświetlenia: ${song.views} | ${song.ago}`)
      queue.textChannel.send(thing);
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      channel.guild.voice.setSelfDeaf(true)
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Nie mogłem dołączyć do kanału głosowego: ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return sendError(`Nie mogłem dołączyć do kanału głosowego: ${error}`, message.channel);
    }
  }
};