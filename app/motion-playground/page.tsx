'use client';

import { useState } from 'react';
import AnimatedSection from '@/components/AnimatedSection';

const presetOptions = [
  { key: 'fadeUp', name: 'Fade Up' },
  { key: 'fadeIn', name: 'Fade In' },
  { key: 'springScaleIn', name: 'Spring Scale In' },
];

export default function MotionPlaygroundPage() {
  const [preset, setPreset] = useState<'fadeUp' | 'fadeIn' | 'springScaleIn'>('fadeUp');
  const [inViewMode, setInViewMode] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Motion Playground</h1>
        <p className="text-gray-600 mb-6">
          切换预设查看不同动效。你可以在组件里替换为自己的视觉样式。
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          {presetOptions.map((p) => (
            <button
              key={p.key}
              onClick={() => setPreset(p.key as any)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                preset === p.key
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-800 border-gray-300'
              }`}
            >
              {p.name}
            </button>
          ))}
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 ml-2">
            <input
              type="checkbox"
              checked={inViewMode}
              onChange={(e) => setInViewMode(e.target.checked)}
            />
            whileInView
          </label>
        </div>

        <AnimatedSection variant={preset} inView={inViewMode}>
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-medium text-gray-900 mb-2">示例卡片</h2>
            <p className="text-gray-600">
              在 `lib/animations.ts` 调整 variants 或新建你自己的预设，然后在这里切换体验。
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}


