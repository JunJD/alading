# Next.js 领域驱动实现方案

## 一、项目结构

```typescript
const projectStructure = {
  src: {
    // 领域层
    domains: {
      // 面试领域
      interview: {
        models: '领域模型',
        events: '领域事件',
        services: '领域服务',
        repositories: '数据访问'
      },
      // 支付领域
      payment: {
        models: '领域模型',
        events: '领域事件',
        services: '领域服务',
        repositories: '数据访问'
      }
    },

    // 共享层
    shared: {
      // 事件总线
      events: {
        eventBus: '事件发布订阅',
        eventTypes: '事件类型定义'
      },
      // 基础设施
      infrastructure: {
        database: '数据库配置',
        cache: '缓存服务',
        logger: '日志服务'
      }
    },

    // API路由层
    app: {
      api: {
        interview: 'API路由',
        payment: 'API路由'
      }
    }
  }
}
```

## 二、事件总线实现

```typescript
// src/shared/events/eventBus.ts
export class EventBus {
  private static instance: EventBus;
  private subscribers: Map<string, Function[]>;

  private constructor() {
    this.subscribers = new Map();
  }

  static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  // 发布事件
  publish(event: DomainEvent) {
    const subscribers = this.subscribers.get(event.type) || [];
    subscribers.forEach(handler => handler(event));
  }

  // 订阅事件
  subscribe(eventType: string, handler: Function) {
    const subscribers = this.subscribers.get(eventType) || [];
    this.subscribers.set(eventType, [...subscribers, handler]);
  }
}

// 使用示例
const eventBus = EventBus.getInstance();

// 支付领域发布事件
eventBus.publish({
  type: 'PaymentCompleted',
  data: { orderId, accessCode }
});

// 面试领域订阅事件
eventBus.subscribe('PaymentCompleted', async (event) => {
  await interviewService.prepareSession(event.data);
});
```

## 三、领域服务实现

```typescript
// src/domains/payment/services/paymentService.ts
export class PaymentService {
  private eventBus: EventBus;

  constructor() {
    this.eventBus = EventBus.getInstance();
  }

  async handlePaymentCallback(data: PaymentCallback) {
    // 1. 处理支付回调
    const order = await this.processPayment(data);
    
    // 2. 生成访问码
    const accessCode = await this.generateAccessCode(order);

    // 3. 发布事件
    this.eventBus.publish({
      type: 'PaymentCompleted',
      data: {
        orderId: order.id,
        accessCode: accessCode.code
      }
    });
  }
}

// src/domains/interview/services/interviewService.ts
export class InterviewService {
  private eventBus: EventBus;

  constructor() {
    this.eventBus = EventBus.getInstance();
    // 订阅支付完成事件
    this.eventBus.subscribe(
      'PaymentCompleted',
      this.handlePaymentCompleted.bind(this)
    );
  }

  private async handlePaymentCompleted(event: PaymentCompletedEvent) {
    // 准备面试会话
    await this.prepareSession(event.data);
  }
}
```

## 四、API路由实现

```typescript
// src/app/api/payment/callback/route.ts
import { PaymentService } from '@/domains/payment/services';

export async function POST(req: Request) {
  const paymentService = new PaymentService();
  const data = await req.json();

  try {
    await paymentService.handlePaymentCallback(data);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// src/app/api/interview/session/route.ts
import { InterviewService } from '@/domains/interview/services';

export async function POST(req: Request) {
  const interviewService = new InterviewService();
  const { accessCode } = await req.json();

  try {
    const session = await interviewService.createSession(accessCode);
    return Response.json(session);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

## 五、状态管理

```typescript
// src/domains/shared/state/store.ts
import { create } from 'zustand';

// 面试领域状态
const useInterviewStore = create((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null })
}));

// 支付领域状态
const usePaymentStore = create((set) => ({
  order: null,
  setOrder: (order) => set({ order }),
  clearOrder: () => set({ order: null })
}));
```

## 六、性能优化

```typescript
const optimizations = {
  // 事件处理优化
  eventHandling: {
    // 批量处理
    batchProcessing: `
      const batchSize = 10;
      let eventQueue = [];

      const processBatch = async () => {
        const batch = eventQueue.splice(0, batchSize);
        await Promise.all(batch.map(processEvent));
      };
    `,

    // 错误重试
    errorRetry: `
      const retryWithBackoff = async (fn, maxRetries = 3) => {
        for (let i = 0; i < maxRetries; i++) {
          try {
            return await fn();
          } catch (error) {
            if (i === maxRetries - 1) throw error;
            await delay(Math.pow(2, i) * 1000);
          }
        }
      };
    `
  },

  // 缓存策略
  caching: {
    // 使用 Vercel KV
    implementation: `
      const cache = await kv.get(\`session:\${sessionId}\`);
      if (!cache) {
        const data = await fetchData();
        await kv.set(\`session:\${sessionId}\`, data);
      }
    `
  }
}
``` 