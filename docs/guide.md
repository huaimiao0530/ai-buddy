# AI Buddy 使用指南

## 快速开始

### 1. 在任何 AI 中使用（推荐）

将 `prompt.md` 的内容复制为 AI 的 System Prompt，然后发送：

```
/buddy
```

即可孵化你的专属伴侣。

支持平台：
- ✅ ChatGPT (Custom Instructions)
- ✅ Claude (Projects / System Prompt)
- ✅ Gemini
- ✅ Cursor (Rules)
- ✅ GitHub Copilot
- ✅ Kimi
- ✅ 通义千问
- ✅ 任何支持 System Prompt 的 AI

### 2. 在 Claude Code 中使用

```bash
# 克隆仓库
git clone https://github.com/huaimiao0530/ai-buddy.git

# 进入 skill 目录
cd ai-buddy/claude-skill

# 安装 skill
npx skills add huaimiao0530/ai-buddy

# 在 Claude Code 中使用
/buddy
```

### 3. 命令行独立使用

```bash
# 生成 Buddy
node src/generator.js "你的用户名"

# 输出示例：
# 🥚 孵化中...
# ✨ ~ 闪光 ~ ✨
# ... (ASCII 艺术)
# 💾 已保存到 output/你的用户名_buddy.json
```

## 命令列表

| 命令 | 功能 |
|------|------|
| `/buddy` | 孵化或显示 Buddy |
| `/buddy pet` | 抚摸 Buddy，提升心情 |
| `/buddy status` | 查看 Buddy 完整状态 |
| `/buddy mute` | 静音，停止主动发言 |
| `/buddy unmute` | 取消静音 |
| 直接叫名字 | Buddy 单独回应 |

## 稀有度说明

| 稀有度 | 概率 | 属性加成 | 解锁装备 |
|--------|------|----------|----------|
| ★ Common | 60% | x1.0 | 基础装备 |
| ★★ Uncommon | 25% | x1.2 | +3 款帽子/眼睛 |
| ★★★ Rare | 10% | x1.5 | +5 款帽子/眼睛 |
| ★★★★ Epic | 4% | x2.0 | +7 款帽子/眼睛 |
| ★★★★★ Legendary | 1% | x3.0 | 全部装备 |

**闪光**: 额外 1% 概率，属性再 x1.5，特殊视觉效果

## 属性说明

| 属性 | 作用 |
|------|------|
| DEBUGGING | 高 = 更擅长发现 bug（吐槽精准） |
| WISDOM | 高 = 评论更有深度 |
| PATIENCE | 高 = 对错误更包容 |
| CHAOS | 高 = 行为更不可预测（更有趣） |
| SNARK | 高 = 吐槽更犀利 |

## 自定义扩展

### 添加新物种

编辑 `src/species.json`，添加新条目：

```json
{
  "id": 19,
  "name": "独角兽",
  "nameEn": "Unicorn",
  "emoji": "🦄",
  "ascii": ["..."],
  "personality": "...",
  "habitat": "...",
  "favorite": "..."
}
```

### 添加新装备

编辑 `src/hats.json` 或 `src/eyes.json`：

```json
{
  "id": 11,
  "name": "新帽子",
  "emoji": "🎩",
  "ascii": "...",
  "rarity": "Legendary",
  "description": "..."
}
```

### 修改生成算法

编辑 `src/generator.js`：

```javascript
// 自定义名字生成
const name = `${prefix}${species.name}${suffix}`;

// 自定义属性计算
const attributes = {
  DEBUGGING: Math.min(100, Math.floor(value * modifier + bonus))
};
```

### 添加新互动命令

在 `prompt.md` 或 `SKILL.md` 中添加新的触发器和响应逻辑。

## 进阶玩法

### 1. 收集系统

每次 `/buddy` 使用相同的种子（基于用户 ID），所以：
- **同一个用户永远得到同一个 Buddy**（确定性生成）
- 如果你想"重抽"，修改种子盐值

### 2. 心情养成

Buddy 有隐藏心情值：
- `/pet` 提升心情
- 长时间不理睬降低心情
- 成功编译提升心情
- 频繁报错降低心情

### 3. 装备合成（计划中）

v2.0 将支持：
- 完成任务获得" Buddy 币"
- 用币购买新装备
- 装备合成升级

### 4. 多 Buddy 系统（计划中）

v2.0 将支持同时养多个 Buddy，它们之间会互动。

## 故障排除

**Q: 为什么每次 /buddy 都生成同一个？**
A: 这是设计如此。Buddy 基于用户 ID 确定性生成，保证长期陪伴的一致性。想换 Buddy，修改 generator.js 中的盐值。

**Q: Buddy 太吵了怎么办？**
A: 使用 `/buddy mute` 静音。

**Q: 可以在团队里用吗？**
A: 可以。每个人的 Buddy 都是独立的，基于各自的用户名生成。

**Q: 如何重置 Buddy？**
A: 删除状态文件：`rm ~/.claude/buddy_state.json`，然后重新 `/buddy`。

## 版本规划

| 版本 | 功能 |
|------|------|
| v1.0 | ✅ 基础孵化、属性、装备、反应系统 |
| v1.1 | 🚧 心情系统、互动命令 |
| v1.2 | 🚧 成就系统、收集图鉴 |
| v2.0 | 🚧 Buddy 币、装备商店、合成 |
| v2.1 | 🚧 多 Buddy 系统、Buddy 间互动 |
| v3.0 | 🚧 跨设备同步、云端保存 |

---

*有问题或建议？提交 Issue 到 GitHub*
