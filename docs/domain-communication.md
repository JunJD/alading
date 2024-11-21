# 领域间通信设计

## 一、通信方式

### 1. 事件驱动
```typescript
const eventDriven = {
  // 支付领域事件
  paymentEvents: {
    PaymentCompleted: {
      data: {
        orderId: string,
        accessCode: string,
        expireAt: Date
      },
      handlers: [
        'interview.createSession',  // 面试领域监听并处理
        'notification.sendEmail'    // 通知领域监听并处理
      ]
    }
  },

  // 面试领域事件
  interviewEvents: {
    InterviewStarted: {
      data: {
        sessionId: string,
        accessCode: string
      },
      handlers: [
        'payment.updateAccessCodeStatus'  // 支付领域更新访问码状态
      ]
    }
  }
}
```

### 2. 共享数据
```typescript
const sharedData = {
  // 共享模型
  models: {
    AccessCode: {
      // 两个领域都可以访问，但有各自的职责
      payment: {
        responsibility: '生成和管理访问码',
        operations: ['create', 'update']
      },
      interview: {
        responsibility: '验证和使用访问码',
        operations: ['read', 'validate']
      }
    }
  }
}
```

## 二、通信原则

### 1. 领域边界
```typescript
const boundaries = {
  // 数据所有权
  ownership: {
    payment: [
      'Order',
      'Payment',
      'AccessCode'
    ],
    interview: [
      'Session',
      'QARecord',
      'Feedback'
    ]
  },

  // 访问控制
  access: {
    // 跨域访问规则
    rules: {
      'payment->interview': '通过事件通知',
      'interview->payment': '通过查询接口'
    }
  }
}
```

### 2. 通信规范
```typescript
const communicationRules = {
  // 同步通信
  sync: {
    // 访问码验证
    accessCodeValidation: {
      request: '面试域请求验证',
      response: '支付域返回结果',
      fallback: '本地缓存验证'
    }
  },

  // 异步通信
  async: {
    // 支付完成
    paymentCompletion: {
      publisher: '支付域发布事件',
      subscriber: '面试域订阅处理',
      retry: '失败重试机制'
    }
  }
}
```

## 三、实现方式

### 1. 事件总线
```typescript
const eventBus = {
  // 事件发布
  publish: {
    implementation: `
      // 支付完成后发布事件
      eventBus.publish('PaymentCompleted', {
        orderId,
        accessCode,
        expireAt
      });
    `
  },

  // 事件订阅
  subscribe: {
    implementation: `
      // 面试域订阅支付完成事件
      eventBus.subscribe('PaymentCompleted', async (data) => {
        await interviewService.prepareSession(data);
      });
    `
  }
}
```

### 2. 共享存储
```typescript
const sharedStorage = {
  // 数据库设计
  database: {
    // 共享表
    sharedTables: {
      access_codes: {
        columns: [
          'id',
          'code',
          'status',
          'expire_at'
        ],
        indexes: [
          'code_idx',
          'status_idx'
        ]
      }
    },
    
    // 访问控制
    permissions: {
      payment: 'READ WRITE',
      interview: 'READ ONLY'
    }
  }
}
```

## 四、最佳实践

```typescript
const bestPractices = {
  // 解耦策略
  decoupling: {
    // 避免直接依赖
    practices: [
      '使用事件而不是直接调用',
      '通过共享模型交换数据',
      '维护清晰的领域边界'
    ]
  },

  // 容错处理
  faultTolerance: {
    // 失败处理
    errorHandling: [
      '事件重试机制',
      '数据一致性检查',
      '补偿事务处理'
    ]
  },

  // 性能优化
  performance: {
    // 优化策略
    strategies: [
      '使用本地缓存',
      '批量处理事件',
      '异步处理非关键流程'
    ]
  }
}
``` 