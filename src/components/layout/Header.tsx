'use client'

import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Bell, ChevronRight, User, Settings, LogOut } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Build breadcrumb from current path
  const segments = pathname.split('/').filter(Boolean)
  const currentNav = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(item.href)
  )

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">AJ Manager</span>
        {currentNav && (
          <>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-700">{currentNav.label}</span>
          </>
        )}
        {segments.length > 1 && !currentNav && (
          <>
            {segments.map((segment, index) => (
              <span key={segment} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
                <span className={index === segments.length - 1 ? 'font-medium text-gray-700' : 'text-gray-400'}>
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </span>
              </span>
            ))}
          </>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* User dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="h-8 w-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-sm font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </button>

          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden group-hover:block z-50">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <User className="h-4 w-4" />
              Perfil
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <Settings className="h-4 w-4" />
              Configurações
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
