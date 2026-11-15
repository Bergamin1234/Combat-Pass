import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InteractiveCombatCalendar } from './InteractiveCombatCalendar';
import { PublicQuickCheckinCard } from './QuickCheckinWidget';

export type SiteVariant = 'school_sidebar' | 'corporate_editorial' | 'arena_hud';

export const FULL_MODALITIES = [
  {
    id: 'muay-thai',
    name: 'Muay Thai Tradicional',
    category: 'Striking Tailandês',
    badge: 'Arte das 8 Armas',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
    desc: 'Socos, chutes com a canela, joelhadas cortantes, cotoveladas e clinch tailandês. O treino mais dinâmico para queima calórica (+800 kcal/aula) e reflexos afiados.',
    highlights: ['Queima Calórica Alta', 'Condicionamento Total', 'Clinch & Cotoveladas', 'Turmas Kids e Adultos'],
    target: 'Iniciantes, Mulheres, Crianças e Atletas',
    scheduleSummary: 'Seg a Sex (Manhã, Tarde e Noite) | Sábado'
  },
  {
    id: 'jiu-jitsu',
    name: 'Jiu-Jitsu Brasileiro (BJJ)',
    category: 'Grappling & Arte Suave',
    badge: 'Domínio no Chão',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=80',
    desc: 'A arte marcial baseada em alavancas, raspagens e finalizações (chaves de braço, triângulos e estrangulamentos). Onde a técnica supera a força física.',
    highlights: ['Gi & No-Gi', 'Graduação Oficial', 'Xadrez Corporal', 'Respeito e Irmandade'],
    target: 'Todas as Idades e Níveis Técnicos',
    scheduleSummary: 'Seg a Sáb (Manhã, Noite e Open Mat)'
  },
  {
    id: 'boxe',
    name: 'Boxe Clássico',
    category: 'Nobre Arte',
    badge: 'Mãos de Aço',
    image: 'https://images.unsplash.com/photo-1509563423944-b791c380791c?w=800&auto=format&fit=crop&q=80',
    desc: 'Evolua seu jogo de pernas, pêndulos defensivos, esquivas cirúrgicas e combinações devastadoras de jab, direto, cruzado e uppercut em sacos pesados e manoplas.',
    highlights: ['Pernas & Esquivas', 'Fortalecimento do Core', 'Sacos Pesados', 'Sparring Controlado'],
    target: 'Iniciantes ao Alto Rendimento',
    scheduleSummary: 'Seg, Qua e Sex (07h, 12h, 18h e 19h)'
  },
  {
    id: 'mma',
    name: 'MMA (Mixed Martial Arts)',
    category: 'Combate Misto',
    badge: 'Octógono & Grade',
    image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&auto=format&fit=crop&q=80',
    desc: 'A integração completa das modalidades: striking em pé, transições de grade, quedas do wrestling e finalizações no solo. Para quem busca a máxima preparação.',
    highlights: ['Grade / Cage Oficial', 'Transições Pé e Solo', 'Ground and Pound', 'Físico de Elite'],
    target: 'Praticantes Intermediários e Avançados',
    scheduleSummary: 'Ter e Qui (20h às 21h30) | Sex'
  },
  {
    id: 'kickboxing',
    name: 'Kickboxing & K-1 Rules',
    category: 'Potência & Ritmo',
    badge: 'Explosão Total',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    desc: 'A união dos socos contundentes do boxe com chutes circulares rápidos e low kicks na coxa. Treinos explosivos que esculpem o corpo e aumentam a resistência cardiovascular.',
    highlights: ['Combinações Rápidas', 'Defesa e Contra-Ataque', 'Pernas Fortes', 'Queima de Gordura'],
    target: 'Público Masculino, Feminino e Juvenil',
    scheduleSummary: 'Ter e Qui (18h às 19h30)'
  },
  {
    id: 'taekwondo',
    name: 'Taekwondo Olímpico',
    category: 'Arte Marcial Coreana',
    badge: 'Precisão & Chutes',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop&q=80',
    desc: 'Chutes voadores, giratórios e velocidade dinâmica com foco em disciplina, flexibilidade extraordinária e autocontrole. Excelente pedagogia esportiva infantil.',
    highlights: ['Chutes Giratórios', 'Flexibilidade Extrema', 'Graduação de Faixas', 'Pedagogia Kids'],
    target: 'Crianças a partir de 5 anos e Adultos',
    scheduleSummary: 'Ter e Qui (17h Kids / 18h Adultos)'
  },
  {
    id: 'judo',
    name: 'Judô & Submission Grappling',
    category: 'Quedas & Alavancas',
    badge: 'Caminho Suave',
    image: 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&auto=format&fit=crop&q=80',
    desc: 'Uso inteligente da força e equilíbrio do oponente contra ele mesmo. Domínio de quedas espetaculares (ippon), projeções corporais e controle no solo.',
    highlights: ['Quedas e Ippons', 'Equilíbrio Inabalável', 'Disciplina e Tradição', 'Defesa Pessoal'],
    target: 'Infantil, Juvenil e Adulto',
    scheduleSummary: 'Seg e Qua (17h e 19h)'
  },
  {
    id: 'defesa-pessoal',
    name: 'Defesa Pessoal & Krav Maga',
    category: 'Autoproteção Real',
    badge: 'Segurança Urbana',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80',
    desc: 'Técnicas diretas e instintivas para neutralizar agressões reais, agarramentos, empurrões e situações de perigo urbano. Aulas práticas com foco em autoconfiança.',
    highlights: ['Sem Regras Esportivas', 'Desvencilhamentos', 'Autoconfiança Total', 'Cenários Urbanos'],
    target: 'Qualquer Pessoa (Sem Exigência Prévia)',
    scheduleSummary: 'Sábados (09h00 às 11h00)'
  }
];

export const FULL_INSTRUCTORS = [
  {
    id: 'carlos-silva',
    name: 'Mestre Carlos Silva',
    role: 'Head Coach de Muay Thai & Striking',
    cref: 'Kru Formado & Faixa Preta',
    bio: 'Mais de 16 anos dedicados ao ensino marcial de alto rendimento. Formador de campeões e especialista em metodologia de ensino para iniciantes e atletas.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    specialties: ['Muay Thai Tradicional', 'Clinch & Cotovelos', 'Kickboxing K-1'],
    achievements: [
      'Faixa Preta / Grau Superior Internacional',
      'Coordenador Técnico Geral do Centro de Treinamento',
      'Mais de 500 alunos e instrutores graduados',
      'Certificação em Fisiologia e Treinamento de Potência'
    ]
  },
  {
    id: 'marcos-prado',
    name: "Prof. Marcos 'Gracie' Prado",
    role: 'Head Coach de Jiu-Jitsu Brasileiro (BJJ)',
    cref: 'Faixa Preta 2º Grau CBJJ/IBJJF',
    bio: 'Especialista em passagens de guarda modernas, alavancas de finalização e defesa pessoal. Dedicado à pedagogia marcial inclusiva para crianças e adultos.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    specialties: ['Jiu-Jitsu Esportivo (Gi)', 'No-Gi / Submission Grappling', 'Defesa Pessoal'],
    achievements: [
      'Faixa Preta 2º Grau CBJJ/IBJJF',
      'Campeão de múltiplos campeonatos estaduais e nacionais',
      'Mais de 12 anos de docência nos tatames'
    ]
  },
  {
    id: 'ricardo-santos',
    name: 'Coach Ricardo Santos',
    role: 'Treinador Chefe de Boxe Clássico',
    cref: 'Ex-Boxeador Profissional & Treinador',
    bio: 'Especialista em biomecânica de golpes, esquivas milimétricas e resistência respiratória para combate.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    specialties: ['Boxe Clássico', 'Padrão de Pêndulo e Fintas', 'Manoplas de Alta Velocidade'],
    achievements: [
      'Cartel invicto como amador (18V - 0D)',
      'Treinador de atletas de destaque nos ringues',
      'Metodologia focada em queima de gordura e precisão'
    ]
  },
  {
    id: 'anderson-costa',
    name: 'Sensei Jin-Woo Park',
    role: 'Mestre de Taekwondo Olímpico',
    cref: 'Faixa Preta 4º Dan Kukkiwon',
    bio: 'Dedicado ao desenvolvimento motor, flexibilidade e integridade moral das crianças e adultos através da arte marcial coreana.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    specialties: ['Taekwondo Olímpico', 'Chutes Giratórios Acrobáticos', 'Formação Infantil'],
    achievements: [
      'Faixa Preta 4º Dan Internacional',
      '15 anos de dedicação e arbitragem marcial',
      'Centenas de crianças formadas e disciplinadas'
    ]
  }
];

export const FULL_FACILITIES = [
  {
    icon: '🥋',
    title: 'Tatame Olímpico de Alta Densidade',
    desc: 'Ampla área de tatame profissional com sistema anti-impacto que protege articulações em quedas e treinos intensos.'
  },
  {
    icon: '🛡️',
    title: 'Octógono & Área de Grade Oficial',
    desc: 'Grade e cage construídos nos padrões internacionais para prática real de transição e clinch no MMA.'
  },
  {
    icon: '🥊',
    title: 'Estação de Sacos Pesados & Manoplas',
    desc: 'Sacos de couro de 60kg a 100kg, teto-solo, punching balls e manoplas tailandesas de primeira linha.'
  },
  {
    icon: '❄️',
    title: 'Ambiente 100% Climatizado',
    desc: 'Ar-condicionado central em todo o espaço de treino, garantindo conforto térmico e ventilação ideal.'
  },
  {
    icon: '🚿',
    title: 'Vestiários Premium com Duchas Quentes',
    desc: 'Vestiários masculino e feminino com armários individuais, duchas pressurizadas e higiene impecável.'
  },
  {
    icon: '☕',
    title: 'Lounge & Loja de Equipamentos',
    desc: 'Espaço de convivência, hidratação e aquisição de luvas, bandagens, kimonos e artigos oficiais.'
  }
];

export const FULL_SCHEDULES = [
  {
    day: 'Segunda, Quarta e Sexta',
    periods: [
      { time: '07:00 - 08:00', modality: 'Boxe Clássico', level: 'Todos os Níveis', instructor: 'Coach Ricardo Santos', shift: 'manha' },
      { time: '16:00 - 17:00', modality: 'Muay Thai (ADULTOS)', level: 'Todos os Níveis', instructor: 'Mestre Carlos Silva', shift: 'tarde' },
      { time: '17:00 - 18:00', modality: 'Judô Infantil & Juvenil', level: 'Iniciante / Kids', instructor: 'Prof. Marcos Prado', shift: 'tarde' },
      { time: '18:00 - 19:00', modality: 'Muay Thai (KIDS)', level: 'Infantil', instructor: 'Mestre Carlos Silva', shift: 'noite' },
      { time: '19:00 - 20:00', modality: 'Muay Thai (ADULTOS)', level: 'Todos os Níveis', instructor: 'Mestre Carlos Silva', shift: 'noite' },
      { time: '20:00 - 21:30', modality: 'Jiu-Jitsu / BJJ (Gi)', level: 'Todos os Níveis', instructor: 'Prof. Marcos Prado', shift: 'noite' }
    ]
  },
  {
    day: 'Terça e Quinta',
    periods: [
      { time: '08:00 - 09:00', modality: 'Funcional Fight & Condicionamento', level: 'Geral', instructor: 'Mestre Carlos Silva', shift: 'manha' },
      { time: '15:00 - 16:00', modality: 'Muay Thai Técnico', level: 'Todos os Níveis', instructor: 'Mestre Carlos Silva', shift: 'tarde' },
      { time: '17:00 - 18:00', modality: 'Taekwondo Kids', level: 'Infantil', instructor: 'Sensei Jin-Woo Park', shift: 'tarde' },
      { time: '18:00 - 19:00', modality: 'Taekwondo Adulto', level: 'Todos os Níveis', instructor: 'Sensei Jin-Woo Park', shift: 'noite' },
      { time: '19:00 - 20:00', modality: 'Kickboxing & K-1', level: 'Todos os Níveis', instructor: 'Mestre Carlos Silva', shift: 'noite' },
      { time: '20:00 - 21:30', modality: 'MMA & Submission No-Gi', level: 'Intermediário e Avançado', instructor: 'Prof. Marcos Prado', shift: 'noite' }
    ]
  },
  {
    day: 'Sábado',
    periods: [
      { time: '08:00 - 09:00', modality: 'Sparring Técnico Controlado', level: 'Alunos Matriculados', instructor: 'Mestre Carlos Silva', shift: 'manha' },
      { time: '09:00 - 10:30', modality: 'Defesa Pessoal & Krav Maga', level: 'Todos os Níveis', instructor: 'Equipe Técnica', shift: 'manha' },
      { time: '10:30 - 12:00', modality: 'Open Mat / Treino Livre BJJ', level: 'Todos os Níveis', instructor: 'Prof. Marcos Prado', shift: 'manha' }
    ]
  }
];

export const FULL_PLANS = [
  {
    badge: 'Iniciação',
    icon: '🥊',
    title: '2x na semana',
    subtitle: 'Ideal para quem está começando nas artes marciais.',
    price: '140',
    period: '/ mês',
    features: [
      '2 Treinos semanais de sua escolha',
      'Boxe, Muay Thai ou Jiu-Jitsu',
      'Acompanhamento técnico com mestres',
      'Vestiários & Tatame Climatizado'
    ],
    ctaUrl: '/checkout?plano=2x%20na%20semana&valor=140',
    ctaLabel: '🥊 Assinar Plano 2x',
    highlighted: false
  },
  {
    badge: 'Evolução',
    icon: '🥋',
    title: '3x na semana',
    subtitle: 'Ritmo constante para defesa pessoal e queima calórica.',
    price: '160',
    period: '/ mês',
    features: [
      '3 Aulas semanais intercaladas',
      'Striking (em pé) e Grappling (chão)',
      'Graduação oficial de faixas/prajied',
      'Acesso ao Portal do Aluno & XP'
    ],
    ctaUrl: '/checkout?plano=3x%20na%20semana&valor=160',
    ctaLabel: '🥋 Assinar Plano 3x',
    highlighted: false
  },
  {
    badge: 'Mais Escolhido · Passaporte Livre',
    icon: '🏆',
    title: 'Todos os Dias',
    subtitle: 'Acesso ilimitado a todas as 8 modalidades e horários.',
    price: '190',
    period: '/ mês',
    features: [
      'Treinos ilimitados de Seg a Sábado',
      'Todas as 8 modalidades inclusas',
      'Open Mat, Sparring & Preparação Física',
      'Multiplicador de XP + Loja de Points'
    ],
    ctaUrl: '/checkout?plano=Passaporte%20Livre&valor=190',
    ctaLabel: '🔥 Assinar Passaporte Livre',
    highlighted: true
  },
  {
    badge: 'Diária & Convênios',
    icon: '⚡',
    title: 'Passes & Avulso',
    subtitle: 'Wellhub (Gympass), TotalPass, Combat-Pass ou Aula Avulsa.',
    price: '40',
    period: '/ aula ou check-in',
    features: [
      'Aceita Wellhub (Gympass) & TotalPass',
      'Validação imediata via Check-in Expresso',
      'Diária avulsa sem fidelidade',
      'Acesso completo à estrutura do CT'
    ],
    ctaUrl: '/portal',
    ctaLabel: '⚡ Validar Check-in / Convênio',
    highlighted: false
  }
];

export const FULL_GALLERY = [
  { title: 'Chute & Manopla', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80' },
  { title: 'Arte Suave (BJJ)', img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=80' },
  { title: 'Boxe Clássico', img: 'https://images.unsplash.com/photo-1509563423944-b791c380791c?w=800&auto=format&fit=crop&q=80' },
  { title: 'Tatame & Estrutura', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80' },
  { title: 'Foco & Manopla', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80' },
  { title: 'MMA & Octógono', img: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&auto=format&fit=crop&q=80' }
];

export const FULL_FAQS = [
  {
    question: 'Nunca pratiquei artes marciais na vida. A academia é para mim?',
    answer: 'Com certeza! Mais de 70% dos nossos novos alunos começam do zero absoluto. Nossas turmas são divididas por níveis técnicos, e os professores acompanham individualmente seus primeiros passos com respeito ao seu ritmo e segurança total.'
  },
  {
    question: 'Quais modalidades estão inclusas no Passaporte Livre?',
    answer: 'No plano Passaporte Livre, você pode treinar TODAS as modalidades da grade: Muay Thai, Jiu-Jitsu (Gi e No-Gi), Boxe Clássico, MMA, Kickboxing, Taekwondo, Judô e Defesa Pessoal, em qualquer horário e turno.'
  },
  {
    question: 'Preciso ter equipamentos (luvas, kimono, caneleira) na primeira aula?',
    answer: 'Não! Para a sua aula experimental, basta vir com uma roupa esportiva confortável (bermuda e camiseta). Nós emprestamos luvas higienizadas e fornecemos toda a orientação.'
  },
  {
    question: 'Como funciona o agendamento da Aula Experimental Gratuita?',
    answer: "Basta clicar em qualquer botão de 'Agendar Aula Experimental' no site, selecionar a modalidade do seu interesse e o turno de preferência para confirmar sua vaga."
  },
  {
    question: 'A academia aceita planos corporativos como Wellhub (Gympass), TotalPass e Combat-Pass?',
    answer: 'Sim! Aceitamos os principais planos corporativos e passes unificados com validação de check-in diário por horário específico para todas as artes marciais.'
  },
  {
    question: 'Mulheres e crianças podem treinar com segurança?',
    answer: 'Absolutamente! Nossas turmas contam com alta participação feminina e turmas kids exclusivas com pedagogia marcial baseada em disciplina, respeito mútuo e zero violência.'
  }
];

export const ECOSYSTEM_MODULES = [
  {
    id: 'alunos',
    icon: '👥',
    title: 'Gestão de Alunos 360°',
    desc: 'Controle integral e simplificado do ciclo de vida de cada praticante. Da matrícula ao acompanhamento médico e frequência no tatame.',
    items: [
      { icon: '✓', title: 'Cadastro completo & CPF', text: 'Dados pessoais, CPF, fotos de perfil, planos vinculados e contratos com assinatura eletrônica.' },
      { icon: '⚡', title: 'Contato de emergência', text: 'Acesso rápido com botão de discagem e WhatsApp direto aos responsáveis.' },
      { icon: '📋', title: 'Histórico médico', text: 'Prontuário com restrições físicas, atestados de saúde e lesões anteriores.' },
      { icon: '🔔', title: 'Alertas inteligentes', text: 'Notificações automáticas de evasão para alunos ausentes e avisos de graduação.' }
    ]
  },
  {
    id: 'financeiro',
    icon: '💰',
    title: 'ERP Financeiro & Caixa Diário',
    desc: 'Fechamento de caixa diário (PDV), controle de mensalidades, repasses multi-academias e comissões dinâmicas de professores.',
    items: [
      { icon: '💵', title: 'Caixa Diário (PDV)', text: 'Entradas via PIX, Cartão e Dinheiro com conferência de saldo em tempo real.' },
      { icon: '📄', title: 'Contratos Digitais', text: 'Geração automática de termos com assinatura digital do aluno no portal.' },
      { icon: '🥋', title: 'Comissões de Professores', text: 'Cálculo transparente por aula ministrada, check-in validado e retenção.' },
      { icon: '📊', title: 'Relatórios Auditáveis', text: 'KPIs de receita recorrente (MRR), inadimplência zero e ticket médio.' }
    ]
  },
  {
    id: 'agenda',
    icon: '📅',
    title: 'Agenda & Check-in por Horário',
    desc: 'Grade interativa em tempo real com limite de vagas por tatame, check-in expresso sem fila e cancelamento de vaga pendente.',
    items: [
      { icon: '🟢', title: 'Status [HÁ VAGAS] / [LOTADO]', text: 'Controle automático de lotação máxima de cada turma e horário.' },
      { icon: '⚡', title: 'Check-in Expresso por CPF', text: 'Bater ponto de presença selecionando o horário exato do treino em 3 segundos.' },
      { icon: '❌', title: 'Cancelamento pelo Aluno', text: 'Liberação de vaga pelo próprio aluno enquanto o check-in está pendente.' },
      { icon: '🚫', title: 'Aulas Canceladas Riscadas', text: 'Exibição transparente de turmas suspensas com horário e instrutor riscados.' }
    ]
  },
  {
    id: 'graduacoes',
    icon: '🥋',
    title: 'Graduações, Faixas & Prajieds',
    desc: 'Acompanhamento oficial de tempo de tatame, exames de faixa/prajied e avaliações técnicas individuais.',
    items: [
      { icon: '🥋', title: 'Linha de Graduação Oficial', text: 'Controle de graus, faixas (BJJ/Judô/TKD) e Prajieds (Muay Thai).' },
      { icon: '📈', title: 'Meta de Frequência %', text: 'Cálculo automático de presença efetiva necessária para o próximo exame.' },
      { icon: '🏅', title: 'Avaliação Técnica do Mestre', text: 'Notas de técnica, gás, força, disciplina e sparring registradas pelo professor.' },
      { icon: '📜', title: 'Certificação Reconhecida', text: 'Histórico completo de evolução marcial no perfil do atleta.' }
    ]
  },
  {
    id: 'app',
    icon: '📱',
    title: 'Portal & Aplicativo do Aluno',
    desc: 'Experiência mobile e desktop completa para o aluno agendar treinos, assinar contratos, ver avisos e acompanhar seu desempenho.',
    items: [
      { icon: '📲', title: 'Acesso Rápido Mobile & Web', text: 'Interface responsiva com 14 paletas de cores e múltiplos layouts.' },
      { icon: '🩺', title: 'Justificativa com Atestado', text: 'Envio de aviso de ausência por doença para abono de falta na frequência.' },
      { icon: '📢', title: 'Mural de Avisos Oficial', text: 'Comunicados de seminários, feriados e exames de faixa direto no app.' },
      { icon: '🛍️', title: 'Mercado & Loja do CT', text: 'Reserva de equipamentos, kimonos, luvas e suplementos pelo portal.' }
    ]
  },
  {
    id: 'engajamento',
    icon: '🏆',
    title: 'Gamificação, Ranking & Torneios',
    desc: 'Transforme suor em XP, medalhas de raridade, posição no Ranking Global e equipamentos reais na Loja de Points.',
    items: [
      { icon: '🔥', title: 'Fogo do Guerreiro (Streak)', text: 'Contador de treinos seguidos que incentiva a assiduidade semanal.' },
      { icon: '🥇', title: '30 Conquistas por Raridade', text: 'Medalhas Normais, Raras, Épicas e Lendárias desbloqueáveis no tatame.' },
      { icon: '🌍', title: 'Ranking Global & Brackets', text: 'Classificação MMR entre atletas e chaves de torneios oficiais.' },
      { icon: '🪙', title: 'Loja de Combat Points', text: 'Troque pontos acumulados nos treinos por luvas, bandagens e mensalidades.' }
    ]
  }
];

export const PODIUM_ATHLETES = [
  { rank: 2, name: 'Marcus Miller', xp: '3,450 XP', badge: 'Prata', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { rank: 1, name: 'Ítalo Bergamin', xp: '4,820 XP', badge: 'Campeão', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', crown: true },
  { rank: 3, name: 'Renato Silva', xp: '2,910 XP', badge: 'Bronze', img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80' }
];

export const ACHIEVEMENT_BADGES = [
  { icon: '🥊', title: 'Primeiro Treino', rarity: 'Normal', color: 'var(--text-muted-foreground)' },
  { icon: '⚡', title: '50 Treinos', rarity: 'Rara', color: 'var(--color-primary)' },
  { icon: '🥋', title: 'Sparring Concluído', rarity: 'Rara', color: 'var(--color-primary)' },
  { icon: '🛡️', title: '100 Treinos', rarity: 'Épica', color: 'var(--color-accent)' },
  { icon: '🔥', title: 'Assiduidade 100%', rarity: 'Épica', color: 'var(--color-accent)' },
  { icon: '🏆', title: 'Mestre do Tatame', rarity: 'Lendária', color: 'var(--color-primary)' }
];

interface CompleteSiteModulesProps {
  variant: SiteVariant;
  academies: any[];
  rewardsCatalog: any[];
  activeSectionFilter?: string; // 'ALL' or specific section id when in school_sidebar mode
}

export const CompleteSiteModules: React.FC<CompleteSiteModulesProps> = ({
  variant,
  academies,
  rewardsCatalog,
  activeSectionFilter = 'ALL'
}) => {
  const [shiftFilter, setShiftFilter] = useState<'all' | 'manha' | 'tarde' | 'noite'>('all');
  const [activeEcoTab, setActiveEcoTab] = useState<string>('alunos');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [modalitySearch, setModalitySearch] = useState('');
  const [partnerForm, setPartnerForm] = useState({ nomeCt: '', cidade: '', responsavel: '', whatsapp: '', modalidades: '' });
  const [partnerSaved, setPartnerSaved] = useState(false);

  const isSharp = variant === 'corporate_editorial';
  const isHud = variant === 'arena_hud';
  const radiusCard = isSharp ? '4px' : isHud ? '12px' : '18px';
  const borderCard = isHud
    ? '1px solid var(--color-primary)'
    : '1px solid var(--border-subtle)';

  const shouldShow = (secId: string) => activeSectionFilter === 'ALL' || activeSectionFilter === secId;

  const currentEco = ECOSYSTEM_MODULES.find(m => m.id === activeEcoTab) || ECOSYSTEM_MODULES[0];

  const filteredModalities = FULL_MODALITIES.filter(m =>
    !modalitySearch.trim() ||
    m.name.toLowerCase().includes(modalitySearch.toLowerCase()) ||
    m.category.toLowerCase().includes(modalitySearch.toLowerCase())
  );

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.nomeCt || !partnerForm.whatsapp) return;
    setPartnerSaved(true);
    setTimeout(() => setPartnerSaved(false), 5000);
    setPartnerForm({ nomeCt: '', cidade: '', responsavel: '', whatsapp: '', modalidades: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isSharp ? '2.25rem' : '2rem' }}>
      {/* =====================================================================
          1. O QUE É O CT + VITRINE DE ACADEMIAS CREDENCIADAS
          ===================================================================== */}
      {shouldShow('o_que_e_ct') && (
        <section
          id="o-que-e-o-ct-react"
          style={{
            padding: isSharp ? '2rem' : '1.75rem',
            borderRadius: radiusCard,
            background: 'var(--bg-surface-1)',
            border: borderCard,
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
              alignItems: 'center'
            }}
          >
            <div>
              <div
                style={{
                  position: 'relative',
                  borderRadius: radiusCard,
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  height: '290px'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&auto=format&fit=crop&q=80"
                  alt="Treino no Centro de Treinamento"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.88), transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1.25rem'
                  }}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Ambiente de Respeito & Disciplina
                  </span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
                    Onde o ego fica do lado de fora do tatame.
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                <div style={{ padding: '0.95rem', borderRadius: radiusCard, background: 'var(--bg-background)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-primary)' }}>100%</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>Ambiente Climatizado</div>
                </div>
                <div style={{ padding: '0.95rem', borderRadius: radiusCard, background: 'var(--bg-background)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-accent)' }}>0 a 100</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>Do Sedentário ao Atleta</div>
                </div>
              </div>
            </div>

            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.28rem 0.7rem',
                  borderRadius: isSharp ? '2px' : '999px',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                🛡️ CONHEÇA NOSSO CENTRO DE TREINAMENTO & REDE COMBAT-PASS
              </span>
              <h2 style={{ margin: '0.6rem 0', fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
                O Que É o <span style={{ color: 'var(--color-primary)' }}>Centro de Combate</span>?
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-foreground)', lineHeight: 1.6, marginBottom: '1rem' }}>
                O <strong>CENTRO DE COMBATE (Combat-Pass Hub)</strong> nasceu com uma missão clara: <strong>democratizar as artes marciais de alto nível técnico</strong> em um ambiente seguro, acolhedor e com infraestrutura padrão internacional.
              </p>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ padding: '0.85rem', borderRadius: radiusCard, background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                    ✓ Para quem nunca calçou uma luva ou vestiu um kimono:
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted-foreground)', marginTop: '0.2rem', lineHeight: 1.45 }}>
                    Não existe cobrança agressiva de desempenho. Nossos mestres ensinam desde a base (postura, guarda, respiração) garantindo segurança total.
                  </div>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: radiusCard, background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                    🔥 Para quem busca emagrecimento & alívio do estresse:
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted-foreground)', marginTop: '0.2rem', lineHeight: 1.45 }}>
                    Treinos de Muay Thai, Kickboxing e Funcional Fight queimam até 800 calorias por hora, descarregando as tensões do dia a dia.
                  </div>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: radiusCard, background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                    🏆 Para atletas e praticantes graduados:
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted-foreground)', marginTop: '0.2rem', lineHeight: 1.45 }}>
                    Treinos táticos de alto rendimento, sparring técnico controlado e preparação para campeonatos de Jiu-Jitsu, Muay Thai, Boxe e MMA.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1.1rem' }}>
                <Link
                  to="/agendar"
                  style={{
                    padding: '0.75rem 1.3rem',
                    borderRadius: radiusCard,
                    background: 'var(--color-primary)',
                    color: 'var(--text-primary-foreground)',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    textTransform: 'uppercase'
                  }}
                >
                  🔥 Agendar Minha Primeira Aula Gratuita
                </Link>
                <Link
                  to="/portal"
                  style={{
                    padding: '0.75rem 1.2rem',
                    borderRadius: radiusCard,
                    background: 'var(--bg-background)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    textDecoration: 'none'
                  }}
                >
                  🥊 Entrar na Área do Aluno
                </Link>
              </div>
            </div>
          </div>

          {/* Unidades Credenciadas */}
          {academies && academies.length > 0 && (
            <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                    REDE MULTI-ACADEMIAS COMBAT-PASS
                  </span>
                  <h3 style={{ margin: '0.15rem 0 0 0', fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                    🏛️ Unidades & Centros de Treinamento Credenciados ({academies.length})
                  </h3>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.9rem' }}>
                {academies.map((ct: any) => (
                  <div
                    key={ct.id}
                    style={{
                      padding: '1rem',
                      borderRadius: radiusCard,
                      background: 'var(--bg-background)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.65rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.64rem', fontWeight: 900, color: 'var(--color-primary)', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--color-primary-light)' }}>
                          PASSE {ct.tierMinimo || 'SILVER'}+
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: ct.vagasHoje > 0 ? 'var(--status-available)' : 'var(--status-full)' }}>
                          {ct.vagasHoje > 0 ? `● [HÁ VAGAS: ${ct.vagasHoje}]` : '● [LOTADO]'}
                        </span>
                      </div>
                      <h4 style={{ margin: '0.45rem 0 0.15rem 0', fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                        {ct.nome}
                      </h4>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted-foreground)' }}>
                        📍 {ct.bairro} · {ct.cidade} ({ct.distancia})
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {(ct.modalidades || []).map((m: string) => (
                        <span key={m} style={{ fontSize: '0.64rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', color: 'var(--text-foreground)', fontWeight: 700 }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          2. OS 3 PILARES COMPETITIVOS: TORNEIOS / RANKING / ESTATÍSTICAS
          ===================================================================== */}
      {shouldShow('competitivo') && (
        <section id="destaques-competitivos-react">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {[
              {
                icon: '🏆',
                badge: 'Inscrições Abertas',
                title: '🏆 Próximos Torneios & Brackets',
                desc: 'Confira o calendário oficial de brackets, eliminatórias regionais e copas de artes marciais. Inscreva-se em chaves oficiais e compita pelo pódio.',
                to: '/portal?tab=torneios'
              },
              {
                icon: '🌍',
                badge: 'MMR Atualizado',
                title: '🌍 Ranking Global de Atletas',
                desc: 'Classificação geral por divisão de peso, graduação e taxa de finalizações. Veja quem lidera o ranking do tatame e compare seus pontos.',
                to: '/portal?tab=ranking'
              },
              {
                icon: '📊',
                badge: 'Analytics Ao Vivo',
                title: '📊 Estatísticas de Desempenho',
                desc: 'Métricas de assiduidade, aproveitamento de golpes, taxa de vitórias e frequência semanal consolidados para impulsionar sua evolução.',
                to: '/portal?tab=desempenho'
              }
            ].map(card => (
              <Link
                key={card.title}
                to={card.to}
                style={{
                  padding: '1.4rem',
                  borderRadius: radiusCard,
                  background: 'var(--bg-surface-1)',
                  border: borderCard,
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '1.9rem' }}>{card.icon}</span>
                    <span style={{ fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', border: '1px solid var(--color-primary-border)' }}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                    {card.title}
                  </h3>
                  <p style={{ margin: '0.45rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted-foreground)', lineHeight: 1.5 }}>
                    {card.desc}
                  </p>
                </div>
                <div style={{ paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.76rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                  Acessar módulo oficial →
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          3. AS 8 MODALIDADES DE COMBATE OFICIAIS (COMPLETAS COM FOTOS E HORÁRIOS)
          ===================================================================== */}
      {shouldShow('modalidades') && (
        <section
          id="modalidades-react"
          style={{
            padding: isSharp ? '2rem' : '1.75rem',
            borderRadius: radiusCard,
            background: 'var(--bg-surface-1)',
            border: borderCard
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.35rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🥋 ARTES MARCIAIS & CONDICIONAMENTO DE ELITE
              </span>
              <h2 style={{ margin: '0.2rem 0 0 0', fontSize: 'clamp(1.45rem, 2.5vw, 2.1rem)', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
                8 Modalidades Oferecidas no Tatame
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={modalitySearch}
                onChange={e => setModalitySearch(e.target.value)}
                placeholder="🔍 Filtrar modalidade..."
                style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: radiusCard,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-background)',
                  color: 'var(--text-foreground)',
                  fontSize: '0.78rem'
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: variant === 'corporate_editorial'
                ? 'repeat(auto-fill, minmax(340px, 1fr))'
                : 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '1.1rem'
            }}
          >
            {filteredModalities.map(mod => (
              <div
                key={mod.id}
                style={{
                  borderRadius: radiusCard,
                  overflow: 'hidden',
                  background: 'var(--bg-background)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ position: 'relative', height: '185px', overflow: 'hidden' }}>
                    <img
                      src={mod.image}
                      alt={mod.name}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.15))' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        padding: '0.22rem 0.6rem',
                        borderRadius: '4px',
                        background: 'var(--color-primary)',
                        color: 'var(--text-primary-foreground)',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        textTransform: 'uppercase'
                      }}
                    >
                      {mod.badge}
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '0.65rem',
                        left: '0.75rem',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: '#fff'
                      }}
                    >
                      {mod.category}
                    </span>
                  </div>

                  <div style={{ padding: '1.1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
                      {mod.name}
                    </h3>
                    <p style={{ margin: '0.45rem 0 0.8rem 0', fontSize: '0.76rem', color: 'var(--text-muted-foreground)', lineHeight: 1.5 }}>
                      {mod.desc}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}>
                      {mod.highlights.map(h => (
                        <span
                          key={h}
                          style={{
                            fontSize: '0.64rem',
                            padding: '0.18rem 0.45rem',
                            borderRadius: '4px',
                            background: 'var(--bg-surface-1)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-foreground)',
                            fontWeight: 700
                          }}
                        >
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-foreground)' }}>
                      <strong style={{ color: 'var(--text-foreground)' }}>Público Indicado:</strong> {mod.target}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.8rem 1.1rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-surface-1)'
                  }}
                >
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
                    🕒 {mod.scheduleSummary}
                  </span>
                  <Link
                    to="/agendar"
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 900,
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Agendar Aula →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          4. GRADE SEMANAL POR TURNO + CALENDÁRIO INTERATIVO AO VIVO + CHECK-IN EXPRESSO
          ===================================================================== */}
      {shouldShow('horarios') && (
        <section
          id="horarios-react"
          style={{
            padding: isSharp ? '2rem' : '1.75rem',
            borderRadius: radiusCard,
            background: 'var(--bg-surface-1)',
            border: borderCard
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                📅 TATAME OFICIAL · GRADE SEMANAL & CHECK-IN EM TEMPO REAL
              </span>
              <h2 style={{ margin: '0.2rem 0 0 0', fontSize: 'clamp(1.45rem, 2.5vw, 2.1rem)', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
                Horários de Treino & Lotação ao Vivo
              </h2>
            </div>

            {/* Filtros de Turno */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {[
                { id: 'all', label: '🥊 Todos os Turnos' },
                { id: 'manha', label: '🌅 Manhã (06h-11h)' },
                { id: 'tarde', label: '☀️ Tarde (12h-17h)' },
                { id: 'noite', label: '🌙 Noite (17h-22h)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setShiftFilter(tab.id as any)}
                  style={{
                    padding: '0.48rem 0.85rem',
                    borderRadius: radiusCard,
                    border: shiftFilter === tab.id ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: shiftFilter === tab.id ? 'var(--color-primary)' : 'var(--bg-background)',
                    color: shiftFilter === tab.id ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grade Semanal Fixa por Dias (Seg/Qua/Sex, Ter/Qui, Sábado) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {FULL_SCHEDULES.map(dayBlock => {
              const periods = dayBlock.periods.filter(p => shiftFilter === 'all' || p.shift === shiftFilter);
              return (
                <div
                  key={dayBlock.day}
                  style={{
                    padding: '1.15rem',
                    borderRadius: radiusCard,
                    background: 'var(--bg-background)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div
                    style={{
                      paddingBottom: '0.65rem',
                      marginBottom: '0.75rem',
                      borderBottom: '2px solid var(--color-primary)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
                      📆 {dayBlock.day}
                    </h3>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {periods.length} turmas
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {periods.map((p, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '0.65rem 0.75rem',
                          borderRadius: '8px',
                          background: 'var(--bg-surface-1)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                            🕒 {p.time}
                          </div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-foreground)' }}>
                            {p.modality}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)' }}>
                            {p.instructor} · {p.level}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 900,
                            padding: '0.18rem 0.45rem',
                            borderRadius: '4px',
                            background: 'var(--status-available-bg)',
                            color: 'var(--status-available)',
                            border: '1px solid var(--status-available-border)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          [HÁ VAGAS]
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendário Oficial Ao Vivo + Check-in Expresso Lado a Lado */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
            <div style={{ padding: '1.15rem', borderRadius: radiusCard, background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                ⚡ CALENDÁRIO INTERATIVO AO VIVO ([HÁ VAGAS] / [LOTADO] / AULAS CANCELADAS RISCADAS)
              </div>
              <InteractiveCombatCalendar userRole="ALUNO" />
            </div>

            <div style={{ padding: '1.15rem', borderRadius: radiusCard, background: 'var(--bg-background)', border: '2px solid var(--color-primary)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                🥊 BATER PONTO DE PRESENÇA · CHECK-IN EXPRESSO POR HORÁRIO
              </div>
              <PublicQuickCheckinCard />
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          5. PLANOS DE TREINAMENTO & CONVÊNIOS (OS 4 PLANOS OFICIAIS + PASSES)
          ===================================================================== */}
      {shouldShow('planos') && (
        <section
          id="planos-react"
          style={{
            padding: isSharp ? '2rem' : '1.75rem',
            borderRadius: radiusCard,
            background: 'var(--bg-surface-1)',
            border: borderCard
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 1.5rem auto' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              🥊 INVESTIMENTO TRANSPARENTE & SEM PEGADINHAS
            </span>
            <h2 style={{ margin: '0.25rem 0', fontSize: 'clamp(1.5rem, 2.6vw, 2.2rem)', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
              Planos de Treinamento & Passes Unificados
            </h2>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted-foreground)' }}>
              Sem taxa oculta de matrícula. Escolha por frequência semanal, Passaporte Livre Ilimitado ou valide seu convênio corporativo.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {FULL_PLANS.map(plan => (
              <div
                key={plan.title}
                style={{
                  padding: '1.35rem',
                  borderRadius: radiusCard,
                  background: plan.highlighted ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                  border: plan.highlighted ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  boxShadow: plan.highlighted ? 'var(--shadow-card)' : 'none'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        padding: '0.22rem 0.55rem',
                        borderRadius: '4px',
                        background: plan.highlighted ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                        color: plan.highlighted ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {plan.badge}
                    </span>
                    <span style={{ fontSize: '1.4rem' }}>{plan.icon}</span>
                  </div>

                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
                    {plan.title}
                  </h3>
                  <p style={{ margin: '0.25rem 0 0.85rem 0', fontSize: '0.75rem', color: 'var(--text-muted-foreground)' }}>
                    {plan.subtitle}
                  </p>

                  <div style={{ padding: '0.75rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted-foreground)' }}>R$ </span>
                    <span style={{ fontSize: '2.2rem', fontWeight: 900, color: plan.highlighted ? 'var(--color-primary)' : 'var(--text-foreground)' }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}> {plan.period}</span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.45rem' }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ fontSize: '0.76rem', color: 'var(--text-foreground)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: 'var(--status-available)', fontWeight: 900 }}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={plan.ctaUrl}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.75rem',
                    borderRadius: radiusCard,
                    background: plan.highlighted ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                    color: plan.highlighted ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                    border: plan.highlighted ? 'none' : '1px solid var(--border-subtle)',
                    fontWeight: 900,
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    textTransform: 'uppercase'
                  }}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          6. ESTRUTURA & INSTALAÇÕES DO CENTRO DE TREINAMENTO (6 CARDS)
          ===================================================================== */}
      {shouldShow('estrutura') && (
        <section
          id="estrutura-react"
          style={{
            padding: isSharp ? '2rem' : '1.75rem',
            borderRadius: radiusCard,
            background: 'var(--bg-surface-1)',
            border: borderCard
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              🏛️ INFRAESTRUTURA DE PONTA
            </span>
            <h2 style={{ margin: '0.2rem 0 0 0', fontSize: 'clamp(1.45rem, 2.5vw, 2.1rem)', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
              Estrutura do Centro de Treinamento
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {FULL_FACILITIES.map(fac => (
              <div
                key={fac.title}
                style={{
                  padding: '1.25rem',
                  borderRadius: radiusCard,
                  background: 'var(--bg-background)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '0.9rem',
                  alignItems: 'flex-start'
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'var(--color-primary-light)',
                    border: '1px solid var(--color-primary-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.35rem',
                    flexShrink: 0
                  }}
                >
                  {fac.icon}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                    {fac.title}
                  </h3>
                  <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.76rem', color: 'var(--text-muted-foreground)', lineHeight: 1.5 }}>
                    {fac.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          7. CORPO DOCENTE / NOSSOS PROFESSORES & MESTRES (4 MESTRES COMPLETOS)
          ===================================================================== */}
      {shouldShow('professores') && (
        <section
          id="professores-react"
          style={{
            padding: isSharp ? '2rem' : '1.75rem',
            borderRadius: radiusCard,
            background: 'var(--bg-surface-1)',
            border: borderCard
          }}
        >
          <div style={{ marginBottom: '1.35rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              🥋 CORPO DOCENTE DE ELITE
            </span>
            <h2 style={{ margin: '0.2rem 0 0 0', fontSize: 'clamp(1.45rem, 2.5vw, 2.1rem)', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
              Nossos Professores & Mestres
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.15rem' }}>
            {FULL_INSTRUCTORS.map(prof => (
              <div
                key={prof.id}
                style={{
                  padding: '1.35rem',
                  borderRadius: radiusCard,
                  background: 'var(--bg-background)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={prof.image}
                    alt={prof.name}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: isSharp ? '6px' : '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--color-primary)',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 900,
                        padding: '0.18rem 0.5rem',
                        borderRadius: '4px',
                        background: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        textTransform: 'uppercase'
                      }}
                    >
                      {prof.cref}
                    </span>
                    <h3 style={{ margin: '0.3rem 0 0.1rem 0', fontSize: '1.08rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                      {prof.name}
                    </h3>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {prof.role}
                    </div>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted-foreground)', lineHeight: 1.5 }}>
                  {prof.bio}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {prof.specialties.map(sp => (
                    <span
                      key={sp}
                      style={{
                        fontSize: '0.65rem',
                        padding: '0.18rem 0.5rem',
                        borderRadius: '4px',
                        background: 'var(--bg-surface-1)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-foreground)',
                        fontWeight: 700
                      }}
                    >
                      🥋 {sp}
                    </span>
                  ))}
                </div>

                <div style={{ paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.66rem', fontWeight: 900, color: 'var(--text-muted-foreground)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Currículo & Conquistas:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.25rem' }}>
                    {prof.achievements.map(ach => (
                      <li key={ach} style={{ fontSize: '0.72rem', color: 'var(--text-foreground)' }}>
                        • {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          8. GAMIFICAÇÃO, PÓDIO TOP 3, 30 CONQUISTAS & LOJA DE COMBAT POINTS
          ===================================================================== */}
      {shouldShow('gamificacao') && (
        <section
          id="gamificacao-react"
          style={{
            padding: isSharp ? '2rem' : '1.75rem',
            borderRadius: radiusCard,
            background: 'var(--bg-surface-1)',
            border: borderCard
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 1.5rem auto' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              🏆 GAMIFICAÇÃO, RETENÇÃO & LOJA DE RECOMPENSAS
            </span>
            <h2 style={{ margin: '0.25rem 0', fontSize: 'clamp(1.45rem, 2.5vw, 2.1rem)', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
              Transforme Cada Treino em XP, Medalhas e Equipamentos
            </h2>
          </div>

          {/* Pódio Oficial Top 3 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.85rem',
              maxWidth: '760px',
              margin: '0 auto 1.75rem auto',
              alignItems: 'end'
            }}
          >
            {PODIUM_ATHLETES.map(ath => (
              <div
                key={ath.name}
                style={{
                  textAlign: 'center',
                  padding: ath.rank === 1 ? '1.35rem 0.85rem' : '1rem 0.75rem',
                  borderRadius: radiusCard,
                  background: ath.rank === 1 ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                  border: ath.rank === 1 ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  boxShadow: ath.rank === 1 ? 'var(--shadow-card)' : 'none'
                }}
              >
                {ath.crown && <div style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>👑</div>}
                <img
                  src={ath.img}
                  alt={ath.name}
                  style={{
                    width: ath.rank === 1 ? '76px' : '60px',
                    height: ath.rank === 1 ? '76px' : '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: ath.rank === 1 ? '3px solid var(--color-primary)' : '2px solid var(--border-subtle)',
                    marginBottom: '0.45rem'
                  }}
                />
                <div style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  #{ath.rank} · {ath.badge}
                </div>
                <div style={{ fontSize: ath.rank === 1 ? '1rem' : '0.88rem', fontWeight: 900, color: 'var(--text-foreground)', marginTop: '0.15rem' }}>
                  {ath.name}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted-foreground)', marginTop: '0.15rem' }}>
                  ⚡ {ath.xp}
                </div>
              </div>
            ))}
          </div>

          {/* 30 Conquistas / Medalhas por Raridade */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
                🎖️ Desbloqueie 30 Conquistas Marciais por Raridade:
              </span>
              <Link to="/portal?tab=conquistas" style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-primary)', textDecoration: 'none' }}>
                Ver todas as 30 medalhas no Portal →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
              {ACHIEVEMENT_BADGES.map(b => (
                <div
                  key={b.title}
                  style={{
                    padding: '0.95rem',
                    borderRadius: radiusCard,
                    background: 'var(--bg-background)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.3rem' }}>{b.icon}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-foreground)' }}>{b.title}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: b.color, textTransform: 'uppercase', marginTop: '0.2rem' }}>
                    {b.rarity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vitrine da Loja de Combat Points */}
          {rewardsCatalog && rewardsCatalog.length > 0 && (
            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
                  🪙 Loja Oficial de Recompensas (Troque seus Combat Points por Equipamentos):
                </span>
                <Link to="/portal?tab=recompensas" style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-primary)', textDecoration: 'none' }}>
                  Abrir Loja de Points →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                {rewardsCatalog.map((item: any) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '1rem',
                      borderRadius: radiusCard,
                      background: 'var(--bg-background)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.6rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.6rem' }}>{item.icone}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--color-primary)', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--color-primary-light)' }}>
                          {item.categoria}
                        </span>
                      </div>
                      <h4 style={{ margin: '0.45rem 0 0.15rem 0', fontSize: '0.88rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                        {item.nome}
                      </h4>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)' }}>
                        Estoque: {item.estoque} unid.
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                        🪙 {item.custoPoints} pts
                      </span>
                      <Link to="/portal?tab=recompensas" style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--text-foreground)', textDecoration: 'none' }}>
                        Resgatar →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          9. ECOSSISTEMA COMPLETO DE MÓDULOS (6 ABAS INTERATIVAS)
          ===================================================================== */}
      {shouldShow('ecossistema') && (
        <section
          id="ecossistema-react"
          style={{
            padding: isSharp ? '2rem' : '1.75rem',
            borderRadius: radiusCard,
            background: 'var(--bg-surface-1)',
            border: borderCard
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ⚙️ ECOSSISTEMA COMPLETO DE GESTÃO & TREINAMENTO
            </span>
            <h2 style={{ margin: '0.2rem 0 0 0', fontSize: 'clamp(1.45rem, 2.5vw, 2.1rem)', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
              Tudo o Que Sua Academia e Seus Alunos Precisam em Um Único Lugar
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
            {/* Menu de Módulos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {ECOSYSTEM_MODULES.map(mod => {
                const active = mod.id === activeEcoTab;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setActiveEcoTab(mod.id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: radiusCard,
                      border: active ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: active ? 'var(--color-primary-light)' : 'var(--bg-background)',
                      color: active ? 'var(--color-primary)' : 'var(--text-foreground)',
                      fontWeight: 900,
                      fontSize: '0.82rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{mod.icon} {mod.title}</span>
                    <span>{active ? '●' : '→'}</span>
                  </button>
                );
              })}
            </div>

            {/* Painel do Módulo Selecionado */}
            <div
              style={{
                padding: '1.5rem',
                borderRadius: radiusCard,
                background: 'var(--bg-background)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>{currentEco.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
                    {currentEco.title}
                  </h3>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted-foreground)' }}>
                    {currentEco.desc}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginTop: '1rem' }}>
                {currentEco.items.map(it => (
                  <div
                    key={it.title}
                    style={{
                      padding: '0.95rem',
                      borderRadius: radiusCard,
                      background: 'var(--bg-surface-1)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ fontSize: '0.84rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                      {it.icon} {it.title}
                    </div>
                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.74rem', color: 'var(--text-muted-foreground)', lineHeight: 1.45 }}>
                      {it.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          10. GALERIA DE FOTOS DO TATAME (6 FOTOS)
          ===================================================================== */}
      {shouldShow('galeria') && (
        <section
          id="galeria-react"
          style={{
            padding: isSharp ? '2rem' : '1.75rem',
            borderRadius: radiusCard,
            background: 'var(--bg-surface-1)',
            border: borderCard
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              📸 DIA A DIA NO TATAME
            </span>
            <h2 style={{ margin: '0.2rem 0 0 0', fontSize: 'clamp(1.45rem, 2.5vw, 2.1rem)', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
              Galeria de Fotos do CT
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.9rem' }}>
            {FULL_GALLERY.map(photo => (
              <div
                key={photo.title}
                style={{
                  position: 'relative',
                  height: '210px',
                  borderRadius: radiusCard,
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <img
                  src={photo.img}
                  alt={photo.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '0.85rem'
                  }}
                >
                  <span
                    style={{
                      padding: '0.22rem 0.6rem',
                      borderRadius: '4px',
                      background: 'var(--color-primary)',
                      color: 'var(--text-primary-foreground)',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      textTransform: 'uppercase'
                    }}
                  >
                    {photo.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          11. PERGUNTAS FREQUENTES (FAQ INTERATIVO - 6 PERGUNTAS)
          ===================================================================== */}
      {shouldShow('faq') && (
        <section
          id="faq-react"
          style={{
            padding: isSharp ? '2rem' : '1.75rem',
            borderRadius: radiusCard,
            background: 'var(--bg-surface-1)',
            border: borderCard
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ❓ TIRE SUAS DÚVIDAS
            </span>
            <h2 style={{ margin: '0.2rem 0 0 0', fontSize: 'clamp(1.45rem, 2.5vw, 2.1rem)', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
              Perguntas Frequentes (FAQ)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {FULL_FAQS.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={item.question}
                  style={{
                    borderRadius: radiusCard,
                    background: 'var(--bg-background)',
                    border: isOpen ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.15rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-foreground)',
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <span>{item.question}</span>
                    <span style={{ color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 900 }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.15rem 1rem 1.15rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted-foreground)',
                        lineHeight: 1.55,
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '0.75rem'
                      }}
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================================
          12. LOCALIZAÇÃO, ATENDIMENTO, MAPA GPS & CREDENCIAMENTO DE ACADEMIAS
          ===================================================================== */}
      {shouldShow('localizacao') && (
        <section
          id="localizacao-react"
          style={{
            padding: isSharp ? '2rem' : '1.75rem',
            borderRadius: radiusCard,
            background: 'var(--bg-surface-1)',
            border: borderCard
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                📍 VENHA NOS CONHECER PESSOALMENTE
              </span>
              <h2 style={{ margin: '0.2rem 0 0.6rem 0', fontSize: 'clamp(1.45rem, 2.5vw, 2.1rem)', fontWeight: 900, color: 'var(--text-foreground)', textTransform: 'uppercase' }}>
                Localização & Contato Oficial
              </h2>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.82rem', color: 'var(--text-muted-foreground)', lineHeight: 1.5 }}>
                Fácil acesso, estacionamento, segurança, vestiários com ducha e ambiente climatizado projetado para a sua melhor experiência de treino.
              </p>

              <div style={{ display: 'grid', gap: '0.65rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.85rem', borderRadius: radiusCard, background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-foreground)' }}>📍 Endereço da Unidade Central</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted-foreground)', marginTop: '0.15rem' }}>
                    Av. das Artes Marciais, 1500 - Centro | São Paulo - SP
                  </div>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: radiusCard, background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-foreground)' }}>🕒 Horário de Funcionamento</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted-foreground)', marginTop: '0.15rem' }}>
                    Segunda a Sexta: 06h às 22h | Sábados: 08h às 14h
                  </div>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: radiusCard, background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-foreground)' }}>💬 WhatsApp & Redes Sociais</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted-foreground)', marginTop: '0.15rem' }}>
                    WhatsApp: (11) 98765-4321 | Instagram: @academiadecombate
                  </div>
                </div>
              </div>

              <div style={{ borderRadius: radiusCard, overflow: 'hidden', border: '1px solid var(--border-subtle)', height: '220px' }}>
                <iframe
                  title="Mapa Centro de Combate"
                  src="https://maps.google.com/maps?q=-23.550520,-46.633308&hl=pt-BR&z=15&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Credenciamento de Novas Academias & Parcerias B2B */}
            <div
              style={{
                padding: '1.35rem',
                borderRadius: radiusCard,
                background: 'var(--bg-background)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                🤝 EXPANSÃO MULTI-ACADEMIAS COMBAT-PASS
              </span>
              <h3 style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                Credenciar Nova Academia ou Empresa Parceira
              </h3>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.76rem', color: 'var(--text-muted-foreground)', lineHeight: 1.5 }}>
                É dono de um Centro de Treinamento ou gestor de RH? Conecte sua unidade ao ecossistema Combat-Pass e receba repasses por check-in validado.
              </p>

              <form onSubmit={handlePartnerSubmit} style={{ display: 'grid', gap: '0.65rem' }}>
                <input
                  type="text"
                  required
                  placeholder="Nome da Academia / CT ou Empresa *"
                  value={partnerForm.nomeCt}
                  onChange={e => setPartnerForm({ ...partnerForm, nomeCt: e.target.value })}
                  style={{ padding: '0.7rem', borderRadius: radiusCard, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', fontSize: '0.8rem' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Cidade / Bairro *"
                    value={partnerForm.cidade}
                    onChange={e => setPartnerForm({ ...partnerForm, cidade: e.target.value })}
                    style={{ padding: '0.7rem', borderRadius: radiusCard, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="WhatsApp Direto *"
                    value={partnerForm.whatsapp}
                    onChange={e => setPartnerForm({ ...partnerForm, whatsapp: e.target.value })}
                    style={{ padding: '0.7rem', borderRadius: radiusCard, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', fontSize: '0.8rem' }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Mestre Responsável / Diretor"
                  value={partnerForm.responsavel}
                  onChange={e => setPartnerForm({ ...partnerForm, responsavel: e.target.value })}
                  style={{ padding: '0.7rem', borderRadius: radiusCard, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', fontSize: '0.8rem' }}
                />
                <input
                  type="text"
                  placeholder="Modalidades Oferecidas (Muay Thai, BJJ, Boxe...)"
                  value={partnerForm.modalidades}
                  onChange={e => setPartnerForm({ ...partnerForm, modalidades: e.target.value })}
                  style={{ padding: '0.7rem', borderRadius: radiusCard, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', fontSize: '0.8rem' }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.85rem',
                    borderRadius: radiusCard,
                    border: 'none',
                    background: 'var(--color-primary)',
                    color: 'var(--text-primary-foreground)',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  🚀 Solicitar Credenciamento Oficial
                </button>
                {partnerSaved && (
                  <div style={{ padding: '0.6rem', borderRadius: radiusCard, background: 'var(--status-available-bg)', color: 'var(--status-available)', fontSize: '0.76rem', fontWeight: 800, textAlign: 'center' }}>
                    ✓ Solicitação enviada! Nossa equipe entrará em contato via WhatsApp.
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
