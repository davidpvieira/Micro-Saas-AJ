'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDraggable } from '@dnd-kit/core'
import { Card } from '@/components/ui/card'
import { SemaforoIndicator } from '@/components/ui/SemaforoIndicator'
import { SetorBadge } from '@/components/ui/SetorBadge'

interface KanbanCardProps {
  processo: any
}

export function KanbanCard({ processo }: KanbanCardProps) {
  const router = useRouter()
  const isDraggingRef = useRef(false)

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: processo.id,
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  // Track whether a drag occurred so click only navigates when not dragging
  const handlePointerDown = () => {
    isDraggingRef.current = false
  }

  const handlePointerMove = () => {
    isDraggingRef.current = true
  }

  const handleClick = () => {
    if (!isDraggingRef.current) {
      router.push(`/processos/${processo.id}`)
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-grab p-3 transition-shadow hover:shadow-md active:cursor-grabbing"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      {...attributes}
      {...listeners}
    >
      <div className="space-y-2">
        {/* Top row: semaforo + name */}
        <div className="flex items-center gap-2">
          {processo.semaforo && (
            <SemaforoIndicator status={processo.semaforo} size="sm" />
          )}
          <span className="truncate text-sm font-bold text-[#1e3a5f]">
            {processo.nomeEmpresarial || processo.nome || 'Sem nome'}
          </span>
        </div>

        {/* Setor badge */}
        {processo.setor && (
          <div className="flex">
            <SetorBadge setor={processo.setor} />
          </div>
        )}

        {/* Comarca */}
        {processo.comarca && (
          <p className="truncate text-xs text-muted-foreground">
            {processo.comarca}
          </p>
        )}

        {/* Responsavel */}
        {processo.responsavel && (
          <p className="truncate text-xs text-[#4a7c9f]">
            {processo.responsavel}
          </p>
        )}
      </div>
    </Card>
  )
}
