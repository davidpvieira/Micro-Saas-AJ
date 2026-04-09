'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Kanban,
  FolderOpen,
  Users,
  DollarSign,
  Contact,
  Globe,
  Scale,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Kanban,
  FolderOpen,
  Users,
  DollarSign,
  Contact,
  Globe,
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className="flex flex-col h-full bg-[#1e3a5f] text-white transition-all duration-300"
      style={{ width: collapsed ? 64 : 256 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
        <Scale className="h-7 w-7 shrink-0" />
        {!collapsed && (
          <span className="text-lg font-bold whitespace-nowrap">AJ Manager</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#4a7c9f] text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  {Icon && <Icon className="h-5 w-5 shrink-0" />}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User info */}
      {session?.user && (
        <div className="border-t border-white/10 px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#4a7c9f] flex items-center justify-center text-sm font-bold shrink-0">
              {session.user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.user.name}</p>
                <p className="text-xs text-white/60 truncate">{session.user.email}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sign out & collapse */}
      <div className="border-t border-white/10 px-2 py-2 flex items-center gap-1">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors flex-1"
          title="Sair"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          title={collapsed ? 'Expandir' : 'Recolher'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  )
}
