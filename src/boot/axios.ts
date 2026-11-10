import { defineBoot } from '#q-app';
import apiClient from 'src/services/api';

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = apiClient;
  app.config.globalProperties.$api = apiClient;
});

export { apiClient };
