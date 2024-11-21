# Next.js 后端开发最佳实践

## 一、目录结构设计

```typescript
const projectStructure = {
  src: {
    // API 路由
    app: {
      api: {
        // 按功能模块划分
        auth: {
          'login/route.ts': '登录接口',
          'register/route.ts': '注册接口'
        },
        interview: {
          'create/route.ts': '创建面试',
          'feedback/route.ts': '面试反馈',
          '[id]/route.ts': '面试详情'
        },
        payment: {
          'create/route.ts': '创建订单',
          'callback/route.ts': '支付回调',
          'verify/route.ts': '订单验证'
        }
      }
    },

    // 业务逻辑层
    services: {
      'interview.service.ts': '面试服务',
      'payment.service.ts': '支付服务',
      'user.service.ts': '用户服务'
    },

    // 数据访问层
    repositories: {
      'interview.repository.ts': '面试数据访问',
      'payment.repository.ts': '支付数据访问',
      'user.repository.ts': '用户数据访问'
    },

    // 工具类
    lib: {
      'prisma.ts': 'Prisma客户端',
      'redis.ts': 'Redis客户端',
      'openai.ts': 'OpenAI客户端'
    }
  }
}
```

## 二、服务层实现

```typescript
// src/services/interview.service.ts
import { InterviewRepository } from '@/repositories/interview.repository';
import { OpenAIService } from '@/lib/openai';
import { RedisService } from '@/lib/redis';

export class InterviewService {
  constructor(
    private repository: InterviewRepository,
    private openai: OpenAIService,
    private redis: RedisService
  ) {}

  // 使用依赖注入模式
  static getInstance() {
    return new InterviewService(
      new InterviewRepository(),
      new OpenAIService(),
      new RedisService()
    );
  }

  async createInterview(data: CreateInterviewDTO) {
    // 1. 验证用户权限
    await this.validateUserAccess(data.userId);

    // 2. 创建面试记录
    const interview = await this.repository.create(data);

    // 3. 初始化面试上下文
    await this.initializeContext(interview.id);

    return interview;
  }

  // 其他方法...
}
```

## 三、API 路由实现

```typescript
// src/app/api/interview/create/route.ts
import { InterviewService } from '@/services/interview.service';
import { validateRequest } from '@/lib/middleware';

export async function POST(req: Request) {
  try {
    // 1. 请求验证
    const { userId, type, settings } = await validateRequest(req, createInterviewSchema);

    // 2. 业务处理
    const service = InterviewService.getInstance();
    const interview = await service.createInterview({
      userId,
      type,
      settings
    });

    // 3. 响应处理
    return Response.json(interview, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    // 4. 错误处理
    return handleApiError(error);
  }
}
```

## 四、中间件实现

```typescript
// src/lib/middleware.ts
import { NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

// 请求验证中间件
export async function validateRequest(req: Request, schema: ZodSchema) {
  const body = await req.json();
  return schema.parse(body);
}

// 认证中间件
export async function authenticate(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('Missing token');
  }

  try {
    const user = await verifyToken(token);
    return user;
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
}

// 错误处理
export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return Response.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }

  if (error instanceof UnauthorizedError) {
    return Response.json(
      { error: error.message },
      { status: 401 }
    );
  }

  console.error('API Error:', error);
  return Response.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

## 五、类型定义

```typescript
// src/types/api.ts
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// src/types/interview.ts
export interface CreateInterviewDTO {
  userId: string;
  type: InterviewType;
  settings: InterviewSettings;
}

export interface InterviewSettings {
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  focus: string[];
}
```

## 六、性能优化

```typescript
const performanceOptimization = {
  // 缓存策略
  caching: {
    // 使用 Redis 缓存
    implementation: `
      export async function withCache<T>(
        key: string,
        fn: () => Promise<T>,
        ttl: number = 3600
      ) {
        const cached = await redis.get(key);
        if (cached) {
          return JSON.parse(cached);
        }

        const data = await fn();
        await redis.setex(key, ttl, JSON.stringify(data));
        return data;
      }
    `,

    // Edge Runtime
    edgeConfig: `
      export const runtime = 'edge';
      export const preferredRegion = 'hkg1';
    `
  },

  // 数据库优化
  database: {
    // Prisma 查询优化
    prismaOptimization: `
      // 使用 include 避免 N+1 问题
      const interviews = await prisma.interview.findMany({
        include: {
          user: true,
          feedback: true
        },
        where: {
          userId,
          status: 'COMPLETED'
        }
      });
    `
  }
}
```

## 七、错误处理

```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, 'UNAUTHORIZED');
  }
}
``` 