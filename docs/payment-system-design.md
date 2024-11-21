# 支付系统设计方案

## 一、系统架构

```typescript
const paymentSystem = {
  // 支付方式
  paymentMethods: {
    alipay: {
      type: '个人当面付',
      features: [
        '扫码支付',
        '订单同步',
        '支付回调'
      ],
      advantages: [
        '接入门槛低',
        '费率优惠',
        '到账快速'
      ]
    },
    // 后续扩展
    future: [
      'WeChatPay',
      'UnionPay',
      'DigitalRMB'
    ]
  },

  // 订单系统
  orderSystem: {
    // 订单模型
    schema: `
      model Order {
        id          String      @id @default(uuid())
        userId      String
        productId   String
        amount      Decimal
        status      OrderStatus @default(PENDING)
        paymentId   String?     // 支付宝交易号
        createdAt   DateTime    @default(now())
        updatedAt   DateTime    @updatedAt
        
        user        User        @relation(fields: [userId], references: [id])
        product     Product     @relation(fields: [productId], references: [id])
      }

      enum OrderStatus {
        PENDING    // 待支付
        PAID       // 已支付
        CANCELLED  // 已取消
        REFUNDED   // 已退款
      }
    `
  }
}
```

## 二、支付流程实现

```typescript
const paymentFlow = {
  // 创建订单
  createOrder: `
    export async function createOrder(userId: string, productId: string) {
      // 1. 验证产品和用户
      const [user, product] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.product.findUnique({ where: { id: productId } })
      ]);

      // 2. 创建订单
      const order = await prisma.order.create({
        data: {
          userId,
          productId,
          amount: product.price,
          status: 'PENDING'
        }
      });

      // 3. 生成支付二维码
      const qrCode = await generateAlipayQRCode({
        orderId: order.id,
        amount: order.amount,
        subject: product.name
      });

      return { order, qrCode };
    }
  `,

  // 支付回调处理
  handleCallback: `
    export async function handleAlipayCallback(data: AlipayCallback) {
      // 1. 验证签名
      if (!verifyAlipaySignature(data)) {
        throw new Error('Invalid signature');
      }

      // 2. 更新订单状态
      const order = await prisma.order.update({
        where: { id: data.out_trade_no },
        data: {
          status: 'PAID',
          paymentId: data.trade_no,
          updatedAt: new Date()
        }
      });

      // 3. 触发后续流程
      await activateUserAccess(order.userId, order.productId);
      
      return { success: true };
    }
  `
}
```

## 三、访问码机制

```typescript
const accessCodeSystem = {
  // 访问码模型
  schema: `
    model AccessCode {
      code        String      @id @unique
      productId   String
      orderId     String?     // 购买订单ID
      status      CodeStatus  @default(AVAILABLE)
      activatedAt DateTime?   // 激活时间
      expiresAt   DateTime    // 过期时间
      createdAt   DateTime    @default(now())
      
      product     Product     @relation(fields: [productId], references: [id])
      order       Order?      @relation(fields: [orderId], references: [id])
    }

    enum CodeStatus {
      AVAILABLE   // 可用
      ACTIVATED   // 已激活
      EXPIRED     // 已过期
    }
  `,

  // 访问码生成
  generation: `
    function generateAccessCode() {
      return crypto
        .randomBytes(16)
        .toString('base64')
        .replace(/[+/=]/g, '')
        .substring(0, 12)
        .toUpperCase();
    }
  `,

  // 访问码激活
  activation: `
    export async function activateAccessCode(code: string, userId: string) {
      const accessCode = await prisma.accessCode.findUnique({
        where: { code }
      });

      // 验证有效性
      if (!accessCode || accessCode.status !== 'AVAILABLE') {
        throw new Error('Invalid access code');
      }

      // 激活访问码
      await prisma.$transaction([
        // 更新访问码状态
        prisma.accessCode.update({
          where: { code },
          data: {
            status: 'ACTIVATED',
            activatedAt: new Date()
          }
        }),
        // 授予用户权限
        prisma.userAccess.create({
          data: {
            userId,
            productId: accessCode.productId,
            expiresAt: accessCode.expiresAt
          }
        })
      ]);
    }
  `
}
```

## 四、安全措施

```typescript
const security = {
  // 签名验证
  signature: {
    alipay: `
      function verifyAlipaySignature(params: Record<string, string>) {
        const sign = params.sign;
        delete params.sign;
        delete params.sign_type;
        
        const sortedParams = Object.keys(params)
          .sort()
          .map(key => \`\${key}=\${params[key]}\`)
          .join('&');
          
        return crypto
          .createVerify('RSA-SHA256')
          .update(sortedParams)
          .verify(ALIPAY_PUBLIC_KEY, sign, 'base64');
      }
    `
  },

  // 防重放攻击
  antiReplay: {
    implementation: `
      const REPLAY_WINDOW = 5 * 60 * 1000; // 5分钟窗口
      
      async function checkReplay(notifyId: string, timestamp: number) {
        // 检查时间窗口
        if (Date.now() - timestamp > REPLAY_WINDOW) {
          throw new Error('Notification expired');
        }
        
        // 检查通知ID是否已处理
        const exists = await redis.exists(\`notify:\${notifyId}\`);
        if (exists) {
          throw new Error('Duplicate notification');
        }
        
        // 记录通知ID
        await redis.setex(
          \`notify:\${notifyId}\`,
          REPLAY_WINDOW / 1000,
          '1'
        );
      }
    `
  }
}
```

## 五、错误处理

```typescript
const errorHandling = {
  // 支付错误类型
  errorTypes: {
    PaymentError: '支付相关错误基类',
    OrderNotFoundError: '订单不存在',
    PaymentTimeoutError: '支付超时',
    SignatureVerificationError: '签名验证失败',
    DuplicatePaymentError: '重复支付',
    RefundError: '退款失败'
  },

  // 错误处理策略
  strategies: {
    // 支付失败重试
    retryStrategy: `
      async function retryPayment(orderId: string, maxAttempts = 3) {
        let attempts = 0;
        while (attempts < maxAttempts) {
          try {
            return await processPayment(orderId);
          } catch (error) {
            attempts++;
            if (attempts === maxAttempts) throw error;
            await delay(1000 * Math.pow(2, attempts)); // 指数退避
          }
        }
      }
    `,

    // 订单状态恢复
    orderRecovery: `
      async function recoverOrderStatus(orderId: string) {
        // 查询支付宝订单状态
        const alipayStatus = await queryAlipayOrder(orderId);
        
        // 同步本地订单状态
        await prisma.order.update({
          where: { id: orderId },
          data: { status: convertAlipayStatus(alipayStatus) }
        });
      }
    `
  }
}
```

## 六、监控告警

```typescript
const monitoring = {
  // 监控指标
  metrics: [
    '支付成功率',
    '支付延迟',
    '回调成功率',
    '订单完成时间',
    '异常支付次数'
  ],

  // 告警规则
  alerts: {
    paymentFailure: '支付失败率超过5%',
    callbackTimeout: '回调延迟超过30秒',
    systemError: '系统错误率超过1%',
    unusualActivity: '异常支付活动检测'
  },

  // 日志记录
  logging: `
    async function logPaymentActivity(data: PaymentActivity) {
      await prisma.paymentLog.create({
        data: {
          orderId: data.orderId,
          action: data.action,
          status: data.status,
          errorCode: data.errorCode,
          metadata: data.metadata
        }
      });
    }
  `
}
``` 