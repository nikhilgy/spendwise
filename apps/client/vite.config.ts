import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@types': path.resolve(__dirname, './src/types'),
          '@components': path.resolve(__dirname, './src/components'),
          '@pages': path.resolve(__dirname, './src/pages'),
          '@hooks': path.resolve(__dirname, './src/hooks'),
          '@services': path.resolve(__dirname, './src/services'),
          '@assets': path.resolve(__dirname, './src/assets'),
          '@shared-types': path.resolve(__dirname, '../../../packages/types'),
        }
      }
    };
});
