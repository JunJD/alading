# Git LFS 维护指南

## 一、清理命令

```bash
# 1. 基础清理命令
git lfs prune                    # 清理本地 LFS 缓存中未被引用的文件

# 2. 带参数的清理
git lfs prune --verbose          # 显示详细清理信息
git lfs prune --dry-run         # 预演清理过程，不实际删除
git lfs prune --verify-remote   # 验证远程文件是否存在

# 3. 强制清理
git lfs prune --force           # 强制清理，即使文件可能还需要
```

## 二、自动化清理脚本

```bash
#!/bin/bash
# cleanup-lfs.sh

# 设置日志文件
LOG_FILE="lfs-cleanup.log"

echo "开始 LFS 清理 - $(date)" >> $LOG_FILE

# 1. 显示当前 LFS 状态
echo "当前 LFS 状态：" >> $LOG_FILE
git lfs status >> $LOG_FILE

# 2. 执行清理
git lfs prune --verbose >> $LOG_FILE 2>&1

# 3. 验证清理结果
echo "清理后状态：" >> $LOG_FILE
git lfs status >> $LOG_FILE

echo "清理完成 - $(date)" >> $LOG_FILE
```

## 三、定期清理策略

```typescript
const cleanupStrategy = {
  // 手动清理时机
  manualTiming: [
    '大版本发布后',
    '切换主要分支后',
    '存储空间不足时'
  ],

  // 自动化建议
  automation: {
    // CI/CD 集成
    cicd: `
      name: LFS Cleanup
      on:
        schedule:
          - cron: '0 0 * * 0'  # 每周日午夜执行
        workflow_dispatch:      # 支持手动触发
      
      jobs:
        cleanup:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v2
            - name: Setup Git LFS
              run: git lfs install
            - name: Run LFS cleanup
              run: git lfs prune --verbose
    `,

    // Git hooks
    gitHooks: {
      'post-merge': '合并后检查并清理',
      'post-checkout': '切换分支后检查',
      'pre-push': '推送前验证'
    }
  }
}
```

## 四、最佳实践

```typescript
const bestPractices = {
  // 清理前检查
  preCleanupChecks: [
    '确保所有更改已提交',
    '验证远程仓库可访问',
    '备份重要数据'
  ],

  // 清理后验证
  postCleanupChecks: [
    '验证项目正常构建',
    '检查必要文件是否存在',
    '测试功能是否正常'
  ],

  // 维护建议
  maintenance: {
    定期检查: '每周检查 LFS 状态',
    空间监控: '设置存储警告阈值',
    日志记录: '保留清理操作日志'
  }
}
```

## 五、故障排除

```typescript
const troubleshooting = {
  // 常见问题
  commonIssues: {
    '清理后文件丢失': [
      '检查 .gitattributes 配置',
      '验证远程仓库状态',
      '从备份恢复'
    ],
    '清理无效果': [
      '检查文件引用状态',
      '验证 LFS 追踪配置',
      '尝试强制清理'
    ]
  },

  // 恢复策略
  recovery: {
    从远程恢复: 'git lfs fetch --all',
    重置本地缓存: 'git lfs prune --force && git lfs fetch',
    验证文件: 'git lfs fsck'
  }
}
``` 