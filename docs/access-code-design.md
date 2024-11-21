# 访问码系统设计

## 一、开源参考

```typescript
const openSourceRefs = {
  // 相关项目
  projects: {
    // 验证码生成器
    'voucher-code-generator': {
      url: 'https://github.com/voucherifyio/voucher-code-generator',
      特点: [
        '支持自定义字符集',
        '防碰撞算法',
        '可配置长度'
      ]
    },
    
    // 激活码系统
    'node-license-key': {
      url: 'https://github.com/busheezy/node-license-key',
      特点: [
        '加密算法',
        '校验机制',
        'TypeScript支持'
      ]
    }
  }
}
```

## 二、自定义实现

```typescript
// src/lib/accessCode/generator.ts
export class AccessCodeGenerator {
  private static readonly CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 排除易混淆字符
  private static readonly LENGTH = 12;
  private static readonly SEGMENT_LENGTH = 4;
  
  // 生成访问码
  static generate(): string {
    const segments: string[] = [];
    
    // 生成3段，每段4个字符
    for (let i = 0; i < 3; i++) {
      const segment = this.generateSegment();
      segments.push(segment);
    }
    
    // 用横线连接，如：ABCD-EFGH-IJKL
    return segments.join('-');
  }
  
  // 生成单个片段
  private static generateSegment(): string {
    let segment = '';
    for (let i = 0; i < this.SEGMENT_LENGTH; i++) {
      const randomIndex = crypto.getRandomValues(new Uint8Array(1))[0] % this.CHARS.length;
      segment += this.CHARS[randomIndex];
    }
    return segment;
  }
  
  // 验证格式
  static validate(code: string): boolean {
    const pattern = /^[23456789A-HJ-NP-Z]{4}-[23456789A-HJ-NP-Z]{4}-[23456789A-HJ-NP-Z]{4}$/;
    return pattern.test(code);
  }
}

// src/lib/accessCode/manager.ts
export class AccessCodeManager {
  // 创建新的访问码
  async create(productId: string, validDays: number): Promise<AccessCode> {
    // 生成唯一访问码
    let code: string;
    let isUnique = false;
    
    while (!isUnique) {
      code = AccessCodeGenerator.generate();
      const existing = await prisma.accessCode.findUnique({
        where: { code }
      });
      isUnique = !existing;
    }
    
    // 创建访问码记录
    return await prisma.accessCode.create({
      data: {
        code,
        productId,
        status: 'AVAILABLE',
        expiresAt: addDays(new Date(), validDays)
      }
    });
  }
  
  // 批量生成访问码
  async batchCreate(params: {
    productId: string;
    count: number;
    validDays: number;
  }): Promise<AccessCode[]> {
    const codes: AccessCode[] = [];
    const { productId, count, validDays } = params;
    
    for (let i = 0; i < count; i++) {
      const code = await this.create(productId, validDays);
      codes.push(code);
    }
    
    return codes;
  }
  
  // 验证并激活访问码
  async verify(code: string): Promise<VerifyResult> {
    // 1. 格式验证
    if (!AccessCodeGenerator.validate(code)) {
      throw new Error('Invalid code format');
    }
    
    // 2. 查询访问码
    const accessCode = await prisma.accessCode.findUnique({
      where: { code },
      include: { product: true }
    });
    
    if (!accessCode) {
      throw new Error('Access code not found');
    }
    
    // 3. 状态检查
    if (accessCode.status !== 'AVAILABLE') {
      throw new Error('Access code already used');
    }
    
    // 4. 过期检查
    if (new Date() > accessCode.expiresAt) {
      throw new Error('Access code expired');
    }
    
    return {
      valid: true,
      accessCode,
      product: accessCode.product
    };
  }
  
  // 使用访问码
  async activate(code: string): Promise<void> {
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

## 三、数据模型

```typescript
// schema.prisma
model AccessCode {
  id          String    @id @default(uuid())
  code        String    @unique
  productId   String
  status      String    @default("AVAILABLE") // AVAILABLE, ACTIVATED, EXPIRED
  createdAt   DateTime  @default(now())
  activatedAt DateTime?
  expiresAt   DateTime
  orderId     String?
  
  product     Product   @relation(fields: [productId], references: [id])
  order       Order?    @relation(fields: [orderId], references: [id])
}
```

## 四、使用示例

```typescript
// src/app/api/access-code/verify/route.ts
export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    
    const manager = new AccessCodeManager();
    const result = await manager.verify(code);
    
    if (result.valid) {
      // 创建面试会话
      const session = await createInterviewSession(result.accessCode);
      // 激活访问码
      await manager.activate(code);
      
      return Response.json({
        valid: true,
        sessionId: session.id
      });
    }
  } catch (error) {
    return Response.json({
      valid: false,
      error: error.message
    }, { status: 400 });
  }
}
```

## 五、安全考虑

```typescript
const security = {
  // 防暴力破解
  bruteForce: {
    // 限制尝试次数
    rateLimit: `
      const rateLimit = {
        window: 15 * 60 * 1000, // 15分钟
        max: 10 // 最大尝试次数
      }
    `,
    
    // IP封禁
    ipBan: `
      const banTime = 24 * 60 * 60 * 1000; // 24小时
    `
  },
  
  // 访问码特性
  codeFeatures: {
    长度: '12字符（不含分隔符）',
    字符集: '32个字符（排除易混淆字符）',
    分段: '4-4-4格式，提高可读性',
    组合数: '32^12 ≈ 1.15 × 10^18'
  },
  
  // 使用限制
  restrictions: {
    单次使用: '激活后立即失效',
    时效性: '设置过期时间',
    绑定关系: '与订单和产品关联'
  }
}
``` 