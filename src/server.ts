import app from '@/app';
import config from '@/config/config';

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});