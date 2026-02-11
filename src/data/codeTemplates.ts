import { Sparkles, Hash, Wand2, Layout, FileCode, Grid3X3, Image, Box, Component } from 'lucide-react'
import type { ReactNode } from 'react'

export interface CodeTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: ReactNode
  preview?: string
  code: {
    html: string
    css: string
    js: string
  }
}

export const defaultTemplates: CodeTemplate[] = [
  {
    id: 'hello-world',
    name: 'Hello World',
    description: '基础的 React 组件示例',
    category: '基础',
    icon: 'Sparkles',
    code: {
      html: `<div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
  <h1 
    className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
  >
    Hello, World!
  </h1>
  <p 
    className="text-gray-600 text-lg mb-8"
  >
    欢迎来到代码游乐场，开始你的创意之旅
  </p>
  <button 
    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
    onClick={() => alert('你好！欢迎来到代码游乐场')}
  >
    开始探索
  </button>
</div>`,
      css: `/* 自定义样式 */
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}`,
      js: `// JavaScript 逻辑
console.log('Hello from Code Playground!');
console.log('当前时间:', new Date().toLocaleString());`,
    },
  },
  {
    id: 'counter',
    name: '计数器',
    description: '带状态的 React 计数器组件',
    category: '交互',
    icon: 'Hash',
    code: {
      html: `<div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
  <h2 className="text-3xl font-bold text-gray-800 mb-8">
    计数器
  </h2>
  
  <div className="flex items-center gap-6 mb-8">
    <button 
      className="w-16 h-16 bg-red-500 text-white rounded-2xl text-2xl font-bold shadow-lg"
      onClick={() => setCount(c => c - 1)}
    >
      −
    </button>
    
    <span className="text-6xl font-mono font-bold text-gray-800 w-32 text-center">
      {count}
    </span>
    
    <button 
      className="w-16 h-16 bg-green-500 text-white rounded-2xl text-2xl font-bold shadow-lg"
      onClick={() => setCount(c => c + 1)}
    >
      +
    </button>
  </div>
  
  <div className="flex gap-4">
    <button 
      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
      onClick={() => setCount(0)}
    >
      重置
    </button>
    <button 
      className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
      onClick={() => setCount(100)}
    >
      设为 100
    </button>
  </div>
</div>`,
      css: `/* 计数器样式 */
button {
  user-select: none;
}
button:active {
  transform: scale(0.95);
}`,
      js: `const [count, setCount] = useState(0);

// 监听 count 变化
useEffect(() => {
  console.log('计数器值变化:', count);
}, [count]);`,
    },
  },
  {
    id: 'animation-demo',
    name: '动画演示',
    description: 'CSS 动画示例',
    category: '动画',
    icon: 'Wand2',
    code: {
      html: `<div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl min-h-[400px]">
  <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
    动画演示
  </h2>
  
  <div className="flex justify-center gap-6 flex-wrap mb-8">
    <div
      className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg spin"
    />
    <div
      className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg pulse"
    />
    <div
      className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg morph"
    />
  </div>
  
  <div className="flex justify-center gap-4 mb-8">
    <button
      className="w-14 h-14 rounded-full shadow-lg bg-red-500"
      onClick={() => setActiveColor('#EF4444')}
    />
    <button
      className="w-14 h-14 rounded-full shadow-lg bg-green-500"
      onClick={() => setActiveColor('#10B981')}
    />
    <button
      className="w-14 h-14 rounded-full shadow-lg bg-blue-500"
      onClick={() => setActiveColor('#3B82F6')}
    />
    <button
      className="w-14 h-14 rounded-full shadow-lg bg-yellow-500"
      onClick={() => setActiveColor('#F59E0B')}
    />
    <button
      className="w-14 h-14 rounded-full shadow-lg bg-purple-500"
      onClick={() => setActiveColor('#8B5CF6')}
    />
  </div>
  
  <div
    className="h-32 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-colors duration-500"
    style={{ backgroundColor: activeColor }}
  >
    点击上方颜色按钮
  </div>
</div>`,
      css: `/* 动画样式 */
body {
  overflow-x: hidden;
}

.spin {
  animation: spin 3s linear infinite;
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}

.morph {
  animation: morph 4s ease-in-out infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

@keyframes morph {
  0%, 100% { 
    border-radius: 10%;
    transform: rotate(0deg);
  }
  50% { 
    border-radius: 50%;
    transform: rotate(180deg);
  }
}`,
      js: `const [activeColor, setActiveColor] = useState('#3B82F6');

useEffect(() => {
  console.log('当前颜色:', activeColor);
}, [activeColor]);`,
    },
  },
  {
    id: 'todo-list',
    name: '待办清单',
    description: '完整的待办事项管理组件',
    category: '应用',
    icon: 'Layout',
    code: {
      html: `<div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
    <span className="text-3xl">✓</span>
    待办清单
    <span className="text-sm font-normal text-gray-500 ml-auto">
      {todos.filter(t => !t.done).length} 待完成
    </span>
  </h2>
  
  <div className="flex gap-2 mb-6">
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && addTodo()}
      placeholder="添加新任务..."
      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      onClick={addTodo}
      className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium"
    >
      添加
    </button>
  </div>
  
  <div className="space-y-2">
    {todos.map((todo) => (
      <div
        key={todo.id}
        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group"
      >
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => toggleTodo(todo.id)}
          className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
        />
        <span className={\`flex-1 \${todo.done ? 'line-through text-gray-400' : 'text-gray-700'}\`}>
          {todo.text}
        </span>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
  
  {todos.length > 0 && (
    <div className="mt-4 pt-4 border-t flex justify-between text-sm text-gray-500">
      <span>共 {todos.length} 项</span>
      <button onClick={clearCompleted} className="text-blue-500 hover:text-blue-700">
        清除已完成
      </button>
    </div>
  )}
</div>`,
      css: `/* 待办清单样式 */
input[type="checkbox"] {
  cursor: pointer;
}
button {
  cursor: pointer;
}`,
      js: `const [todos, setTodos] = useState([
  { id: 1, text: '学习 React', done: false },
  { id: 2, text: '完成项目', done: true },
  { id: 3, text: '部署应用', done: false }
]);
const [inputValue, setInputValue] = useState('');

const addTodo = () => {
  if (!inputValue.trim()) return;
  setTodos([...todos, { id: Date.now(), text: inputValue, done: false }]);
  setInputValue('');
};

const toggleTodo = (id) => {
  setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
};

const deleteTodo = (id) => {
  setTodos(todos.filter(t => t.id !== id));
};

const clearCompleted = () => {
  setTodos(todos.filter(t => !t.done));
};`,
    },
  },
  {
    id: 'form-validation',
    name: '表单验证',
    description: '带验证的注册表单',
    category: '表单',
    icon: 'FileCode',
    code: {
      html: `<div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">用户注册</h2>
  
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
      <input
        type="text"
        value={form.username}
        onChange={(e) => setForm({...form, username: e.target.value})}
        className={\`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 \${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}\`}
        placeholder="请输入用户名"
      />
      {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({...form, email: e.target.value})}
        className={\`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 \${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}\`}
        placeholder="your@email.com"
      />
      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({...form, password: e.target.value})}
        className={\`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 \${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}\`}
        placeholder="至少6位字符"
      />
      {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
    </div>
    
    <button
      type="submit"
      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg"
    >
      注册
    </button>
  </form>
  
  {isSuccess && (
    <div
      className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl text-center"
    >
      ✅ 注册成功！
    </div>
  )}
</div>`,
      css: `/* 表单样式 */
input {
  transition: all 0.2s;
}
input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}`,
      js: `const [form, setForm] = useState({ username: '', email: '', password: '' });
const [errors, setErrors] = useState({});
const [isSuccess, setIsSuccess] = useState(false);

const validate = () => {
  const newErrors = {};
  if (!form.username.trim()) newErrors.username = '用户名不能为空';
  else if (form.username.length < 3) newErrors.username = '用户名至少3个字符';
  
  if (!form.email.trim()) newErrors.email = '邮箱不能为空';
  else if (!/^\\S+@\\S+\\.\\S+$/.test(form.email)) newErrors.email = '邮箱格式不正确';
  
  if (!form.password) newErrors.password = '密码不能为空';
  else if (form.password.length < 6) newErrors.password = '密码至少6个字符';
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (validate()) {
    setIsSuccess(true);
    console.log('表单数据:', form);
    setTimeout(() => setIsSuccess(false), 3000);
  }
};`,
    },
  },
  {
    id: 'data-table',
    name: '数据表格',
    description: '带排序和筛选的数据表格',
    category: '数据',
    icon: 'Grid3X3',
    code: {
      html: `<div className="p-6 bg-white rounded-2xl shadow-xl">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-gray-800">用户列表</h2>
    <input
      type="text"
      placeholder="搜索用户..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th 
            className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={() => handleSort('name')}
          >
            姓名 {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </th>
          <th 
            className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={() => handleSort('email')}
          >
            邮箱 {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
          </th>
          <th 
            className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={() => handleSort('role')}
          >
            角色 {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
          </th>
          <th 
            className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={() => handleSort('status')}
          >
            状态 {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user) => (
          <tr
            key={user.id}
            className="border-b border-gray-100 hover:bg-gray-50"
          >
            <td className="py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {user.name[0]}
                </div>
                <span className="font-medium text-gray-800">{user.name}</span>
              </div>
            </td>
            <td className="py-3 px-4 text-gray-600">{user.email}</td>
            <td className="py-3 px-4">
              <span className={\`px-3 py-1 rounded-full text-sm \${
                user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                user.role === 'Editor' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }\`}>
                {user.role}
              </span>
            </td>
            <td className="py-3 px-4">
              <span className={\`px-3 py-1 rounded-full text-sm \${
                user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }\`}>
                {user.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  <div className="mt-4 text-sm text-gray-500">
    共 {filteredUsers.length} 条记录
  </div>
</div>`,
      css: `/* 表格样式 */
table {
  border-collapse: separate;
  border-spacing: 0;
}
th {
  user-select: none;
}
tr:last-child {
  border-bottom: none;
}`,
      js: `const [users] = useState([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: '钱七', email: 'qianqi@example.com', role: 'User', status: 'Active' }
]);

const [searchTerm, setSearchTerm] = useState('');
const [sortField, setSortField] = useState('name');
const [sortDirection, setSortDirection] = useState('asc');

const handleSort = (field) => {
  if (sortField === field) {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    setSortField(field);
    setSortDirection('asc');
  }
};

const filteredUsers = users
  .filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const aVal = a[sortField].toLowerCase();
    const bVal = b[sortField].toLowerCase();
    return sortDirection === 'asc' 
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });`,
    },
  },
  {
    id: 'image-gallery',
    name: '图片画廊',
    description: '带筛选和灯箱效果的图片画廊',
    category: '展示',
    icon: 'Image',
    code: {
      html: `<div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">图片画廊</h2>
  
  <div className="flex justify-center gap-2 mb-6 flex-wrap">
    {['全部', '自然', '建筑', '人物'].map((category) => (
      <button
        key={category}
        onClick={() => setFilter(category)}
        className={\`px-4 py-2 rounded-full font-medium transition-colors \${
          filter === category 
            ? 'bg-blue-500 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }\`}
      >
        {category}
      </button>
    ))}
  </div>
  
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {filteredImages.map((image) => (
      <div
        key={image.id}
        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => setSelectedImage(image)}
      >
        <div 
          className="w-full h-full"
          style={{
            background: \`linear-gradient(\${image.id * 45}deg, \${image.color}, \${image.color}88)\`
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            {image.title}
          </span>
        </div>
      </div>
    ))}
  </div>
  
  {selectedImage && (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={() => setSelectedImage(null)}
    >
      <div
        className="relative max-w-2xl w-full aspect-video rounded-2xl overflow-hidden"
        style={{
          background: \`linear-gradient(135deg, \${selectedImage.color}, \${selectedImage.color}88)\`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-white text-xl font-bold">{selectedImage.title}</h3>
          <p className="text-white/80">{selectedImage.category}</p>
        </div>
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )}
</div>`,
      css: `/* 画廊样式 */
.aspect-square {
  aspect-ratio: 1;
}
.aspect-video {
  aspect-ratio: 16/9;
}`,
      js: `const [images] = useState([
  { id: 1, title: '山水风光', category: '自然', color: '#3B82F6' },
  { id: 2, title: '城市夜景', category: '建筑', color: '#8B5CF6' },
  { id: 3, title: '微笑女孩', category: '人物', color: '#EC4899' },
  { id: 4, title: '森林小径', category: '自然', color: '#10B981' },
  { id: 5, title: '现代建筑', category: '建筑', color: '#F59E0B' },
  { id: 6, title: '商务人士', category: '人物', color: '#6366F1' }
]);

const [filter, setFilter] = useState('全部');
const [selectedImage, setSelectedImage] = useState(null);

const filteredImages = filter === '全部' 
  ? images 
  : images.filter(img => img.category === filter);`,
    },
  },
  {
    id: 'calculator',
    name: '计算器',
    description: '功能完整的计算器组件',
    category: '工具',
    icon: 'Box',
    code: {
      html: `<div className="max-w-xs mx-auto p-6 bg-gray-900 rounded-3xl shadow-2xl">
  <div className="mb-4 p-4 bg-gray-800 rounded-2xl text-right">
    <div className="text-gray-400 text-sm h-6">{previousValue} {operator}</div>
    <div className="text-white text-4xl font-light overflow-hidden">{display}</div>
  </div>
  
  <div className="grid grid-cols-4 gap-3">
    <button
      onClick={clear}
      className="p-4 bg-red-500 text-white rounded-2xl font-medium"
    >
      C
    </button>
    <button
      onClick={() => handleOperator('÷')}
      className={\`p-4 rounded-2xl font-medium \${operator === '÷' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-orange-400'}\`}
    >
      ÷
    </button>
    <button
      onClick={() => handleOperator('×')}
      className={\`p-4 rounded-2xl font-medium \${operator === '×' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-orange-400'}\`}
    >
      ×
    </button>
    <button
      onClick={deleteLast}
      className="p-4 bg-gray-700 text-white rounded-2xl font-medium"
    >
      ⌫
    </button>
    
    {['7', '8', '9'].map((num) => (
      <button
        key={num}
        onClick={() => handleNumber(num)}
        className="p-4 bg-gray-800 text-white rounded-2xl text-xl font-medium"
      >
        {num}
      </button>
    ))}
    <button
      onClick={() => handleOperator('-')}
      className={\`p-4 rounded-2xl font-medium \${operator === '-' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-orange-400'}\`}
    >
      −
    </button>
    
    {['4', '5', '6'].map((num) => (
      <button
        key={num}
        onClick={() => handleNumber(num)}
        className="p-4 bg-gray-800 text-white rounded-2xl text-xl font-medium"
      >
        {num}
      </button>
    ))}
    <button
      onClick={() => handleOperator('+')}
      className={\`p-4 rounded-2xl font-medium \${operator === '+' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-orange-400'}\`}
    >
      +
    </button>
    
    {['1', '2', '3'].map((num) => (
      <button
        key={num}
        onClick={() => handleNumber(num)}
        className="p-4 bg-gray-800 text-white rounded-2xl text-xl font-medium"
      >
        {num}
      </button>
    ))}
    <button
      onClick={calculate}
      className="p-4 bg-orange-500 text-white rounded-2xl text-xl font-medium row-span-2"
    >
      =
    </button>
    
    <button
      onClick={() => handleNumber('0')}
      className="p-4 bg-gray-800 text-white rounded-2xl text-xl font-medium col-span-2"
    >
      0
    </button>
    <button
      onClick={() => handleNumber('.')}
      className="p-4 bg-gray-800 text-white rounded-2xl text-xl font-medium"
    >
      .
    </button>
  </div>
</div>`,
      css: `/* 计算器样式 */
button {
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
button:active {
  transform: scale(0.95);
}`,
      js: `const [display, setDisplay] = useState('0');
const [previousValue, setPreviousValue] = useState('');
const [operator, setOperator] = useState(null);
const [waitingForOperand, setWaitingForOperand] = useState(false);

const handleNumber = (num) => {
  if (waitingForOperand) {
    setDisplay(num);
    setWaitingForOperand(false);
  } else {
    setDisplay(display === '0' ? num : display + num);
  }
};

const handleOperator = (nextOperator) => {
  const inputValue = parseFloat(display);
  
  if (previousValue === '') {
    setPreviousValue(display);
  } else if (operator) {
    const currentValue = parseFloat(previousValue) || 0;
    const newValue = calculateValues(currentValue, inputValue, operator);
    setPreviousValue(String(newValue));
    setDisplay(String(newValue));
  }
  
  setWaitingForOperand(true);
  setOperator(nextOperator);
};

const calculateValues = (first, second, op) => {
  switch (op) {
    case '+': return first + second;
    case '-': return first - second;
    case '×': return first * second;
    case '÷': return second !== 0 ? first / second : 0;
    default: return second;
  }
};

const calculate = () => {
  if (!operator || waitingForOperand) return;
  
  const inputValue = parseFloat(display);
  const currentValue = parseFloat(previousValue) || 0;
  const newValue = calculateValues(currentValue, inputValue, operator);
  
  setDisplay(String(newValue));
  setPreviousValue('');
  setOperator(null);
  setWaitingForOperand(true);
};

const clear = () => {
  setDisplay('0');
  setPreviousValue('');
  setOperator(null);
  setWaitingForOperand(false);
};

const deleteLast = () => {
  setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
};`,
    },
  },
  {
    id: 'weather-card',
    name: '天气卡片',
    description: '精美的天气展示组件',
    category: '展示',
    icon: 'Component',
    code: {
      html: `<div className="max-w-sm mx-auto">
  <div 
    className="p-8 rounded-3xl text-white overflow-hidden relative"
    style={{
      background: weather === 'sunny' 
        ? 'linear-gradient(135deg, #F59E0B, #EF4444)'
        : weather === 'rainy'
        ? 'linear-gradient(135deg, #3B82F6, #1E40AF)'
        : 'linear-gradient(135deg, #6B7280, #374151)'
    }}
  >
    {/* 背景装饰 */}
    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-xl" />
    
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold">北京市</h2>
          <p className="text-white/80">{new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          {['sunny', 'rainy', 'cloudy'].map((w) => (
            <button
              key={w}
              onClick={() => setWeather(w)}
              className={\`w-8 h-8 rounded-full flex items-center justify-center transition-colors \${
                weather === w ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
              }\`}
            >
              {w === 'sunny' ? '☀' : w === 'rainy' ? '☂' : '☁'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-7xl font-light">
            {temperature}°
          </div>
          <p className="text-xl text-white/90 mt-2">
            {weather === 'sunny' ? '晴朗' : weather === 'rainy' ? '小雨' : '多云'}
          </p>
        </div>
        <div className="text-6xl">
          {weather === 'sunny' ? '☀️' : weather === 'rainy' ? '🌧️' : '☁️'}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
        <div className="text-center">
          <p className="text-white/60 text-sm">湿度</p>
          <p className="text-xl font-semibold">{humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-white/60 text-sm">风速</p>
          <p className="text-xl font-semibold">{windSpeed}km/h</p>
        </div>
        <div className="text-center">
          <p className="text-white/60 text-sm">体感</p>
          <p className="text-xl font-semibold">{temperature + 2}°</p>
        </div>
      </div>
    </div>
  </div>
  
  {/* 未来预报 */}
  <div className="mt-4 p-4 bg-white rounded-2xl shadow-lg">
    <div className="flex justify-between items-center">
      {['周一', '周二', '周三', '周四', '周五'].map((day, i) => (
        <div key={day} className="text-center">
          <p className="text-gray-500 text-sm mb-1">{day}</p>
          <p className="text-2xl mb-1">{['☀️', '⛅', '🌧️', '☀️', '⛅'][i]}</p>
          <p className="text-gray-700 font-medium">{[22, 19, 16, 23, 20][i]}°</p>
        </div>
      ))}
    </div>
  </div>
</div>`,
      css: `/* 天气卡片样式 */
button {
  cursor: pointer;
  transition: all 0.2s;
}`,
      js: `const [weather, setWeather] = useState('sunny');
const [temperature, setTemperature] = useState(24);
const [humidity, setHumidity] = useState(65);
const [windSpeed, setWindSpeed] = useState(12);

useEffect(() => {
  // 根据天气更新数据
  if (weather === 'sunny') {
    setTemperature(24);
    setHumidity(45);
    setWindSpeed(8);
  } else if (weather === 'rainy') {
    setTemperature(16);
    setHumidity(85);
    setWindSpeed(15);
  } else {
    setTemperature(20);
    setHumidity(60);
    setWindSpeed(10);
  }
}, [weather]);`,
    },
  },
]

// 图标映射
export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Hash,
  Wand2,
  Layout,
  FileCode,
  Grid3X3,
  Image,
  Box,
  Component,
}
