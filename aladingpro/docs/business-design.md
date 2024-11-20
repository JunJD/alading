# 业务设计文档

## 一、核心业务模块

```typescript
const businessModules = {
  // 1. 面试对话管理
  interviewManagement: {
    features: {
      // 面试历史
      history: {
        list: '面试记录列表',
        detail: '面试详情回放',
        feedback: '面试反馈与评分',
        analysis: '表现数据分析'
      },
      // 对话记录
      conversation: {
        qa: '问答记录',
        timeline: '时间轴展示',
        highlights: '重点标记',
        notes: '面试笔记'
      },
      // 学习追踪
      learning: {
        weakPoints: '薄弱点分析',
        improvement: '进步追踪',
        suggestions: '学习建议'
      }
    }
  },

  // 2. 面试页面
  interviewSession: {
    features: {
      // 实时对话
      realtime: {
        audio: '音频对话',
        video: '可选视频模式',
        chat: '文字实时记录'
      },
      // 辅助工具
      tools: {
        codeEditor: '在线代码编辑器',
        whiteboard: '画板（架构图）',
        resources: '参考资料展示'
      },
      // 状态控制
      control: {
        progress: '面试进度',
        timer: '时间管理',
        breaks: '休息请求'
      }
    },
    // 面试流程
    process: [
      '开场寒暄',
      '基础技能评估',
      '项目经验交流',
      '技术深度探讨',
      '候选人提问',
      '面试总结'
    ]
  },

  // 3. 个人信息页
  profile: {
    features: {
      // 简历管理
      resume: {
        basic: '基本信息',
        education: '教育经历',
        experience: '工作/项目经验',
        skills: '技能清单'
      },
      // 求职偏好
      preference: {
        positions: '目标岗位',
        locations: '期望城市',
        salary: '薪资要求',
        industry: '行业偏好'
      },
      // 学习档案
      learning: {
        progress: '能力提升记录',
        certificates: '证书成就',
        projects: '项目作品集'
      }
    }
  },

  // 4. 面试屋
  interviewRoom: {
    features: {
      // 岗位管理
      position: {
        creation: '岗位创建',
        template: '面试模板',
        requirements: '要求配置',
        matching: '人岗匹配'
      },
      // 招聘信息
      recruitment: {
        company: '企业信息',
        jd: '职位描述',
        benefits: '福利待遇',
        process: '招聘流程'
      },
      // 面试配置
      settings: {
        difficulty: '难度级别',
        duration: '时长设置',
        focus: '考察重点',
        style: '面试风格'
      }
    }
  }
}
```

## 二、数据模型设计

```typescript
const dataModels = {
  // 用户模型
  User: {
    profile: {
      basic: '基本信息',
      resume: '简历信息',
      preferences: '求职偏好'
    },
    interviews: '面试记录[]',
    learning: '学习记录[]'
  },

  // 面试记录
  Interview: {
    basic: {
      id: '唯一标识',
      type: '面试类型',
      status: '面试状态',
      duration: '面试时长'
    },
    content: {
      qa: '问答记录[]',
      feedback: '面试反馈',
      score: '评分详情'
    },
    relations: {
      user: '关联用户',
      position: '关联岗位',
      room: '关联面试屋'
    }
  },

  // 面试屋
  Room: {
    basic: {
      id: '唯一标识',
      name: '面试屋名称',
      type: '面试类型'
    },
    settings: {
      position: '岗位信息',
      requirements: '要求配置',
      template: '面试模板'
    },
    stats: {
      interviews: '面试次数',
      rating: '评分统计',
      feedback: '反馈汇总'
    }
  }
}
```

## 三、页面路由设计

```typescript
const routes = {
  // 主页面
  main: {
    '/': '首页',
    '/dashboard': '个人仪表盘'
  },

  // 面试相关
  interview: {
    '/interviews': '面试列表',
    '/interviews/:id': '面试详情',
    '/interviews/:id/session': '面试进行页',
    '/interviews/:id/replay': '面试回放'
  },

  // 个人中心
  profile: {
    '/profile': '个人信息',
    '/profile/resume': '简历管理',
    '/profile/settings': '个人设置'
  },

  // 面试屋
  room: {
    '/rooms': '面试屋列表',
    '/rooms/create': '创建面试屋',
    '/rooms/:id': '面试屋详情',
    '/rooms/:id/settings': '面试屋设置'
  }
}
```

## 四、业务流程

### 1. 面试流程

```typescript
const interviewProcess = {
  // 准备阶段
  preparation: [
    '选择面试屋',
    '确认个人信息',
    '设备检测',
    '开始面试'
  ],

  // 面试阶段
  interview: [
    '开场介绍',
    '基础问答',
    '技术深入',
    '项目讨论',
    '互动提问',
    '结束总结'
  ],

  // 反馈阶段
  feedback: [
    '即时反馈',
    '详细报告',
    '改进建议',
    '后续规划'
  ]
}
```

### 2. 数据流转

```typescript
const dataFlow = {
  // 面试数据
  interview: {
    input: ['音频流', '用户操作', '系统状态'],
    processing: ['实时转写', 'AI分析', '状态更新'],
    output: ['问答记录', '即时反馈', '状态展示']
  },

  // 用户数据
  user: {
    input: ['个人信息', '简历数据', '面试记录'],
    processing: ['数据分析', '能力评估', '进度追踪'],
    output: ['个人报告', '建议反馈', '学习计划']
  }
}
```

## 五、交互设计

### 1. 关键交互流程

```typescript
const interactions = {
  // 面试进行
  interviewSession: {
    audioControl: '音频控制面板',
    toolSwitch: '工具切换区',
    qaDisplay: '问答展示区',
    statusBar: '状态信息栏'
  },

  // 数据展示
  dataVisualization: {
    timeline: '时间轴视图',
    statistics: '数据统计图',
    progress: '进度指示器'
  }
}
```

### 2. 状态管理

```typescript
const stateManagement = {
  // 全局状态
  global: {
    user: '用户信息',
    settings: '系统设置',
    theme: '主题配置'
  },

  // 面试状态
  interview: {
    status: '面试状态',
    progress: '当前进度',
    audio: '音频状态'
  }
}
``` 