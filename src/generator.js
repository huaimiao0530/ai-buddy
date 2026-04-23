const fs = require('fs');
const path = require('path');

// 确定性随机数生成器 (mulberry32)
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 字符串转种子
function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// 加载 JSON 数据
function loadJSON(filename) {
  const filepath = path.join(__dirname, filename);
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

// 根据概率选择稀有度
function selectRarity(rand, rarities) {
  const roll = rand();
  let cumulative = 0;
  for (const rarity of rarities) {
    cumulative += rarity.probability;
    if (roll < cumulative) {
      return rarity;
    }
  }
  return rarities[rarities.length - 1];
}

// 根据稀有度过滤装备
function filterByRarity(items, maxRarityLevel) {
  const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Epic': 4, 'Legendary': 5 };
  return items.filter(item => rarityOrder[item.rarity] <= maxRarityLevel);
}

// 生成 Buddy
function generateBuddy(userId) {
  const seed = stringToSeed(userId + '_ai_buddy_v1');
  const rand = mulberry32(seed);

  const speciesData = loadJSON('species.json');
  const raritiesData = loadJSON('rarities.json');
  const hatsData = loadJSON('hats.json');
  const eyesData = loadJSON('eyes.json');

  // 选择物种
  const speciesIndex = Math.floor(rand() * speciesData.species.length);
  const species = speciesData.species[speciesIndex];

  // 选择稀有度
  const rarity = selectRarity(rand, raritiesData.rarities);

  // 是否闪光
  const isShiny = rand() < raritiesData.shiny.probability;

  // 生成属性 (0-100)
  const baseAttributes = {
    DEBUGGING: Math.floor(rand() * 100),
    WISDOM: Math.floor(rand() * 100),
    PATIENCE: Math.floor(rand() * 100),
    CHAOS: Math.floor(rand() * 100),
    SNARK: Math.floor(rand() * 100)
  };

  // 应用稀有度加成
  const modifier = rarity.bonus.attributeModifier;
  const attributes = {};
  for (const [key, value] of Object.entries(baseAttributes)) {
    attributes[key] = Math.min(100, Math.floor(value * modifier));
  }

  // 生成装备
  const rarityLevel = raritiesData.rarities.findIndex(r => r.id === rarity.id) + 1;
  const availableHats = filterByRarity(hatsData.hats, rarityLevel);
  const availableEyes = filterByRarity(eyesData.eyes, rarityLevel);

  const hat = availableHats[Math.floor(rand() * availableHats.length)];
  const eyes = availableEyes[Math.floor(rand() * availableEyes.length)];

  // 生成名字 (组合格式)
  const namePrefixes = ['小', '大', '阿', '老', '超级', '迷你', '闪电', ' Lazy', '狂暴', '温柔'];
  const nameSuffixes = ['酱', '君', '桑', '宝', '崽', '球', '团', '仔', '王', '神'];
  const prefix = namePrefixes[Math.floor(rand() * namePrefixes.length)];
  const suffix = nameSuffixes[Math.floor(rand() * nameSuffixes.length)];
  const name = `${prefix}${species.name}${suffix}`;

  return {
    userId,
    seed,
    name,
    species: {
      id: species.id,
      name: species.name,
      nameEn: species.nameEn,
      emoji: species.emoji,
      ascii: species.ascii,
      personality: species.personality,
      habitat: species.habitat,
      favorite: species.favorite
    },
    rarity: {
      name: rarity.name,
      nameCn: rarity.nameCn,
      stars: rarity.stars,
      color: rarity.color,
      description: rarity.bonus.description
    },
    shiny: isShiny,
    attributes,
    equipment: {
      hat: {
        name: hat.name,
        nameEn: hat.nameEn,
        emoji: hat.emoji,
        ascii: hat.ascii,
        description: hat.description
      },
      eyes: {
        name: eyes.name,
        nameEn: eyes.nameEn,
        emoji: eyes.emoji,
        ascii: eyes.ascii,
        description: eyes.description
      }
    },
    generatedAt: new Date().toISOString()
  };
}

// 渲染 ASCII 艺术
function renderBuddy(buddy) {
  const lines = [];
  const { species, equipment, shiny, rarity } = buddy;

  // 闪光效果
  if (shiny) {
    lines.push('✨ ~ 闪光 ~ ✨');
  }

  // 帽子
  if (equipment.hat.ascii) {
    const hatLines = equipment.hat.ascii.split('\n');
    lines.push(...hatLines);
  }

  // 物种 ASCII (替换眼睛)
  const eyePattern = /o\.?o|@\.?@|\*\.?\*|\(\s*\.\s*\.\s*\)/i;
  species.ascii.forEach((line, idx) => {
    let rendered = line;
    if (idx === 1 || idx === 2) {
      // 尝试替换眼睛区域
      const eyeStr = equipment.eyes.ascii;
      rendered = line.replace(/o\.?o|@\.?@|\*\.?\*|\(\s*\.\s*\.\s*\)|[<>^][\s]*[<>^]/i, eyeStr) || line;
    }
    lines.push(rendered);
  });

  lines.push('');
  lines.push(`${species.emoji} ${buddy.name}`);
  lines.push(`${rarity.stars} ${rarity.nameCn} ${shiny ? '(闪光)' : ''}`);
  lines.push('');
  lines.push('【属性】');
  for (const [key, value] of Object.entries(buddy.attributes)) {
    const bar = '█'.repeat(Math.floor(value / 5)) + '░'.repeat(20 - Math.floor(value / 5));
    lines.push(`${key.padEnd(10)} ${bar} ${value}`);
  }

  return lines.join('\n');
}

// 主程序
if (require.main === module) {
  const userId = process.argv[2] || 'default_user';
  const buddy = generateBuddy(userId);

  console.log('🥚 孵化中...\n');
  console.log(renderBuddy(buddy));
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`性格: ${buddy.species.personality}`);
  console.log(`栖息地: ${buddy.species.habitat}`);
  console.log(`最爱: ${buddy.species.favorite}`);
  console.log(`帽子: ${buddy.equipment.hat.emoji} ${buddy.equipment.hat.name} - ${buddy.equipment.hat.description}`);
  console.log(`眼睛: ${buddy.equipment.eyes.emoji} ${buddy.equipment.eyes.name} - ${buddy.equipment.eyes.description}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 保存到文件
  const outputDir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(outputDir, `${userId}_buddy.json`),
    JSON.stringify(buddy, null, 2)
  );
  console.log(`\n💾 已保存到 output/${userId}_buddy.json`);
}

module.exports = { generateBuddy, renderBuddy, mulberry32, stringToSeed };
