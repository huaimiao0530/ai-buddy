# AI Buddy - 你的 AI 编程伴侣

一个可移植的 AI 陪伴系统，灵感来自 Claude Code 的 Buddy 功能。可以在任何支持 system prompt 的 AI 中使用。

## 快速开始

### 方式一：直接复制 Prompt（通用）

将 `prompt.md` 的内容复制到任何 AI 的 system prompt 中，然后发送 `/buddy` 即可孵化你的专属伴侣。

支持：ChatGPT、Claude、Gemini、Cursor、Copilot 等。

### 方式二：Claude Code Skill

```bash
# 进入项目目录后
npx skills add huaimiao0530/ai-buddy
```

或在 Claude Code 中直接使用 `/buddy`。

### 方式三：程序化生成

```bash
cd src
node generator.js "你的用户ID"
```

## 核心特性

- **18 种物种** - 随机孵化属于你的小动物
- **5 级稀有度** - 从 Common 到 Legendary
- **闪光系统** - 1% 概率获得特殊版本
- **5 维属性** - DEBUGGING / WISDOM / PATIENCE / CHAOS / SNARK
- **装备系统** - 可搭配不同眼睛和帽子
- **上下文感知** - 根据你的编码状态做出反应
- **跨平台** - 一个 prompt，到处使用

## 文件结构

```
ai-buddy/
├── README.md              # 本文件
├── prompt.md              # 通用 System Prompt
├── claude-skill/
│   └── SKILL.md           # Claude Code Skill 格式
├── src/
│   ├── species.json       # 物种数据
│   ├── rarities.json      # 稀有度配置
│   ├── hats.json          # 帽子装备
│   ├── eyes.json          # 眼睛装备
│   └── generator.js       # 确定性生成器
└── docs/
    └── guide.md           # 使用指南与进阶玩法
```

## 版本

v1.0.0 - 基础陪伴系统

## 许可证

MIT
