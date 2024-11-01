
import type { NextConfig } from 'next';
import CopyPlugin from "copy-webpack-plugin";

const nextConfig: NextConfig = {
  webpack: (config) => {
    if (!config.plugins) {
      config.plugins = [];
    }

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "./node_modules/onnxruntime-web/dist/*.wasm",
            to: "public/[name][ext]",
          },
          {
            from: "node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
            to: "public/[name][ext]",
          },
          {
            from: "node_modules/@ricky0123/vad-web/dist/silero_vad.onnx",
            to: "public/[name][ext]",
          },
        ],
      })
    );

    return config;
  },
};

export default nextConfig;
