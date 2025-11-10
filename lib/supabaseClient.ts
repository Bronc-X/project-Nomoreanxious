import { createClient } from '@supabase/supabase-js';

// 从环境变量中获取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 验证环境变量是否已设置
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '缺少 Supabase 环境变量。请确保在 .env.local 文件中设置了 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

/**
 * 创建并导出 Supabase 客户端实例
 * 此客户端配置为在 Next.js App Router 环境中工作
 * 
 * @returns {ReturnType<typeof createClient>} Supabase 客户端实例
 */
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 在 Next.js App Router 中，使用持久化存储来保持会话
    persistSession: true,
    // 自动刷新 token
    autoRefreshToken: true,
    // 检测会话变化
    detectSessionInUrl: true,
  },
});

