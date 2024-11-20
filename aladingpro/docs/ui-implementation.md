# UI实现细节

## 一、布局结构

```typescript
const layoutStructure = {
  // 主布局
  mainLayout: {
    // 顶部导航
    header: {
      height: '64px',
      position: 'fixed',
      components: [
        'Logo',
        '主导航菜单',
        '用户信息/头像'
      ],
      style: {
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }
    },

    // 侧边栏
    sidebar: {
      width: '240px',
      collapsible: true,
      components: [
        '功能导航',
        '快捷操作',
        '统计信息'
      ],
      style: {
        background: '#1a1a1a',
        color: '#ffffff'
      }
    },

    // 主内容区
    content: {
      padding: '24px',
      margin: '64px 0 0 240px',
      minHeight: 'calc(100vh - 64px)'
    }
  }
}
```

## 二、色彩系统

```typescript
const colorSystem = {
  // 主题色
  primary: {
    main: '#2563EB',      // 主色
    light: '#60A5FA',     // 亮色
    dark: '#1E40AF',      // 暗色
    contrast: '#FFFFFF'    // 对比色
  },

  // 功能色
  functional: {
    success: '#10B981',   // 成功
    warning: '#F59E0B',   // 警告
    error: '#EF4444',     // 错误
    info: '#3B82F6'       // 信息
  },

  // 中性色
  neutral: {
    title: '#1F2937',     // 标题
    text: '#4B5563',      // 正文
    secondary: '#9CA3AF', // 次要文字
    border: '#E5E7EB',    // 边框
    background: '#F9FAFB' // 背景
  },

  // 深色模式
  dark: {
    background: '#1A1A1A',
    surface: '#262626',
    text: '#E5E7EB'
  }
}
```

## 三、字体系统

```typescript
const typography = {
  // 字体家族
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    code: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier'
  },

  // 字号
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px'
  },

  // 字重
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },

  // 行高
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
}
```

## 四、组件样式

```typescript
const componentStyles = {
  // 卡片
  card: {
    borderRadius: '8px',
    shadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    padding: '24px',
    background: '#FFFFFF'
  },

  // 按钮
  button: {
    primary: {
      background: '#2563EB',
      hover: '#1E40AF',
      active: '#1E3A8A'
    },
    height: {
      small: '32px',
      default: '40px',
      large: '48px'
    },
    borderRadius: '6px'
  },

  // 输入框
  input: {
    height: '40px',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #E5E7EB'
  },

  // 菜单项
  menuItem: {
    height: '40px',
    padding: '0 16px',
    hover: {
      background: 'rgba(37, 99, 235, 0.1)'
    }
  }
}
```

## 五、响应式设计

```typescript
const responsive = {
  // 断点
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // 布局调整
  layout: {
    sidebar: {
      lg: 'visible',
      md: 'collapsible',
      sm: 'overlay'
    },
    content: {
      padding: {
        lg: '24px',
        md: '16px',
        sm: '12px'
      }
    }
  }
}
```

## 六、动画效果

```typescript
const animations = {
  // 过渡效果
  transition: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease'
  },

  // 页面切换
  pageTransition: {
    enter: 'fade-enter',
    leave: 'fade-leave'
  },

  // 交互反馈
  interaction: {
    hover: 'scale(1.02)',
    active: 'scale(0.98)',
    press: 'scale(0.95)'
  }
}
```

## 七、布局示例

```tsx
// 主布局组件
const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 顶部导航 */}
      <header className="fixed top-0 w-full h-16 bg-white shadow-sm z-50">
        <nav className="flex items-center justify-between px-6 h-full">
          <Logo />
          <MainNav />
          <UserInfo />
        </nav>
      </header>

      {/* 侧边栏 */}
      <aside className={`fixed left-0 h-full bg-dark transition-all ${
        collapsed ? 'w-20' : 'w-60'
      }`}>
        <SidebarNav collapsed={collapsed} />
        <CollapseButton 
          collapsed={collapsed}
          onClick={() => setCollapsed(!collapsed)}
        />
      </aside>

      {/* 主内容区 */}
      <main className={`min-h-screen transition-all ${
        collapsed ? 'ml-20' : 'ml-60'
      } pt-16 px-6`}>
        {children}
      </main>
    </div>
  );
};
``` 