'use client';

import { useState, FormEvent } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase-client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * 登录页面组件
 * 支持 Magic Link（邮件链接）和邮箱/密码登录
 */
export default function LoginPage() {
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
        // 登录成功，重定向到仪表板或之前尝试访问的页面
        const redirectedFrom = searchParams.get('redirectedFrom') || '/dashboard';
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">登录</h1>
          <p className="mt-2 text-sm text-gray-600">
            欢迎回来，请登录您的账户
          </p>
        </div>

        <div className="mt-8">
          {/* 切换登录方式 */}
          <div className="mb-6 flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setIsMagicLink(false)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                !isMagicLink
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              邮箱/密码
            </button>
            <button
              type="button"
              onClick={() => setIsMagicLink(true)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isMagicLink
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:text-gray-900'
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
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* 登录表单 */}
          <form
            onSubmit={isMagicLink ? handleMagicLinkLogin : handleEmailPasswordLogin}
            className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>

            {!isMagicLink && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? '处理中...' : isMagicLink ? '发送登录链接' : '登录'}
            </button>
          </form>

          {/* 注册链接 */}
          <p className="mt-6 text-center text-sm text-gray-600">
            还没有账户？{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

