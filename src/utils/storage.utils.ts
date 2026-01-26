export const StoragePaths = {
  userAvatar: (userId: string, hash: string) => `avatars/${userId}/${hash}`,
  serverIcon: (serverId: string, hash: string) => `icons/${serverId}/${hash}`,
  channelIcon: (channelId: string, hash: string) => `channels/${channelId}/icons/${hash}`,
  defaultUserAvatar: (userId: number) => `embed/avatars/${userId}.png`,
  attachment: (channelId: string, attachmentId: string, filename: string) =>
    `attachments/${channelId}/${attachmentId}/${filename}`,
};
