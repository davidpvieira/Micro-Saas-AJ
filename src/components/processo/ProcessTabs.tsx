'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ProcessTabsProps {
  processoId: string
  setor: string
}

export function ProcessTabs({ processoId, setor }: ProcessTabsProps) {
  const pathname = usePathname()

  const basePath = `/processos/${processoId}`

  const tabs = [
    { label: 'Obrigações', href: basePath },
    { label: 'Credores/QGC', href: `${basePath}/credores` },
    { label: 'Documentação', href: `${basePath}/documentos` },
    { label: 'Honorários', href: `${basePath}/honorarios` },
    { label: 'Vistorias', href: `${basePath}/vistorias` },
    { label: 'AGC', href: `${basePath}/agc` },
    ...(setor === 'agronegocio'
      ? [{ label: 'Rural', href: `${basePath}/rural` }]
      : []),
  ]

  return (
    <nav className="flex flex-row gap-1 overflow-x-auto border-b">
      {tabs.map((tab) => {
        const isActive =
          tab.href === basePath
            ? pathname === basePath
            : pathname.startsWith(tab.href)

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'whitespace-nowrap px-4 py-2.5 text-sm transition-colors',
              isActive
                ? 'border-b-2 border-[#1e3a5f] text-[#1e3a5f] font-medium'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
