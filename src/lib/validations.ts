import { z } from 'zod'

// ── Recuperanda ──────────────────────────────────────────────────────
export const recuperandaSchema = z.object({
  nome: z.string().min(1, 'Nome \u00e9 obrigat\u00f3rio'),
  cnpj: z.string().optional(),
  setor: z.enum(['agronegocio', 'construcao', 'transporte']),
  comarca: z.string().min(1, 'Comarca \u00e9 obrigat\u00f3ria'),
  vara: z.string().min(1, 'Vara \u00e9 obrigat\u00f3ria'),
  juiz: z.string().min(1, 'Juiz \u00e9 obrigat\u00f3rio'),
  numeroCNJ: z.string().min(1, 'N\u00famero CNJ \u00e9 obrigat\u00f3rio'),
  dataDistribuicao: z.coerce.date(),
  statusStay: z.boolean().default(false),
  kanbanColuna: z
    .enum([
      'peticoes_iniciais',
      'verificacao_qgc',
      'agc',
      'fiscalizacao',
      'encerramento',
    ])
    .default('peticoes_iniciais'),
  responsavelId: z.string().optional(),
})

export type RecuperandaFormData = z.infer<typeof recuperandaSchema>

// ── Credor ───────────────────────────────────────────────────────────
export const credorSchema = z.object({
  nome: z.string().min(1, 'Nome \u00e9 obrigat\u00f3rio'),
  cpfCnpj: z.string().optional(),
  classe: z.enum(['trabalhista', 'quirografario', 'real', 'me_epp']),
  valorDeclarado: z.coerce.number().nonnegative().default(0),
  valorHabilitado: z.coerce.number().nonnegative().default(0),
  indiceCorrecao: z.string().optional(),
})

export type CredorFormData = z.infer<typeof credorSchema>

// ── Obriga\u00e7\u00e3o ──────────────────────────────────────────────────────
export const obrigacaoSchema = z.object({
  descricao: z.string().min(1, 'Descri\u00e7\u00e3o \u00e9 obrigat\u00f3ria'),
  artigoLegal: z.string().optional(),
  status: z
    .enum(['pendente', 'em_andamento', 'concluido', 'vencido', 'ia_pendente'])
    .default('pendente'),
  prazoFinal: z.coerce.date(),
  prazoAlertaDias: z.coerce.number().int().positive().default(7),
  linkDocumento: z.string().url().optional().or(z.literal('')),
})

export type ObrigacaoFormData = z.infer<typeof obrigacaoSchema>

// ── Honor\u00e1rio ──────────────────────────────────────────────────────
export const honorarioSchema = z.object({
  valorTotal: z.coerce.number().positive('Valor total deve ser positivo'),
  valorParcela: z.coerce.number().positive('Valor da parcela deve ser positivo'),
  parcelaAtual: z.coerce.number().int().nonnegative().default(0),
  totalParcelas: z.coerce.number().int().positive('Total de parcelas deve ser positivo'),
  status: z.enum(['em_dia', 'atrasado', 'pago']).default('em_dia'),
  dataProximoPagamento: z.coerce.date(),
})

export type HonorarioFormData = z.infer<typeof honorarioSchema>

// ── Documento ────────────────────────────────────────────────────────
export const documentoSchema = z.object({
  categoria: z.enum([
    'art51',
    'contabil',
    'fiscal',
    'trabalhista',
    'societario',
    'judicial',
    'outros',
  ]),
  descricao: z.string().min(1, 'Descri\u00e7\u00e3o \u00e9 obrigat\u00f3ria'),
  artigoReferencia: z.string().optional(),
  status: z
    .enum(['pendente', 'recebido', 'em_analise', 'aprovado'])
    .default('pendente'),
  prazo: z.coerce.date().optional(),
})

export type DocumentoFormData = z.infer<typeof documentoSchema>

// ── Vistoria ─────────────────────────────────────────────────────────
export const vistoriaSchema = z.object({
  dataVistoria: z.coerce.date(),
  observacoes: z.string().optional(),
  proximaVisita: z.coerce.date().optional(),
  status: z.string().default('agendada'),
})

export type VistoriaFormData = z.infer<typeof vistoriaSchema>

// ── AGC ──────────────────────────────────────────────────────────────
export const agcSchema = z.object({
  dataPrimeiraChamada: z.coerce.date(),
  dataSegundaChamada: z.coerce.date().optional(),
  statusEdital: z.string().default('pendente'),
  parceiroSandrini: z.boolean().default(false),
  statusAta: z.string().default('pendente'),
  quorumPresente: z.coerce.number().nonnegative().default(0),
  etapaAtual: z
    .enum([
      'procuracoes',
      'quorum',
      'edital',
      'primeira_chamada',
      'segunda_chamada',
      'ata',
    ])
    .default('procuracoes'),
})

export type AgcFormData = z.infer<typeof agcSchema>

// ── Fazenda ──────────────────────────────────────────────────────────
export const fazendaSchema = z.object({
  nome: z.string().min(1, 'Nome \u00e9 obrigat\u00f3rio'),
  municipio: z.string().min(1, 'Munic\u00edpio \u00e9 obrigat\u00f3rio'),
  areaHectares: z.coerce.number().positive('\u00c1rea deve ser positiva'),
  geoLinkMaps: z.string().url().optional().or(z.literal('')),
  latLng: z.string().optional(),
  statusFitossanitario: z.string().optional(),
  cicloSafra: z.string().optional(),
  creditosCPR: z.coerce.number().nonnegative().default(0),
})

export type FazendaFormData = z.infer<typeof fazendaSchema>

// ── Mensagem Media\u00e7\u00e3o ──────────────────────────────────────────────
export const mensagemMediacaoSchema = z.object({
  texto: z
    .string()
    .min(10, 'Mensagem deve ter no m\u00ednimo 10 caracteres'),
})

export type MensagemMediacaoFormData = z.infer<typeof mensagemMediacaoSchema>

// ── Login ────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('E-mail inv\u00e1lido'),
  password: z.string().min(6, 'Senha deve ter no m\u00ednimo 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
