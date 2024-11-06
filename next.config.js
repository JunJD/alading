
import CopyPlugin from "copy-webpack-plugin";

const nextConfig = {
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

    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });

    return config;
  },
  // 添加 WebSocket 支持
  async rewrites() {
    return [
      {
        source: '/api/realtime',
        destination: '/api/realtime',
        has: [
          {
            type: 'header',
            key: 'upgrade',
            value: 'websocket',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
