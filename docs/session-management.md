# 会话管理设计

## 一、会话流程

```typescript
const sessionFlow = {
  // 1. 访问码验证
  accessCodeVerification: {
    input: '访问码',
    process: [
      '验证访问码有效性',
      '创建面试会话',
      '生成会话ID'
    ],
    output: {
      sessionId: '会话唯一标识',
      expireAt: '会话过期时间'
    }
  },

  // 2. 会话管理
  sessionManagement: {
    storage: {
      // Redis存储结构
      key: 'session:{sessionId}',
      value: {
        accessCode: '关联的访问码',
        startTime: '开始时间',
        expireAt: '过期时间',
        status: '会话状态'
      },
      ttl: '24小时'  // 会话有效期
    }
  }
}
```

## 二、安全控制

```typescript
const security = {
  // 会话ID生成
  sessionIdGeneration: {
    method: 'uuid v4',
    format: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    entropy: '122位随机性'
  },

  // 访问控制
  accessControl: {
    // API接口保护
    apiProtection: `
      // 中间件实现
      const validateSession = async (req, res, next) => {
        const sessionId = req.headers['x-session-id'];
        
        // 1. 验证会话存在
        const session = await redis.get(\`session:\${sessionId}\`);
        if (!session) {
          return res.status(401).json({
            error: 'Invalid session'
          });
        }
        
        // 2. 检查会话是否过期
        if (new Date() > session.expireAt) {
          return res.status(401).json({
            error: 'Session expired'
          });
        }

        // 3. 附加会话信息
        req.session = session;
        next();
      };
    `
  }
}
```

## 三、接口调整

```typescript
const apiEndpoints = {
  // 1. 创建会话
  createSession: {
    url: '/api/interview/session',
    method: 'POST',
    body: {
      accessCode: '访问码'
    },
    response: {
      sessionId: '会话ID',
      expireAt: '过期时间'
    }
  },

  // 2. 面试对话
  chat: {
    url: '/api/interview/chat',
    method: 'POST',
    headers: {
      'x-session-id': '会话ID'  // 用会话ID替代token
    },
    body: {
      message: '用户输入'
    }
  }
}
```

## 四、客户端实现

```typescript
const clientImplementation = {
  // 会话管理
  sessionManagement: `
    // 存储会话信息
    const storeSession = (sessionId: string, expireAt: Date) => {
      localStorage.setItem('interview_session', JSON.stringify({
        sessionId,
        expireAt
      }));
    };

    // API调用封装
    const api = {
      chat: async (message: string) => {
        const session = JSON.parse(
          localStorage.getItem('interview_session')
        );

        if (!session || new Date() > new Date(session.expireAt)) {
          throw new Error('Session expired');
        }

        return fetch('/api/interview/chat', {
          method: 'POST',
          headers: {
            'x-session-id': session.sessionId
          },
          body: JSON.stringify({ message })
        });
      }
    };
  `
}
```

## 五、错误处理

```typescript
const errorHandling = {
  // 会话相关错误
  sessionErrors: {
    'SESSION_NOT_FOUND': '会话不存在',
    'SESSION_EXPIRED': '会话已过期',
    'SESSION_INVALID': '无效的会话ID'
  },

  // 错误处理策略
  errorStrategy: {
    // 会话过期处理
    sessionExpired: [
      '清除本地会话信息',
      '重定向到访问码验证页',
      '提示用户重新验证'
    ],
    // 无效会话处理
    invalidSession: [
      '记录错误日志',
      '返回401状态码',
      '提示用户重新开始'
    ]
  }
}
``` 