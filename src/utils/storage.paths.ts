export const StoragePaths = {
  userAvatar: (userId: string, hash: string) => `avatars/${userId}/${hash}`,
  serverIcon: (serverId: string, hash: string) => `icons/${serverId}/${hash}`,  
};