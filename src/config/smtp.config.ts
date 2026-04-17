export interface ISMTPConfig {
  host: string;
  port: string;
  user: string;
  password: string;
}

export const config: ISMTPConfig = {
  host: process.env.SMTP_HOST || 'mailpit',
  port: process.env.SMTP_PORT || '1025',
  user: process.env.SMTP_USER || 'noreply@patchcord.org',
  password: process.env.SMTP_PASS || 'change-me',
};

export default config;
