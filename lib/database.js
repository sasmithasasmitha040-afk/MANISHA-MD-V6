const fs = require("fs");
const path = require("path");
const config = require("../config");

// Base database folder
const basePath = path.join(__dirname, "database");

// Ensure base folder exists
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath);
}

// Helper: ensure folder exists
function ensureFolder(folder) {
  const folderPath = path.join(basePath, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

// Helper: read JSON
function readJSON(folder, file, defaultData = []) {
  ensureFolder(folder);
  const filePath = path.join(basePath, folder, file);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Helper: write JSON
function writeJSON(folder, file, data) {
  ensureFolder(folder);
  const filePath = path.join(basePath, folder, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// =========================================
// CMD STORE FUNCTIONS
// =========================================

async function updateCMDStore(MsgID, CmdID) {
  try {
    let olds = readJSON("Non-Btn", "data.json", []);
    olds.push({ [MsgID]: CmdID });
    writeJSON("Non-Btn", "data.json", olds);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function isbtnID(MsgID) {
  try {
    let olds = readJSON("Non-Btn", "data.json", []);
    return olds.some((item) => item[MsgID]);
  } catch {
    return false;
  }
}

async function getCMDStore(MsgID) {
  try {
    let olds = readJSON("Non-Btn", "data.json", []);
    for (const item of olds) {
      if (item[MsgID]) {
        return item[MsgID];
      }
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

function getCmdForCmdId(CMD_ID_MAP, cmdId) {
  const result = CMD_ID_MAP.find((entry) => entry.cmdId === cmdId);
  return result ? result.cmd : null;
}

// =========================================
// DATABASE CONNECT
// =========================================

async function connectdb() {
  const defaultSettings = {
    PREFIX: ".",
    BOT_IMAGE: "https://i.ibb.co/S4Cf2kZg/IMG-0773.png",
    OWNER: "94759934522",
    AUTO_READ_STATUS: "false",
    PRESENCE: "composing",
    WORK_TYPE: "public",
    AUTO_BLOCK: "off",
    WELCOME: "true",
    GOODBYE: "true",
    ADMIN_EVENTS: "true",
  };

  readJSON("settings", "settings.json", defaultSettings);
  readJSON("Non-Btn", "data.json", []);

  console.log("Local Database connected ✅");
}

// =========================================
// SETTINGS UPDATE
// =========================================

async function input(setting, data) {
  let settings = readJSON("settings", "settings.json", {});

  if (!(setting in settings)) {
    console.warn(`Setting "${setting}" not found.`);
    return false;
  }

  settings[setting] = data;
  config[setting] = data;

  writeJSON("settings", "settings.json", settings);
  return true;
}

async function get(setting) {
  let settings = readJSON("settings", "settings.json", {});
  return settings[setting] ?? null;
}

// =========================================
// UPDATE CONFIG FROM DB
// =========================================

async function updb() {
  let settings = readJSON("settings", "settings.json", {});

  Object.keys(settings).forEach((key) => {
    config[key] = settings[key];
  });

  console.log("Database synced to config ✅");
}

// =========================================
// RESET DATABASE
// =========================================

async function updfb() {
  const defaultSettings = {
    PREFIX: ".",
    BOT_IMAGE: "https://i.ibb.co/S4Cf2kZg/IMG-0773.png",
    OWNER: "94759934522",
    AUTO_READ_STATUS: "false",
    PRESENCE: "composing",
    WORK_TYPE: "public",
    AUTO_BLOCK: "off",
    WELCOME: "true",
    GOODBYE: "true",
    ADMIN_EVENTS: "true",
};

  writeJSON("settings", "settings.json", defaultSettings);
  writeJSON("Non-Btn", "data.json", []);

  Object.assign(config, defaultSettings);

  console.log("Database reset ✅");
}

// =========================================
// RESET BUTTON STORE
// =========================================

async function upresbtn() {
  writeJSON("Non-Btn", "data.json", []);
}

// =========================================

module.exports = {
  updateCMDStore,
  isbtnID,
  getCMDStore,
  getCmdForCmdId,
  connectdb,
  input,
  get,
  updb,
  updfb,
  upresbtn,
};
