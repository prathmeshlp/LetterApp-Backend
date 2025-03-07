import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { IUser } from '../models/User';

export const getDriveClient = async (user: IUser): Promise<OAuth2Client> => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://letterappbackend.vercel.app/auth/google/callback',
    
    
  );
  oauth2Client.setCredentials({
    refresh_token: user.refreshToken
  });

  // // Ensure token is refreshed if expired
  // oauth2Client.on('tokens', (tokens) => {
  //   if (tokens.refresh_token) {
  //     user.refreshToken = tokens.refresh_token;
  //     user.save().catch(err => console.error('Failed to update refresh token:', err));
  //   }
  //   console.log('Refreshed Access Token:', tokens.access_token);
  // });

  // Force a refresh to ensure we have a valid access token
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    console.log('Manually Refreshed Token:', credentials);
  } catch (err) {
    console.error('Token Refresh Error:', err);
    throw err;
  }
  return oauth2Client;
};




export const saveLetterToDrive = async (user: IUser, title: string, content: string): Promise<string> => {
  try {
    const auth = await getDriveClient(user); 
    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
      name: title,
      mimeType: 'application/vnd.google-apps.document'
    };
    const media = {
      mimeType: 'text/html',
      body: content
    };
    console.log('Saving to Drive as Google Doc with:', { fileMetadata, media });
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id'
    });
    console.log('Drive response:', file.data);
    if (!file.data.id) {
      throw new Error('No file ID returned from Drive');
    }
    return file.data.id;
  } catch (err) {
    console.error('Drive API Error:', err);
    throw err;
  }
};

export const getLetterFromDrive = async (user: IUser, fileId: string): Promise<string> => {
  try {
    const auth = await getDriveClient(user); 
    const drive = google.drive({ version: 'v3', auth });
    const response = await drive.files.export({
      fileId,
      mimeType: 'text/html'
    });
    return response.data as string;
  } catch (err) {
    console.error('Drive Fetch Error:', err);
    throw err;
  }
};