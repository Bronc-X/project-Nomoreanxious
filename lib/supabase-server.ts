import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * 创建服务器端 Supabase 客户端
 * 用于在服务器组件中使用
 * 
 * @returns {ReturnType<typeof createServerComponentClient>} 服务器端 Supabase 客户端实例
 */
export async function createServerSupabaseClient() {
  return createServerComponentClient(
    {
      cookies,
    },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  );
}

