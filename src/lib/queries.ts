import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ── Query Key Factories ──────────────────────────────────────────────
export const queryKeys = {
  dashboard: ['dashboard'] as const,
  recuperandas: ['recuperandas'] as const,
  recuperanda: (id: string) => ['recuperanda', id] as const,
  credores: (recuperandaId?: string) => ['credores', recuperandaId] as const,
  obrigacoes: (recuperandaId: string) => ['obrigacoes', recuperandaId] as const,
  honorarios: (recuperandaId?: string) => ['honorarios', recuperandaId] as const,
  documentos: (recuperandaId: string) => ['documentos', recuperandaId] as const,
  vistorias: (recuperandaId: string) => ['vistorias', recuperandaId] as const,
  agc: (recuperandaId: string) => ['agc', recuperandaId] as const,
  fazendas: (moduloRuralId: string) => ['fazendas', moduloRuralId] as const,
}

// ── Generic Fetcher ──────────────────────────────────────────────────
async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro na requisi\u00e7\u00e3o' }))
    throw new Error(error.message || 'Erro na requisi\u00e7\u00e3o')
  }
  return res.json()
}

async function mutationFetcher<T>(
  url: string,
  options: { method: string; body?: unknown }
): Promise<T> {
  const res = await fetch(url, {
    method: options.method,
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro na requisi\u00e7\u00e3o' }))
    throw new Error(error.message || 'Erro na requisi\u00e7\u00e3o')
  }
  return res.json()
}

// ── Fetch Functions ──────────────────────────────────────────────────
export const fetchDashboardSummary = () =>
  fetcher<any>('/api/dashboard/summary')

export const fetchRecuperandas = () =>
  fetcher<any[]>('/api/recuperandas')

export const fetchRecuperanda = (id: string) =>
  fetcher<any>(`/api/recuperandas/${id}`)

export const fetchCredores = (recuperandaId?: string) =>
  fetcher<any[]>(
    recuperandaId
      ? `/api/credores?recuperandaId=${recuperandaId}`
      : '/api/credores'
  )

export const fetchObrigacoes = (recuperandaId: string) =>
  fetcher<any[]>(`/api/obrigacoes?recuperandaId=${recuperandaId}`)

export const fetchHonorarios = (recuperandaId?: string) =>
  fetcher<any[]>(
    recuperandaId
      ? `/api/honorarios?recuperandaId=${recuperandaId}`
      : '/api/honorarios'
  )

export const fetchDocumentos = (recuperandaId: string) =>
  fetcher<any[]>(`/api/documentos?recuperandaId=${recuperandaId}`)

export const fetchVistorias = (recuperandaId: string) =>
  fetcher<any[]>(`/api/vistorias?recuperandaId=${recuperandaId}`)

export const fetchAgc = (recuperandaId: string) =>
  fetcher<any>(`/api/agc?recuperandaId=${recuperandaId}`)

export const fetchFazendas = (moduloRuralId: string) =>
  fetcher<any[]>(`/api/fazendas?moduloRuralId=${moduloRuralId}`)

// ── Query Hooks ──────────────────────────────────────────────────────
export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: fetchDashboardSummary,
  })
}

export function useRecuperandas() {
  return useQuery({
    queryKey: queryKeys.recuperandas,
    queryFn: fetchRecuperandas,
  })
}

export function useRecuperanda(id: string) {
  return useQuery({
    queryKey: queryKeys.recuperanda(id),
    queryFn: () => fetchRecuperanda(id),
    enabled: !!id,
  })
}

export function useCredores(recuperandaId?: string) {
  return useQuery({
    queryKey: queryKeys.credores(recuperandaId),
    queryFn: () => fetchCredores(recuperandaId),
  })
}

export function useObrigacoes(recuperandaId: string) {
  return useQuery({
    queryKey: queryKeys.obrigacoes(recuperandaId),
    queryFn: () => fetchObrigacoes(recuperandaId),
    enabled: !!recuperandaId,
  })
}

export function useHonorarios(recuperandaId?: string) {
  return useQuery({
    queryKey: queryKeys.honorarios(recuperandaId),
    queryFn: () => fetchHonorarios(recuperandaId),
  })
}

export function useDocumentos(recuperandaId: string) {
  return useQuery({
    queryKey: queryKeys.documentos(recuperandaId),
    queryFn: () => fetchDocumentos(recuperandaId),
    enabled: !!recuperandaId,
  })
}

export function useVistorias(recuperandaId: string) {
  return useQuery({
    queryKey: queryKeys.vistorias(recuperandaId),
    queryFn: () => fetchVistorias(recuperandaId),
    enabled: !!recuperandaId,
  })
}

export function useAgc(recuperandaId: string) {
  return useQuery({
    queryKey: queryKeys.agc(recuperandaId),
    queryFn: () => fetchAgc(recuperandaId),
    enabled: !!recuperandaId,
  })
}

export function useFazendas(moduloRuralId: string) {
  return useQuery({
    queryKey: queryKeys.fazendas(moduloRuralId),
    queryFn: () => fetchFazendas(moduloRuralId),
    enabled: !!moduloRuralId,
  })
}

// ── Mutation Hooks ───────────────────────────────────────────────────
export function useCreateRecuperanda() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      mutationFetcher('/api/recuperandas', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recuperandas })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })
}

export function useUpdateRecuperanda(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      mutationFetcher(`/api/recuperandas/${id}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recuperanda(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.recuperandas })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })
}

export function useUpdateKanban() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string; kanbanColuna: string }) =>
      mutationFetcher(`/api/recuperandas/${data.id}`, {
        method: 'PATCH',
        body: { kanbanColuna: data.kanbanColuna },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recuperandas })
    },
  })
}

export function useCreateCredor(recuperandaId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      mutationFetcher('/api/credores', {
        method: 'POST',
        body: { ...data, recuperandaId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.credores(recuperandaId) })
    },
  })
}

export function useCreateObrigacao(recuperandaId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      mutationFetcher('/api/obrigacoes', {
        method: 'POST',
        body: { ...data, recuperandaId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.obrigacoes(recuperandaId) })
    },
  })
}

export function useUpdateHonorario(recuperandaId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      mutationFetcher(`/api/honorarios/${data.id}`, {
        method: 'PATCH',
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.honorarios(recuperandaId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })
}

export function useCreateDocumento(recuperandaId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      mutationFetcher('/api/documentos', {
        method: 'POST',
        body: { ...data, recuperandaId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos(recuperandaId) })
    },
  })
}

export function useCreateVistoria(recuperandaId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      mutationFetcher('/api/vistorias', {
        method: 'POST',
        body: { ...data, recuperandaId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vistorias(recuperandaId) })
    },
  })
}

export function useUpdateAgc(recuperandaId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      mutationFetcher(`/api/agc/${data.id}`, {
        method: 'PATCH',
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agc(recuperandaId) })
    },
  })
}

export function useCreateFazenda(moduloRuralId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      mutationFetcher('/api/fazendas', {
        method: 'POST',
        body: { ...data, moduloRuralId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fazendas(moduloRuralId) })
    },
  })
}
