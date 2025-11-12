'use client';

import { useState, FormEvent, Suspense } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase-client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

/**
 * 登录表单内容组件（使用 Suspense 包裹 useSearchParams）
 */
function LoginFormContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientSupabaseClient();

  // 处理邮箱/密码登录
  const handleEmailPasswordLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // 登录成功，重定向到 landing 页面或之前尝试访问的页面
        const redirectedFrom = searchParams.get('redirectedFrom') || '/landing';
        router.push(redirectedFrom);
        router.refresh();
      }
    } catch (error) {
      console.error('登录时出错:', error);
      setMessage({
        type: 'error',
        text: '登录时发生错误，请稍后重试',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理 Magic Link 登录
  const handleMagicLinkLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
        setIsLoading(false);
        return;
      }

      setMessage({
        type: 'success',
        text: '登录链接已发送到您的邮箱，请查收邮件并点击链接完成登录',
      });
    } catch (error) {
      console.error('发送 Magic Link 时出错:', error);
      setMessage({
        type: 'error',
        text: '发送登录链接时发生错误，请稍后重试',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6EF] px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <AnimatedSection variant="fadeUp" className="text-center">
          <h1 className="text-3xl font-semibold text-[#0B3D2E]">登录</h1>
          <p className="mt-2 text-sm text-[#0B3D2E]/80">
            欢迎回来，请登录您的账户
          </p>
        </AnimatedSection>

        <AnimatedSection variant="fadeUp" className="mt-8">
          {/* 切换登录方式 */}
          <div className="mb-6 flex rounded-lg border border-[#E7E1D6] bg-white p-1">
            <button
              type="button"
              onClick={() => setIsMagicLink(false)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                !isMagicLink
                  ? 'bg-[#0B3D2E]/10 text-[#0B3D2E]'
                  : 'text-[#0B3D2E]/70 hover:text-[#0B3D2E]'
              }`}
            >
              邮箱/密码
            </button>
            <button
              type="button"
              onClick={() => setIsMagicLink(true)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isMagicLink
                  ? 'bg-[#0B3D2E]/10 text-[#0B3D2E]'
                  : 'text-[#0B3D2E]/70 hover:text-[#0B3D2E]'
              }`}
            >
              Magic Link
            </button>
          </div>

          {/* 消息提示 */}
          {message && (
            <div
              className={`mb-4 rounded-md p-4 ${
                message.type === 'success'
                  ? 'bg-[#0B3D2E]/10 text-[#0B3D2E] border border-[#0B3D2E]/20'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* 登录表单 */}
          <form
            onSubmit={isMagicLink ? handleMagicLinkLogin : handleEmailPasswordLogin}
            className="space-y-6 rounded-lg border border-[#E7E1D6] bg-white p-6 shadow-sm"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0B3D2E]">
                邮箱地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[#E7E1D6] bg-[#FFFDF8] px-3 py-2 text-sm text-[#0B3D2E] placeholder:text-[#0B3D2E]/40 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 focus:border-[#0B3D2E]/30"
                placeholder="your@email.com"
              />
            </div>

            {!isMagicLink && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#0B3D2E]">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[#E7E1D6] bg-[#FFFDF8] px-3 py-2 text-sm text-[#0B3D2E] placeholder:text-[#0B3D2E]/40 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 focus:border-[#0B3D2E]/30"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-gradient-to-r from-[#0b3d2e] via-[#0a3427] to-[#06261c] px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? '处理中...' : isMagicLink ? '发送登录链接' : '登录'}
            </button>
          </form>

          {/* 注册链接 */}
          <p className="mt-6 text-center text-sm text-[#0B3D2E]/70">
            还没有账户？{' '}
            <Link href="/signup" className="font-medium text-[#0B3D2E] hover:text-[#0B3D2E]/80 underline">
              立即注册
            </Link>
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}

/**
 * 登录页面组件
 * 支持 Magic Link（邮件链接）和邮箱/密码登录
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAF6EF]">
          <div className="text-center">
            <p className="text-[#0B3D2E]/70">加载中...</p>
          </div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}

