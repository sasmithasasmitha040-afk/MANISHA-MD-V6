/*const { cmd } = require("../command");
const yt = require("ytdl");
const yts = require("yt-search");

// ================== VIDEO SEARCH ==================

cmd(
  {
    pattern: "video",
    react: "🎬",
    alias: ["ytv", "mp4"],
    category: "download",
    use: ".video <Video Name or YouTube URL>",
    filename: __filename,
  },
  async (conn, mek, m, { from, prefix, q, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a video name or YouTube URL!*");

      const search = await yts(q);
      if (!search.videos.length) {
        return reply("⚠️ *No video results found!*");
      }

      const vid = search.videos[0];

      const caption = `
*🎬 MANISHA-MD-V6 VIDEO DOWNLOAD 📥*

╭──────────────────❥
│✨ \`Title\` : ${vid.title}
│⏰ \`Duration\` : ${vid.timestamp}
│👀 \`Views\` : ${vid.views}
│📅 \`Uploaded\` : ${vid.ago}
│📺 \`Channel\` : ${vid.author.name}
╰──────────────────❥

> _*Powered By Manaofc*_
`;

      const buttons = [
        {
          buttonId: `${prefix}ytv ${vid.url}`,
          buttonText: { displayText: "DOWNLOAD VIDEO 📥" },
          type: 1,
        },
      ];

      const buttonMessage = {
        image: vid.thumbnail,
        caption: caption,
        footer: "> _Powered By Manaofc_",
        buttons: buttons,
        headerType: 4,
      };

      await conn.buttonMessage(from, buttonMessage, mek);
    } catch (e) {
      console.log(e);
      reply("❌ *Error while searching video!*");
    }
  }
);

// ================== VIDEO DOWNLOAD ================== 

cmd(
  {
    pattern: "ytv",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Need a YouTube URL!*");

      await conn.sendMessage(from, {
        react: { text: "⬇️", key: mek.key },
      });

      const res = await yt.ytmp4(q);

      if (!res.status || !res.download?.url) {
        return reply("❌ *Failed to fetch video!*");
      }

      const videoUrl = res.download.url;
      const title = res.download.title || "Manaofc-Video";

      await conn.sendMessage(
        from,
        {
          video: { url: videoUrl },
          caption: `🎬 *${title}*\n\n> _Powered By Manaofc_`,
        },
        { quoted: mek }
      );

      await conn.sendMessage(from, {
        react: { text: "✔️", key: mek.key },
      });

    } catch (e) {
      console.log(e);
      reply("❌ *Video download failed!*");
    }
  }
);

*/
