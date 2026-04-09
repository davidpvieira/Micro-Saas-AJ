'use client'

import { useState } from 'react'
import { Search, FileText, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CredorResult {
  id: string
  nome: string
  classe: string
  valorDeclarado: number
  valorHabilitado: number | null
  recuperanda: { nome: string }
}

const classeColors: Record<string, string> = {
  trabalhista: 'bg-red-100 text-red-800',
  garantia_real: 'bg-blue-100 text-blue-800',
  quirografario: 'bg-yellow-100 text-yellow-800',
  micro_empresa: 'bg-green-100 text-green-800',
  extraconcursal: 'bg-purple-100 text-purple-800',
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export default function PortalPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CredorResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedCredorId, setSelectedCredorId] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResults([])
    setSucesso(false)

    try {
      const res = await fetch(`/api/credores/buscar?cpfCnpj=${encodeURIComponent(query.trim())}`)
      if (!res.ok) throw new Error('Erro ao buscar')
      const data = await res.json()
      setResults(data)
      if (data.length > 0) {
        setSelectedCredorId(data[0].id)
      }
    } catch {
      setError('Erro ao buscar créditos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleEnviarProposta() {
    if (!selectedCredorId || mensagem.length < 10) return
    setEnviando(true)
    setSucesso(false)

    try {
      const res = await fetch('/api/mediacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credorId: selectedCredorId, texto: mensagem }),
      })
      if (!res.ok) throw new Error('Erro ao enviar')
      setSucesso(true)
      setMensagem('')
    } catch {
      setError('Erro ao enviar proposta. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Section 1 - Consulta de Créditos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Consulta de Créditos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Digite seu CPF ou CNPJ"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4" />
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-4 space-y-3">
              {results.map((credor, index) => (
                <div
                  key={index}
                  className="rounded-lg border bg-white p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{credor.nome}</span>
                    <Badge
                      className={classeColors[credor.classe] || 'bg-gray-100 text-gray-800'}
                    >
                      {credor.classe.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="text-gray-400">Valor Declarado:</span>{' '}
                      <span className="font-medium">{formatCurrency(credor.valorDeclarado)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Valor Habilitado:</span>{' '}
                      <span className="font-medium">
                        {credor.valorHabilitado != null
                          ? formatCurrency(credor.valorHabilitado)
                          : 'Pendente'}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Recuperanda: {credor.recuperanda.nome}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && query && !error && (
            <p className="mt-4 text-sm text-gray-500">
              Nenhum crédito encontrado para este CPF/CNPJ
            </p>
          )}
        </CardContent>
      </Card>

      {/* Section 2 - Canal de Mediação */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Canal de Mediação (Lei 14.112/2020)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Utilize este canal para enviar propostas de negociação ao administrador judicial,
              conforme previsto na Lei 14.112/2020. Sua mensagem será analisada e respondida
              em até 5 dias úteis.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecione o crédito
              </label>
              <select
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={selectedCredorId}
                onChange={(e) => setSelectedCredorId(e.target.value)}
              >
                {results.map((credor, index) => (
                  <option key={index} value={credor.id}>
                    {credor.nome} — {formatCurrency(credor.valorDeclarado)} ({credor.recuperanda.nome})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem (mínimo 10 caracteres)
              </label>
              <textarea
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
                placeholder="Descreva sua proposta de mediação..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                minLength={10}
              />
            </div>

            <Button
              onClick={handleEnviarProposta}
              disabled={enviando || mensagem.length < 10}
            >
              <Send className="h-4 w-4" />
              {enviando ? 'Enviando...' : 'Enviar Proposta'}
            </Button>

            {sucesso && (
              <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                Proposta enviada com sucesso!
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Section 3 - Documentos Públicos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documentação Pública</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-[#1e3a5f] hover:underline"
              >
                <FileText className="h-4 w-4" />
                Edital de Recuperação Judicial
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-[#1e3a5f] hover:underline"
              >
                <FileText className="h-4 w-4" />
                Plano de Recuperação Judicial
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-[#1e3a5f] hover:underline"
              >
                <FileText className="h-4 w-4" />
                Quadro Geral de Credores (QGC)
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
