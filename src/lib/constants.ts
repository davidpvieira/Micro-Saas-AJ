export const SETORES = [
  { value: 'agronegocio', label: 'Agroneg\u00f3cio', icon: 'Tractor' },
  { value: 'construcao', label: 'Constru\u00e7\u00e3o Civil', icon: 'Building2' },
  { value: 'transporte', label: 'Transporte', icon: 'Truck' },
] as const

export const CLASSES_CREDORES = [
  { value: 'trabalhista', label: 'Trabalhista' },
  { value: 'quirografario', label: 'Quirograf\u00e1rio' },
  { value: 'real', label: 'Garantia Real' },
  { value: 'me_epp', label: 'ME/EPP' },
] as const

export const KANBAN_COLUMNS = [
  { value: 'peticoes_iniciais', label: 'Peti\u00e7\u00f5es Iniciais', color: '#3b82f6' },
  { value: 'verificacao_qgc', label: 'Verifica\u00e7\u00e3o QGC', color: '#8b5cf6' },
  { value: 'agc', label: 'AGC', color: '#f59e0b' },
  { value: 'fiscalizacao', label: 'Fiscaliza\u00e7\u00e3o', color: '#10b981' },
  { value: 'encerramento', label: 'Encerramento', color: '#6b7280' },
] as const

export const STATUS_OBRIGACAO = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluido', label: 'Conclu\u00eddo' },
  { value: 'vencido', label: 'Vencido' },
  { value: 'ia_pendente', label: 'IA Pendente' },
] as const

export const STATUS_HONORARIO = [
  { value: 'em_dia', label: 'Em Dia' },
  { value: 'atrasado', label: 'Atrasado' },
  { value: 'pago', label: 'Pago' },
] as const

export const STATUS_DOCUMENTO = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'recebido', label: 'Recebido' },
  { value: 'em_analise', label: 'Em An\u00e1lise' },
  { value: 'aprovado', label: 'Aprovado' },
] as const

export const STATUS_MEDIACAO = [
  { value: 'sem_proposta', label: 'Sem Proposta' },
  { value: 'proposta_enviada', label: 'Proposta Enviada' },
  { value: 'em_negociacao', label: 'Em Negocia\u00e7\u00e3o' },
  { value: 'acordo_fechado', label: 'Acordo Fechado' },
] as const

export const AGC_ETAPAS = [
  { value: 'procuracoes', label: 'Procura\u00e7\u00f5es' },
  { value: 'quorum', label: 'Qu\u00f3rum' },
  { value: 'edital', label: 'Edital' },
  { value: 'primeira_chamada', label: '1\u00aa Chamada' },
  { value: 'segunda_chamada', label: '2\u00aa Chamada' },
  { value: 'ata', label: 'Ata' },
] as const

export const SEMAFORO_LEVELS = [
  {
    value: 'verde',
    label: 'Verde',
    color: '#22c55e',
    description: 'Tudo em ordem. Sem alertas.',
  },
  {
    value: 'amarelo',
    label: 'Amarelo',
    color: '#eab308',
    description: 'Aten\u00e7\u00e3o necess\u00e1ria. Prazos se aproximando.',
  },
  {
    value: 'azul',
    label: 'Azul',
    color: '#3b82f6',
    description: 'Informa\u00e7\u00e3o. A\u00e7\u00e3o de IA pendente.',
  },
  {
    value: 'vermelho',
    label: 'Vermelho',
    color: '#ef4444',
    description: 'Cr\u00edtico. A\u00e7\u00e3o imediata necess\u00e1ria.',
  },
] as const

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/kanban', label: 'Kanban', icon: 'Kanban' },
  { href: '/processos', label: 'Processos', icon: 'FolderOpen' },
  { href: '/credores', label: 'Credores/QGC', icon: 'Users' },
  { href: '/honorarios', label: 'Honor\u00e1rios', icon: 'DollarSign' },
  { href: '/crm', label: 'CRM', icon: 'Contact' },
  { href: '/portal', label: 'Portal', icon: 'Globe' },
] as const
