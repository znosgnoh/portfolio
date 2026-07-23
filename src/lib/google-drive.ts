import { google } from 'googleapis';

function getAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  return auth;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webContentLink?: string;
  thumbnailLink?: string;
  imageMediaMetadata?: {
    width?: number;
    height?: number;
    time?: string;
  };
}

export interface DriveFolder {
  id: string;
  name: string;
}

function getDrive() {
  return google.drive({ version: 'v3', auth: getAuth() });
}

/** List immediate child folders under a Drive folder (not trashed). */
export async function listChildFolders(rootFolderId: string): Promise<DriveFolder[]> {
  const drive = getDrive();
  const folders: DriveFolder[] = [];
  let pageToken: string | undefined;

  do {
    const res = await drive.files.list({
      q: `'${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'nextPageToken, files(id, name)',
      pageSize: 100,
      pageToken,
      orderBy: 'name',
    });

    for (const file of res.data.files || []) {
      if (file.id && file.name) {
        folders.push({ id: file.id, name: file.name });
      }
    }

    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);

  return folders;
}

/** List image files in a folder, paginating past the first 100. */
export async function listFilesInFolder(folderId: string): Promise<DriveFile[]> {
  const drive = getDrive();
  const files: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields:
        'nextPageToken, files(id, name, mimeType, webContentLink, thumbnailLink, imageMediaMetadata)',
      pageSize: 100,
      pageToken,
      orderBy: 'createdTime desc',
    });

    for (const file of res.data.files || []) {
      if (!file.id) continue;
      files.push({
        id: file.id,
        name: file.name || 'untitled',
        mimeType: file.mimeType || 'image/jpeg',
        webContentLink: file.webContentLink || undefined,
        thumbnailLink: file.thumbnailLink || undefined,
        imageMediaMetadata: file.imageMediaMetadata
          ? {
              width: file.imageMediaMetadata.width ?? undefined,
              height: file.imageMediaMetadata.height ?? undefined,
              time: file.imageMediaMetadata.time ?? undefined,
            }
          : undefined,
      });
    }

    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);

  return files;
}

/** Stable view URL for Drive-hosted images (works with next/image remotePatterns). */
export async function getFileUrl(fileId: string): Promise<string> {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export function driveViewUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}
