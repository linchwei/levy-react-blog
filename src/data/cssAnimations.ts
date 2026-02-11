export type AnimationCategory = 'entrance' | 'emphasis' | 'exit' | 'special'

export interface CSSAnimation {
  id: string
  name: string
  category: AnimationCategory
  description: string
  keyframes: string
  className: string
  defaultDuration: string
  defaultTiming: string
}

export const animationCategories: { id: AnimationCategory; name: string; description: string }[] = [
  { id: 'entrance', name: '入场动画', description: '元素进入页面时的动画效果' },
  { id: 'emphasis', name: '强调动画', description: '吸引注意力的动画效果' },
  { id: 'exit', name: '退出动画', description: '元素离开页面时的动画效果' },
  { id: 'special', name: '特殊效果', description: '独特的创意动画效果' },
]

export const cssAnimations: CSSAnimation[] = [
  // 入场动画
  {
    id: 'fadeIn',
    name: 'Fade In',
    category: 'entrance',
    description: '淡入效果',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-out',
    keyframes: `@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}`,
    className: `.fade-in {
  animation: fadeIn 0.5s ease-out;
}`,
  },
  {
    id: 'fadeInUp',
    name: 'Fade In Up',
    category: 'entrance',
    description: '从下方淡入',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-out',
    keyframes: `@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
    className: `.fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}`,
  },
  {
    id: 'fadeInDown',
    name: 'Fade In Down',
    category: 'entrance',
    description: '从上方淡入',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-out',
    keyframes: `@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
    className: `.fade-in-down {
  animation: fadeInDown 0.5s ease-out;
}`,
  },
  {
    id: 'fadeInLeft',
    name: 'Fade In Left',
    category: 'entrance',
    description: '从左侧淡入',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-out',
    keyframes: `@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}`,
    className: `.fade-in-left {
  animation: fadeInLeft 0.5s ease-out;
}`,
  },
  {
    id: 'fadeInRight',
    name: 'Fade In Right',
    category: 'entrance',
    description: '从右侧淡入',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-out',
    keyframes: `@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}`,
    className: `.fade-in-right {
  animation: fadeInRight 0.5s ease-out;
}`,
  },
  {
    id: 'slideInUp',
    name: 'Slide In Up',
    category: 'entrance',
    description: '从下方滑入',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-out',
    keyframes: `@keyframes slideInUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}`,
    className: `.slide-in-up {
  animation: slideInUp 0.5s ease-out;
}`,
  },
  {
    id: 'slideInDown',
    name: 'Slide In Down',
    category: 'entrance',
    description: '从上方滑入',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-out',
    keyframes: `@keyframes slideInDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}`,
    className: `.slide-in-down {
  animation: slideInDown 0.5s ease-out;
}`,
  },
  {
    id: 'zoomIn',
    name: 'Zoom In',
    category: 'entrance',
    description: '缩放进入',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-out',
    keyframes: `@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
  }
}`,
    className: `.zoom-in {
  animation: zoomIn 0.5s ease-out;
}`,
  },
  {
    id: 'bounceIn',
    name: 'Bounce In',
    category: 'entrance',
    description: '弹跳进入',
    defaultDuration: '0.75s',
    defaultTiming: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    keyframes: `@keyframes bounceIn {
  from,
  20%,
  40%,
  60%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}`,
    className: `.bounce-in {
  animation: bounceIn 0.75s cubic-bezier(0.215, 0.61, 0.355, 1);
}`,
  },
  {
    id: 'flipInX',
    name: 'Flip In X',
    category: 'entrance',
    description: 'X轴翻转进入',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-out',
    keyframes: `@keyframes flipInX {
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }
  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }
  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }
  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }
  to {
    transform: perspective(400px);
  }
}`,
    className: `.flip-in-x {
  animation: flipInX 0.5s ease-out;
  backface-visibility: visible;
}`,
  },

  // 强调动画
  {
    id: 'pulse',
    name: 'Pulse',
    category: 'emphasis',
    description: '脉冲效果',
    defaultDuration: '1s',
    defaultTiming: 'ease-in-out',
    keyframes: `@keyframes pulse {
  from {
    transform: scale3d(1, 1, 1);
  }
  50% {
    transform: scale3d(1.05, 1.05, 1.05);
  }
  to {
    transform: scale3d(1, 1, 1);
  }
}`,
    className: `.pulse {
  animation: pulse 1s ease-in-out infinite;
}`,
  },
  {
    id: 'shake',
    name: 'Shake',
    category: 'emphasis',
    description: '摇晃效果',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-in-out',
    keyframes: `@keyframes shake {
  from,
  to {
    transform: translate3d(0, 0, 0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate3d(-4px, 0, 0);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translate3d(4px, 0, 0);
  }
}`,
    className: `.shake {
  animation: shake 0.5s ease-in-out;
}`,
  },
  {
    id: 'tada',
    name: 'Tada',
    category: 'emphasis',
    description: '惊喜效果',
    defaultDuration: '1s',
    defaultTiming: 'ease-in-out',
    keyframes: `@keyframes tada {
  from {
    transform: scale3d(1, 1, 1);
  }
  10%,
  20% {
    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
  }
  30%,
  50%,
  70%,
  90% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  }
  40%,
  60%,
  80% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  }
  to {
    transform: scale3d(1, 1, 1);
  }
}`,
    className: `.tada {
  animation: tada 1s ease-in-out;
}`,
  },
  {
    id: 'swing',
    name: 'Swing',
    category: 'emphasis',
    description: '摆动效果',
    defaultDuration: '1s',
    defaultTiming: 'ease-in-out',
    keyframes: `@keyframes swing {
  20% {
    transform: rotate3d(0, 0, 1, 15deg);
  }
  40% {
    transform: rotate3d(0, 0, 1, -10deg);
  }
  60% {
    transform: rotate3d(0, 0, 1, 5deg);
  }
  80% {
    transform: rotate3d(0, 0, 1, -5deg);
  }
  to {
    transform: rotate3d(0, 0, 1, 0deg);
  }
}`,
    className: `.swing {
  animation: swing 1s ease-in-out;
  transform-origin: top center;
}`,
  },
  {
    id: 'wobble',
    name: 'Wobble',
    category: 'emphasis',
    description: '摇晃效果',
    defaultDuration: '1s',
    defaultTiming: 'ease-in-out',
    keyframes: `@keyframes wobble {
  from {
    transform: translate3d(0, 0, 0);
  }
  15% {
    transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
  }
  30% {
    transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
  }
  45% {
    transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
  }
  60% {
    transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
  }
  75% {
    transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}`,
    className: `.wobble {
  animation: wobble 1s ease-in-out;
}`,
  },
  {
    id: 'jello',
    name: 'Jello',
    category: 'emphasis',
    description: '果冻效果',
    defaultDuration: '0.9s',
    defaultTiming: 'ease-in-out',
    keyframes: `@keyframes jello {
  from,
  11.1%,
  to {
    transform: translate3d(0, 0, 0);
  }
  22.2% {
    transform: skewX(-12.5deg) skewY(-12.5deg);
  }
  33.3% {
    transform: skewX(6.25deg) skewY(6.25deg);
  }
  44.4% {
    transform: skewX(-3.125deg) skewY(-3.125deg);
  }
  55.5% {
    transform: skewX(1.5625deg) skewY(1.5625deg);
  }
  66.6% {
    transform: skewX(-0.78125deg) skewY(-0.78125deg);
  }
  77.7% {
    transform: skewX(0.390625deg) skewY(0.390625deg);
  }
  88.8% {
    transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
  }
}`,
    className: `.jello {
  animation: jello 0.9s ease-in-out;
}`,
  },
  {
    id: 'heartbeat',
    name: 'Heartbeat',
    category: 'emphasis',
    description: '心跳效果',
    defaultDuration: '1.3s',
    defaultTiming: 'ease-in-out',
    keyframes: `@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}`,
    className: `.heartbeat {
  animation: heartbeat 1.3s ease-in-out infinite;
}`,
  },
  {
    id: 'rubberBand',
    name: 'Rubber Band',
    category: 'emphasis',
    description: '橡皮筋效果',
    defaultDuration: '1s',
    defaultTiming: 'ease-in-out',
    keyframes: `@keyframes rubberBand {
  from {
    transform: scale3d(1, 1, 1);
  }
  30% {
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    transform: scale3d(1.05, 0.95, 1);
  }
  to {
    transform: scale3d(1, 1, 1);
  }
}`,
    className: `.rubber-band {
  animation: rubberBand 1s ease-in-out;
}`,
  },

  // 退出动画
  {
    id: 'fadeOut',
    name: 'Fade Out',
    category: 'exit',
    description: '淡出效果',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-in',
    keyframes: `@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}`,
    className: `.fade-out {
  animation: fadeOut 0.5s ease-in forwards;
}`,
  },
  {
    id: 'fadeOutUp',
    name: 'Fade Out Up',
    category: 'exit',
    description: '向上淡出',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-in',
    keyframes: `@keyframes fadeOutUp {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }
}`,
    className: `.fade-out-up {
  animation: fadeOutUp 0.5s ease-in forwards;
}`,
  },
  {
    id: 'fadeOutDown',
    name: 'Fade Out Down',
    category: 'exit',
    description: '向下淡出',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-in',
    keyframes: `@keyframes fadeOutDown {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}`,
    className: `.fade-out-down {
  animation: fadeOutDown 0.5s ease-in forwards;
}`,
  },
  {
    id: 'zoomOut',
    name: 'Zoom Out',
    category: 'exit',
    description: '缩放退出',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-in',
    keyframes: `@keyframes zoomOut {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 0;
  }
}`,
    className: `.zoom-out {
  animation: zoomOut 0.5s ease-in forwards;
}`,
  },
  {
    id: 'slideOutUp',
    name: 'Slide Out Up',
    category: 'exit',
    description: '向上滑出',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-in',
    keyframes: `@keyframes slideOutUp {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, -100%, 0);
  }
}`,
    className: `.slide-out-up {
  animation: slideOutUp 0.5s ease-in forwards;
}`,
  },
  {
    id: 'slideOutDown',
    name: 'Slide Out Down',
    category: 'exit',
    description: '向下滑出',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-in',
    keyframes: `@keyframes slideOutDown {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, 100%, 0);
  }
}`,
    className: `.slide-out-down {
  animation: slideOutDown 0.5s ease-in forwards;
}`,
  },

  // 特殊效果
  {
    id: 'flip',
    name: 'Flip',
    category: 'special',
    description: '翻转效果',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-in-out',
    keyframes: `@keyframes flip {
  from {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, -360deg);
    animation-timing-function: ease-out;
  }
  40% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -190deg);
    animation-timing-function: ease-out;
  }
  50% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -170deg);
    animation-timing-function: ease-in;
  }
  80% {
    transform: perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-in;
  }
  to {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-in;
  }
}`,
    className: `.flip {
  animation: flip 0.5s ease-in-out;
  backface-visibility: visible;
}`,
  },
  {
    id: 'rotateIn',
    name: 'Rotate In',
    category: 'special',
    description: '旋转进入',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-out',
    keyframes: `@keyframes rotateIn {
  from {
    transform-origin: center;
    transform: rotate3d(0, 0, 1, -200deg);
    opacity: 0;
  }
  to {
    transform-origin: center;
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}`,
    className: `.rotate-in {
  animation: rotateIn 0.5s ease-out;
}`,
  },
  {
    id: 'rotateOut',
    name: 'Rotate Out',
    category: 'special',
    description: '旋转退出',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-in',
    keyframes: `@keyframes rotateOut {
  from {
    transform-origin: center;
    opacity: 1;
  }
  to {
    transform-origin: center;
    transform: rotate3d(0, 0, 1, 200deg);
    opacity: 0;
  }
}`,
    className: `.rotate-out {
  animation: rotateOut 0.5s ease-in forwards;
}`,
  },
  {
    id: 'blurIn',
    name: 'Blur In',
    category: 'special',
    description: '模糊淡入',
    defaultDuration: '0.5s',
    defaultTiming: 'ease-out',
    keyframes: `@keyframes blurIn {
  from {
    opacity: 0;
    filter: blur(10px);
  }
  to {
    opacity: 1;
    filter: blur(0);
  }
}`,
    className: `.blur-in {
  animation: blurIn 0.5s ease-out;
}`,
  },
  {
    id: 'glow',
    name: 'Glow',
    category: 'special',
    description: '发光效果',
    defaultDuration: '1.5s',
    defaultTiming: 'ease-in-out',
    keyframes: `@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(66, 153, 225, 0.5),
                0 0 20px rgba(66, 153, 225, 0.3),
                0 0 40px rgba(66, 153, 225, 0.1);
  }
  50% {
    box-shadow: 0 0 10px rgba(66, 153, 225, 0.8),
                0 0 40px rgba(66, 153, 225, 0.5),
                0 0 80px rgba(66, 153, 225, 0.3);
  }
}`,
    className: `.glow {
  animation: glow 1.5s ease-in-out infinite;
}`,
  },
  {
    id: 'shimmer',
    name: 'Shimmer',
    category: 'special',
    description: '闪光效果',
    defaultDuration: '2s',
    defaultTiming: 'linear',
    keyframes: `@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}`,
    className: `.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
}`,
  },
  {
    id: 'float',
    name: 'Float',
    category: 'special',
    description: '漂浮效果',
    defaultDuration: '3s',
    defaultTiming: 'ease-in-out',
    keyframes: `@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}`,
    className: `.float {
  animation: float 3s ease-in-out infinite;
}`,
  },
  {
    id: 'bounce',
    name: 'Bounce',
    category: 'special',
    description: '弹跳效果',
    defaultDuration: '1s',
    defaultTiming: 'ease-in-out',
    keyframes: `@keyframes bounce {
  from,
  20%,
  53%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -30px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}`,
    className: `.bounce {
  animation: bounce 1s ease-in-out infinite;
  transform-origin: center bottom;
}`,
  },
  {
    id: 'spin',
    name: 'Spin',
    category: 'special',
    description: '旋转效果',
    defaultDuration: '1s',
    defaultTiming: 'linear',
    keyframes: `@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}`,
    className: `.spin {
  animation: spin 1s linear infinite;
}`,
  },
  {
    id: 'ping',
    name: 'Ping',
    category: 'special',
    description: '脉冲扩散',
    defaultDuration: '1s',
    defaultTiming: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: `@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}`,
    className: `.ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}`,
  },
]

export const timingFunctions = [
  { name: 'Linear', value: 'linear', description: '匀速' },
  { name: 'Ease', value: 'ease', description: '默认' },
  { name: 'Ease In', value: 'ease-in', description: '慢开始' },
  { name: 'Ease Out', value: 'ease-out', description: '慢结束' },
  { name: 'Ease In Out', value: 'ease-in-out', description: '慢开始慢结束' },
  { name: 'Spring', value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', description: '弹性' },
  { name: 'Bounce', value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', description: '弹跳' },
]

export const durationOptions = [
  { name: 'Fast', value: '0.3s' },
  { name: 'Normal', value: '0.5s' },
  { name: 'Slow', value: '0.8s' },
  { name: 'Slower', value: '1s' },
  { name: 'Slowest', value: '1.5s' },
]
