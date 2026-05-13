const { cmd } = require('../command');
const SubzLK = require("subz.lk");
const { fetchJson } = require('../lib/functions')
const Seedr = require("seedr")

//================ MOVIE SEARCH ================

cmd({
pattern: "ytsmx",
react: "🎬",
alias: ["yts"],
category: "movie",
use: ".ytsmx <movie name>",
filename: __filename
},
async(conn, mek, m,{from, prefix, q, reply}) => {

try{

if(!q) return reply("*❗ Give movie name*")

const data = await fetchJson(`https://api-dark-shan-yt.koyeb.app/movie/ytsmx-search?q=${q}&apikey=82d73cfc7453a625`)

if(!data.status) return reply("*Movie not found ❌*")

const rows = data.data.map(v => ({
buttonId: `${prefix}dmovie ${v.link}`,
buttonText: { displayText: `${v.title} (${v.year})` },
type: 1
}))

const buttonMessage = {
text: `🎬 *MOVIE SEARCH RESULTS*\n\n🔎 Query : ${q}\n\nSelect movie ⬇`,
footer: "> Powered By Manaofc",
buttons: rows,
headerType: 4
}

await conn.buttonMessage(from, buttonMessage, mek)

}catch(e){
console.log(e)
reply("❌ Error")
}

})


//================ MOVIE DOWNLOAD OPTIONS ================

cmd({
pattern: "dmovie",
react: "📥",
dontAddCommandList: true,
filename: __filename
},
async(conn, mek, m,{from, prefix, q, reply}) => {

try{

if(!q) return reply("*Movie url needed ❗*")

const data = await fetchJson(`https://api-dark-shan-yt.koyeb.app/movie/ytsmx-download?url=${encodeURIComponent(q)}&apikey=82d73cfc7453a625`)

if(!data.status) return reply("*Download error ❌*")

let movie = data.data

let caption = `🎬 *${movie.title}*

⭐ Rating : ${movie.rating}
📅 Year : ${movie.year}

Select quality ⬇
`

const rows = movie.downloads.map(v => ({
buttonId: `${prefix}seeder ${v.magnet}`,
buttonText: { displayText: `${v.quality} | ${v.size}` },
type: 1
}))

const buttonMessage = {
image: movie.image,
caption: caption,
footer: "> Powered By Manaofc",
buttons: rows,
headerType: 4
}

await conn.buttonMessage(from, buttonMessage, mek)

}catch(e){
console.log(e)
reply("❌ Error")
}

})


//================ SEEDER TORRENT DOWNLOAD ================

cmd({
pattern: "seeder",
react: "⬆",
dontAddCommandList: true,
filename: __filename
},
async(conn, mek, m,{from, q, reply}) => {

try{

if(!q) return reply("*Magnet link needed ❗*")

var seedr = new Seedr()

await seedr.login("vajirarathnayaka891@gmail.com","vajirarathnayaka891@")

await conn.sendMessage(from,{text:"📥 Uploading magnet file..."},{quoted:mek})

const magnet = await seedr.addMagnet(q)

if(magnet.code === 400 || magnet.result !== true){
return reply("❌ Magnet upload failed")
}

await conn.sendMessage(from,{text:"✅ Magnet uploaded. Waiting download..."},{quoted:mek})

var contents = []

do{
contents = await seedr.getVideos()
}while(contents.length === 0)

var file = await seedr.getFile(contents[0][0].id)
var folder_id = contents[0][0].fid

const link = file.url

await conn.sendMessage(from,{
document:{url:link},
mimetype:"video/mp4",
fileName:file.name,
caption:`🎬 ${file.name}`
},{quoted:mek})

await seedr.deleteFolder(folder_id)

await conn.sendMessage(from,{text:"✅ Movie sent successfully"},{quoted:mek})

}catch(e){
console.log(e)
reply(`❌ Error\n${e}`)
}

})


cmd({
    pattern: "subz",
    react: "🎬",
    desc: "Search Sinhala subtitles",
    category: "movie",
    use: ".subz <movie name>",
    filename: __filename
}, async (conn, mek, m, { from, q, prefix, reply }) => {

    try {

        if (!q) return reply("❗ Please enter a Movie name!.\nExample: .subz jurassic");

        reply("⏳ *Searching subtitles...*");

        const data = await SubzLK.search(q);

        if (!data.length) return reply("❌ Subtitle not found!");

        const rows = data.slice(0, 10).map((v) => ({
            buttonId: `${prefix}subzdl ${v.url}`,
            buttonText: {
                displayText: v.title.length > 40
                    ? v.title.slice(0, 37) + "..."
                    : v.title
            },
            type: 1,
        }));

        const buttonMessage = {
            text: "🎬 *Select Your Movie Subtitle*\n\nResults:",
            footer: "> _Powered By Manaofc_",
            buttons: rows,
            headerType: 1
        };

        await conn.buttonMessage(from, buttonMessage, mek);

    } catch (e) {
        console.log(e);
        reply("❌ Error searching subtitles!");
    }
});

cmd({
    pattern: "subzdl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {

    try {

        if (!q) return reply("❌ Invalid subtitle link!");

        const movie = await SubzLK.getMovie(q);

        const subLink = movie.downloads.subtitle;

        await conn.sendMessage(
            from,
            {
                document: { url: subLink },
                mimetype: "application/zip",
                fileName: `${movie.title}.zip`,
                caption:
`🎬 *${movie.title}*

👤 Author : ${movie.author}
📅 ${movie.publishDate}

> _*Powered By Manaofc*_`
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply("❌ Subtitle download failed!");
    }
});
