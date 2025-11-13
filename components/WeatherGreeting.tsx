'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface WeatherData {
  temperature: number;
  icon: string;
  description: string;
}

export default function WeatherGreeting() {
  const [greeting, setGreeting] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 获取北京时间问候
    const getBeijingGreeting = () => {
      // 使用Intl API获取北京时间的当前小时
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai',
        hour: 'numeric',
        hour12: false,
      });
      const hour = parseInt(formatter.format(now), 10);

      if (hour >= 5 && hour < 12) {
        return '早安';
      } else if (hour >= 12 && hour < 14) {
        return '午安';
      } else if (hour >= 14 && hour < 18) {
        return '午后好';
      } else {
        return '晚安';
      }
    };

    // 立即设置一次
    setGreeting(getBeijingGreeting());

    // 设置定时器，每分钟更新一次问候语
    const interval = setInterval(() => {
      setGreeting(getBeijingGreeting());
    }, 60000); // 每分钟更新一次

    // 获取广州天气 (使用OpenWeatherMap API，如果没有API key则使用模拟数据)
    const fetchWeather = async () => {
      try {
        // 使用免费的天气API (Open-Meteo)
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=23.1291&longitude=113.2644&current=temperature_2m,weather_code&timezone=Asia/Shanghai'
        );
        
        if (response.ok) {
          const data = await response.json();
          const temp = Math.round(data.current.temperature_2m);
          const weatherCode = data.current.weather_code;
          
          // 根据天气代码获取图标
          const getWeatherIcon = (code: number) => {
            // 简化的天气图标映射
            if (code === 0) return '☀️'; // 晴天
            if (code <= 3) return '⛅'; // 少云
            if (code <= 49) return '🌫️'; // 雾
            if (code <= 59) return '🌦️'; // 小雨
            if (code <= 69) return '🌧️'; // 中雨
            if (code <= 79) return '🌨️'; // 雪
            if (code <= 84) return '⛈️'; // 雷暴
            return '☁️'; // 默认多云
          };

          setWeather({
            temperature: temp,
            icon: getWeatherIcon(weatherCode),
            description: '',
          });
        } else {
          // 如果API失败，使用模拟数据
          setWeather({
            temperature: 22,
            icon: '☀️',
            description: '晴',
          });
        }
      } catch (error) {
        console.error('获取天气失败:', error);
        // 使用模拟数据
        setWeather({
          temperature: 22,
          icon: '☀️',
          description: '晴',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();

    // 清理定时器
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-lg font-medium text-[#0B3D2E]">
        <span>{greeting}</span>
        <span className="text-xl">🌤️</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-lg font-medium text-[#0B3D2E]">{greeting}</span>
      {weather && (
        <Link
          href="/weather"
          className="flex items-center gap-2 rounded-full border border-[#E7E1D6] bg-white px-3 py-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <span className="text-xl">{weather.icon}</span>
          <span className="text-sm font-medium text-[#0B3D2E]">{weather.temperature}°C</span>
        </Link>
      )}
    </div>
  );
}

