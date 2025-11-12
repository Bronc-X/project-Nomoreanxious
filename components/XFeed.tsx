'use client';

import { Tweet } from 'react-tweet';
import 'react-tweet/theme.css';

// 推文 ID 列表（从提供的 URL 中提取）
const TWEET_IDS = [
  '1986977228165689658', // Svwang1
  '1979696074978983954', // Svwang1
  '1987810985558913191', // xYsfknBXPT6M0jo
  '1987741929027813696', // xYsfknBXPT6M0jo
];

/**
 * X.com Feed 组件
 * 显示来自特定领域权威博主的帖子（灵感板块）
 * 使用 react-tweet 库，无需 API
 */
export default function XFeed({
  variant = 'card',
  compact = false,
  columns = 1,  
  limit,
}: {
  variant?: 'card' | 'bare';
  compact?: boolean;
  columns?: number;
  limit?: number;
}) {
  const ids = typeof limit === 'number' ? TWEET_IDS.slice(0, limit) : TWEET_IDS;
  const Container =
    variant === 'card'
      ? ({ children }: { children: React.ReactNode }) => (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">灵感板块</h3>
            <p className="text-sm text-gray-600 mb-6">来自健康与习惯养成领域的专业见解</p>
            {children}
          </div>
        )
      : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  const Grid =
    columns > 1
      ? ({ children }: { children: React.ReactNode }) => (
          <div className={`grid grid-cols-1 sm:grid-cols-${columns} gap-4`}>{children}</div>
        )
      : ({ children }: { children: React.ReactNode }) => <div className="space-y-6">{children}</div>;

  return (
    <Container>
      <Grid>
        {ids.map((tweetId) => (
          <div
            key={tweetId}
            className={`${
              columns > 1 ? 'border border-gray-100 rounded-md p-3 bg-white' : 'border-b border-gray-100 last:border-b-0 pb-6 last:pb-0'
            } ${compact ? 'transform origin-top-left scale-[0.92]' : ''}`}
          >
            <Tweet id={tweetId} />
          </div>
        ))}
      </Grid>
    </Container>
  );
}

