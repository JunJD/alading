'use client';

import { useState } from 'react';
import { useConfigStore } from '@/stores/config';
import toast from 'react-hot-toast';


export default function AIConfig() {
  const { config, setConfig } = useConfigStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setConfig(config!);
      toast.success('配置已保存');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存配置失败');
      toast.error('保存配置失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">API Key</label>
        <input
          type="password"
          value={config!.apiKey}
          onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                   text-white placeholder-white/40 focus:outline-none focus:ring-2 
                   focus:ring-blue-500/40 focus:border-transparent"
          placeholder="sk-..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Model</label>
        <select
          value={config!.model}
          onChange={(e) => setConfig({ ...config, model: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                   text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 
                   focus:border-transparent"
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4o-mini">GPT-4o-mini</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
          <option value="gpt-4o">GPT-4o</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Base URL</label>
        <input
          type="text"
          value={config!.baseUrl}
          onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                   text-white placeholder-white/40 focus:outline-none focus:ring-2 
                   focus:ring-blue-500/40 focus:border-transparent"
          placeholder="https://api.openai.com/v1"
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 
                 disabled:bg-blue-500/50 disabled:cursor-not-allowed
                 text-white rounded-lg transition-colors duration-200"
      >
        {loading ? '保存中...' : '保存配置'}
      </button>
    </form>
  );
} 