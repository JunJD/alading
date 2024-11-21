# 系统领域划分

## 一、面试领域 (Interview Domain)

### 1. 核心概念
- 面试会话 (Interview Session)
- 面试官 (Interviewer)
- 问答记录 (QA Record)
- 面试反馈 (Feedback)

### 2. 业务规则
- 一次会话只能进行一场面试
- 面试过程必须记录问答内容
- 面试结束必须生成反馈
- 面试中断可以恢复会话

### 3. 领域行为
- 创建面试会话
- 处理面试对话
- 生成面试反馈
- 管理会话状态

### 4. 边界上下文
- 上游：访问控制（验证访问码）
- 下游：AI服务（对话生成）
- 外部：音频处理服务

## 二、支付领域 (Payment Domain)

### 1. 核心概念
- 订单 (Order)
- 产品 (Product)
- 访问码 (Access Code)
- 支付记录 (Payment Record)

### 2. 业务规则
- 订单支付成功后生成访问码
- 访问码具有有效期限制
- 访问码只能使用一次
- 支付记录需要永久保存

### 3. 领域行为
- 创建支付订单
- 处理支付回调
- 生成访问码
- 验证访问权限

### 4. 边界上下文
- 上游：产品管理
- 下游：面试系统
- 外部：支付宝服务

## 三、领域交互

```typescript
const domainInteractions = {
  // 领域间通信
  communication: {
    // 支付 -> 面试
    paymentToInterview: {
      trigger: '支付成功',
      data: '访问码信息',
      purpose: '授权面试访问'
    },
    
    // 面试 -> 支付
    interviewToPayment: {
      trigger: '验证访问',
      data: '访问码',
      purpose: '验证权限'
    }
  },

  // 边界定义
  boundaries: {
    // 共享概念
    shared: [
      'AccessCode',  // 访问码（两个领域都需要理解）
      'Product'      // 产品（两个领域都需要理解）
    ],
    
    // 独立概念
    independent: {
      interview: ['Session', 'QA', 'Feedback'],
      payment: ['Order', 'Payment', 'Refund']
    }
  }
}
```

## 四、领域隔离

```typescript
const domainIsolation = {
  // 技术隔离
  technical: {
    // 独立数据库表
    database: {
      interview: ['sessions', 'qa_records', 'feedbacks'],
      payment: ['orders', 'access_codes', 'payments']
    },
    
    // 独立服务
    services: {
      interview: ['InterviewService', 'FeedbackService'],
      payment: ['PaymentService', 'AccessCodeService']
    }
  },

  // 业务隔离
  business: {
    // 独立业务流程
    processes: {
      interview: ['面试流程', '反馈生成'],
      payment: ['支付流程', '访问码管理']
    },
    
    // 独立配置管理
    configurations: {
      interview: ['面试设置', 'AI参数'],
      payment: ['支付配置', '有效期设置']
    }
  }
}
```

## 五、领域扩展性

```typescript
const domainExtensibility = {
  // 面试领域扩展
  interview: {
    features: [
      '多种面试类型',
      '自定义面试流程',
      '高级数据分析'
    ]
  },
  
  // 支付领域扩展
  payment: {
    features: [
      '多支付渠道',
      '订阅模式',
      '分销系统'
    ]
  }
}
``` 