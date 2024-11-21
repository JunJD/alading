# 支付系统实现细节

## 一、支付宝当面付实现

```typescript
// src/lib/payment/alipay.ts
import AlipaySdk from 'alipay-sdk';
import AlipayFormData from 'alipay-sdk/lib/form';

export class AlipayService {
  private alipay: AlipaySdk;

  constructor() {
    this.alipay = new AlipaySdk({
      appId: process.env.ALIPAY_APP_ID,
      privateKey: process.env.ALIPAY_PRIVATE_KEY,
      alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY,
      gateway: 'https://openapi.alipay.com/gateway.do',
    });
  }

  // 生成支付二维码
  async generateQRCode(params: {
    orderId: string;
    amount: number;
    subject: string;
  }) {
    const formData = new AlipayFormData();
    formData.setMethod('alipay.trade.precreate');
    formData.addField('bizContent', {
      out_trade_no: params.orderId,
      total_amount: params.amount,
      subject: params.subject,
    });

    const result = await this.alipay.exec(
      'alipay.trade.precreate',
      {},
      { formData }
    );

    return result.qr_code;
  }

  // 验证支付回调
  verifyCallback(params: Record<string, string>) {
    return this.alipay.checkNotifySign(params);
  }

  // 查询订单状态
  async queryOrder(orderId: string) {
    const result = await this.alipay.exec('alipay.trade.query', {
      bizContent: {
        out_trade_no: orderId,
      },
    });

    return result;
  }
}
```

## 二、订单处理

```typescript
// src/lib/payment/order.ts
import { prisma } from '@/lib/prisma';
import { AlipayService } from './alipay';

export class OrderService {
  private alipayService: AlipayService;

  constructor() {
    this.alipayService = new AlipayService();
  }

  // 创建订单
  async createOrder(data: {
    userId: string;
    productId: string;
    amount: number;
  }) {
    // 1. 创建订单记录
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        amount: data.amount,
        status: 'PENDING',
      },
    });

    // 2. 生成支付二维码
    const qrCode = await this.alipayService.generateQRCode({
      orderId: order.id,
      amount: data.amount,
      subject: `面试服务-${order.id}`,
    });

    return {
      order,
      qrCode,
    };
  }

  // 处理支付回调
  async handlePaymentCallback(params: Record<string, string>) {
    // 1. 验证签名
    const isValid = await this.alipayService.verifyCallback(params);
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    // 2. 更新订单状态
    const order = await prisma.order.update({
      where: { id: params.out_trade_no },
      data: {
        status: 'PAID',
        paymentId: params.trade_no,
      },
    });

    // 3. 生成访问码
    await this.generateAccessCode(order);

    return order;
  }

  // 生成访问码
  private async generateAccessCode(order: Order) {
    const accessCode = await prisma.accessCode.create({
      data: {
        code: generateRandomCode(),
        productId: order.productId,
        orderId: order.id,
        expiresAt: calculateExpiryDate(order.productId),
      },
    });

    // 发送邮件通知
    await sendAccessCodeEmail(order.userId, accessCode.code);
  }
}
```

## 三、API 路由实现

```typescript
// src/app/api/payment/create/route.ts
import { OrderService } from '@/lib/payment/order';

export async function POST(req: Request) {
  try {
    const { userId, productId, amount } = await req.json();
    
    const orderService = new OrderService();
    const result = await orderService.createOrder({
      userId,
      productId,
      amount,
    });

    return Response.json(result);
  } catch (error) {
    console.error('Create order error:', error);
    return Response.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// src/app/api/payment/callback/route.ts
export async function POST(req: Request) {
  try {
    const params = await req.formData();
    const orderService = new OrderService();
    
    await orderService.handlePaymentCallback(
      Object.fromEntries(params.entries())
    );

    return new Response('success');
  } catch (error) {
    console.error('Payment callback error:', error);
    return new Response('fail');
  }
}
```

## 四、前端组件实现

```typescript
// src/components/payment/QRCodePayment.tsx
import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

export function QRCodePayment({
  productId,
  amount,
  onSuccess,
}: {
  productId: string;
  amount: number;
  onSuccess: () => void;
}) {
  const [qrCode, setQRCode] = useState<string>('');
  const [status, setStatus] = useState<'pending' | 'paid'>('pending');

  // 创建订单并获取二维码
  useEffect(() => {
    async function createOrder() {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          amount,
          userId: 'current-user-id', // 从认证上下文获取
        }),
      });

      const { qrCode } = await response.json();
      setQRCode(qrCode);
    }

    createOrder();
  }, [productId, amount]);

  // 轮询检查支付状态
  useEffect(() => {
    if (!qrCode || status === 'paid') return;

    const interval = setInterval(async () => {
      const response = await fetch('/api/payment/status?orderId=xxx');
      const { status: orderStatus } = await response.json();

      if (orderStatus === 'PAID') {
        setStatus('paid');
        onSuccess();
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [qrCode, status, onSuccess]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        支付金额: ¥{amount}
      </h3>
      
      {qrCode ? (
        <div className="flex flex-col items-center">
          <QRCode value={qrCode} size={200} />
          <p className="mt-4 text-gray-600">
            请使用支付宝扫码支付
          </p>
        </div>
      ) : (
        <div className="flex justify-center">
          <span className="loading loading-spinner" />
        </div>
      )}

      {status === 'paid' && (
        <div className="mt-4 text-center text-green-600">
          支付成功！
        </div>
      )}
    </div>
  );
}
```

## 五、环境变量配置

```env
# .env.local
# 支付宝配置
ALIPAY_APP_ID=你的应用ID
ALIPAY_PRIVATE_KEY=你的私钥
ALIPAY_PUBLIC_KEY=支付宝公钥

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# 邮件服务配置
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

## 六、类型定义

```typescript
// src/types/payment.ts
export interface Order {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessCode {
  code: string;
  productId: string;
  orderId?: string;
  status: 'AVAILABLE' | 'ACTIVATED' | 'EXPIRED';
  activatedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}

export interface PaymentCallback {
  out_trade_no: string;    // 商户订单号
  trade_no: string;        // 支付宝交易号
  trade_status: string;    // 交易状态
  total_amount: string;    // 订单金额
  gmt_payment?: string;    // 支付时间
  [key: string]: string;   // 其他参数
}
``` 