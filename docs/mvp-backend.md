# MVP阶段后端设计

## 一、简化的目录结构

```typescript
const mvpStructure = {
  src: {
    // API 路由
    app: {
      api: {
        // 面试相关
        interview: {
          'create/route.ts': '创建面试会话',
          'session/route.ts': '面试对话',
          'feedback/route.ts': '面试反馈'
        },
        // 支付相关
        payment: {
          'create/route.ts': '创建订单',
          'callback/route.ts': '支付回调',
          'verify/route.ts': '验证访问码'
        }
      }
    },

    // 业务逻辑
    services: {
      'interview.service.ts': '面试服务',
      'payment.service.ts': '支付服务',
      'accessCode.service.ts': '访问码服务'
    },

    // 工具类
    lib: {
      'prisma.ts': 'Prisma客户端',
      'openai.ts': 'OpenAI客户端',
      'alipay.ts': '支付宝SDK'
    }
  }
}
```

## 二、访问码验证

```typescript
// src/services/accessCode.service.ts
export class AccessCodeService {
  // 验证访问码
  async verifyCode(code: string): Promise<AccessCodeInfo> {
    const accessCode = await prisma.accessCode.findUnique({
      where: { code },
      include: { product: true }
    });

    if (!accessCode) {
      throw new Error('Invalid access code');
    }

    if (accessCode.status !== 'AVAILABLE') {
      throw new Error('Access code already used');
    }

    if (new Date() > accessCode.expiresAt) {
      throw new Error('Access code expired');
    }

    return accessCode;
  }

  // 激活访问码
  async activateCode(code: string): Promise<void> {
    await prisma.accessCode.update({
      where: { code },
      data: {
        status: 'ACTIVATED',
        activatedAt: new Date()
      }
    });
  }
}
```

## 三、面试会话管理

```typescript
// src/services/interview.service.ts
export class InterviewService {
  async createSession(accessCode: string) {
    // 1. 验证访问码
    const codeService = new AccessCodeService();
    const codeInfo = await codeService.verifyCode(accessCode);

    // 2. 创建面试会话
    const session = await prisma.interviewSession.create({
      data: {
        accessCodeId: codeInfo.id,
        productId: codeInfo.productId,
        status: 'ACTIVE',
        context: {
          create: {
            type: 'FRONTEND_INTERVIEW',
            difficulty: 'MEDIUM'
          }
        }
      }
    });

    // 3. 激活访问码
    await codeService.activateCode(accessCode);

    return session;
  }

  async processInteraction(sessionId: string, input: string) {
    // 1. 验证会话
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId }
    });

    if (!session || session.status !== 'ACTIVE') {
      throw new Error('Invalid session');
    }

    // 2. 处理对话
    const response = await this.generateResponse(session, input);

    // 3. 记录对话
    await prisma.interaction.create({
      data: {
        sessionId,
        input,
        response,
        timestamp: new Date()
      }
    });

    return response;
  }
}
```

## 四、API路由实现

```typescript
// src/app/api/interview/create/route.ts
export async function POST(req: Request) {
  try {
    const { accessCode } = await req.json();
    
    const service = new InterviewService();
    const session = await service.createSession(accessCode);

    return Response.json({ sessionId: session.id });
  } catch (error) {
    return handleApiError(error);
  }
}

// src/app/api/interview/session/route.ts
export async function POST(req: Request) {
  try {
    const { sessionId, input } = await req.json();
    
    const service = new InterviewService();
    const response = await service.processInteraction(sessionId, input);

    return Response.json({ response });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## 五、数据模型

```typescript
// schema.prisma
model AccessCode {
  id          String    @id @default(uuid())
  code        String    @unique
  productId   String
  status      String    @default("AVAILABLE")
  activatedAt DateTime?
  expiresAt   DateTime
  sessions    InterviewSession[]
}

model InterviewSession {
  id           String    @id @default(uuid())
  accessCodeId String
  productId    String
  status       String    @default("ACTIVE")
  startedAt    DateTime  @default(now())
  endedAt      DateTime?
  interactions Interaction[]
  accessCode   AccessCode @relation(fields: [accessCodeId], references: [id])
}

model Interaction {
  id        String   @id @default(uuid())
  sessionId String
  input     String
  response  String
  timestamp DateTime @default(now())
  session   InterviewSession @relation(fields: [sessionId], references: [id])
}
``` 