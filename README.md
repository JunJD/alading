# AI 面试助手

一个基于 AI 的面试模拟系统，支持实时语音对话和多种面试场景。通过结合 OpenAI 的 GPT、Whisper 和 TTS 技术，为用户提供沉浸式的面试体验。

## 演示视频

### 功能演示
Vercel边缘服务限制，可能无法使用在线webscoket的功能(ai基于webscoket实现)，可以拉下来运行

### 项目目录结构

## 项目简介

AI 面试助手是一个创新的面试训练平台，它能够：

### 个性化面试体验
- 支持多个行业（技术开发、产品经理等）
- 提供多种面试类型（自我介绍、项目经验、薪资谈判）
- 根据用户简历定制面试内容

### 智能交互
- 实时语音对话，模拟真实面试场景
- AI 面试官能够根据上下文进行追问
- 动态调整面试难度和深度

### 结构化面试流程
- 清晰的面试阶段划分
- 实时进度追踪
- 每个阶段都有明确的评估重点

### 技术特色
- 实时语音转写和合成
- WebSocket 实时通信
- 动态粒子效果反馈
- 响应式界面设计

## 功能特点

- 🎙️ 实时语音交互
- 🤖 智能 AI 面试官
- 🎯 多种面试类型
  - 自我介绍
  - 项目经验
  - 薪资谈判
- 🏢 多行业支持
  - 技术开发
  - 产品经理
- 📊 面试进度追踪
- 🔄 实时反馈
- 💼 简历分析

## 技术栈

- **前端框架**: Next.js 13+ (App Router)
- **样式**: Tailwind CSS
- **状态管理**: React Hooks
- **动画**: Framer Motion
- **实时通信**: WebSocket
- **语音处理**: Web Audio API
- **AI 模型**: OpenAI GPT-3.5 + Whisper + TTS

## 系统架构

### 前端模块
- `InterviewSetup`: 面试配置和初始化
- `InterviewRoom`: 核心面试交互界面
- `VoiceInput`: 语音输入处理
- `RealtimeClient`: WebSocket 通信客户端

### 后端服务
- WebSocket 服务器
- OpenAI 接口集成
- 音频处理服务

### 核心功能
- 实时语音转文字
- AI 对话生成
- 文字转语音
- 面试进度追踪

## 本地开发

1. 克隆项目
