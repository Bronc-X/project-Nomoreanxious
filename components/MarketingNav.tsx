'use client';

import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';
import UserProfileMenu from '@/components/UserProfileMenu';

interface MarketingNavProps {
  user?: {
    id: string;
    email?: string;
  } | null;
  profile?: {
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

export default function MarketingNav({ user, profile }: MarketingNavProps) {
  return (
    <AnimatedSection inView variant="fadeIn" className="sticky top-0 z-30 bg-[#FAF6EF]/90 backdrop-blur border-b border-[#E7E1D6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#0B3D2E]" />
            <span className="text-sm font-semibold tracking-wide text-[#0B3D2E]">
              No More anxious™
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#how" className="text-[#0B3D2E]/80 hover:text-[#0B3D2E]">核心功能</Link>
            <Link href="#model" className="text-[#0B3D2E]/80 hover:text-[#0B3D2E]">科学模型</Link>
            <Link href="#authority" className="text-[#0B3D2E]/80 hover:text-[#0B3D2E]">权威洞察</Link>
            {user ? (
              <UserProfileMenu user={user} profile={profile} />
            ) : (
              <>
                <Link href="/login" className="text-[#0B3D2E]/80 hover:text-[#0B3D2E]">登录</Link>
                <Link
                  href="#cta"
                  className="inline-flex items-center rounded-md bg-[#0B3D2E] px-3 py-1.5 text-white hover:bg-[#0a3629] transition-colors"
                >
                  获取早期访问权限
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </AnimatedSection>
  );
}


