'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * 创建客户端 Supabase 客户端
 * 用于在客户端组件中使用
 * 
 * @returns {ReturnType<typeof createClientComponentClient>} 客户端 Supabase 客户端实例
 */
export function createClientSupabaseClient() {
  return createClientComponentClient();
}

