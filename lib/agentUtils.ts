import fs from 'fs';
import path from 'path';

// 规则类型定义
interface RuleCondition {
  primary_concern?: string;
  activity_level?: string;
  circadian_rhythm?: string;
}

interface AgentRule {
  conditions: RuleCondition;
  recommendation_short: string;
  recommendation_long: string;
}

interface AgentRules {
  rules: AgentRule[];
}

interface UserProfile {
  primary_concern?: string | null;
  activity_level?: string | null;
  circadian_rhythm?: string | null;
}

/**
 * 加载 agentRules.json 文件
 * 
 * @returns {Promise<AgentRules>} 规则数据
 */
export async function loadAgentRules(): Promise<AgentRules> {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'agentRules.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as AgentRules;
  } catch (error) {
    console.error('加载 agentRules.json 时出错:', error);
    return { rules: [] };
  }
}

/**
 * 检查用户资料是否匹配规则条件
 * 
 * @param {UserProfile} profile - 用户资料
 * @param {RuleCondition} conditions - 规则条件
 * @returns {boolean} 是否匹配
 */
function matchesConditions(profile: UserProfile, conditions: RuleCondition): boolean {
  // 遍历所有条件，检查是否都匹配
  for (const [key, value] of Object.entries(conditions)) {
    const profileValue = profile[key as keyof UserProfile];
    
    // 如果条件值存在，但用户资料中的对应值不匹配，则返回 false
    if (value && profileValue !== value) {
      return false;
    }
  }
  
  // 所有条件都匹配
  return true;
}

/**
 * 根据用户资料查找匹配的推荐规则
 * 
 * @param {UserProfile} profile - 用户资料
 * @returns {Promise<AgentRule | null>} 匹配的规则，如果没有匹配则返回 null
 */
export async function findMatchingRule(profile: UserProfile): Promise<AgentRule | null> {
  try {
    const agentRules = await loadAgentRules();
    
    // 遍历规则，找到第一条匹配的规则
    for (const rule of agentRules.rules) {
      if (matchesConditions(profile, rule.conditions)) {
        return rule;
      }
    }
    
    // 没有找到匹配的规则
    return null;
  } catch (error) {
    console.error('查找匹配规则时出错:', error);
    return null;
  }
}

