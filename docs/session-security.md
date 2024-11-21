# 会话安全设计

## 一、安全策略

```typescript
const securityStrategy = {
  // 会话ID设计
  sessionId: {
    format: {
      prefix: 'si_',  // session_interview
      random: '32字节随机数',
      timestamp: '时间戳'
    },
    // 服务端验证规则
    validation: [
      '验证会话是否存在',
      '检查IP地址是否匹配',
      '验证设备指纹',
      '检查使用时间间隔'
    ]
  },

  // 设备指纹
  deviceFingerprint: {
    factors: [
      'userAgent',
      'screen resolution',
      'timezone',
      'language',
      'installed plugins',
      'canvas fingerprint'
    ],
    implementation: `
      const generateFingerprint = async () => {
        const fp = await FingerprintJS.load();
        return await fp.get();
      };
    `
  }
}
```

## 二、Redis存储结构

```typescript
const redisSchema = {
  // 会话信息
  session: {
    key: 'session:{sessionId}',
    value: {
      accessCode: '访问码',
      fingerprint: '设备指纹',
      ipAddress: 'IP地址',
      lastAccessTime: '最后访问时间',
      createdAt: '创建时间',
      status: '会话状态'
    },
    ttl: '24小时'
  },

  // 访问控制
  rateLimit: {
    key: 'rate:{ip}:{sessionId}',
    value: '访问次数',
    ttl: '1分钟'
  }
}
```

## 三、会话验证中间件

```typescript
const sessionMiddleware = `
  export async function validateSession(req: Request) {
    const sessionId = req.headers['x-session-id'];
    const fingerprint = req.headers['x-device-fingerprint'];
    const ip = req.headers['x-real-ip'];

    // 1. 基础验证
    if (!sessionId || !fingerprint) {
      throw new Error('Missing session credentials');
    }

    // 2. 获取会话信息
    const session = await redis.get(\`session:\${sessionId}\`);
    if (!session) {
      throw new Error('Invalid session');
    }

    // 3. 设备指纹验证
    if (session.fingerprint !== fingerprint) {
      throw new Error('Device mismatch');
    }

    // 4. IP地址验证（可选，考虑移动网络）
    if (session.ipAddress !== ip) {
      // 记录异常但不一定要阻止访问
      logger.warn('IP address changed', { sessionId, oldIp: session.ipAddress, newIp: ip });
    }

    // 5. 访问频率控制
    const rateKey = \`rate:\${ip}:\${sessionId}\`;
    const accessCount = await redis.incr(rateKey);
    if (accessCount === 1) {
      await redis.expire(rateKey, 60); // 1分钟过期
    }
    if (accessCount > 100) { // 每分钟最多100次请求
      throw new Error('Rate limit exceeded');
    }

    // 6. 更新最后访问时间
    await redis.hset(\`session:\${sessionId}\`, 'lastAccessTime', Date.now());

    return session;
  }
`;
```

## 四、客户端实现

```typescript
const clientImplementation = `
  // 初始化会话
  const initSession = async (accessCode: string) => {
    // 1. 生成设备指纹
    const fingerprint = await generateFingerprint();

    // 2. 创建会话
    const response = await fetch('/api/interview/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-device-fingerprint': fingerprint
      },
      body: JSON.stringify({ accessCode })
    });

    const { sessionId } = await response.json();

    // 3. 存储会话信息（内存中）
    sessionStorage.setItem('interview_session', JSON.stringify({
      sessionId,
      fingerprint
    }));

    return sessionId;
  };

  // API请求封装
  const api = {
    chat: async (message: string) => {
      const session = JSON.parse(
        sessionStorage.getItem('interview_session')
      );

      if (!session) {
        throw new Error('No active session');
      }

      return fetch('/api/interview/chat', {
        method: 'POST',
        headers: {
          'x-session-id': session.sessionId,
          'x-device-fingerprint': session.fingerprint
        },
        body: JSON.stringify({ message })
      });
    }
  };
`;
```

## 五、异常处理

```typescript
const errorHandling = {
  // 会话异常类型
  sessionErrors: {
    'SESSION_EXPIRED': '会话已过期',
    'DEVICE_MISMATCH': '设备不匹配',
    'RATE_LIMIT': '访问频率超限',
    'INVALID_SESSION': '无效会话'
  },

  // 处理策略
  strategies: {
    'SESSION_EXPIRED': '重新验证访问码',
    'DEVICE_MISMATCH': '记录安全事件',
    'RATE_LIMIT': '实施递增延迟',
    'INVALID_SESSION': '清除会话状态'
  }
}
``` 