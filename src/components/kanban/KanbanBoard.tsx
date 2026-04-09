'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useRecuperandas, useUpdateKanban } from '@/lib/queries'
import { KANBAN_COLUMNS } from '@/lib/constants'
import { KanbanColumn } from './KanbanColumn'
import { Skeleton } from '@/components/ui/skeleton'

export function KanbanBoard() {
  const { data: processos, isLoading } = useRecuperandas()
  const updateKanban = useUpdateKanban()

  // Local state for optimistic updates
  const [optimisticMoves, setOptimisticMoves] = useState<
    Record<string, string>
  >({})

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  // Group processos by kanban column, applying optimistic moves
  const groupedProcessos = useMemo(() => {
    const groups: Record<string, any[]> = {}
    for (const col of KANBAN_COLUMNS) {
      groups[col.value] = []
    }

    if (processos) {
      for (const p of processos) {
        const coluna = optimisticMoves[p.id] || p.kanbanColuna || 'peticoes_iniciais'
        if (groups[coluna]) {
          groups[coluna].push(p)
        }
      }
    }

    return groups
  }, [processos, optimisticMoves])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over) return

      const processoId = active.id as string
      const newColumn = over.id as string

      // Find current column for this processo
      const processo = processos?.find((p: any) => p.id === processoId)
      if (!processo) return

      const currentColumn =
        optimisticMoves[processoId] || processo.kanbanColuna || 'peticoes_iniciais'
      if (currentColumn === newColumn) return

      // Optimistic update
      setOptimisticMoves((prev) => ({ ...prev, [processoId]: newColumn }))

      // Persist to server
      updateKanban.mutate(
        { id: processoId, kanbanColuna: newColumn },
        {
          onError: () => {
            // Revert optimistic update on error
            setOptimisticMoves((prev) => {
              const next = { ...prev }
              delete next[processoId]
              return next
            })
          },
          onSuccess: () => {
            // Clean up optimistic state after server confirms
            setOptimisticMoves((prev) => {
              const next = { ...prev }
              delete next[processoId]
              return next
            })
          },
        }
      )
    },
    [processos, optimisticMoves, updateKanban]
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1e3a5f]">Kanban</h1>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.value}
              id={col.value}
              title={col.label}
              color={col.color}
              processos={isLoading ? [] : groupedProcessos[col.value] || []}
            />
          ))}
        </div>
      </DndContext>

      {isLoading && (
        <div className="flex gap-4">
          {KANBAN_COLUMNS.map((col) => (
            <div key={col.value} className="min-w-[280px] flex-1 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
