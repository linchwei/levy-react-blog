export type AnimationCategory = 
  | 'entrance' 
  | 'emphasis' 
  | 'gesture' 
  | 'transition' 
  | 'micro' 
  | '3d'

export interface AnimationCategoryInfo {
  id: AnimationCategory
  name: string
  description: string
  icon: string
  color: string
}

export const animationCategories: AnimationCategoryInfo[] = [
  {
    id: 'entrance',
    name: '入场动画',
    description: '元素进入视口时的动画效果',
    icon: 'LogIn',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'emphasis',
    name: '强调动画',
    description: '吸引用户注意力的动画效果',
    icon: 'Zap',
    color: 'from-yellow-500 to-orange-600',
  },
  {
    id: 'gesture',
    name: '手势动画',
    description: '拖拽、滑动等交互手势动画',
    icon: 'Hand',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'transition',
    name: '页面过渡',
    description: '路由切换和模态框过渡动画',
    icon: 'ArrowRightLeft',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'micro',
    name: '微交互',
    description: '按钮、输入框等细节动画',
    icon: 'MousePointer',
    color: 'from-rose-500 to-red-600',
  },
  {
    id: '3d',
    name: '3D 效果',
    description: '立体翻转和透视动画',
    icon: 'Box',
    color: 'from-indigo-500 to-violet-600',
  },
]

export interface AnimationParameter {
  name: string
  key: string
  type: 'slider' | 'select' | 'toggle'
  min?: number
  max?: number
  step?: number
  default: number | string | boolean
  options?: { label: string; value: string }[]
}

export const animationParameters: AnimationParameter[] = [
  {
    name: 'Duration',
    key: 'duration',
    type: 'slider',
    min: 0.1,
    max: 3,
    step: 0.1,
    default: 0.5,
  },
  {
    name: 'Delay',
    key: 'delay',
    type: 'slider',
    min: 0,
    max: 2,
    step: 0.1,
    default: 0,
  },
  {
    name: 'Easing',
    key: 'ease',
    type: 'select',
    default: 'easeOut',
    options: [
      { label: 'Linear', value: 'linear' },
      { label: 'Ease In', value: 'easeIn' },
      { label: 'Ease Out', value: 'easeOut' },
      { label: 'Ease In Out', value: 'easeInOut' },
      { label: 'Circ In', value: 'circIn' },
      { label: 'Circ Out', value: 'circOut' },
      { label: 'Back In', value: 'backIn' },
      { label: 'Back Out', value: 'backOut' },
      { label: 'Elastic', value: 'elastic' },
      { label: 'Bounce', value: 'bounce' },
    ],
  },
  {
    name: 'Stagger',
    key: 'stagger',
    type: 'slider',
    min: 0,
    max: 0.5,
    step: 0.05,
    default: 0.1,
  },
]
