import AIConfig from '@/components/settings/AIConfig';
import Link from 'next/link';
import { Icons } from '@/constants/icons';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-black/90">
      <div className="max-w-4xl mx-auto p-8">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <Icons.back className="w-6 h-6" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">系统设置</h1>
        </div>

        {/* 设置卡片 */}
        <div className="grid gap-6">
          {/* OpenAI 配置卡片 */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Icons.openai className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">OpenAI 配置</h2>
                <p className="text-sm text-white/60">配置 OpenAI API 密钥和模型参数</p>
              </div>
            </div>
            <AIConfig />
          </div>

          {/* 其他设置卡片 */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Icons.interview className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">面试设置</h2>
                <p className="text-sm text-white/60">自定义面试流程和评估标准</p>
              </div>
            </div>
            <div className="text-white/60 text-center py-8">
              更多设置选项开发中...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 