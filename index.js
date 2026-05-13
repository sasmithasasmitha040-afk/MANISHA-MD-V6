const {
  default: makeWASocket,
  getAggregateVotesInPollMessage,
  useMultiFileAuthState,
  DisconnectReason,
  getDevice,
  fetchLatestBaileysVersion,
  jidNormalizedUser,
  getContentType,
  Browsers,
  makeInMemoryStore,
  makeCacheableSignalKeyStore,
  downloadContentFromMessage,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  generateForwardMessageContent,
  proto,
} = require("baileys");
const fs = require("fs");
const EventEmitter = require('events');
const P = require("pino");
const pino = require("pino");
const config = require("./config");
const figlet = require("figlet");
const lolcatjs = require("lolcatjs");
const FileType = require("file-type");
const qrcode = require("qrcode-terminal");
const NodeCache = require("node-cache");
const util = require("util");
const { toAudio, toPTT, toVideo } = require("./lib/converter");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, fetchBuffer, getFile, } = require("./lib/functions");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, } = require("./lib/exif");
const abc = fetchJson
const { sms, downloadMediaMessage } = require("./lib/msg");
const GroupEvents = require('./lib/groupevents');
const axios = require("axios");
const fetch = require("node-fetch");
const { File } = require("megajs");
const mega = require("megajs");
const path = require("path");
const msgRetryCounterCache = new NodeCache();
const ownerNumber = config.OWNER
const l = console.log;
var { updateCMDStore, isbtnID, getCMDStore, getCmdForCmdId, connectdb, input, get, updb, updfb, upresbtn, } = require("./lib/database");

function pickRandom(list) {
  const shuffledList = list.slice().sort(() => Math.random() - 0.5);
  return shuffledList[Math.floor(Math.random() * shuffledList.length)];
}

function levenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
    
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,     // deletion
                        dp[i][j - 1] + 1,     // insertion
                        dp[i - 1][j - 1] + 1  // substitution
                    );
                }
            }
        }
    
        return dp[m][n];
    }
    function findSimilarCommands(events, cmdName, threshold = 3) {
        const allCommands = events.commands.flatMap(cmd => 
            [cmd.pattern, ...(cmd.alias || [])]
        ).filter(Boolean);
    
        const similarCommands = allCommands
            .map(cmd => ({
                command: cmd,
                distance: levenshteinDistance(cmdName.toLowerCase(), cmd.toLowerCase())
            }))
            .filter(item => item.distance <= threshold)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 3);  // Limit to top 3 suggestions
    
        return similarCommands.map(item => item.command);
    }

let docmime = pickRandom([
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/msword",
  "application/pdf",
  "text/rtf",
]);

let cos = "```";

//===================SESSION============================
const sessionDir = path.join(__dirname, 'manaofc');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(credsPath)) {

  // Folder eka exist nathi nam create karanawa
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  if (config.SESSION_ID) {
    const sessdata = config.SESSION_ID;
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);

    filer.download((err, data) => {
      if (err) throw err;

      fs.writeFile(credsPath, data, (err) => {
        if (err) throw err;

        console.log("MANISHA-MD-V6 Session Download Completed.");
        console.log("Please Wait 5-10 Minutes For Run MANISHA-MD-V6");
      });
    });
  }
}
// <<==========PORTS===========>>
const express = require("express");
const app = express();
const port = process.env.PORT || 3034;
//====================================
async function connectToWA() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`MANISHA-MD-V6 Using WA v${version.join(".")}, isLatest: ${isLatest}`);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const usePairingCode = true;
  const conn = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: !usePairingCode,
    browser: Browsers.macOS("Safari"),
    syncFullHistory: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
    },
    version,
    generateHighQualityLinkPreview: true,
    defaultQueryTimeoutMs: 0,
  });

  conn.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      if (
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
      ) {
        connectToWA();
      }
    } else if (connection === "open") {
      console.log("---------------------------------------------❥❥");
      lolcatjs.fromString("MANISHA-MD-V6 Installing.....");
      const path = require("path");
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });  
      console.log(" ├────────────────────────────────────────────────────────────────────❥");
      lolcatjs.fromString(" ├ MANISHA-MD-V6 Plugins Installed...");
      console.log(" ├──────────────────────────────────────···");
      lolcatjs.fromString(" ├ MANISHA-MD-V6 Bot Connected...");
      console.log(" ├──────────────────────────────────────···");
      lolcatjs.fromString(" ├ Powered By Manaofc...");
      console.log(" ╰──────────────────────────────────────···");
      await connectdb();
      await updb();
      await conn.sendMessage(config.OWNER + "@s.whatsapp.net", {
        image: { url: config.BOT_IMAGE },
        caption: `*MANISHA-MD-V6 WhatsApp Bot Connected.✅*`,
      });
      console.clear();
    }
  });

  conn.ev.on("creds.update", saveCreds);
	// ====================
	conn.ev.on("group-participants.update", (update) => GroupEvents(conn, update));
	//=====================
  conn.ev.on("messages.upsert", async (mek) => {
    try {
      mek = mek.messages[0];
      if (!mek.message) return;
      mek.message =
        getContentType(mek.message) === "ephemeralMessage"
          ? mek.message.ephemeralMessage.message
          : mek.message;
      if (config.AUTO_READ_STATUS === "true") {
        if (mek.key && mek.key.remoteJid === "status@broadcast") {
          await conn.readMessages([mek.key]);
        }
      }

      if (mek.key && mek.key.remoteJid === "status@broadcast") return;
      const m = sms(conn, mek);
      const type = getContentType(mek.message);
      const content = JSON.stringify(mek.message);
      const from = mek.key.remoteJid;
      const quoted =
        type == "extendedTextMessage" &&
        mek.message.extendedTextMessage.contextInfo != null
          ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
          : [];
      const body =
        type === "conversation"
          ? mek.message.conversation
          : mek.message?.extendedTextMessage?.contextInfo?.hasOwnProperty(
              "quotedMessage"
            ) &&
            (await isbtnID(
              mek.message?.extendedTextMessage?.contextInfo?.stanzaId
            )) &&
            getCmdForCmdId(
              await getCMDStore(
                mek.message?.extendedTextMessage?.contextInfo?.stanzaId
              ),
              mek?.message?.extendedTextMessage?.text
            )
          ? getCmdForCmdId(
              await getCMDStore(
                mek.message?.extendedTextMessage?.contextInfo?.stanzaId
              ),
              mek?.message?.extendedTextMessage?.text
            )
          : type === "extendedTextMessage"
          ? mek.message.extendedTextMessage.text
          : type == "imageMessage" && mek.message.imageMessage.caption
          ? mek.message.imageMessage.caption
          : type == "videoMessage" && mek.message.videoMessage.caption
          ? mek.message.videoMessage.caption
          : "";
      const prefix = config.PREFIX
        ? config.PREFIX
        : /^./.test(body)
        ? body.match(/^./gi)
        : "#";
      const isCmd = body.startsWith(prefix);
      const command = isCmd
        ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase()
        : "";
      const args = body.trim().split(/ +/).slice(1);
      const q = args.join(" ");
      const isGroup = from.endsWith("@g.us");
      const sender = mek.key.fromMe
        ? conn.user.id.split(":")[0] + "@s.whatsapp.net" || conn.user.id
        : mek.key.participant || mek.key.remoteJid;
      const senderNumber = sender.split("@")[0];
      const mentionByTag =
        type == "extendedTextMessage" &&
        mek.message.extendedTextMessage.contextInfo != null
          ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
          : [];
      const botNumber = conn.user.id.split(":")[0];
	  const pushname = mek.pushName || "NO NUMBER";
	  const isMe = botNumber.includes(senderNumber);
	  const isOwner = ownerNumber?.includes(senderNumber) || isMe;
      const botNumber2 = await jidNormalizedUser(conn.user.id);
      const groupMetadata = isGroup
        ? await conn.groupMetadata(from).catch((e) => {})
        : "";
      const groupName = isGroup ? groupMetadata.subject : "";
      const participants = isGroup ? await groupMetadata.participants : "";
      const groupAdmins = isGroup ? await getGroupAdmins(participants) : "";
      const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
      const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
      const isreaction = m.message.reactionMessage ? true : false;
	  const manaofc = await abc;
	 //==================
	  const who = m.sender;
		const ppuser = await (async () => {
  try { return await conn.profilePictureUrl(who, "image"); }
  catch { return "https://i.ibb.co/S4Cf2kZg/IMG-0773.png"; }
})();
      //const ppuser = (await conn.profilePictureUrl(who, "image")) ||"https://i.ibb.co/S4Cf2kZg/IMG-0773.png";
	  const reply = async (tex) => {
      const qtext = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { 'contactMessage': { 'displayName': 'manaofc', 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;'manaofc',;;;\nFN:'manaofc'\nitem1.TEL;waid=94759934522:+94759934522\nitem1.X-ABLabel:Mobile\nEND:VCARD`, 'jpegThumbnail': 'https://i.ibb.co/S4Cf2kZg/IMG-0773.png', thumbnail: 'https://i.ibb.co/S4Cf2kZg/IMG-0773.png',sendEphemeral: true}}}

    await conn.sendMessage(from, { text: tex }, { quoted: qtext });};
      //===========================================================================================================
		const NON_BUTTON = true; // Implement a switch to on/off this feature...
      conn.buttonMessage = async (jid, msgData, quotemek) => {
        if (!NON_BUTTON) {
          await conn.sendMessage(jid, msgData);
        } else {
          let result = "";
          const CMD_ID_MAP = [];

          msgData.buttons.forEach((button, bttnIndex) => {
            const mainNumber = `${bttnIndex + 1}`;
            result += `\n◈ *${mainNumber} - ${button.buttonText.displayText}*`;
            CMD_ID_MAP.push({ cmdId: mainNumber, cmd: button.buttonId });
          });

          const buttonMessage = `
${msgData.text || msgData.caption}

*╭─────────────────❥➻*
*╎*  ${cos}🔢 Reply Below Number:${cos}
*╰─────────────────❥➻*
${result}

${msgData.footer}`;

          const btnimg = msgData.image
            ? { url: msgData.image }
            : { url: config.BOT_IMAGE };

          if (msgData.headerType === 1 || msgData.headerType === 4) {
            const imgmsg = await conn.sendMessage(
              jid,
              { image: btnimg, caption: buttonMessage },
              { quoted: quotemek || mek }
            );
            await updateCMDStore(imgmsg.key.id, CMD_ID_MAP);
          }
        }
      };

      conn.listMessage = async (jid, msgData, quotemek) => {
        if (!NON_BUTTON) {
          await conn.sendMessage(jid, msgData);
        } else {
          let result = "";
          const CMD_ID_MAP = [];

          msgData.sections.forEach((section, sectionIndex) => {
            const mainNumber = `${sectionIndex + 1}`;
            result += `\n*${mainNumber} :* ${section.title}\n`;

            section.rows.forEach((row, rowIndex) => {
              const subNumber = `${mainNumber}.${rowIndex + 1}`;
              const rowHeader = `◦  ${subNumber} - ${row.title}`;
              result += `${rowHeader}\n`;
              CMD_ID_MAP.push({ cmdId: subNumber, cmd: row.rowId });
            });
          });

          const listimg = msgData.image
            ? { url: msgData.image }
            : { url: config.BOT_IMAGE };

          const listMessage = `
${msgData.text}

*╭─────────────────❥➻*
*╎*  ${cos}🔢 Reply Below Number:${cos}
*╰─────────────────❥➻*

${result}

${msgData.footer}`;

          const text = await conn.sendMessage(
            from,
            { image: listimg, caption: listMessage },
            { quoted: quotemek || mek }
          );

          await updateCMDStore(text.key.id, CMD_ID_MAP);
        }
      };
      //=======================================================
      conn.edit = async (mek, newmg) => {
        await conn.relayMessage(
          from,
          {
            protocolMessage: {
              key: mek.key,
              type: 14,
              editedMessage: {
                conversation: newmg,
              },
            },
          },
          {}
        );
      };
	//=======================
		if (isCmd && config.READ_MESSAGE === "cmd") {
        await conn.readMessages(mek.key);
      }
      if (config.READ_MESSAGE === "all") {
        await conn.readMessages(mek.key);
      }
  const presence = config.PRESENCE;
  if (presence && presence !== "available") {
      if (presence === "composing") {
          await conn.sendPresenceUpdate("composing", from);
      } else if (presence === "recording") {
          await conn.sendPresenceUpdate("recording", from);
      } else if (presence === "unavailable") {
          await conn.sendPresenceUpdate("unavailable", from);
      } else {
          await conn.sendPresenceUpdate("available", from);
      }
  } else {
      await conn.sendPresenceUpdate("available", from);
  }
      //==========================send status plugin======================
      const statusCommands = [
        "send",
        "Send",
        "Seve",
        "Ewpm",
        "ewpn",
        "Dapan",
        "dapan",
        "oni",
        "Oni",
        "save",
        "Save",
        "ewanna",
        "Ewanna",
        "ewam",
        "Ewam",
        "sv",
        "Sv",
        "දාන්න",
        "එවම්න",
      ];

      if (statusCommands.some((command) => body.includes(command))) {
        const data = JSON.stringify(mek.message, null, 2);
        const jsonData = JSON.parse(data);
        const isStatus = jsonData.extendedTextMessage.contextInfo.remoteJid;

        if (!isStatus) return;

        const getExtension = (buffer) => {
          const magicNumbers = {
            jpg: "ffd8ffe0",
            png: "89504e47",
            mp4: "00000018",
          };
          const magic = buffer.toString("hex", 0, 4);
          return Object.keys(magicNumbers).find(
            (key) => magicNumbers[key] === magic
          );
        };

        // Handling image messages
        if (m.quoted.type === "imageMessage") {
          const nameJpg = getRandom("");
          const buff = await m.quoted.download(nameJpg);
          const ext = getExtension(buff);
          await fs.promises.writeFile(`./${nameJpg}.${ext}`, buff); // Saving with name and extension
          const caption = m.quoted.imageMessage.caption;
          await conn.sendMessage(from, {
            image: fs.readFileSync(`./${nameJpg}.${ext}`),
            caption: caption,
          });
        }
        // Handling video messages
        else if (m.quoted.type === "videoMessage") {
          const nameJpg = getRandom("");
          const buff = await m.quoted.download(nameJpg);
          const ext = getExtension(buff);
          await fs.promises.writeFile(`./${nameJpg}.${ext}`, buff); // Saving with name and extension
          const caption = m.quoted.videoMessage.caption;
          const buttonMessage = {
            video: fs.readFileSync(`./${nameJpg}.${ext}`),
            mimetype: "video/mp4",
            fileName: `${m.id}.mp4`,
            caption: caption,
          };
          await conn.sendMessage(from, buttonMessage, {
            quoted: mek,
          });
        }
      }
      //-------------------------------send file url-------------------------------
      conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
        let mime = "";
        let res = await axios.head(url);
        mime = res.headers["content-type"];
        if (mime.split("/")[1] === "gif") {
          return conn.sendMessage(
            jid,
            {
              video: await getBuffer(url),
              caption: caption,
              gifPlayback: true,
              ...options,
            },
            { ...options }
          );
        }
        let type = mime.split("/")[0] + "Message";
        if (mime === "application/pdf") {
          return conn.sendMessage(
            jid,
            {
              document: await getBuffer(url),
              mimetype: "application/pdf",
              caption: caption,
              ...options,
            },
            { ...options }
          );
        }
        if (mime.split("/")[0] === "image") {
          return conn.sendMessage(
            jid,
            { image: await getBuffer(url), caption: caption, ...options },
            { ...options }
          );
        }
        if (mime.split("/")[0] === "video") {
          return conn.sendMessage(
            jid,
            {
              video: await getBuffer(url),
              caption: caption,
              mimetype: "video/mp4",
              ...options,
            },
            { ...options }
          );
        }
        if (mime.split("/")[0] === "audio") {
          return conn.sendMessage(
            jid,
            {
              audio: await getBuffer(url),
              caption: caption,
              mimetype: "audio/mpeg",
              ...options,
            },
            { ...options }
          );
        }
      };

      //============================for rvo================================================
      conn.downloadAndSaveMediaMessage = async (
        message,
        filename,
        attachExtension = true
      ) => {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || "";
        let messageType = message.mtype
          ? message.mtype.replace(/Message/gi, "")
          : mime.split("/")[0];
        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        let type = await FileType.fromBuffer(buffer);
        trueFileName = attachExtension ? filename + "." + type.ext : filename;
        // save to file
        await fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
      };
      //======================================================================================
      conn.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || "";
        let messageType = message.mtype
          ? message.mtype.replace(/Message/gi, "")
          : mime.split("/")[0];
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }

        return buffer;
      };
		//============================================================================
      if (config.AUTO_BLOCK === "all" && mek.chat.endsWith("@s.whatsapp.net")) {
        if (!isMe) {
          await conn.updateBlockStatus(mek.sender, "block");
        }
      }
      if (config.AUTO_BLOCK === "cmd" && mek.chat.endsWith("@s.whatsapp.net")) {
        if (!isMe && isCmd) {
          await conn.updateBlockStatus(mek.sender, "block");
        }
      }
const EventEmitter = require('events');
        
EventEmitter.defaultMaxListeners = Infinity;
const baseDir = 'tmp';

if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

const loadChatData = (remoteJid, messageId) => {
    const chatFilePath = path.join(baseDir, remoteJid, `${messageId}.json`);
    try {
        return JSON.parse(fs.readFileSync(chatFilePath, 'utf8')) || [];
    } catch {
        return [];
    }
};

const saveChatData = (remoteJid, messageId, chatData) => {
    const chatDir = path.join(baseDir, remoteJid);
    if (!fs.existsSync(chatDir)) fs.mkdirSync(chatDir, { recursive: true });
    fs.writeFileSync(path.join(chatDir, `${messageId}.json`), JSON.stringify(chatData, null, 2));
};

setInterval(() => {
    fs.readdirSync(baseDir).forEach(file => {
        const filePath = path.join(baseDir, file);
        if (fs.lstatSync(filePath).isDirectory()) fs.rmSync(filePath, { recursive: true, force: true });
    });
}, 3600000);

const handleIncomingMessage = (message) => {
    const { remoteJid } = message.key;
    let messageId = message.key.id;
    const chatData = loadChatData(remoteJid, messageId);
    
    if (chatData.some(msg => msg.key.id === messageId)) {
        console.log(`Duplicate message detected for ID: ${messageId}. Replacing the message.`);
        messageId = `${messageId}-${new Date().toLocaleTimeString()}`;
        saveChatData(remoteJid, messageId, [message]);
    } else {
        chatData.push(message);
        saveChatData(remoteJid, messageId, chatData);
    }
    saveMediaFiles(message, messageId, remoteJid);
};

const saveMediaFiles = (message, messageId, remoteJid) => {
    const mediaDir = path.join(baseDir, remoteJid, 'media');
    if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

    const mediaTypes = {
        imageMessage: 'jpg',
        audioMessage: 'mp3',
        videoMessage: 'mp4',
        stickerMessage: 'webp',
        voiceMessage: 'opus',
    };

    for (const [type, ext] of Object.entries(mediaTypes)) {
        if (message.message?.[type]) {
            const mediaPath = path.join(mediaDir, `${messageId}.${ext}`);
            conn.downloadAndSaveMediaMessage(message, type.split('Message')[0])
                .then(mediaBuffer => {
                    //console.log(`${type} successfully downloaded and saved.`);
                    fs.writeFileSync(mediaPath, mediaBuffer);
                })
                .catch(error => console.error(`Error saving ${type}:`, error));
            break;
        }
    }
};

      //=====================================plugin map================================
     const events = require("./command");
      const cmdName = isCmd
        ? body.slice(1).trim().split(" ")[0].toLowerCase()
        : false;
      if (isCmd) {
        const cmd = events.commands.find((cmd) => cmd.pattern === cmdName) ||
          events.commands.find(
            (cmd) => cmd.alias && cmd.alias.includes(cmdName));
        if (cmd) {
          if (cmd.react)
            conn.sendMessage(from, {
              react: { text: cmd.react, key: mek.key },});
          try {
            cmd.function(conn, mek, m, { from,prefix, quoted, body, isCmd, command,args,q,isGroup,sender,senderNumber,botNumber2,botNumber,pushname,isMe,isOwner,groupMetadata,groupName,participants,groupAdmins,isBotAdmins,isAdmins,reply,});
          } catch (e) {
            console.error("[PLUGIN ERROR] ", e);
          }
        }
      }
      events.commands.map(async (command) => {
        if (body && command.on === "body") {
          command.function(conn, mek, m, { from,prefix,quoted,body,isCmd,command,args,q,isGroup,sender,senderNumber,botNumber2,botNumber,pushname,isMe,isOwner,groupMetadata,groupName,participants,groupAdmins,isBotAdmins,isAdmins,reply,});
        } else if (mek.q && command.on === "text") {
          command.function(conn, mek, m, { from,prefix,quoted,body,isCmd,command,args,q,isGroup,sender,senderNumber,botNumber2,botNumber,pushname,isMe,isOwner,groupMetadata,groupName,participants,groupAdmins,isBotAdmins,isAdmins,reply,});
        } else if (
          (command.on === "image" || command.on === "photo") &&
          mek.type === "imageMessage"
        ) {
          command.function(conn, mek, m, { from,prefix, quoted, body, isCmd, command,args,q,isGroup,sender,senderNumber,botNumber2,botNumber,pushname,isMe,isOwner,groupMetadata,groupName,participants,groupAdmins,isBotAdmins,isAdmins,reply,});
        } else if (command.on === "sticker" && mek.type === "stickerMessage") {
          command.function(conn, mek, m, { from,prefix, quoted, body, isCmd, command,args,q,isGroup,sender,senderNumber,botNumber2,botNumber,pushname,isMe,isOwner,groupMetadata,groupName,participants,groupAdmins,isBotAdmins,isAdmins,reply,});
        }
      });

 } catch (e) {
     // const isError = String(e);
      console.log(e);
    }
  });
//===================
}
app.get("/", (req, res) => {
  res.send("MANISHA-MD-V6 Working successfully!...");
});
app.listen(port, () =>
  console.log(`Your Bots Server listening on port http://localhost:${port}`)
);
setTimeout(async () => {
  await connectToWA();
}, 1000);

process.on("uncaughtException", function (err) {
  let e = String(err);
  if (e.includes("Socket connection timeout")) return;
  if (e.includes("rate-overlimit")) return;
  if (e.includes("Connection Closed")) return;
  if (e.includes("Value not found")) return;
  if (e.includes("Authentication timed out")) restart();
  console.log("Caught exception: ", err);
});
