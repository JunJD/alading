# 项目文档目录

## 一、项目概览
- `README.md` - 项目总体介绍
- `development-plan.md` - 开发计划和时间线

## 二、架构设计
- `/architecture`
  - `system-architecture.md` - 系统整体架构
  - `access-code-architecture.md` - 访问码系统架构
  - `backend-practices.md` - 后端开发规范
  - `mvp-backend.md` - MVP阶段后端设计

## 三、业务设计
- `/business`
  - `business-design.md` - 业务架构设计
  - `payment-system-design.md` - 支付系统设计
  - `payment-implementation.md` - 支付系统实现
  - `knowledge-base-design.md` - 知识库设计

## 四、技术实现
- `/technical`
  - `LEARNING.md` - 技术学习笔记
  - `ui-implementation.md` - UI实现细节

## 五、运维部署
- `/devops`
  - `git-lfs-guide.md` - Git LFS使用指南
  - `git-lfs-principles.md` - Git LFS原理
  - `git-lfs-maintenance.md` - Git LFS维护
  - `git-lfs-binding.md` - Git LFS绑定

## 文档更新记录
```typescript
const docUpdates = {
  latest: {
    date: '2024-03-xx',
    updates: [
      '创建文档目录结构',
      '整理分类系统',
      '完善文档间关系'
    ]
  }
}
```

## 文档编写规范
1. 每个文档都应该有清晰的标题和简介
2. 架构设计文档避免涉及具体实现
3. 实现细节文档要包含代码示例
4. 文档间保持适当的引用关系

## 文档维护指南
1. 定期更新文档内容
2. 保持文档结构清晰
3. 及时补充新功能文档
4. 记录重要的设计决策 