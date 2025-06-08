import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv('mock', process.cwd(), '');
  const processEnvValues = {
    'process.env': Object.entries(env).reduce((prev, [key, val]) => {
      return {
        ...prev,
        [key]: val,
      };
    }, {}),
  };

  return {
    server: {
      host: '0.0.0.0',
      port: 5177,
      hmr: {
        overlay: false,
      },
    },
    build: {
      target: 'es2020', // Update the target to es2020 or later
      chunkSizeWarningLimit: 10000,
      commonjsOptions: {
        include: ["tailwind.config.js", "node_modules/**"],
      },
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
          }
          warn(warning);
        },
      },
    },
    preview: {
      port: 8080,
    },
    optimizeDeps: {
      include: ["tailwind-config"],
    },
    plugins: [react()],
    define: processEnvValues,
    resolve: {
      alias: {
        "tailwind-config": path.resolve(__dirname, "./tailwind.config.js"),
      },
    },
  };
});