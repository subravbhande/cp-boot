import {
DisconnectReason,
useMultiFileAuthState,
makeWASocket,
fetchLatestBaileysVersion,
makeCacheableSignalKeyStore
} from "@whiskeysockets/baileys";

import { fetchData } from "./getContestDetails.js";
import { IDS } from "./ids.js";
import pino from "pino";
import QRCode from "qrcode";
import config from "./config.js";
import { messageAdmin, sleep } from "./utility.js";
import NodeCache from "node-cache";
import https from "https";

const logger = pino({ level: "error" });

export const groupCache = new NodeCache({
stdTTL: 5 * 60,
useClones: false
});

async function connectionLogic(functionToExecute) {

try {


const { state, saveCreds } = await useMultiFileAuthState(
  config.paths.authInfo
);

const { version } = await fetchLatestBaileysVersion();

const sock = makeWASocket({
  version,
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, logger)
  },
  logger,
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  cachedGroupMetadata: async (jid) => groupCache.get(jid),
  options: {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  },
  syncFullHistory: true
});

sock.ev.on("connection.update", async (update) => {

  const { connection, lastDisconnect, qr, receivedPendingNotifications } = update;

  if (qr) {
    await QRCode.toFile(config.paths.qrCodeFile, qr);
    console.log("QR Code saved to: " + config.paths.qrCodeFile);
  }

  if (connection === "close") {

    const statusCode = lastDisconnect?.error?.output?.statusCode;

    console.log("Connection closed.");

    if (statusCode === DisconnectReason.loggedOut) {

      console.log("Logged out. Please re-authenticate.");
      await messageAdmin(sock, "Logged out. Please re-authenticate.");

    } else if (
      statusCode === DisconnectReason.connectionClosed ||
      statusCode === DisconnectReason.connectionLost
    ) {

      console.log("Connection lost. Reconnecting...");
      connectionLogic(functionToExecute);

    } else if (statusCode === DisconnectReason.connectionReplaced) {

      console.log("Connection replaced. Restarting required.");
      await messageAdmin(sock, "Connection replaced. Restart bot.");

    } else if (statusCode === DisconnectReason.restartRequired) {

      console.log("Restart required. Restarting...");
      connectionLogic(functionToExecute);

    } else if (statusCode === DisconnectReason.timedOut) {

      console.log("Connection timed out. Reconnecting...");
      connectionLogic(functionToExecute);

    } else {

      console.log("Unknown disconnection. Reconnecting...");
      connectionLogic(functionToExecute);

    }

  } else if (connection === "open") {

    console.log("Connected!");

    if (typeof functionToExecute === "function") {
      await functionToExecute(sock);
    } else {
      console.log("Socket ready. No function to execute.");
    }

  }

  if (receivedPendingNotifications) {
    console.log("Waiting for new messages...");
  }

});

sock.ev.on("messaging-history.set", ({ chats, contacts, messages }) => {

  console.log(
    `Received ${chats.length} chats, ${contacts.length} contacts, ${messages.length} messages`
  );

});

sock.ev.on("messages.upsert", async ({ type, messages }) => {

  if (!messages) return;

  console.log(`Received ${messages.length} new messages of type: ${type}`);

  for (const message of messages) {

    const jid = message.key?.remoteJid;

    if (jid === "status@broadcast") {
      console.log(`Received status from ${message.pushName || "unknown"}`);
    }

    if (jid && jid.endsWith("@g.us")) {
      console.log("Group message detected → Group ID:", jid);
    }

  }

});

sock.ev.on("creds.update", saveCreds);

sock.ev.on("lid-mapping.update", (update) => {
  console.log("LID mapping updated:", update);
});


} catch (error) {

console.error("Error in connection logic:", error);


}

}

async function moveFurther(sock) {

try {


const payload = await fetchData(sock);
const ids = IDS;

for (const id of ids) {

  if (id.endsWith("@g.us")) {

    const metadata = await sock.groupMetadata(id);
    groupCache.set(id, metadata);

  }

}

if (payload && payload.length > 0) {

  let successCount = 0;

  for (const id of ids) {

    try {

      const isGroup = id.endsWith("@g.us");
      const groupInfo = isGroup ? groupCache.get(id) : null;

      await sock.sendMessage(id, { text: payload });

      if (sleep) await sleep(10000);

      if (isGroup && groupInfo) {
        console.log(`Message sent to group: ${groupInfo.subject}`);
      } else {
        console.log(`Message sent to: ${id}`);
      }

      successCount++;

    } catch (error) {

      console.error(`Failed to send message to: ${id}`, error);

    }

  }

  if (successCount > 0) {

    console.log(`Contest updates sent successfully to ${successCount} recipients.`);

  } else {

    await messageAdmin(sock, "Failed to send messages to any recipients.");

  }

} else {

  console.log("No contests to notify about.");
  await messageAdmin(sock, "No contests found.");

}


} catch (error) {


await messageAdmin(sock, `Error in app.js: ${error.message}`);


}

}

export { connectionLogic, moveFurther };
