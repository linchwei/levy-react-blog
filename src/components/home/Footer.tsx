import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { OnlineStatusIndicator } from '@/components/common/OnlineStatusIndicator'

const footerLinks = {
  navigation: [
    { label: '首页', href: '/' },
    { label: '文章', href: '/blog' },
    { label: '项目', href: '/projects' },
    { label: '关于', href: '/about' },
  ],
  resources: [
    { label: '待办事项', href: '/todo' },
    { label: '时间线', href: '/timeline' },
    { label: '工具箱', href: '/tools' },
  ],
  social: [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@example.com', label: 'Email' },
  ],
}

export function Footer() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('订阅成功！')
  }

  return (
    <footer className="bg-gradient-to-b from-background to-accent/10 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                MyBlog
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              一个专注于前端开发、UI设计和开源技术的个人博客。
            </p>
            <div className="flex gap-3">
              {footerLinks.social.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-accent/50 hover:bg-accent transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">导航</h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">资源</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">订阅更新</h4>
            <p className="text-sm text-muted-foreground mb-4">
              获取最新文章和项目更新
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="输入邮箱"
                className="flex-1"
                required
              />
              <Button type="submit" size="sm">
                订阅
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <OnlineStatusIndicator />
            <span className="text-muted-foreground">|</span>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using React & Tailwind
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MyBlog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
