# Git LFS 使用指南

## 一、大文件处理策略

```typescript
const largeFiles = {
  // 需要用 Git LFS 管理的文件类型
  lfsFiles: [
    '*.wasm',        // WebAssembly 文件
    '*.onnx',        // ONNX 模型文件
    '*.bin',         // 二进制文件
    '*.mp3',         // 音频文件
    '*.wav',         // 音频文件
    '*.model'        // 模型文件
  ],

  // 不需要版本控制的文件
  ignoreFiles: [
    'node_modules/',
    '.env',
    'dist/',
    '.next/',
    '*.log'
  ]
}
```

## 二、Git LFS 设置步骤

```bash
# 1. 安装 Git LFS
brew install git-lfs   # macOS
# 或
apt-get install git-lfs   # Ubuntu
# 或
windows: 下载 Git LFS windows installer

# 2. 设置 Git LFS
git lfs install

# 3. 跟踪大文件
git lfs track "*.wasm"
git lfs track "*.onnx"
git lfs track "*.model"

# 4. 确保 .gitattributes 被提交
git add .gitattributes
git commit -m "build: configure git lfs"

# 5. 正常添加和提交文件
git add .
git commit -m "feat: add model files"
git push origin main
```

## 三、项目结构建议

```typescript
const projectStructure = {
  // 模型文件存储
  models: {
    location: '/public/models/',
    strategy: 'Git LFS',
    files: [
      'whisper.wasm',
      'vad.onnx'
    ]
  },

  // 静态资源
  assets: {
    location: '/public/assets/',
    strategy: 'Git常规版本控制',
    files: [
      'images/',
      'icons/'
    ]
  },

  // 开发资源
  dev: {
    location: '/dev-assets/',
    strategy: 'Git忽略',
    files: [
      'test-audio/',
      'temp-models/'
    ]
  }
}
```

## 四、.gitignore 配置

```bash
# 依赖
node_modules/
.pnpm-store/

# 构建输出
.next/
dist/
build/

# 环境变量
.env
.env.local
.env.*.local

# 开发工具
.vscode/
.idea/
*.swp
*.swo

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# 测试覆盖率
coverage/

# 临时文件
.DS_Store
Thumbs.db
*.tmp
*.temp

# 开发资源
dev-assets/
test-audio/
temp-models/
```

## 五、CI/CD 注意事项

```typescript
const cicdConsiderations = {
  // Git LFS 配置
  gitLFS: {
    vercel: {
      // Vercel 自动支持 Git LFS
      notes: '无需额外配置'
    },
    github: {
      actions: {
        setup: `
          - uses: actions/checkout@v2
            with:
              lfs: true
        `
      }
    }
  },

  // 部署优化
  deployment: {
    caching: '配置 CDN 缓存大文件',
    preload: '关键模型预加载',
    fallback: '准备降级方案'
  }
}
```

## 六、最佳实践

```typescript
const bestPractices = {
  // 文件管理
  fileManagement: [
    '定期清理未使用的大文件',
    '压缩模型文件',
    '使用CDN分发大文件'
  ],

  // 版本控制
  versionControl: [
    '合理使用标签管理版本',
    '主要版本更新才更新模型',
    '保持模型文件命名规范'
  ],

  // 协作建议
  collaboration: [
    '在README中说明LFS依赖',
    '记录模型文件的更新日志',
    '建立模型文件的管理规范'
  ]
}
``` 