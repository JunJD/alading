# Git LFS 仓库绑定机制

## 一、绑定原理

```typescript
const lfsBinding = {
  // 核心配置文件
  configFiles: {
    // .gitattributes - 定义哪些文件使用 LFS
    gitattributes: {
      location: '项目根目录/.gitattributes',
      purpose: '指定 LFS 追踪的文件模式',
      format: '*.ext filter=lfs diff=lfs merge=lfs -text'
    },
    
    // .lfsconfig - LFS 特定配置
    lfsconfig: {
      location: '项目根目录/.lfsconfig',
      purpose: '配置 LFS 服务器和其他选项',
      example: `
        [lfs]
          url = https://git-lfs.example.com/repo/name
          access = basic
          batch = true
      `
    },

    // .git/config - Git 配置
    gitConfig: {
      location: '.git/config',
      purpose: 'Git LFS 设置和远程仓库配置',
      content: `
        [lfs]
          enabled = true
          fetchexclude = 
          fetchinclude = 
        [remote "origin"]
          lfsurl = https://git-lfs.example.com/repo/name
      `
    }
  }
}
```

## 二、绑定过程

```typescript
const bindingProcess = {
  // 初始化步骤
  initialization: [
    '1. git lfs install                 // 在仓库中启用 LFS',
    '2. git lfs track "*.ext"           // 配置追踪规则',
    '3. git add .gitattributes          // 提交追踪配置',
    '4. git commit -m "配置 LFS"         // 确认配置'
  ],

  // 远程仓库关联
  remoteBinding: {
    // GitHub
    github: {
      自动支持: true,
      步骤: '直接推送即可，GitHub 自动处理 LFS'
    },
    
    // 自托管
    selfHosted: {
      步骤: [
        '配置 LFS 服务器',
        '设置 lfsurl',
        '配置认证信息'
      ]
    }
  }
}
```

## 三、验证配置

```bash
# 检查 LFS 配置
git lfs env

# 验证追踪状态
git lfs track

# 查看当前追踪的文件
git lfs ls-files

# 检查远程连接
git lfs pre-push origin main --dry-run
```

## 四、常见问题

```typescript
const troubleshooting = {
  // 绑定问题
  bindingIssues: {
    '远程URL错误': [
      '检查 .lfsconfig',
      '验证远程仓库配置',
      '确认认证信息'
    ],
    '追踪规则无效': [
      '检查 .gitattributes',
      '确认文件模式正确',
      '重新运行 track 命令'
    ]
  },

  // 迁移问题
  migrationIssues: {
    '已有文件迁移': [
      'git lfs migrate import',
      '更新远程仓库',
      '团队成员重新克隆'
    ]
  }
}
```

## 五、最佳实践

```typescript
const bestPractices = {
  // 仓库设置
  repoSetup: {
    初始化: '在项目开始时就配置 LFS',
    文档: '在 README 中说明 LFS 依赖',
    模板: '使用 .gitattributes 模板'
  },

  // 团队协作
  teamwork: {
    规范: [
      '统一的 LFS 配置',
      '明确的文件规则',
      '定期同步配置'
    ],
    培训: [
      'LFS 基本使用',
      '常见问题处理',
      '最佳实践遵守'
    ]
  }
}
``` 