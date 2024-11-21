# 支付流程同步设计

```typescript
// src/domains/payment/services/paymentService.ts
export class PaymentService {
  constructor(
    private orderRepository: OrderRepository,
    private accessCodeService: AccessCodeService
  ) {}

  async handlePaymentCallback(data: PaymentCallback) {
    // 使用事务确保原子性
    return await prisma.$transaction(async (tx) => {
      // 1. 验证支付
      if (!this.verifyPayment(data)) {
        throw new Error('Invalid payment');
      }

      // 2. 更新订单状态
      const order = await tx.order.update({
        where: { id: data.orderId },
        data: { status: 'PAID' }
      });

      // 3. 生成访问码（同步）
      const accessCode = await tx.accessCode.create({
        data: {
          code: generateAccessCode(),
          orderId: order.id,
          status: 'ACTIVE',
          expiresAt: calculateExpiry(order.productId)
        }
      });

      // 4. 返回结果
      return {
        success: true,
        order,
        accessCode
      };
    });
  }
}

// API路由实现
export async function POST(req: Request) {
  try {
    const paymentService = new PaymentService();
    const data = await req.json();

    // 同步处理支付回调
    const result = await paymentService.handlePaymentCallback(data);

    // 直接返回访问码
    return Response.json({
      success: true,
      accessCode: result.accessCode.code,
      expiresAt: result.accessCode.expiresAt
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

## 性能优化

```typescript
const optimizations = {
  // 数据库优化
  database: {
    // 索引优化
    indexes: [
      'orderId_idx',
      'accessCode_idx',
      'status_idx'
    ],
    // 事务隔离级别
    isolation: 'READ COMMITTED'
  },

  // 缓存策略
  caching: {
    // 热点数据缓存
    hot: [
      'product配置',
      '有效期规则'
    ],
    // 本地缓存
    local: [
      'payment验证规则',
      '访问码生成规则'
    ]
  }
}
```

## 错误处理

```typescript
const errorHandling = {
  // 重试策略
  retry: {
    maxAttempts: 3,
    delay: 100, // ms
    backoff: 'exponential'
  },

  // 降级策略
  fallback: {
    // 支付验证降级
    payment: '本地规则验证',
    // 访问码生成降级
    accessCode: '备用生成器'
  }
}
```

## 监控指标

```typescript
const monitoring = {
  // 性能指标
  performance: {
    // 关键步骤耗时
    timing: [
      'payment_verify_time',
      'access_code_gen_time',
      'total_process_time'
    ],
    // 目标值
    targets: {
      total_time: '< 1s',
      success_rate: '> 99.9%'
    }
  }
}
``` 