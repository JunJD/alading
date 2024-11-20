# 技术学习记录

## 语音技术栈

### Azure TTS (文本转语音)

```typescript
const azureTTS = {
  // 基础配置
  setup: {
    申请步骤: [
      '1. 注册Azure账号',
      '2. 创建Speech Service资源',
      '3. 获取密钥和区域信息'
    ],
    价格: '免费层每月50万字符',
    文档: 'https://learn.microsoft.com/zh-cn/azure/cognitive-services/speech-service/'
  },
  
  // 代码示例
  implementation: {
    nodejs: `
      const sdk = require('microsoft-cognitiveservices-speech-sdk');
      
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env.AZURE_TTS_KEY,
        process.env.AZURE_REGION
      );
      
      // 设置音色
      speechConfig.speechSynthesisVoiceName = "zh-CN-XiaoxiaoNeural";
      
      // 创建合成器
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
      
      // 合成音频
      synthesizer.speakTextAsync(
        text,
        result => {
          const { audioData } = result;
          // 处理音频数据...
        },
        error => console.log(error)
      );
    `
  },

  // 优化建议
  optimization: [
    '使用SSML控制语音效果',
    '实现音频缓存机制',
    '批量合成时使用队列'
  ]
}
```

### Whisper (语音识别)

```typescript
const whisperComparison = {
  // API版本
  api: {
    优点: [
      '无需部署维护',
      '稳定性好',
      '自动扩展'
    ],
    缺点: [
      '延迟较高(1-2s)',
      '成本较高',
      '依赖网络'
    ],
    适用场景: '用户量小，对延迟要求不高时'
  },

  // 本地版本
  local: {
    优点: [
      '延迟低(200-500ms)',
      '无需联网',
      '成本低'
    ],
    缺点: [
      '部署复杂',
      '资源占用大',
      '需要优化'
    ],
    适用场景: '用户量大，需要低延迟时',
    
    // 本地部署方案
    deployment: {
      方案1: 'whisper.cpp + WebAssembly',
      方案2: 'onnx模型 + onnxruntime-web',
      推荐: '方案1 (体积小、性能好)'
    }
  }
}
```

### VAD (语音活动检测)

```typescript
const vadImplementation = {
  // Silero VAD
  sileroVAD: {
    介绍: '轻量级、准确率高的语音检测模型',
    部署方式: [
      {
        方案: 'ONNX + Web Worker',
        代码: `
          // 1. 加载模型
          const session = await ort.InferenceSession.create('silero_vad.onnx');
          
          // 2. 处理音频
          const tensor = new ort.Tensor('float32', audioData, [1, audioLength]);
          const feeds = { input: tensor };
          
          // 3. 推理
          const result = await session.run(feeds);
          const prediction = result.output.data;
        `,
        优点: '浏览器原生支持，性能好'
      },
      {
        方案: 'WebAssembly',
        说明: '可以将模型编译为wasm以获得更好性能'
      }
    ],
    优化建议: [
      '使用Web Worker避免阻塞主线程',
      '实现音频数据缓冲队列',
      '调整检测阈值平衡准确率和延迟'
    ]
  }
}
```

## 数据库相关

### PostgreSQL 工具

```typescript
const postgresqlTools = {
  // pgAdmin
  pgAdmin: {
    介绍: 'PostgreSQL官方推荐的GUI管理工具',
    功能: [
      'SQL查询编辑器',
      '数据库监控',
      '用户权限管理',
      '备份还原'
    ],
    安装: {
      docker: 'docker pull dpage/pgadmin4',
      desktop: 'https://www.pgadmin.org/download/'
    }
  },

  // 其他工具推荐
  alternatives: {
    DBeaver: {
      特点: '免费开源，支持多种数据库',
      推荐指数: '⭐⭐⭐⭐'
    },
    DataGrip: {
      特点: 'JetBrains出品，功能强大',
      推荐指数: '⭐⭐⭐⭐⭐'
    },
    Prisma Studio: {
      特点: '与Prisma集成，界面简洁',
      推荐指数: '⭐⭐⭐⭐'
    }
  }
}
```

### Prisma 使用笔记

```typescript
const prismaLearning = {
  // 基础设置
  setup: [
    'pnpm add prisma -D',
    'pnpm add @prisma/client',
    'npx prisma init'
  ],

  // 常用命令
  commands: {
    'prisma generate': '生成客户端',
    'prisma db push': '同步数据库架构',
    'prisma migrate dev': '创建迁移',
    'prisma studio': '启动数据库GUI'
  },

  // 模型示例
  schema: `
    model User {
      id        String   @id @default(uuid())
      email     String   @unique
      name      String?
      interviews Interview[]
      createdAt DateTime @default(now())
    }

    model Interview {
      id        String   @id @default(uuid())
      userId    String
      user      User     @relation(fields: [userId], references: [id])
      status    Status   @default(PENDING)
      createdAt DateTime @default(now())
    }
  `,

  // 查询示例
  queries: `
    // 创建用户
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User'
      }
    })

    // 关联查询
    const interviews = await prisma.interview.findMany({
      where: { userId: user.id },
      include: { user: true }
    })
  `
}
```

## 学习资源

```typescript
const resources = {
  文档: {
    'Azure TTS': 'https://learn.microsoft.com/zh-cn/azure/cognitive-services/speech-service/',
    'Whisper': 'https://github.com/openai/whisper',
    'Prisma': 'https://www.prisma.io/docs',
    'PostgreSQL': 'https://www.postgresql.org/docs/'
  },
  
  教程: {
    'Whisper WebAssembly': 'https://github.com/ggerganov/whisper.cpp',
    'Silero VAD': 'https://github.com/snakers4/silero-vad',
    'Prisma入门': 'https://www.prisma.io/learn'
  },
  
  示例项目: {
    'Azure TTS Demo': 'github-link-here',
    'Whisper Web': 'github-link-here',
    'Prisma Examples': 'github-link-here'
  }
}
```

## 待解决问题

```typescript
const todos = [
  'Azure TTS音频流式传输优化',
  'Whisper本地部署性能调优',
  'VAD误判问题处理',
  'PostgreSQL索引优化',
  'Prisma关联查询N+1问题'
]
```

## 笔记更新记录

```typescript
const updateLog = [
  {
    date: '2024-03-xx',
    content: '创建文档'
  }
  // 后续更新...
]
```

### Whisper 本地部署详解

```typescript
const whisperLocal = {
  // 方案对比
  solutions: {
    // 方案1: Whisper.cpp + WebAssembly
    whisperCppWasm: {
      优点: [
        '模型体积小 (约100MB)',
        '加载速度快',
        '内存占用低',
        '推理速度快'
      ],
      缺点: [
        '精度略低于原始模型',
        '需要编译为WASM'
      ],
      实现步骤: [
        '1. 使用 whisper.cpp 编译 WASM',
        '2. 加载 WASM 到 Web Worker',
        '3. 实现音频数据传输',
        '4. 处理识别结果'
      ]
    },

    // 方案2: ONNX + onnxruntime-web
    onnxWeb: {
      优点: [
        '与原始模型精度一致',
        '部署相对简单',
        'ONNX生态支持好'
      ],
      缺点: [
        '模型体积大 (约1GB)',
        '加载时间长',
        '内存占用大'
      ],
      实现步骤: [
        '1. 转换模型为ONNX格式',
        '2. 使用CDN加载模型',
        '3. Web Worker中运行'
      ]
    }
  },

  // 推荐实现方案
  recommendation: {
    方案: 'Whisper.cpp + WASM',
    原因: [
      '用户体验更好（加载快）',
      '资源占用更少',
      '精度损失可接受'
    ],
    
    // 具体实现
    implementation: {
      // 1. 模型加载
      modelLoading: `
        // 在 Web Worker 中
        let whisper;
        
        self.onmessage = async (e) => {
          if (e.data.type === 'load') {
            // 加载 WASM 模型
            whisper = await WhisperModule.load('whisper-model.wasm');
            self.postMessage({ type: 'loaded' });
          }
        };
      `,

      // 2. 音频处理
      audioProcessing: `
        // 主线程
        const processAudio = async (audioData) => {
          // 转换音频格式
          const pcmData = await convertToWavPCM(audioData);
          
          // 发送到 Worker
          worker.postMessage({
            type: 'process',
            audio: pcmData
          });
        };
      `,

      // 3. 结果处理
      resultHandling: `
        // Web Worker 中
        self.onmessage = async (e) => {
          if (e.data.type === 'process') {
            const result = await whisper.transcribe(e.data.audio);
            self.postMessage({
              type: 'result',
              text: result.text
            });
          }
        };
      `
    },

    // 性能优化
    optimization: {
      加载优化: [
        '使用 Service Worker 缓存WASM文件',
        '实现进度提示',
        '后台预加载'
      ],
      运行优化: [
        '使用 SharedArrayBuffer 减少数据拷贝',
        '音频数据分片处理',
        '结果流式返回'
      ],
      内存优化: [
        '及时释放音频数据',
        '控制并发处理数量',
        '定期清理缓存'
      ]
    }
  },

  // 部署示例
  deployment: {
    // 项目结构
    structure: `
      src/
        lib/
          whisper/
            worker.ts      # Web Worker 实现
            loader.ts      # 模型加载器
            processor.ts   # 音频处理器
            types.ts       # 类型定义
        hooks/
          useWhisper.ts   # React Hook封装
    `,

    // 使用示例
    usage: `
      const useWhisper = () => {
        const [isReady, setIsReady] = useState(false);
        const workerRef = useRef<Worker>();

        useEffect(() => {
          // 初始化 Worker
          workerRef.current = new Worker('/whisper-worker.js');
          
          // 加载模型
          workerRef.current.postMessage({ type: 'load' });
          
          workerRef.current.onmessage = (e) => {
            if (e.data.type === 'loaded') {
              setIsReady(true);
            }
          };

          return () => workerRef.current?.terminate();
        }, []);

        const transcribe = useCallback(async (audio: ArrayBuffer) => {
          if (!workerRef.current || !isReady) return;
          
          return new Promise((resolve) => {
            workerRef.current!.onmessage = (e) => {
              if (e.data.type === 'result') {
                resolve(e.data.text);
              }
            };
            
            workerRef.current!.postMessage({
              type: 'process',
              audio
            });
          });
        }, [isReady]);

        return { isReady, transcribe };
      };
    `
  }
}
``` 