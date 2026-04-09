import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ==================== HELPERS ====================

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}

function randomDate2024(): Date {
  const start = new Date('2024-01-15').getTime()
  const end = new Date('2024-11-30').getTime()
  return new Date(start + Math.random() * (end - start))
}

function randomCNJ(index: number): string {
  const seq = String(index).padStart(7, '0')
  const dig = String(randomBetween(10, 99))
  const foro = String(randomBetween(1, 30)).padStart(4, '0')
  return `0${seq}-${dig}.2024.8.16.${foro}`
}

function randomCPF(): string {
  const n = () => randomBetween(100, 999)
  return `${n()}.${n()}.${n()}-${randomBetween(10, 99)}`
}

function randomCNPJCredor(): string {
  const n = () => String(randomBetween(10, 99))
  return `${n()}.${n()}${n()}.${n()}${n()}/0001-${n()}`
}

// ==================== DATA CONSTANTS ====================

const juizes = [
  'Dr. Ricardo Augusto de Almeida',
  'Dra. Fernanda Cristina Lourenço',
  'Dr. Marcos Vinícius de Oliveira',
  'Dra. Patrícia Helena Borges',
  'Dr. Eduardo Luís Ferreira',
  'Dra. Juliana Maria Campos',
  'Dr. Roberto Carlos Mendes',
  'Dra. Ana Beatriz Souto Maior',
  'Dr. Gustavo Henrique Prado',
  'Dra. Cláudia Regina da Silva',
  'Dr. Fernando Antônio Costa',
  'Dra. Renata Aparecida Nunes',
  'Dr. Paulo César Rodrigues',
  'Dra. Mariana de Souza Lima',
  'Dr. Alexandre Tavares Lopes',
]

const varas = [
  '1ª Vara Cível',
  '2ª Vara Cível',
  'Vara de Falências e Recuperações',
]

const kanbanColunas = [
  'peticoes_iniciais',
  'verificacao_qgc',
  'agc',
  'fiscalizacao',
  'encerramento',
]

const nomesCredores = [
  'José Carlos da Silva', 'Maria Aparecida Santos', 'Antônio Ferreira Lima',
  'Ana Paula de Oliveira', 'Francisco Alves Pereira', 'Luciana Rodrigues Costa',
  'Pedro Henrique Souza', 'Claudia Fernandes Dias', 'Rafael Moreira Alves',
  'Fernanda Batista Nunes', 'Marcos Antônio Ribeiro', 'Patrícia Mendes Carvalho',
  'Carlos Eduardo Martins', 'Adriana Lopes da Cruz', 'Rodrigo Barbosa Pinto',
  'Juliana Campos Teixeira', 'Bruno Augusto Nascimento', 'Camila Araújo Gomes',
  'Leandro Vieira Ramos', 'Tatiane Rocha Monteiro', 'Fábio Correia Duarte',
  'Sandra Regina Fonseca', 'Marcelo Augusto Xavier', 'Renata Cristina Brito',
  'Banco do Brasil S.A.', 'Caixa Econômica Federal', 'Bradesco S.A.',
  'Itaú Unibanco S.A.', 'Santander Brasil S.A.', 'Banco Safra S.A.',
  'Sicoob Cooperativa de Crédito', 'Sicredi S.A.', 'Syngenta Proteção de Cultivos',
  'Bayer CropScience Ltda', 'Basf S.A.', 'John Deere Brasil',
  'CNH Industrial Brasil', 'Yara Brasil Fertilizantes', 'Mosaic Fertilizantes',
  'Minerva Foods S.A.', 'JBS S.A.', 'BRF S.A.',
  'Votorantim Cimentos S.A.', 'Gerdau S.A.', 'InterCement Brasil S.A.',
  'Concrebras S.A.', 'Quartzolit Weber', 'Tigre S.A.',
]

const classesCredores: Array<{ classe: string; peso: number }> = [
  { classe: 'trabalhista', peso: 30 },
  { classe: 'quirografario', peso: 40 },
  { classe: 'real', peso: 20 },
  { classe: 'me_epp', peso: 10 },
]

function randomClasse(): string {
  const r = randomBetween(1, 100)
  if (r <= 30) return 'trabalhista'
  if (r <= 70) return 'quirografario'
  if (r <= 90) return 'real'
  return 'me_epp'
}

const obrigacaoDescricoes = [
  { desc: 'Apresentar RMA mensal ao juízo', art: "Art. 22, II, 'a'" },
  { desc: 'Extrair relação de credores', art: "Art. 22, I, 'b'" },
  { desc: 'Fiscalizar atividades da devedora', art: "Art. 22, I, 'a'" },
  { desc: 'Publicar edital Art. 52, §1º', art: 'Art. 52, §1º' },
  { desc: 'Apresentar relatório mensal de receitas e despesas', art: "Art. 22, II, 'c'" },
  { desc: 'Verificar procedência dos créditos habilitados', art: "Art. 22, I, 'c'" },
  { desc: 'Consolidar quadro geral de credores', art: 'Art. 18' },
  { desc: 'Comunicar impossibilidade de cumprimento do plano', art: 'Art. 73, IV' },
  { desc: 'Requerer convocação de AGC quando necessário', art: 'Art. 22, I, f' },
  { desc: 'Apresentar plano de recuperação ao juízo', art: 'Art. 53' },
  { desc: 'Protocolar contestações de habilitações', art: 'Art. 8º' },
  { desc: 'Emitir parecer sobre o plano de recuperação', art: "Art. 22, II, 'd'" },
]

const documentoDescricoes = [
  { cat: 'contabil', desc: 'Balanço patrimonial do último exercício', art: 'Art. 51, I' },
  { cat: 'contabil', desc: 'Demonstração de resultados acumulados', art: 'Art. 51, II' },
  { cat: 'contabil', desc: 'Relatório de fluxo de caixa mensal', art: 'Art. 51, V' },
  { cat: 'juridico', desc: 'Certidão negativa de débitos tributários', art: 'Art. 57' },
  { cat: 'juridico', desc: 'Relação nominal completa de credores', art: 'Art. 51, III' },
  { cat: 'juridico', desc: 'Certidão de regularidade fiscal federal', art: 'Art. 57' },
  { cat: 'operacional', desc: 'Relatório de atividades operacionais', art: 'Art. 51, IV' },
  { cat: 'operacional', desc: 'Inventário atualizado de bens e ativos', art: 'Art. 51, VI' },
  { cat: 'contabil', desc: 'Extrato bancário consolidado dos últimos 3 meses', art: 'Art. 51, V' },
  { cat: 'juridico', desc: 'Contrato social e última alteração', art: 'Art. 51, IX' },
]

const fazendaNomes = [
  'Fazenda Boa Esperança', 'Fazenda Santa Clara', 'Sítio São José',
  'Fazenda Três Irmãos', 'Fazenda Água Limpa', 'Fazenda Campo Alegre',
  'Fazenda Primavera', 'Estância Gaúcha', 'Fazenda Bela Vista',
  'Sítio Recanto Verde', 'Fazenda Alto Paraná', 'Fazenda Sol Nascente',
  'Fazenda Nova Aliança', 'Fazenda São Jorge', 'Fazenda Cerrado Verde',
]

const municipiosPR = [
  'Cascavel', 'Toledo', 'Maringá', 'Londrina', 'Foz do Iguaçu',
  'Guarapuava', 'Pato Branco', 'Campo Mourão', 'Umuarama', 'Paranavaí',
  'Francisco Beltrão', 'Palotina', 'Assis Chateaubriand', 'Medianeira',
  'Corbélia',
]

const etapasAGC = [
  'procuracoes', 'quorum', 'edital', 'primeira_chamada', 'segunda_chamada', 'ata',
]

// ==================== RECUPERANDAS DATA ====================

interface RecuperandaData {
  nome: string
  cnpj: string
  setor: string
  comarca: string
  statusStay: string
  stayDaysLeft: number // days until stay expires (negative = already expired)
  kanbanColuna: string
  honorarioStatus: string
  honorarioDiasAtraso: number
}

const recuperandasData: RecuperandaData[] = [
  // ===== AGRONEGOCIO (5) =====
  // RED: stay < 15 days + atrasado honorario
  {
    nome: 'Anilton Winiarski Agropecuária',
    cnpj: '12.345.678/0001-01',
    setor: 'agronegocio',
    comarca: 'Cascavel',
    statusStay: 'ativo',
    stayDaysLeft: 8,
    kanbanColuna: 'fiscalizacao',
    honorarioStatus: 'atrasado',
    honorarioDiasAtraso: 12,
  },
  // YELLOW: pending docs + ia_pendente
  {
    nome: 'Vanderlir Rodrigues Grãos ME',
    cnpj: '23.456.789/0001-02',
    setor: 'agronegocio',
    comarca: 'Toledo',
    statusStay: 'ativo',
    stayDaysLeft: 45,
    kanbanColuna: 'verificacao_qgc',
    honorarioStatus: 'em_dia',
    honorarioDiasAtraso: 0,
  },
  // GREEN
  {
    nome: 'Fazenda São Pedro',
    cnpj: '34.567.890/0001-03',
    setor: 'agronegocio',
    comarca: 'Maringá',
    statusStay: 'prorrogado',
    stayDaysLeft: 90,
    kanbanColuna: 'agc',
    honorarioStatus: 'em_dia',
    honorarioDiasAtraso: 0,
  },
  // YELLOW: stay < 30 days
  {
    nome: 'Cooperativa Rural Iguaçu',
    cnpj: '45.678.901/0001-04',
    setor: 'agronegocio',
    comarca: 'Foz do Iguaçu',
    statusStay: 'ativo',
    stayDaysLeft: 22,
    kanbanColuna: 'fiscalizacao',
    honorarioStatus: 'em_dia',
    honorarioDiasAtraso: 0,
  },
  // GREEN
  {
    nome: 'Agrotech Paranaense',
    cnpj: '56.789.012/0001-05',
    setor: 'agronegocio',
    comarca: 'Londrina',
    statusStay: 'ativo',
    stayDaysLeft: 120,
    kanbanColuna: 'peticoes_iniciais',
    honorarioStatus: 'em_dia',
    honorarioDiasAtraso: 0,
  },
  // ===== CONSTRUCAO (5) =====
  // RED: stay < 15 days + atrasado honorario
  {
    nome: 'CDN Engenharia',
    cnpj: '67.890.123/0001-06',
    setor: 'construcao',
    comarca: 'Curitiba',
    statusStay: 'ativo',
    stayDaysLeft: 5,
    kanbanColuna: 'agc',
    honorarioStatus: 'atrasado',
    honorarioDiasAtraso: 18,
  },
  // YELLOW: ia_pendente obligations
  {
    nome: 'Grupo Bernini Incorporações',
    cnpj: '78.901.234/0001-07',
    setor: 'construcao',
    comarca: 'São Paulo',
    statusStay: 'prorrogado',
    stayDaysLeft: 60,
    kanbanColuna: 'fiscalizacao',
    honorarioStatus: 'em_dia',
    honorarioDiasAtraso: 0,
  },
  // GREEN
  {
    nome: 'Construtora Ibirapuera',
    cnpj: '89.012.345/0001-08',
    setor: 'construcao',
    comarca: 'Campinas',
    statusStay: 'ativo',
    stayDaysLeft: 150,
    kanbanColuna: 'peticoes_iniciais',
    honorarioStatus: 'em_dia',
    honorarioDiasAtraso: 0,
  },
  // GREEN
  {
    nome: 'WMS Construções',
    cnpj: '90.123.456/0001-09',
    setor: 'construcao',
    comarca: 'Curitiba',
    statusStay: 'ativo',
    stayDaysLeft: 100,
    kanbanColuna: 'verificacao_qgc',
    honorarioStatus: 'em_dia',
    honorarioDiasAtraso: 0,
  },
  // YELLOW: pending docs
  {
    nome: 'Edificar Engenharia',
    cnpj: '01.234.567/0001-10',
    setor: 'construcao',
    comarca: 'Florianópolis',
    statusStay: 'ativo',
    stayDaysLeft: 35,
    kanbanColuna: 'encerramento',
    honorarioStatus: 'em_dia',
    honorarioDiasAtraso: 0,
  },
  // ===== TRANSPORTE (5) =====
  // RED: stay vencido + atrasado honorario
  {
    nome: 'Rodojulia Transportes',
    cnpj: '11.222.333/0001-11',
    setor: 'transporte',
    comarca: 'Curitiba',
    statusStay: 'vencido',
    stayDaysLeft: -10,
    kanbanColuna: 'fiscalizacao',
    honorarioStatus: 'atrasado',
    honorarioDiasAtraso: 25,
  },
  // YELLOW: stay < 30 days
  {
    nome: 'Print Press Logística',
    cnpj: '22.333.444/0001-12',
    setor: 'transporte',
    comarca: 'São José dos Pinhais',
    statusStay: 'ativo',
    stayDaysLeft: 18,
    kanbanColuna: 'agc',
    honorarioStatus: 'em_dia',
    honorarioDiasAtraso: 0,
  },
  // GREEN
  {
    nome: 'Transportadora Sudeste',
    cnpj: '33.444.555/0001-13',
    setor: 'transporte',
    comarca: 'Guarulhos',
    statusStay: 'ativo',
    stayDaysLeft: 130,
    kanbanColuna: 'verificacao_qgc',
    honorarioStatus: 'em_dia',
    honorarioDiasAtraso: 0,
  },
  // GREEN
  {
    nome: 'Expresso Paraná Cargas',
    cnpj: '44.555.666/0001-14',
    setor: 'transporte',
    comarca: 'Ponta Grossa',
    statusStay: 'ativo',
    stayDaysLeft: 110,
    kanbanColuna: 'peticoes_iniciais',
    honorarioStatus: 'em_dia',
    honorarioDiasAtraso: 0,
  },
  // GREEN
  {
    nome: 'TransBrasil Fretes',
    cnpj: '55.666.777/0001-15',
    setor: 'transporte',
    comarca: 'Joinville',
    statusStay: 'ativo',
    stayDaysLeft: 95,
    kanbanColuna: 'encerramento',
    honorarioStatus: 'pago',
    honorarioDiasAtraso: 0,
  },
]

// ==================== MAIN SEED ====================

async function main() {
  console.log('🌱 Iniciando seed...')

  // Clean existing data (in reverse order of dependencies)
  console.log('🧹 Limpando dados existentes...')
  await prisma.interacaoCRM.deleteMany()
  await prisma.advogadoInterlocutor.deleteMany()
  await prisma.monitoramentoPJE.deleteMany()
  await prisma.fazenda.deleteMany()
  await prisma.moduloRural.deleteMany()
  await prisma.aGC.deleteMany()
  await prisma.vistoria.deleteMany()
  await prisma.documentoPendente.deleteMany()
  await prisma.honorario.deleteMany()
  await prisma.mensagemMediacao.deleteMany()
  await prisma.incidente.deleteMany()
  await prisma.credor.deleteMany()
  await prisma.obrigacaoLegal.deleteMany()
  await prisma.recuperanda.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  // ==================== 1. USERS ====================
  console.log('👤 Criando usuários...')

  const hashedPassword = bcrypt.hashSync('admin123', 10)

  const nilton = await prisma.user.create({
    data: {
      name: 'Nilton',
      email: 'nilton@aj.com',
      passwordHash: hashedPassword,
      role: 'admin',
    },
  })

  const suzi = await prisma.user.create({
    data: {
      name: 'Suzi',
      email: 'suzi@aj.com',
      passwordHash: hashedPassword,
      role: 'member',
    },
  })

  const david = await prisma.user.create({
    data: {
      name: 'David',
      email: 'david@aj.com',
      passwordHash: hashedPassword,
      role: 'member',
    },
  })

  const users = [nilton, suzi, david]
  console.log(`   ✅ ${users.length} usuários criados`)

  // ==================== 2. RECUPERANDAS + RELATED DATA ====================
  console.log('🏢 Criando recuperandas e dados relacionados...')

  const usedCredorNames = new Set<string>()

  for (let i = 0; i < recuperandasData.length; i++) {
    const rd = recuperandasData[i]
    const responsavel = users[i % 3]

    const dataDistribuicao = randomDate2024()
    const dataInicioStay = new Date(dataDistribuicao.getTime() + 30 * 24 * 60 * 60 * 1000)
    const dataFimStay = daysFromNow(rd.stayDaysLeft)

    console.log(`   📋 [${i + 1}/15] ${rd.nome}...`)

    // Create the Recuperanda
    const recuperanda = await prisma.recuperanda.create({
      data: {
        nome: rd.nome,
        cnpj: rd.cnpj,
        setor: rd.setor,
        comarca: rd.comarca,
        vara: randomFrom(varas),
        juiz: juizes[i],
        numeroCNJ: randomCNJ(i + 1),
        dataDistribuicao,
        statusStay: rd.statusStay,
        dataInicioStay,
        dataFimStay,
        kanbanColuna: rd.kanbanColuna,
        responsavelId: responsavel.id,
      },
    })

    // ---------- CREDORES ----------
    const numCredores = randomBetween(8, 15)
    const credorIds: string[] = []

    for (let c = 0; c < numCredores; c++) {
      let nomeCredor: string
      do {
        nomeCredor = randomFrom(nomesCredores)
      } while (usedCredorNames.has(`${recuperanda.id}-${nomeCredor}`))
      usedCredorNames.add(`${recuperanda.id}-${nomeCredor}`)

      const classe = randomClasse()
      let valorDeclarado: number
      switch (classe) {
        case 'trabalhista':
          valorDeclarado = randomBetween(5000, 150000)
          break
        case 'quirografario':
          valorDeclarado = randomBetween(20000, 2000000)
          break
        case 'real':
          valorDeclarado = randomBetween(100000, 2000000)
          break
        case 'me_epp':
          valorDeclarado = randomBetween(5000, 80000)
          break
        default:
          valorDeclarado = randomBetween(10000, 500000)
      }

      // A few credores with mediation in progress
      let statusMediacao = 'sem_proposta'
      if (c === 0 && i % 3 === 0) statusMediacao = 'proposta_enviada'
      if (c === 1 && i % 4 === 0) statusMediacao = 'em_negociacao'
      if (c === 2 && i % 5 === 0) statusMediacao = 'acordo_fechado'

      const isJuridica = nomeCredor.includes('S.A.') || nomeCredor.includes('Ltda') || nomeCredor.includes('Cooperativa')

      const credor = await prisma.credor.create({
        data: {
          recuperandaId: recuperanda.id,
          nome: nomeCredor,
          cpfCnpj: isJuridica ? randomCNPJCredor() : randomCPF(),
          classe,
          valorDeclarado,
          valorHabilitado: Math.random() > 0.3 ? valorDeclarado * (0.7 + Math.random() * 0.3) : null,
          valorAtualizado: Math.random() > 0.5 ? valorDeclarado * (1.02 + Math.random() * 0.08) : null,
          dataAtualizacao: Math.random() > 0.5 ? daysAgo(randomBetween(5, 60)) : null,
          indiceCorrecao: randomFrom(['ipca_e', 'selic', 'tr', null]),
          statusMediacao,
        },
      })
      credorIds.push(credor.id)
    }

    // ---------- OBRIGACOES LEGAIS ----------
    const numObrigacoes = randomBetween(10, 12)
    const shuffledObrigacoes = [...obrigacaoDescricoes].sort(() => Math.random() - 0.5)

    for (let o = 0; o < numObrigacoes; o++) {
      const obData = shuffledObrigacoes[o % shuffledObrigacoes.length]

      let status: string
      let prazoFinal: Date | null = null
      let iaExtractedDate: Date | null = null
      let iaReliabilityScore: number | null = null

      const statusRoll = randomBetween(1, 100)

      if (o < 2 && (i === 1 || i === 6 || i === 11)) {
        // ia_pendente for YELLOW semaphore processes
        status = 'ia_pendente'
        prazoFinal = daysFromNow(randomBetween(10, 30))
        iaExtractedDate = daysAgo(randomBetween(1, 5))
        iaReliabilityScore = randomBetween(55, 95)
      } else if (o < 3 && (i === 0 || i === 5 || i === 10)) {
        // vencido for RED semaphore processes
        status = 'vencido'
        prazoFinal = daysAgo(randomBetween(3, 15))
      } else if (statusRoll <= 35) {
        status = 'concluido'
        prazoFinal = daysAgo(randomBetween(10, 60))
      } else if (statusRoll <= 55) {
        status = 'em_andamento'
        prazoFinal = daysFromNow(randomBetween(15, 60))
      } else if (statusRoll <= 70) {
        status = 'pendente'
        // Some with prazo in next 7 days (YELLOW)
        if (o % 4 === 0) {
          prazoFinal = daysFromNow(randomBetween(1, 7))
        } else {
          prazoFinal = daysFromNow(randomBetween(15, 45))
        }
      } else if (statusRoll <= 85) {
        status = 'vencido'
        prazoFinal = daysAgo(randomBetween(1, 20))
      } else {
        status = 'ia_pendente'
        prazoFinal = daysFromNow(randomBetween(5, 25))
        iaExtractedDate = daysAgo(randomBetween(1, 10))
        iaReliabilityScore = randomBetween(55, 95)
      }

      await prisma.obrigacaoLegal.create({
        data: {
          recuperandaId: recuperanda.id,
          descricao: obData.desc + (o >= shuffledObrigacoes.length ? ` (${o + 1})` : ''),
          artigoLegal: obData.art,
          status,
          dataProtocolo: status === 'concluido' ? daysAgo(randomBetween(15, 90)) : null,
          prazoFinal,
          prazoAlertaDias: randomFrom([5, 7, 10, 15]),
          linkDocumento: status === 'concluido' ? `https://docs.aj.com/obrigacoes/${recuperanda.id}/${o}` : null,
          iaExtractedDate,
          iaReliabilityScore,
        },
      })
    }

    // ---------- HONORARIO ----------
    const valorTotal = randomBetween(50000, 200000)
    const totalParcelas = randomFrom([12, 18, 24])
    const valorParcela = Math.round((valorTotal / totalParcelas) * 100) / 100

    await prisma.honorario.create({
      data: {
        recuperandaId: recuperanda.id,
        valorTotal,
        valorParcela,
        parcelaAtual: randomBetween(1, Math.min(8, totalParcelas)),
        totalParcelas,
        status: rd.honorarioStatus,
        dataProximoPagamento: rd.honorarioStatus === 'atrasado'
          ? daysAgo(rd.honorarioDiasAtraso)
          : daysFromNow(randomBetween(5, 30)),
        diasAtraso: rd.honorarioDiasAtraso,
      },
    })

    // ---------- DOCUMENTOS PENDENTES ----------
    const numDocs = randomBetween(3, 5)
    const shuffledDocs = [...documentoDescricoes].sort(() => Math.random() - 0.5)

    for (let d = 0; d < numDocs; d++) {
      const docData = shuffledDocs[d % shuffledDocs.length]

      let docStatus: string
      if (d === 0 && (i === 1 || i === 3 || i === 9)) {
        // Pending docs for YELLOW processes
        docStatus = 'pendente'
      } else {
        docStatus = randomFrom(['pendente', 'pendente', 'recebido', 'em_analise', 'aprovado'])
      }

      await prisma.documentoPendente.create({
        data: {
          recuperandaId: recuperanda.id,
          categoria: docData.cat,
          descricao: docData.desc,
          artigoReferencia: docData.art,
          status: docStatus,
          prazo: docStatus === 'pendente'
            ? daysFromNow(randomBetween(5, 30))
            : (docStatus === 'aprovado' ? daysAgo(randomBetween(5, 30)) : daysFromNow(randomBetween(10, 45))),
        },
      })
    }

    // ---------- VISTORIAS ----------
    const numVistorias = randomBetween(1, 2)

    for (let v = 0; v < numVistorias; v++) {
      const vistoriaStatus = v === 0 ? 'realizada' : randomFrom(['agendada', 'realizada'])

      await prisma.vistoria.create({
        data: {
          recuperandaId: recuperanda.id,
          dataVistoria: v === 0
            ? daysAgo(randomBetween(10, 60))
            : daysFromNow(randomBetween(5, 30)),
          observacoes: v === 0
            ? `Vistoria realizada na sede da ${rd.nome}. Verificados documentos contábeis e operacionais. Empresa em funcionamento regular.`
            : `Vistoria de acompanhamento agendada para verificar cumprimento das obrigações do plano.`,
          fotoLinks: v === 0
            ? JSON.stringify([
                `https://storage.aj.com/vistorias/${recuperanda.id}/foto1.jpg`,
                `https://storage.aj.com/vistorias/${recuperanda.id}/foto2.jpg`,
              ])
            : null,
          proximaVisita: daysFromNow(randomBetween(15, 60)),
          status: vistoriaStatus,
        },
      })
    }

    // ---------- AGC ----------
    const etapa = randomFrom(etapasAGC)
    const agcDateBase = new Date(dataDistribuicao.getTime() + 90 * 24 * 60 * 60 * 1000)

    await prisma.aGC.create({
      data: {
        recuperandaId: recuperanda.id,
        dataPrimeiraChamada: ['primeira_chamada', 'segunda_chamada', 'ata'].includes(etapa)
          ? agcDateBase
          : null,
        dataSegundaChamada: ['segunda_chamada', 'ata'].includes(etapa)
          ? new Date(agcDateBase.getTime() + 5 * 24 * 60 * 60 * 1000)
          : null,
        statusEdital: ['edital', 'primeira_chamada', 'segunda_chamada', 'ata'].includes(etapa)
          ? 'publicado'
          : 'pendente',
        parceiroSandrini: Math.random() > 0.6,
        statusAta: etapa === 'ata'
          ? randomFrom(['rascunho', 'finalizada', 'homologada'])
          : 'pendente',
        quorumPresente: ['primeira_chamada', 'segunda_chamada', 'ata'].includes(etapa)
          ? randomBetween(35, 85)
          : null,
        etapaAtual: etapa,
      },
    })

    // ---------- MODULO RURAL (only for agronegocio) ----------
    if (rd.setor === 'agronegocio') {
      const moduloRural = await prisma.moduloRural.create({
        data: {
          recuperandaId: recuperanda.id,
        },
      })

      const numFazendas = randomBetween(2, 3)
      const usedFazendaNomes = new Set<string>()

      for (let f = 0; f < numFazendas; f++) {
        let fazendaNome: string
        do {
          fazendaNome = randomFrom(fazendaNomes)
        } while (usedFazendaNomes.has(fazendaNome))
        usedFazendaNomes.add(fazendaNome)

        // Generate realistic lat/lng in Paraná region
        const lat = -(24.5 + Math.random() * 1.5) // -24.5 to -26.0
        const lng = -(51.5 + Math.random() * 2.5) // -51.5 to -54.0

        // Some fazendas WITHOUT linkLaudoEngenheiro for YELLOW semaphore
        const hasLaudo = f === 0 ? true : Math.random() > 0.4

        await prisma.fazenda.create({
          data: {
            moduloRuralId: moduloRural.id,
            nome: fazendaNome,
            municipio: randomFrom(municipiosPR),
            areaHectares: randomBetween(50, 5000),
            geoLinkMaps: `https://maps.google.com/?q=${lat.toFixed(4)},${lng.toFixed(4)}`,
            latLng: `${lat.toFixed(4)},${lng.toFixed(4)}`,
            statusFitossanitario: randomFrom(['verde', 'verde', 'verde', 'amarelo']),
            cicloSafra: '2025/2026',
            progressoSafra: randomBetween(20, 80),
            creditosCPR: Math.random() > 0.5 ? randomBetween(50000, 500000) : null,
            linkLaudoEngenheiro: hasLaudo
              ? `https://docs.aj.com/laudos/${moduloRural.id}/engenheiro_fazenda_${f + 1}.pdf`
              : null,
            linkLaudoSatelite: Math.random() > 0.3
              ? `https://docs.aj.com/laudos/${moduloRural.id}/satelite_fazenda_${f + 1}.pdf`
              : null,
          },
        })
      }
    }
  }

  // ==================== SUMMARY ====================
  const totalRecuperandas = await prisma.recuperanda.count()
  const totalCredores = await prisma.credor.count()
  const totalObrigacoes = await prisma.obrigacaoLegal.count()
  const totalHonorarios = await prisma.honorario.count()
  const totalDocumentos = await prisma.documentoPendente.count()
  const totalVistorias = await prisma.vistoria.count()
  const totalAGCs = await prisma.aGC.count()
  const totalModulos = await prisma.moduloRural.count()
  const totalFazendas = await prisma.fazenda.count()

  console.log('\n✅ Seed concluído com sucesso!')
  console.log('─'.repeat(40))
  console.log(`   Usuários:          3`)
  console.log(`   Recuperandas:      ${totalRecuperandas}`)
  console.log(`   Credores:          ${totalCredores}`)
  console.log(`   Obrigações:        ${totalObrigacoes}`)
  console.log(`   Honorários:        ${totalHonorarios}`)
  console.log(`   Documentos:        ${totalDocumentos}`)
  console.log(`   Vistorias:         ${totalVistorias}`)
  console.log(`   AGCs:              ${totalAGCs}`)
  console.log(`   Módulos Rurais:    ${totalModulos}`)
  console.log(`   Fazendas:          ${totalFazendas}`)
  console.log('─'.repeat(40))
  console.log('\n🚦 Semáforos esperados:')
  console.log('   🔴 RED (3): Anilton Winiarski, CDN Engenharia, Rodojulia Transportes')
  console.log('   🟡 YELLOW (5): Vanderlir Rodrigues, Cooperativa Rural Iguaçu, Grupo Bernini, Edificar Engenharia, Print Press Logística')
  console.log('   🟢 GREEN (7): Fazenda São Pedro, Agrotech, Construtora Ibirapuera, WMS, Transportadora Sudeste, Expresso Paraná, TransBrasil')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
