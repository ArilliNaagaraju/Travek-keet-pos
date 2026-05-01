require("../config/config");
const { google } = require("googleapis");

function getServiceAccount() {
  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!rawJson) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is missing.");
  }

  try {
    return JSON.parse(rawJson);
  } catch (error) {
    throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_JSON.");
  }
}

function getDriveClient() {
  const credentials = getServiceAccount();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return google.drive({ version: "v3", auth });
}

async function uploadBufferToDrive({ buffer, mimeType, originalName }) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID is missing.");
  }

  const drive = getDriveClient();
  const uniqueName = `${Date.now()}_${originalName || "file"}`;

  const createResponse = await drive.files.create({
    requestBody: {
      name: uniqueName,
      parents: [folderId],
    },
    media: {
      mimeType: mimeType || "application/octet-stream",
      body: Buffer.from(buffer),
    },
    fields: "id,name,mimeType,size,webViewLink,webContentLink",
  });

  const fileId = createResponse.data.id;

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return {
    fileId,
    name: createResponse.data.name,
    mimeType: createResponse.data.mimeType,
    size: createResponse.data.size,
    webViewLink: createResponse.data.webViewLink,
    webContentLink: createResponse.data.webContentLink,
    publicUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
  };
}

module.exports = { uploadBufferToDrive };
