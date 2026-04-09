'use client'

import { useDroppable } from '@dnd-kit/core'
import { KanbanCard } from './KanbanCard'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  id: string
  title: string
  processos: any[]
  color: string
}

export function KanbanColumn({ id, title, processos, color }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-w-[280px] flex-1 flex-col rounded-lg bg-muted/50 transition-colors',
        isOver && 'bg-muted/80'
      )}
    >
      {/* Column header with colored top border */}
      <div
        className="rounded-t-lg px-3 py-2"
        style={{ borderTop: `4px solid ${color}` }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1e3a5f]">{title}</h3>
          <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#4a7c9f]/15 px-1.5 text-xs font-medium text-[#4a7c9f]">
            {processos.length}
          </span>
        </div>
      </div>

      {/* Cards list */}
      <div className="flex flex-col gap-2 p-2">
        {processos.map((processo: any) => (
          <KanbanCard key={processo.id} processo={processo} />
        ))}

        {processos.length === 0 && (
          <div className="rounded-md border border-dashed border-muted-foreground/25 py-8 text-center text-xs text-muted-foreground">
            Nenhum processo
          </div>
        )}
      </div>
    </div>
  )
}
