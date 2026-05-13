const { File } = require("megajs");
const apkdl = require('../lib/apkdl');
const { fetchJson } = require('../lib/functions')
const { cmd } = require("../command");
const path = require("path");
const fetch = require("node-fetch");
const axios = require("axios");
const cheerio = require("cheerio");
const yts = require("yt-search");

/* ================== SONG SEARCH ================== */

cmd(
  {
    pattern: "song",
    react: "🎵",
    alias: ["music", "yt"],
    category: "download",
    use: ".song <Song Name or YouTube URL>",
    filename: __filename,
  },
  async (conn, mek, m, { from, prefix, q, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a song name or YouTube URL!*");

      const search = await yts(q);
      if (!search.videos || search.videos.length === 0) {
        return reply("⚠️ *No song results found!*");
      }

      const song = search.videos[0];

      const caption = `

*🎶 MANISHA-MD-V6 SONG DOWNLOAD.📥*
╭──────────────────❥
│✨ \`Title\` : ${song.title}
│⏰ \`Duration\` : ${song.timestamp}
│👀 \`Views\` : ${song.views}
│ 📅 ‍ \`Uploaded\` : ${song.ago}
│ 📺 ‍ \`Channel\` : ${song.author.name}
╰──────────────────❥

> _*Powered By Manaofc*_ `;

      const buttons = [
        {
          buttonId: `${prefix}yta ${song.url}`,
          buttonText: { displayText: "AUDIO TYPE 🎙" },
          type: 1,
        },
        {
          buttonId: `${prefix}ytd ${song.url}`,
          buttonText: { displayText: "DOCUMENT TYPE 📁" },
          type: 1,
        },
      ];

      const buttonMessage = {
        image: song.thumbnail,
        caption: caption,
        footer: "> _Powered By Manaofc_",
        buttons: buttons,
        headerType: 4,
      };

      await conn.buttonMessage(from, buttonMessage, mek);
    } catch (e) {
      console.log(e);
      reply("❌ *An error occurred while searching!*");
    }
  }
);

/* ================== AUDIO DOWNLOAD ================== */

cmd(
  {
    pattern: "yta",
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

      const apiUrl = `https://api-dark-shan-yt.koyeb.app/download/ytmp3-v2?url=${encodeURIComponent(q)}`;

      const res = await axios.get(apiUrl, { timeout: 30000 });
      const data = res.data;

      if (!data.status || !data.data?.download) {
        return reply("❌ *Failed to fetch audio link!*");
      }

      const audioUrl = data.data.download;

      await conn.sendMessage(
        from,
        {
          audio: { url: audioUrl },
          mimetype: "audio/mpeg",
        },
        { quoted: mek }
      );

      await conn.sendMessage(from, {
        react: { text: "✔️", key: mek.key },
      });
    } catch (e) {
      console.log(e);
      reply("❌ *Audio download failed!*");
    }
  }
);

/* ================== DOCUMENT DOWNLOAD ================== */

cmd(
  {
    pattern: "ytd",
    react: "📁",
    dontAddCommandList: true,
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Need a YouTube URL!*");

      await conn.sendMessage(from, {
        react: { text: "⬇️", key: mek.key },
      });

      const apiUrl = `https://api-dark-shan-yt.koyeb.app/download/ytmp3-v2?url=${encodeURIComponent(q)}`;

      const res = await axios.get(apiUrl, { timeout: 30000 });
      const data = res.data;

      if (!data.status || !data.data?.download) {
        return reply("❌ *Failed to fetch document link!*");
      }

      const audioUrl = data.data.download;
      const title = data.data.title || "Manaofc-Music";

      await conn.sendMessage(
        from,
        {
          document: { url: audioUrl },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`,
        },
        { quoted: mek }
      );

      await conn.sendMessage(from, {
        react: { text: "✔️", key: mek.key },
      });
    } catch (e) {
      console.log(e);
      reply("❌ *Document download failed!*");
    }
  }
);

//========== xnxx download ============

const BASE_LINK = "https://manaofc-xnxx-api-7cc70cbd0adc.herokuapp.com"
cmd({
    pattern: "xnxx",
    desc: "Download XNXX Video",
    use: ".xnxx <query>",
    react: "🔞",
    category: "download",
    filename: __filename
},

async (conn, mek, m, { from, prefix, q, reply }) => {
    try {            
        if (!q) return await reply('*Please enter a query!*')

        const res = await fetchJson(`${BASE_LINK}/search?q=${encodeURIComponent(q)}&api_key=manaofc-v6 `)

        // ✅ FIX HERE (results instead of result)
        if (!res.success || !res.results || res.results.length === 0) {
            return reply('*❌ No results found!*')
        }

        const data = res.results

        const rows = data.slice(0, 50).map((v) => ({
            buttonId: `${prefix}xnxxvid ${v.url}`,
            buttonText: { 
                displayText: v.title.length > 40 
                    ? v.title.slice(0, 37) + "..." 
                    : v.title 
            },
            type: 1,
        }))

        const buttonMessage = {
            image: "https://i.ibb.co/S4Cf2kZg/IMG-0773.png",
            caption: `*MANISHA-MD-V6 XNXX DOWNLOAD 🤫*`,
            footer: '> _*Powered By Manaofc*_',
            buttons: rows,
            headerType: 4
        }


        return await conn.buttonMessage(from, buttonMessage, mek)
    } catch (e) {
      console.log(e)
      reply('*❌ Error occurred!*');
    }
  }
)

cmd({
    pattern: "xnxxvid",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},

async (conn, mek, m, { from, q, reply }) => {
try {

    if (!q) return await reply('*Need a video url!*')

    const res = await fetchJson(`${BASE_LINK}/video?url=${encodeURIComponent(q)}&api_key=manaofc-v6`)

    if (!res.success || !res.data) 
        return reply('*❌ Failed to fetch video!*')

    let data = res.data

    let caption = `
*🔞 XNXX VIDEO DOWNLOAD*

╭──────────────────❥
│🎬 \`Title\` : ${data.title}
│⏱ \`Duration\` : ${data.duration}
│👀 \`Views\` : ${data.views}
│👍 \`Likes\` : ${data.likes}
│⭐ \`Rating\` : ${data.rating}
╰──────────────────❥
`

    await conn.sendMessage(from, { react: { text: '⬆', key: mek.key }})

    await conn.sendMessage(from, {
        image: { url: data.thumbnail },
        caption: caption
    }, { quoted: mek })

    await conn.sendMessage(from, {
        video: { url: data.dlink },
        mimetype: "video/mp4"
    }, { quoted: mek })

    await conn.sendMessage(from, { react: { text: '✔', key: mek.key }})

} catch (e) {
    console.log(e)
    reply('*❌ Download failed!*')
}
})

//========== xvideo download ============
cmd({
    pattern: "xvideo",
    desc: "Search xvideos",
    use: ".xnxx <query>",
    react: "🔞",
    category: "download",
    filename: __filename
},

async (conn, mek, m, { from, prefix, q, reply }) => {
try {

if (!q) return reply("*Please enter a search query!*")

// API SEARCH
const res = await fetchJson(`https://api.giftedtech.co.ke/api/search/xvideossearch?apikey=gifted&query=${encodeURIComponent(q)}`)

if (!res.success || !res.results || res.results.length === 0) {
return reply("*❌ No results found!*")
}

let results = res.results

// limit buttons
const rows = results.slice(0,50).map((v,i)=>({
buttonId: `${prefix}xvid ${v.url}`,
buttonText:{
displayText: v.title ? v.title.slice(0,50) : `Video ${i+1}`
},
type:1
}))

const buttonMessage = {
image: "https://i.ibb.co/S4Cf2kZg/IMG-0773.png",
caption:`*MANISHA-MD XVIDEO DOWNLOAD 🔞*`,
footer:`> _*Powered By Manaofc*_`,
buttons: rows,
headerType:4
}

return await conn.buttonMessage(from, buttonMessage, mek)
    } catch (e) {
      console.log(e)
      reply('*❌ Error occurred!*');
    }
  }
)


// XVIDEO DOWNLOAD

cmd({
pattern:"xvid",
react:"⬇️",
dontAddCommandList:true,
filename:__filename
},

async (conn, mek, m, { from, q, reply }) => {

try{

if(!q) return reply("*Please provide video url!*")

// API DOWNLOAD
const res = await fetchJson(`https://api.giftedtech.co.ke/api/download/xvideosdl?apikey=gifted&url=${encodeURIComponent(q)}`)

if(!res.success || !res.result) return reply("*❌ Failed to fetch video!*")

let data = res.result

let caption = `
*VIDEO DOWNLOADER*

╭──────────────❍
│ 🎬 *Title* : ${data.title || "Unknown"}
│ 👀 *Views* : ${data.views || "N/A"}
│ 👍 *Likes* : ${data.likes || "N/A"}
│ 👎 *Dislikes* : ${data.dislikes || "N/A"}
│ 📦 *Size* : ${data.size || "Unknown"}
╰──────────────❍
`

await conn.sendMessage(from,{ react:{ text:"⬆️", key: mek.key }})

// send thumbnail + info
await conn.sendMessage(from,{
image:{ url: data.thumbnail },
caption: caption
},{quoted: mek})

// send video
await conn.sendMessage(from,{
video:{ url: data.download_url },
mimetype:"video/mp4"
},{quoted: mek})

await conn.sendMessage(from,{ react:{ text:"✅", key: mek.key }})

}catch(e){
console.log(e)
reply("*❌ Download failed!*")
}

})

cmd(
  {
    pattern: "apk",
    react: "📦",
    alias: ["app", "playstore"],
    category: "download",
    use: ".apk *<Apk Name>*",
    filename: __filename,
  },
  async (conn, mek, m, { from, prefix, q, reply }) => {
    try {
      if (!q) return await reply(imgMsg, mek);
      const data = await apkdl.search(q);
      if (!data.length) return await reply("*couldn't find anything*");

      const rows = data.map(v => ({
        buttonId: `${prefix}dapk ${v.id}`,
        buttonText: { displayText: `${v.name}` },
        type: 1,
      }));

      const buttonMessage = {
        image: "https://cdn6.aptoide.com/imgs/4/8/c/48c1f18f7d65f38d0b19af5f47015e9c_fgraphic.jpg",
        caption: `* MANISHA-MD-V6 APK DOWNLOAD.📦*`,
        footer: '> _*Powered By Manaofc*_ ',
        buttons: rows,
        headerType: 4,
      };

      return await conn.buttonMessage(from, buttonMessage, mek);
    } catch (e) {
      console.error(e);
      reply("*ERROR !!*");
    }
  }
);

cmd(
  {
    pattern: "dapk",
    react: "📦",
    dontAddCommandList: true,
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      await conn.sendMessage(from, { react: { text: "🌟", key: mek.key } });
      if (!q) return await reply("*Need apk link...❗*");

      const data = await apkdl.download(q);
      const caption = `📥 *MANISHA-MD-V6 APK DOWNLOAD* 📥\n\n` +
        `◈ *🏷️  :* ${data.name}\n` +
        `◈ *👤 Developers :* ${data.package}\n` +
        `◈ *📆 Last Update :* ${data.lastup}\n` +
        `◈ *📥 Size :* ${data.size}\n\n> _*Powered By Manaofc*_`;

      await conn.sendMessage(from, { image: { url: data.icon }, caption }, { quoted: mek });

      await conn.sendMessage(from, {
        document: { url: data.dllink },
        mimetype: "application/vnd.android.package-archive",
        fileName: `${data.name}.apk`,
        caption: '> _*Powered By Manaofc*_ ',
      }, { quoted: mek });
      
      await conn.sendMessage(from, { react: { text: "✔", key: mek.key } });
    } catch (e) {
      console.error(e);
      reply(`_An Error Found_ : *${e}*`);
    }
  }
);



// Mapping common file extensions to MIME types
const mimeTypes = {
  ".mp4": "video/mp4",
  ".mkv": "video/x-matroska",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".rar": "application/x-rar-compressed",
  ".7z": "application/x-7z-compressed",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".txt": "text/plain",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".exe": "application/octet-stream",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  // Add more as needed
};

// Function to format file size
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const maxSize = 4 * 1024 * 1024 * 1024; // 4GB size limit

async function MegaDl(url) {
  let res = { error: true };

  if (!url) return res;

  try {
    const file = File.fromURL(url);
    await file.loadAttributes();

    const fileExtension = path.extname(file.name).toLowerCase();
    const mimeType = mimeTypes[fileExtension] || "application/octet-stream"; // Default MIME type for unknown file types

    // Check file size
    if (file.size > maxSize) {
      return { error: true, message: "File size exceeds the 4GB limit." };
    }

    const fileInfo = {
      fileName: file.name,
      fileSize: formatBytes(file.size),
      fileSizeb: file.size,
      mimeType: mimeType
    };

    // Download file buffer
    const data = await file.downloadBuffer();

    return {
      error: false,
      fileInfo: fileInfo,
      data: data
    };
  } catch (e) {
    console.log(e);
    return res;
  }
}

// Mega command to handle Mega file download
cmd({
  pattern: "mega",
  alias: ["megadl", "meganz"],
  react: '📦',
  desc: "Download files from Mega.",
  category: "download",
  use: '.mega *<Mega URL>*',
  filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return await reply('*Please provide a Mega URL!*');

    // Call MegaDl function to get file metadata and download URL
    let res = await MegaDl(q);

    if (res.error) {
      return await reply(res.message || "An error occurred while processing the Mega URL.");
    }

    const { fileInfo, data } = res;
    const { fileName, mimeType, fileSizeb } = fileInfo;

    // Check file size (4GB)
    if (fileSizeb > maxSize) {
      return await conn.sendMessage(from, { text: '🚩 *File size is too big...*' }, { quoted: mek });
    }

    // Prepare message with file metadata
    const caption = `*◈ File name:*  ${fileName}
*◈ File Size:* ${fileInfo.fileSize}
*◈ File type:* ${mimeType}

> _*Powered By Manaofc*_`;

    // Send the file to the user
    const message = {
      document: data,
      mimetype: mimeType,
      fileName: fileName,
      caption: caption,
    };

    await conn.sendMessage(from, message, { quoted: mek });

  } catch (e) {
    console.log(e); // Log the error
    reply(`${e}`); // Send the error message to the user
  }
});

// Function to download Google Drive file
async function GDriveDl(url) {
  let id, res = { error: true };

  if (!url || !url.match(/drive\.google/i)) return res;

  try {
    if (id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1], !id) throw "ID Not Found";

    // Fetch file metadata from Google Drive API
    res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
      method: "post",
      headers: {
        "accept-encoding": "gzip, deflate, br",
        "content-length": 0,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        origin: "https://drive.google.com",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
        "x-client-data": "CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=",
        "x-drive-first-party": "DriveWebUi",
        "x-json-requested": "true"
      }
    });

    let { fileName, sizeBytes, downloadUrl } = JSON.parse((await res.text()).slice(4));

    if (!downloadUrl) throw "Link Download Limit!";

    let data = await fetch(downloadUrl);

    return 200 !== data.status ? data.statusText : {
      downloadUrl: downloadUrl,
      fileName: fileName,
      fileSize: formatBytes(sizeBytes),
      fileSizeb: sizeBytes,
      mimetype: data.headers.get("content-type")
    };

  } catch (e) {
    console.log(e); // Log any error
    return res; // Return the error response
  }
}

// Google Drive command to handle file download
cmd({
  pattern: "gdrive",
  alias: ["googledrive"],
  react: '📁',
  desc: "Download Google Drive files.",
  category: "download",
  use: '.gdrive *<GoogleDrive URL>*',
  filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
  try {
    const [data] = q.split("±");
    if (!data) return await reply('*Please provide a Google Drive URL!*');

    let res = await GDriveDl(data);

    if (res.error) return await reply("Failed to fetch the file or the file is not available.");

    let mimetype = res.mimetype;
    const fileExtension = path.extname(res.fileName).toLowerCase();
    mimetype = mimeTypes[fileExtension] || mimetype || "application/octet-stream";

    if (res.fileSizeb > maxSize) {
      return await conn.sendMessage(from, { text: '🚩 *File size is too big...*' }, { quoted: mek });
    }

    const response = await axios.get(res.downloadUrl, { responseType: "arraybuffer" });
    const mediaBuffer = Buffer.from(response.data, "binary");

    const caption = `*◈ File name:*  ${res.fileName}
*◈ File Size:* ${res.fileSize}
*◈ File type:* ${mimetype}

> _*Powered By Manaofc*_`;

    const message = {
      document: mediaBuffer,
      mimetype: mimetype,
      fileName: res.fileName,
      caption: caption,
    };

    await conn.sendMessage(from, message, { quoted: mek });

  } catch (e) {
    console.log(e); // Log the error
    reply(`${e}`); // Send the error message to the user
  }
});

// MediaFire command to handle file download
async function mfire(url) {
  try {
    const response = await fetch(`https://www-mediafire-com.translate.goog/${url.replace("https://www.mediafire.com/", "")}?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5481.178 Safari/537.36",
      },
    });

    const data = await response.text();
    const $ = cheerio.load(data);

    const downloadUrl = ($("#downloadButton").attr("href") || "").trim();
    const alternativeUrl = ($("#download_link > a.retry").attr("href") || "").trim();
    const $intro = $("div.dl-info > div.intro");

    return {
      link: downloadUrl || alternativeUrl,
      name: $intro.find("div.filename").text().trim(),
      size: $intro.find("div.filetype > span").eq(0).text().trim(),
      uploaded: $("div.dl-info > ul.details > li").eq(1).find("span").text().trim(),
      mime: /\(\.(.*?)\)/.exec($intro.find("div.filetype > span").eq(1).text())?.[1]?.trim() || "bin",
    };
  } catch (error) {
    console.error(error);
  }
}

// MediaFire command to handle file download
cmd(
  {
    pattern: "mediafire",
    alias: ["mfire"],
    react: "📁",
    desc: "Download MediaFire files.",
    category: "download",
    use: ".mediafire *<MediaFire URL>*",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      const res = await mfire(q);
      if (!res || !res.link) {
        return await reply("*Error:* Unable to retrieve the file from the provided URL.");
      }

      const sendmedia = res.link;
      const fileSizeInBytes = parseFloat(res.size.replace(/\D/g, "")) * 1024 * 1024;
      const fileExtension = `.${res.mime.toLowerCase()}`;
      const mimetype = mimeTypes[fileExtension] || "application/octet-stream";

      const caption = `*MANISHA-MD-V6 MEDIAFIRE DOWNLOAD.📦*\n*◈ Name:* ${res.name}\n*◈ Size:* ${res.size}\n*◈ Mimetype:* ${mimetype}\n*◈ Uploaded:* ${res.uploaded}\n\n\n> _*Powered By Manaofc*_`;

      if (fileSizeInBytes > maxSize) {
        return await reply("*This file is too big.⁉️*");
      }

      await conn.sendMessage(from, {
        document: { url: sendmedia },
        mimetype: mimetype,
        fileName: `${res.name}.${res.mime}`,
        caption: caption,
      }, { quoted: mek });

    } catch (e) {
      console.error(e);
      await reply(`*Error:* ${e}`);
    }
  }
);

//============== GITCLONE =============
cmd(
  {
    pattern: "gitclone",
    alias: ["gitdl"],
    react: "📁",
    desc: "Download git repos",
    category: "download",
    use: ".gitclone *<Git Repo Url>*",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q) return await reply("🩸*Please provide a GitHub repo URL !!*");
      const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
      if (!regex.test(q)) return reply("🩸*Please provide a valid GitHub repo link !!*");

      const [, user, repo] = q.match(regex) || [];
      const url = `https://api.github.com/repos/${user}/${repo.replace(/.git$/, "")}/zipball`;
      const filename = (await fetch(url, { method: "HEAD" })).headers
        .get("content-disposition")
        .match(/attachment; filename=(.*)/)[1];

      await conn.sendMessage(from, {
        document: { url },
        mimetype: "application/zip",
        fileName: filename,
        caption: "> _*Powered By Manaofc*_",
      }, { quoted: mek });
    } catch (e) {
      console.error(e);
      reply("*I can't find this repo.⁉️*");
    }
  }
);

