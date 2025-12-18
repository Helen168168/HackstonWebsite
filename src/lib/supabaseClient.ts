import { createClient } from '@supabase/supabase-js';

/**
 * Supabase 客户端（仅用于认证）
 * 数据存储已迁移到飞书多维表格
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase 环境变量未配置。认证功能将不可用。');
  console.warn('请在项目根目录创建 .env 文件并添加以下配置：');
  console.warn('VITE_SUPABASE_URL=your_supabase_url');
  console.warn('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
}

// 使用合法的占位符以避免错误，实际认证功能需要真实凭据
// 注意：这是一个虚拟的但格式正确的URL和key，仅用于避免初始化错误
export const supabaseAuth = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'
);

