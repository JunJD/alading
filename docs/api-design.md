# API设计方案

## 一、接口分布

```typescript
const apiDistribution = {
  // 支付领域对外接口
  payment: {
    // 访问码相关
    accessCode: {
      '/api/access-code/verify': '验证访问码',
      '/api/access-code/status': '查询访问码状态'
    },
    // 支付相关
    payment: {
      '/api/payment/create': '创建订单',
      '/api/payment/callback': '支付回调'
    }
  },

  // 面试领域对外接口
  interview: {
    // 面试会话
    session: {
      '/api/interview/create': '创建面试会话',
      '/api/interview/chat': '面试对话',
      '/api/interview/:id/feedback': '获取反馈'
    }
  }
}
```

## 二、接口职责

```typescript
const apiResponsibilities = {
  // 支付领域职责
  payment: {
    主要职责: [
      '订单管理',
      '支付处理',
      '访问码生命周期管理'
    ],
    数据所有权: [
      'Order',
      'Payment',
      'AccessCode'
    ]
  },

  // 面试领域职责
  interview: {
    主要职责: [
      '面试流程管理',
      '对话处理',
      '反馈生成'
    ],
    数据所有权: [
      'Session',
      'Interaction',
      'Feedback'
    ]
  }
}
```

## 三、典型流程

```typescript
const typicalFlow = {
  // 1. 创建订单流程
  orderCreation: [
    '调用支付域创建订单',
    '生成支付二维码',
    '等待支付回调',
    '生成访问码'
  ],

  // 2. 开始面试流程
  startInterview: [
    '调用支付域验证访问码',
    '调用面试域创建会话',
    '开始面试对话',
    '生成面试反馈'
  ]
}
```

## 四、错误处理

```typescript
const errorHandling = {
  // 统一错误响应
  errorResponse: {
    format: {
      success: false,
      error: {
        code: '错误代码',
        message: '错误信息',
        details: '详细信息'
      }
    }
  },

  // 错误类型
  errorTypes: {
    payment: {
      'INVALID_ORDER': '订单无效',
      'PAYMENT_FAILED': '支付失败',
      'CODE_EXPIRED': '访问码过期'
    },
    interview: {
      'SESSION_NOT_FOUND': '会话不存在',
      'INVALID_ACCESS': '访问未授权',
      'SERVICE_ERROR': '服务异常'
    }
  }
}
```

## 五、安全考虑

```typescript
const security = {
  // 访问控制
  accessControl: {
    payment: {
      '/api/payment/*': '需要签名验证',
      '/api/access-code/*': '需要访问码'
    },
    interview: {
      '/api/interview/*': '需要会话token'
    }
  },

  // 限流策略
  rateLimit: {
    payment: {
      'verify': '100次/分钟',
      'create': '60次/分钟'
    },
    interview: {
      'chat': '120次/分钟',
      'feedback': '30次/分钟'
    }
  }
}
```

## 六、监控指标

```typescript
const monitoring = {
  // API指标
  metrics: {
    // 性能指标
    performance: [
      'API响应时间',
      '错误率',
      '并发数'
    ],
    // 业务指标
    business: [
      '支付转化率',
      '面试完成率',
      '用户满意度'
    ]
  }
}
``` 