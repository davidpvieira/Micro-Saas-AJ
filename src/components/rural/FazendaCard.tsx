'use client'

import { MapPin, FileText, AlertTriangle } from 'lucide-react'
import { formatarMoeda } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SemaforoIndicator } from '@/components/ui/SemaforoIndicator'
import { SafraProgress } from '@/components/rural/SafraProgress'

interface FazendaCardProps {
  fazenda: any
}

export function FazendaCard({ fazenda }: FazendaCardProps) {
  const areaFormatted = fazenda.area
    ? `${Number(fazenda.area).toLocaleString('pt-BR')} ha`
    : '—'

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{fazenda.nome}</CardTitle>
          {!fazenda.linkLaudoEngenheiro && (
            <Badge className="border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertTriangle className="size-3" />
              Sem laudo
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Location and area */}
        <div className="text-sm">
          {fazenda.municipio && (
            <p className="text-muted-foreground">{fazenda.municipio}</p>
          )}
          <p className="font-medium">{areaFormatted}</p>
        </div>

        {/* Fitossanitario status */}
        {fazenda.statusFitossanitario && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Fitossanitário:</span>
            <SemaforoIndicator
              status={fazenda.statusFitossanitario}
              size="sm"
              showLabel
            />
          </div>
        )}

        {/* Safra progress */}
        {fazenda.cicloSafra && (
          <SafraProgress
            cicloSafra={fazenda.cicloSafra}
            progressoSafra={fazenda.progressoSafra ?? 0}
          />
        )}

        {/* CPR credits */}
        {fazenda.creditosCPR != null && (
          <div className="text-sm">
            <span className="text-muted-foreground">CPR: </span>
            <span className="font-medium">
              {formatarMoeda(fazenda.creditosCPR)}
            </span>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-2 pt-1">
          {fazenda.linkMapa && (
            <a
              href={fazenda.linkMapa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-[#4a7c9f] hover:bg-muted transition-colors"
            >
              <MapPin className="size-3" />
              Mapa
            </a>
          )}
          {fazenda.linkLaudoEngenheiro && (
            <a
              href={fazenda.linkLaudoEngenheiro}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-[#4a7c9f] hover:bg-muted transition-colors"
            >
              <FileText className="size-3" />
              Laudo
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
