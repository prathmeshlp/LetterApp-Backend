import { google } from "googleapis";

export const saveToGoogleDrive = async (accessToken: string, content: string) => {
  const drive = google.drive({ version: "v3", auth: accessToken });
  const fileMetadata = {
    name: "Letter.docx",
    mimeType: "application/vnd.google-apps.document",
  };
  const media = {
    mimeType: "text/plain",
    body: content,
  };
  const res = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id",
  });
  return res.data.id;
};