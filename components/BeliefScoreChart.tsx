'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// 图表数据类型定义
interface ChartDataPoint {
  period: string;
  averageScore: number;
}

interface BeliefScoreChartProps {
  data: ChartDataPoint[];
}

/**
 * 信心增长曲线图表组件（贝叶斯可视化）
 * 显示用户信念分数的平均值变化
 */
export default function BeliefScoreChart({ data }: BeliefScoreChartProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">信心增长曲线</h3>
      <p className="text-sm text-gray-600 mb-4">
        显示您对习惯帮助缓解焦虑的信念分数平均值变化
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="period"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)} 分`, '平均信念分数']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="averageScore"
              stroke="#10b981"
              strokeWidth={2}
              name="平均信念分数"
              dot={{ fill: '#10b981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

