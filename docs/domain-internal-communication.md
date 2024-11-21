# 领域内外通信设计

## 一、领域内部通信

```typescript
const internalCommunication = {
  // 直接方法调用
  directCall: {
    example: `
      // 支付领域内部
      class PaymentService {
        constructor(
          private orderRepository: OrderRepository,
          private accessCodeService: AccessCodeService
        ) {}

        async handlePayment(data: PaymentData) {
          // 1. 直接调用订单处理
          const order = await this.orderRepository.updateStatus(
            data.orderId, 
            'PAID'
          );

          // 2. 直接调用访问码生成
          const accessCode = await this.accessCodeService.generate(
            order.id
          );

          return { order, accessCode };
        }
      }
    `
  },

  // 同步流程
  synchronousFlow: {
    advantages: [
      '直接调用更简单',
      '类型安全',
      '调试容易',
      '事务管理简单'
    ]
  }
}
```

## 二、领域间通信

```typescript
const crossDomainCommunication = {
  // 事件驱动
  eventDriven: {
    example: `
      // 支付领域
      class PaymentService {
        constructor(private eventBus: EventBus) {}

        async handlePayment(data: PaymentData) {
          // 1. 处理支付
          const order = await this.processPayment(data);

          // 2. 发布事件（通知其他领域）
          this.eventBus.publish({
            type: 'PaymentCompleted',
            data: { orderId: order.id }
          });
        }
      }

      // 面试领域
      class InterviewService {
        constructor(private eventBus: EventBus) {
          // 订阅支付事件
          this.eventBus.subscribe(
            'PaymentCompleted',
            this.handlePaymentCompleted.bind(this)
          );
        }
      }
    `,
    advantages: [
      '领域解耦',
      '异步处理',
      '扩展性好'
    ]
  }
}
```

## 三、通信原则

```typescript
const communicationPrinciples = {
  // 领域内部
  internal: {
    principles: [
      '直接方法调用',
      '强类型约束',
      '同步处理为主',
      '事务完整性'
    ],
    scope: [
      '同一个领域的服务之间',
      '领域对象之间',
      'Repository访问'
    ]
  },

  // 领域之间
  external: {
    principles: [
      '事件驱动',
      '最终一致性',
      '异步处理',
      '领域隔离'
    ],
    scope: [
      '不同领域之间',
      '核心领域与支撑领域',
      '领域与外部系统'
    ]
  }
}
```

## 四、实现示例

```typescript
// 领域内部通信示例
class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private paymentProcessor: PaymentProcessor,
    private accessCodeGenerator: AccessCodeGenerator
  ) {}

  async createOrder(data: OrderData) {
    // 1. 创建订单 - 直接调用
    const order = await this.orderRepo.create(data);

    // 2. 处理支付 - 直接调用
    const payment = await this.paymentProcessor.process(order);

    // 3. 生成访问码 - 直接调用
    const accessCode = await this.accessCodeGenerator.generate(order);

    return { order, payment, accessCode };
  }
}

// 领域间通信示例
class PaymentDomain {
  constructor(private eventBus: EventBus) {}

  async handlePaymentSuccess(orderId: string) {
    // 领域内部处理完成后，通知其他领域
    this.eventBus.publish({
      type: 'PaymentCompleted',
      data: { orderId }
    });
  }
}
```

## 五、最佳实践

```typescript
const bestPractices = {
  // 领域内通信
  internal: {
    do: [
      '使用依赖注入',
      '保持同步调用',
      '使用强类型',
      '维护事务边界'
    ],
    dont: [
      '不使用事件总线',
      '避免异步操作',
      '不跨领域直接调用'
    ]
  },

  // 领域间通信
  external: {
    do: [
      '使用事件通信',
      '保持领域独立',
      '处理最终一致性',
      '实现幂等性'
    ],
    dont: [
      '不直接调用其他领域方法',
      '避免同步等待其他领域',
      '不共享领域对象'
    ]
  }
}
``` 