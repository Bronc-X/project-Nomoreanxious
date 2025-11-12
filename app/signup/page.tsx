'use client';

import { useState, FormEvent } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

/**
 * 注册页面组件
 * 新用户注册表单
 */
export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  // 处理用户注册
  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // 验证密码匹配
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的密码不匹配' });
      setIsLoading(false);
      return;
    }

    // 验证密码长度
    if (password.length < 6) {
      setMessage({ type: 'error', text: '密码长度至少为 6 个字符' });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // 注册成功，显示成功消息
        setMessage({
          type: 'success',
          text: '注册成功！请查收邮件以验证您的账户。',
        });

        // 如果用户已自动登录，重定向到仪表板
        if (data.session) {
          setTimeout(() => {
            router.push('/dashboard');
            router.refresh();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('注册时出错:', error);
      setMessage({
        type: 'error',
        text: '注册时发生错误，请稍后重试',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6EF] px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <AnimatedSection variant="fadeUp" className="text-center">
          <h1 className="text-3xl font-semibold text-[#0B3D2E]">注册</h1>
          <p className="mt-2 text-sm text-[#0B3D2E]/80">
            创建您的账户，开始建立健康习惯
          </p>
        </AnimatedSection>

        <AnimatedSection variant="fadeUp" className="mt-8">
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

          {/* 注册表单 */}
          <form
            onSubmit={handleSignup}
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0B3D2E]">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[#E7E1D6] bg-[#FFFDF8] px-3 py-2 text-sm text-[#0B3D2E] placeholder:text-[#0B3D2E]/40 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 focus:border-[#0B3D2E]/30"
                placeholder="至少 6 个字符"
                minLength={6}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#0B3D2E]"
              >
                确认密码
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[#E7E1D6] bg-[#FFFDF8] px-3 py-2 text-sm text-[#0B3D2E] placeholder:text-[#0B3D2E]/40 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 focus:border-[#0B3D2E]/30"
                placeholder="再次输入密码"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-gradient-to-r from-[#0b3d2e] via-[#0a3427] to-[#06261c] px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? '注册中...' : '注册'}
            </button>
          </form>

          {/* 登录链接 */}
          <p className="mt-6 text-center text-sm text-[#0B3D2E]/70">
            已有账户？{' '}
            <Link href="/login" className="font-medium text-[#0B3D2E] hover:text-[#0B3D2E]/80 underline">
              立即登录
            </Link>
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}

