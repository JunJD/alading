/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { OpenAIConfig } from '@/types/config';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const config: OpenAIConfig = await request.json();
    
    // 验证配置
    if (!config.apiKey) {
      return NextResponse.json(
        { error: 'API Key 不能为空' }, 
        { status: 400 }
      );
    }

    if (!config.model) {
      return NextResponse.json(
        { error: 'Model 不能为空' }, 
        { status: 400 }
      );
    }

    if (!config.baseUrl) {
      return NextResponse.json(
        { error: 'Base URL 不能为空' }, 
        { status: 400 }
      );
    }

    const openai = new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseUrl
    });
    
    // 验证 API Key 是否有效
    try {
        console.log('config.baseUrl')
        const testResponse = await openai.models.list()
        
        // 如果能成功获取模型列表，说明配置正确
        if (testResponse.data && testResponse.data.length > 0) {
            return NextResponse.json({ 
                success: true,
                message: '配置验证成功'
            });
        } else {
            return NextResponse.json(
                { error: '无法获取模型列表，请检查配置' }, 
                { status: 400 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: '无法连接到 OpenAI 服务: ' + error.message }, 
            { status: 400 }
        );
    }

    
  } catch (error: any) {
    console.error('配置验证错误:', error.message);
    return NextResponse.json(
      { error: '请求格式错误' }, 
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: '配置服务正常运行'
  });
} 