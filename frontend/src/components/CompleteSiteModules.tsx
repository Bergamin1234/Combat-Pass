import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InteractiveCombatCalendar } from './InteractiveCombatCalendar';
import { PublicQuickCheckinCard } from './QuickCheckinWidget';
import { useSiteBuilder } from '../config/siteBuilderConfig';

export type SiteVariant = 'school_sidebar' | 'corporate_editorial' | 'arena_hud';

export const FULL_MODALITIES = [
  {
    id: 'muay-thai',
    code: 'DISC-MT101',
    name: 'Muay Thai Tradicional',
    schoolTitle: 'Cátedra de Muay Thai & Boxe Tailandês (Arte das 8 Armas)',
    editorialTitle: 'Programa 01 — Biomecânica de Striking & Clinch Tailandês',
    hudTitle: 'STYLE 01 // MUAY THAI STRIKER [8 LIMBS]',
    category: 'Striking Tailandês',
    badge: 'Arte das 8 Armas',
    workload: '60h / Semestre',
    kcal: '850 kcal/h',
    stats: { striking: 98, grappling: 45, cardio: 95, power: 92 },
    imageSchool: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop&q=80',
    imageEditorial: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&auto=format&fit=crop&q=80',
    imageHud: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
    desc: 'Socos, chutes com a canela, joelhadas cortantes, cotoveladas e clinch tailandês. O treino mais dinâmico para queima calórica (+800 kcal/aula) e reflexos afiados.',
    schoolDesc: 'Disciplina obrigatória de combate em pé com foco em postura, guarda tailandesa, calejamento progressivo, clinch e exame oficial de Prajied.',
    editorialDesc: 'Protocolo de condicionamento metabólico de alta intensidade combinado à tradição marcial tailandesa para executivos, iniciantes e atletas.',
    highlights: ['Queima Calórica Alta', 'Condicionamento Total', 'Clinch & Cotoveladas', 'Turmas Kids e Adultos'],
    target: 'Iniciantes, Mulheres, Crianças e Atletas',
    scheduleSummary: 'Seg a Sex (Manhã, Tarde e Noite) | Sábado'
  },
  {
    id: 'jiu-jitsu',
    code: 'DISC-BJJ102',
    name: 'Jiu-Jitsu Brasileiro (BJJ)',
    schoolTitle: 'Cátedra de Arte Suave, Alavancas & Xadrez Corporal (Gi & No-Gi)',
    editorialTitle: 'Programa 02 — Estratégia de Solo, Alavancas & Defesa Pessoal',
    hudTitle: 'STYLE 02 // BRAZILIAN JIU-JITSU [SUBMISSION MASTER]',
    category: 'Grappling & Arte Suave',
    badge: 'Domínio no Chão',
    workload: '72h / Semestre',
    kcal: '720 kcal/h',
    stats: { striking: 20, grappling: 100, cardio: 88, power: 84 },
    imageSchool: 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&auto=format&fit=crop&q=80',
    imageEditorial: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&auto=format&fit=crop&q=80',
    imageHud: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    desc: 'A arte marcial baseada em alavancas, raspagens e finalizações (chaves de braço, triângulos e estrangulamentos). Onde a técnica supera a força física.',
    schoolDesc: 'Curso curricular estruturado conforme diretrizes CBJJ/IBJJF: quedas, passagens de guarda, retenção, raspagens e progressão oficial de graus e faixas.',
    editorialDesc: 'Desenvolvimento cognitivo sob pressão: resolução tática de problemas físicos através de alavancas biomecânicas sem impacto articular.',
    highlights: ['Gi & No-Gi', 'Graduação Oficial', 'Xadrez Corporal', 'Respeito e Irmandade'],
    target: 'Todas as Idades e Níveis Técnicos',
    scheduleSummary: 'Seg a Sáb (Manhã, Noite e Open Mat)'
  },
  {
    id: 'boxe',
    code: 'DISC-BOX103',
    name: 'Boxe Clássico',
    schoolTitle: 'Cátedra de Nobre Arte, Deslocamento & Biomecânica de Punhos',
    editorialTitle: 'Programa 03 — Nobre Arte Olímpica, Coordenação & Reflexo',
    hudTitle: 'STYLE 03 // OLYMPIC BOXING [IRON HANDS]',
    category: 'Nobre Arte',
    badge: 'Mãos de Aço',
    workload: '48h / Semestre',
    kcal: '800 kcal/h',
    stats: { striking: 96, grappling: 15, cardio: 94, power: 90 },
    imageSchool: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
    imageEditorial: 'https://images.unsplash.com/photo-1509563423944-b791c380791c?w=900&auto=format&fit=crop&q=80',
    imageHud: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
    desc: 'Evolua seu jogo de pernas, pêndulos defensivos, esquivas cirúrgicas e combinações devastadoras de jab, direto, cruzado e uppercut em sacos pesados e manoplas.',
    schoolDesc: 'Estudo técnico de footwork, ângulos de saída, pêndulo defensivo, combinações numéricas na manopla e sparring educativo supervisionado.',
    editorialDesc: 'Treinamento cardiovascular de precisão focado em agilidade mental, coordenação motora fina, tonificação superior e alívio imediato de tensão.',
    highlights: ['Pernas & Esquivas', 'Fortalecimento do Core', 'Sacos Pesados', 'Sparring Controlado'],
    target: 'Iniciantes ao Alto Rendimento',
    scheduleSummary: 'Seg, Qua e Sex (07h, 12h, 18h e 19h)'
  },
  {
    id: 'mma',
    code: 'DISC-MMA201',
    name: 'MMA (Mixed Martial Arts)',
    schoolTitle: 'Cátedra Avançada de Artes Marciais Mistas & Integração de Grade',
    editorialTitle: 'Programa 04 — Síntese Multidisciplinar de Combate Moderno',
    hudTitle: 'STYLE 04 // PRO CAGE MMA [HYBRID FIGHTER]',
    category: 'Combate Misto',
    badge: 'Octógono & Grade',
    workload: '60h / Semestre',
    kcal: '920 kcal/h',
    stats: { striking: 90, grappling: 92, cardio: 98, power: 95 },
    imageSchool: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&auto=format&fit=crop&q=80',
    imageEditorial: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&auto=format&fit=crop&q=80',
    imageHud: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&auto=format&fit=crop&q=80',
    desc: 'A integração completa das modalidades: striking em pé, transições de grade, quedas do wrestling e finalizações no solo. Para quem busca a máxima preparação.',
    schoolDesc: 'Disciplina de integração tática conectando trocação, entradas de queda (Double/Single Leg), domínio no cage (Wall Wrestling) e Ground & Pound.',
    editorialDesc: 'Preparação atlética integral que combina força isométrica, explosão anaeróbica e adaptabilidade estratégica em múltiplos cenários.',
    highlights: ['Grade / Cage Oficial', 'Transições Pé e Solo', 'Ground and Pound', 'Físico de Elite'],
    target: 'Praticantes Intermediários e Avançados',
    scheduleSummary: 'Ter e Qui (20h às 21h30) | Sex'
  },
  {
    id: 'kickboxing',
    code: 'DISC-K1104',
    name: 'Kickboxing & K-1 Rules',
    schoolTitle: 'Cátedra de Kickboxing Japonês/Holandês & Ritmo K-1',
    editorialTitle: 'Programa 05 — Potência Dinâmica, Low Kicks & Volume de Jogo',
    hudTitle: 'STYLE 05 // K-1 KICKBOXER [BLITZKRIEG]',
    category: 'Potência & Ritmo',
    badge: 'Explosão Total',
    workload: '48h / Semestre',
    kcal: '830 kcal/h',
    stats: { striking: 95, grappling: 25, cardio: 96, power: 91 },
    imageSchool: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    imageEditorial: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80',
    imageHud: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=80',
    desc: 'A união dos socos contundentes do boxe com chutes circulares rápidos e low kicks na coxa. Treinos explosivos que esculpem o corpo e aumentam a resistência.',
    schoolDesc: 'Metodologia Dutch-Style K-1 focada em sequências de 4 a 6 golpes terminando em chute baixo ou alto, bloqueios de canela e contra-ataques.',
    editorialDesc: 'Alta densidade aeróbica e anaeróbica com circuitos técnicos de manoplas e sacos pesados para definição muscular acelerada.',
    highlights: ['Combinações Rápidas', 'Defesa e Contra-Ataque', 'Pernas Fortes', 'Queima de Gordura'],
    target: 'Público Masculino, Feminino e Juvenil',
    scheduleSummary: 'Ter e Qui (18h às 19h30)'
  },
  {
    id: 'taekwondo',
    code: 'DISC-TKD105',
    name: 'Taekwondo Olímpico',
    schoolTitle: 'Cátedra de Arte Marcial Coreana, Poomsae & Pedagogia Infantil',
    editorialTitle: 'Programa 06 — Biomecânica de Membros Inferiores & Flexibilidade',
    hudTitle: 'STYLE 06 // TAEKWONDO [AERIAL KICKER]',
    category: 'Arte Marcial Coreana',
    badge: 'Precisão & Chutes',
    workload: '48h / Semestre',
    kcal: '690 kcal/h',
    stats: { striking: 92, grappling: 15, cardio: 90, power: 86 },
    imageSchool: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop&q=80',
    imageEditorial: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=900&auto=format&fit=crop&q=80',
    imageHud: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop&q=80',
    desc: 'Chutes voadores, giratórios e velocidade dinâmica com foco em disciplina, flexibilidade extraordinária e autocontrole. Excelente pedagogia esportiva infantil.',
    schoolDesc: 'Formação ética e motora com certificação Kukkiwon: domínio de chutes em giro, alongamento ativo e filosofia disciplinar para jovens e adultos.',
    editorialDesc: 'Mobilidade articular avançada, equilíbrio dinâmico e velocidade de reação com metodologia olímpica reconhecida mundialmente.',
    highlights: ['Chutes Giratórios', 'Flexibilidade Extrema', 'Graduação de Faixas', 'Pedagogia Kids'],
    target: 'Crianças a partir de 5 anos e Adultos',
    scheduleSummary: 'Ter e Qui (17h Kids / 18h Adultos)'
  },
  {
    id: 'judo',
    code: 'DISC-JUD106',
    name: 'Judô & Submission Grappling',
    schoolTitle: 'Cátedra Kodokan de Projeções (Nage-Waza) & Imobilizações',
    editorialTitle: 'Programa 07 — Física Aplicada ao Equilíbrio, Quedas & Controle',
    hudTitle: 'STYLE 07 // KODOKAN JUDO [IPPON THROWER]',
    category: 'Quedas & Alavancas',
    badge: 'Caminho Suave',
    workload: '48h / Semestre',
    kcal: '740 kcal/h',
    stats: { striking: 15, grappling: 97, cardio: 89, power: 93 },
    imageSchool: 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&auto=format&fit=crop&q=80',
    imageEditorial: 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=900&auto=format&fit=crop&q=80',
    imageHud: 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&auto=format&fit=crop&q=80',
    desc: 'Uso inteligente da força e equilíbrio do oponente contra ele mesmo. Domínio de quedas espetaculares (ippon), projeções corporais e controle no solo.',
    schoolDesc: 'Ensino de amortecimento de quedas (Ukemi), desequilíbrio (Kuzushi), projeções clássicas e transição imediata para Ne-Waza.',
    editorialDesc: 'Tradição olímpica japonesa que desenvolve propriocepção, força de pegada (Grip Strength), postura ereta e respeito institucional.',
    highlights: ['Quedas e Ippons', 'Equilíbrio Inabalável', 'Disciplina e Tradição', 'Defesa Pessoal'],
    target: 'Infantil, Juvenil e Adulto',
    scheduleSummary: 'Seg e Qua (17h e 19h)'
  },
  {
    id: 'defesa-pessoal',
    code: 'DISC-KRV107',
    name: 'Defesa Pessoal & Krav Maga',
    schoolTitle: 'Seminário Permanente de Sobrevivência Urbana & Autoproteção',
    editorialTitle: 'Programa 08 — Gestão de Risco Pessoal & Neutralização de Ameaças',
    hudTitle: 'STYLE 08 // KRAV MAGA TACTICAL [URBAN DEFENSE]',
    category: 'Autoproteção Real',
    badge: 'Segurança Urbana',
    workload: '36h / Semestre',
    kcal: '650 kcal/h',
    stats: { striking: 88, grappling: 85, cardio: 82, power: 89 },
    imageSchool: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80',
    imageEditorial: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&auto=format&fit=crop&q=80',
    imageHud: 'https://images.unsplash.com/photo-1509563423944-b791c380791c?w=800&auto=format&fit=crop&q=80',
    desc: 'Técnicas diretas e instintivas para neutralizar agressões reais, agarramentos, empurrões e situações de perigo urbano. Aulas práticas com foco em autoconfiança.',
    schoolDesc: 'Módulo prático de prevenção situacional, liberação de agarramentos, defesa contra múltiplos agressores e tomada de decisão sob adrenalina.',
    editorialDesc: 'Capacitação de segurança pessoal para mulheres, executivos e famílias, priorizando respostas reflexas simples e evasão segura.',
    highlights: ['Sem Regras Esportivas', 'Desvencilhamentos', 'Autoconfiança Total', 'Cenários Urbanos'],
    target: 'Qualquer Pessoa (Sem Exigência Prévia)',
    scheduleSummary: 'Sábados (09h00 às 11h00)'
  }
];

export const FULL_INSTRUCTORS = [
  {
    id: 'carlos-silva',
    name: 'Mestre Carlos Silva',
    academicTitle: 'Reitor Técnico & Cátedra de Striking',
    hudAlias: 'BOSS 01 // KRU CARLOS "IRON SHIN"',
    role: 'Head Coach de Muay Thai & Striking',
    cref: 'Kru Formado & Faixa Preta Internacional',
    bio: 'Mais de 16 anos dedicados ao ensino marcial de alto rendimento. Formador de campeões e especialista em metodologia de ensino para iniciantes e atletas.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    record: '42 Lutadores Formados · 16 Anos de Tatame',
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
    academicTitle: 'Coordenador da Cátedra de Grappling & BJJ',
    hudAlias: 'BOSS 02 // MASTER MARCOS "CHOKER"',
    role: 'Head Coach de Jiu-Jitsu Brasileiro (BJJ)',
    cref: 'Faixa Preta 2º Grau CBJJ/IBJJF',
    bio: 'Especialista em passagens de guarda modernas, alavancas de finalização e defesa pessoal. Dedicado à pedagogia marcial inclusiva para crianças e adultos.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    record: 'Tricampeão Estadual · 12 Anos de Docência',
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
    academicTitle: 'Docente Titular de Nobre Arte & Boxe',
    hudAlias: 'BOSS 03 // COACH RICARDO "COUNTER"',
    role: 'Treinador Chefe de Boxe Clássico',
    cref: 'Ex-Boxeador Profissional & Treinador',
    bio: 'Especialista em biomecânica de golpes, esquivas milimétricas e resistência respiratória para combate.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    record: 'Cartel 18V-0D Amador · Especialista Olímpico',
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
    academicTitle: 'Diretor Pedagógico Infantil & 4º Dan Kukkiwon',
    hudAlias: 'BOSS 04 // SENSEI JIN-WOO "TORNADO"',
    role: 'Mestre de Taekwondo Olímpico',
    cref: 'Faixa Preta 4º Dan Kukkiwon',
    bio: 'Dedicado ao desenvolvimento motor, flexibilidade e integridade moral das crianças e adultos através da arte marcial coreana.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    record: '4º Dan Internacional · +300 Crianças Formadas',
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
    code: 'LAB-01',
    zone: 'ZONA ALFA · TATAME PRINCIPAL',
    icon: '🥋',
    title: 'Tatame Olímpico de Alta Densidade (180m²)',
    desc: 'Ampla área de tatame profissional com sistema anti-impacto que protege articulações em quedas e treinos intensos.'
  },
  {
    code: 'LAB-02',
    zone: 'ZONA BETA · CAGE OFICIAL',
    icon: '🛡️',
    title: 'Octógono & Área de Grade Oficial',
    desc: 'Grade e cage construídos nos padrões internacionais para prática real de transição e clinch no MMA.'
  },
  {
    code: 'LAB-03',
    zone: 'ZONA GAMA · ARTILHARIA PESADA',
    icon: '🥊',
    title: 'Estação de Sacos Pesados & Manoplas',
    desc: 'Sacos de couro de 60kg a 100kg, teto-solo, punching balls e manoplas tailandesas de primeira linha.'
  },
  {
    code: 'LAB-04',
    zone: 'ZONA DELTA · CONTROLE TÉRMICO',
    icon: '❄️',
    title: 'Ambiente 100% Climatizado',
    desc: 'Ar-condicionado central em todo o espaço de treino, garantindo conforto térmico e ventilação ideal.'
  },
  {
    code: 'LAB-05',
    zone: 'ZONA EPSILON · RECUPERAÇÃO',
    icon: '🚿',
    title: 'Vestiários Premium com Duchas Quentes',
    desc: 'Vestiários masculino e feminino com armários individuais, duchas pressurizadas e higiene impecável.'
  },
  {
    code: 'LAB-06',
    zone: 'ZONA ZETA · CONVIVÊNCIA & PRO SHOP',
    icon: '☕',
    title: 'Lounge & Loja Oficial de Equipamentos',
    desc: 'Espaço de convivência, hidratação e aquisição de luvas, bandagens, kimonos e artigos oficiais.'
  }
];

export const FULL_SCHEDULES = [
  {
    day: 'Segunda, Quarta e Sexta',
    shortDay: 'SEG / QUA / SEX',
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
    shortDay: 'TER / QUI',
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
    shortDay: 'SÁBADO',
    periods: [
      { time: '08:00 - 09:00', modality: 'Sparring Técnico Controlado', level: 'Alunos Matriculados', instructor: 'Mestre Carlos Silva', shift: 'manha' },
      { time: '09:00 - 10:30', modality: 'Defesa Pessoal & Krav Maga', level: 'Todos os Níveis', instructor: 'Equipe Técnica', shift: 'manha' },
      { time: '10:30 - 12:00', modality: 'Open Mat / Treino Livre BJJ', level: 'Todos os Níveis', instructor: 'Prof. Marcos Prado', shift: 'manha' }
    ]
  }
];

export const FULL_PLANS = [
  {
    id: 'plan-2x',
    tierCode: 'TIER I · INICIAÇÃO',
    schoolCode: 'MATRÍCULA BÁSICA (2 CRÉDITOS/SEM)',
    badge: 'Iniciação',
    icon: '🥊',
    title: '2x na semana',
    subtitle: 'Ideal para quem está começando nas artes marciais.',
    price: '140',
    period: '/ mês',
    xpBonus: '+100 XP/aula',
    features: [
      '2 Treinos semanais de sua escolha',
      'Boxe, Muay Thai ou Jiu-Jitsu',
      'Acompanhamento técnico com mestres',
      'Vestiários & Tatame Climatizado'
    ],
    matrix: {
      treinosSemanais: '2 aulas / semana',
      modalidadesInclusas: '1 modalidade à escolha',
      openMatSparring: '—',
      graduacaoOficial: '✓ Inclusa',
      xpMultiplier: '1.0x Padrão',
      convenios: '—'
    },
    ctaUrl: '/checkout?plano=2x%20na%20semana&valor=140',
    ctaLabel: '🥊 Assinar Plano 2x',
    highlighted: false
  },
  {
    id: 'plan-3x',
    tierCode: 'TIER II · EVOLUÇÃO',
    schoolCode: 'MATRÍCULA REGULAR (3 CRÉDITOS/SEM)',
    badge: 'Evolução',
    icon: '🥋',
    title: '3x na semana',
    subtitle: 'Ritmo constante para defesa pessoal e queima calórica.',
    price: '160',
    period: '/ mês',
    xpBonus: '+150 XP/aula',
    features: [
      '3 Aulas semanais intercaladas',
      'Striking (em pé) e Grappling (chão)',
      'Graduação oficial de faixas/prajied',
      'Acesso ao Portal do Aluno & XP'
    ],
    matrix: {
      treinosSemanais: '3 aulas / semana',
      modalidadesInclusas: 'Até 2 modalidades',
      openMatSparring: '✓ Sábados inclusos',
      graduacaoOficial: '✓ Inclusa',
      xpMultiplier: '1.25x Boost',
      convenios: '—'
    },
    ctaUrl: '/checkout?plano=3x%20na%20semana&valor=160',
    ctaLabel: '🥋 Assinar Plano 3x',
    highlighted: false
  },
  {
    id: 'plan-free',
    tierCode: 'TIER III · PASSAPORTE BLACK ILIMITADO',
    schoolCode: 'BOLSA INTEGRAL / ACESSO PLENO (8 CÁTEDRAS)',
    badge: 'Mais Escolhido · Passaporte Livre',
    icon: '🏆',
    title: 'Todos os Dias',
    subtitle: 'Acesso ilimitado a todas as 8 modalidades e horários.',
    price: '190',
    period: '/ mês',
    xpBonus: '+250 XP/aula (2x Boost)',
    features: [
      'Treinos ilimitados de Seg a Sábado',
      'Todas as 8 modalidades inclusas',
      'Open Mat, Sparring & Preparação Física',
      'Multiplicador de XP + Loja de Points'
    ],
    matrix: {
      treinosSemanais: 'Ilimitado (Seg a Sáb)',
      modalidadesInclusas: 'Todas as 8 Modalidades',
      openMatSparring: '✓ Acesso Total VIP',
      graduacaoOficial: '✓ Prioridade + Exames',
      xpMultiplier: '2.0x Dobro de Points',
      convenios: 'Passe Unificado Black'
    },
    ctaUrl: '/checkout?plano=Passaporte%20Livre&valor=190',
    ctaLabel: '🔥 Assinar Passaporte Livre',
    highlighted: true
  },
  {
    id: 'plan-drop',
    tierCode: 'TIER IV · DROP-IN & CONVÊNIOS',
    schoolCode: 'ALUNO VISITANTE / CONVÊNIO CORPORATIVO',
    badge: 'Diária & Convênios',
    icon: '⚡',
    title: 'Passes & Avulso',
    subtitle: 'Wellhub (Gympass), TotalPass, Combat-Pass ou Aula Avulsa.',
    price: '40',
    period: '/ aula ou check-in',
    xpBonus: '+80 XP/check-in',
    features: [
      'Aceita Wellhub (Gympass) & TotalPass',
      'Validação imediata via Check-in Expresso',
      'Diária avulsa sem fidelidade',
      'Acesso completo à estrutura do CT'
    ],
    matrix: {
      treinosSemanais: 'Por Check-in Diário',
      modalidadesInclusas: 'Conforme Tier do Passe',
      openMatSparring: '✓ Mediante Vaga',
      graduacaoOficial: 'Consulte Secretaria',
      xpMultiplier: '1.0x por Check-in',
      convenios: 'Wellhub, TotalPass & Combat-Pass'
    },
    ctaUrl: '/portal',
    ctaLabel: '⚡ Validar Check-in / Convênio',
    highlighted: false
  }
];

export const FULL_GALLERY = [
  { title: 'Chute & Manopla', tag: 'Muay Thai', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80' },
  { title: 'Arte Suave (BJJ)', tag: 'Grappling', img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=80' },
  { title: 'Boxe Clássico', tag: 'Ringue', img: 'https://images.unsplash.com/photo-1509563423944-b791c380791c?w=800&auto=format&fit=crop&q=80' },
  { title: 'Tatame & Estrutura', tag: '180m² Olímpico', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80' },
  { title: 'Foco & Manopla', tag: 'Alta Performance', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80' },
  { title: 'MMA & Octógono', tag: 'Cage Oficial', img: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&auto=format&fit=crop&q=80' }
];

export const FULL_FAQS = [
  {
    code: 'REG-01',
    question: 'Nunca pratiquei artes marciais na vida. A academia é para mim?',
    answer: 'Com certeza! Mais de 70% dos nossos novos alunos começam do zero absoluto. Nossas turmas são divididas por níveis técnicos, e os professores acompanham individualmente seus primeiros passos com respeito ao seu ritmo e segurança total.'
  },
  {
    code: 'REG-02',
    question: 'Quais modalidades estão inclusas no Passaporte Livre?',
    answer: 'No plano Passaporte Livre, você pode treinar TODAS as modalidades da grade: Muay Thai, Jiu-Jitsu (Gi e No-Gi), Boxe Clássico, MMA, Kickboxing, Taekwondo, Judô e Defesa Pessoal, em qualquer horário e turno.'
  },
  {
    code: 'REG-03',
    question: 'Preciso ter equipamentos (luvas, kimono, caneleira) na primeira aula?',
    answer: 'Não! Para a sua aula experimental, basta vir com uma roupa esportiva confortável (bermuda e camiseta). Nós emprestamos luvas higienizadas e fornecemos toda a orientação.'
  },
  {
    code: 'REG-04',
    question: 'Como funciona o agendamento da Aula Experimental Gratuita?',
    answer: "Basta clicar em qualquer botão de 'Agendar Aula Experimental' no site, selecionar a modalidade do seu interesse e o turno de preferência para confirmar sua vaga."
  },
  {
    code: 'REG-05',
    question: 'A academia aceita planos corporativos como Wellhub (Gympass), TotalPass e Combat-Pass?',
    answer: 'Sim! Aceitamos os principais planos corporativos e passes unificados com validação de check-in diário por horário específico para todas as artes marciais.'
  },
  {
    code: 'REG-06',
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
  { rank: 2, name: 'Marcus Miller', xp: '3,450 XP', badge: 'Prata · Vice-Líder', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { rank: 1, name: 'Ítalo Bergamin', xp: '4,820 XP', badge: 'Campeão Geral · Ouro', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', crown: true },
  { rank: 3, name: 'Renato Silva', xp: '2,910 XP', badge: 'Bronze · Destaque', img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80' }
];

export const ACHIEVEMENT_BADGES = [
  { icon: '🥊', title: 'Primeiro Treino', rarity: 'Normal', xp: '+50 XP' },
  { icon: '⚡', title: '50 Treinos no Tatame', rarity: 'Rara', xp: '+250 XP' },
  { icon: '🥋', title: 'Sparring Concluído', rarity: 'Rara', xp: '+300 XP' },
  { icon: '🛡️', title: '100 Treinos Oficial', rarity: 'Épica', xp: '+600 XP' },
  { icon: '🔥', title: 'Assiduidade 100%', rarity: 'Épica', xp: '+750 XP' },
  { icon: '🏆', title: 'Mestre do Tatame', rarity: 'Lendária', xp: '+1500 XP' }
];

interface CompleteSiteModulesProps {
  variant: SiteVariant;
  academies: any[];
  rewardsCatalog: any[];
  activeSectionFilter?: string;
}

export const CompleteSiteModules: React.FC<CompleteSiteModulesProps> = ({
  variant,
  academies,
  rewardsCatalog,
  activeSectionFilter = 'ALL'
}) => {
  const [selectedModalityIdx, setSelectedModalityIdx] = useState<number>(0);
  const [shiftFilter, setShiftFilter] = useState<'all' | 'manha' | 'tarde' | 'noite'>('all');
  const [activeEcoTab, setActiveEcoTab] = useState<string>('alunos');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [partnerForm, setPartnerForm] = useState({ nomeCt: '', cidade: '', responsavel: '', whatsapp: '', modalidades: '' });
  const [partnerSaved, setPartnerSaved] = useState(false);

  const { config: builderConfig } = useSiteBuilder();

  const shouldShow = (secId: string) => {
    const matchesFilter = activeSectionFilter === 'ALL' || activeSectionFilter === secId;
    if (!matchesFilter) return false;
    const s = builderConfig.sections;
    if (secId === 'o_que_e_ct') return s.showHub;
    if (secId === 'galeria' || secId === 'estrutura') return s.showGaleria;
    if (secId === 'horarios') return s.showHorarios;
    if (secId === 'modalidades' || secId === 'professores') return s.showModalidades;
    if (secId === 'planos') return s.showPlanos;
    if (secId === 'faq' || secId === 'localizacao') return s.showFaq;
    if (secId === 'gamificacao' || secId === 'competitivo') return builderConfig.portals.enableGamification;
    return true;
  };
  const activeModality = FULL_MODALITIES[selectedModalityIdx] || FULL_MODALITIES[0];
  const currentEco = ECOSYSTEM_MODULES.find(m => m.id === activeEcoTab) || ECOSYSTEM_MODULES[0];

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.nomeCt || !partnerForm.whatsapp) return;
    setPartnerSaved(true);
    setTimeout(() => setPartnerSaved(false), 5000);
    setPartnerForm({ nomeCt: '', cidade: '', responsavel: '', whatsapp: '', modalidades: '' });
  };

  // ============================================================================
  // ENGINE 1: SISTEMA ESCOLAR / ACADÊMICO (TABELAS LETIVAS, CÍRCULOS, FICHAS, LADO INVERTIDO)
  // ============================================================================
  if (variant === 'school_sidebar') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* 1. REGIMENTO & DIRETÓRIO DE CAMPUS (TEXTO NA ESQUERDA / FOTO REDONDA-OVAL NA DIREITA) */}
        {shouldShow('o_que_e_ct') && (
          <section
            style={{
              padding: '1.75rem',
              borderRadius: '24px',
              background: 'var(--bg-surface-1)',
              border: '2px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', alignItems: 'center' }}>
              {/* LADO ESQUERDO: TEXTO ACADÊMICO & PILARES PEDAGÓGICOS */}
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', borderRadius: '999px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.68rem', fontWeight: 900 }}>
                  📘 MÓDULO LETIVO 01 · REGIMENTO PEDAGÓGICO & DIRETRIZES DA ESCOLA MARCIAL
                </div>
                <h2 style={{ margin: '0.6rem 0', fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                  Instituição de Ensino em Artes Marciais & Formação de Caráter
                </h2>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted-foreground)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Diferente de uma academia comum, operamos como uma <strong>Escola Marcial Estruturada por Semestres, Créditos e Graus</strong>. O aluno ingressa na turma de base (Nível I) e avança mediante frequência auditada e exame perante banca de mestres.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                  {[
                    { step: 'ETAPA I', title: 'Nivelamento Zero', desc: 'Acolhimento pedagógico para iniciantes absolutos sem contato brusco.' },
                    { step: 'ETAPA II', title: 'Ciclo de Condicionamento', desc: 'Desenvolvimento cardiovascular, coordenação motora e perda de até 800 kcal/aula.' },
                    { step: 'ETAPA III', title: 'Banca de Graduação', desc: 'Exames oficiais de Faixa e Prajied com certificado registrado no portal.' }
                  ].map(st => (
                    <div key={st.step} style={{ padding: '0.85rem', borderRadius: '16px', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.62rem', fontWeight: 900, color: 'var(--color-primary)' }}>{st.step}</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 900, margin: '0.2rem 0' }}>{st.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-foreground)', lineHeight: 1.4 }}>{st.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LADO DIREITO: MOLDURA ARREDONDADA ACADÊMICA + TABELA DE UNIDADES CREDENCIADAS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '999px', background: 'var(--bg-background)', border: '2px solid var(--color-primary)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&auto=format&fit=crop&q=80"
                    alt="Campus Marcial"
                    style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                      🏛️ SELO DE EXCELÊNCIA PEDAGÓGICA
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 900 }}>100% Ambiente Climatizado & Seguro</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted-foreground)' }}>
                      Mais de 500 alunos ativos distribuídos em turmas infantis, femininas, iniciantes e competição.
                    </div>
                  </div>
                </div>

                {/* Tabela Escolar de Campus / Unidades Credenciadas */}
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-background)' }}>
                  <div style={{ padding: '0.6rem 0.9rem', background: 'var(--bg-surface-2)', fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                    📋 Quadro de Unidades / Campus Credenciados ({academies.length})
                  </div>
                  <div style={{ padding: '0.5rem 0.75rem', display: 'grid', gap: '0.4rem' }}>
                    {academies.map((ct: any) => (
                      <div key={ct.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.6rem', borderRadius: '10px', background: 'var(--bg-surface-1)', fontSize: '0.73rem' }}>
                        <div>
                          <strong>{ct.nome}</strong> <span style={{ color: 'var(--text-muted-foreground)' }}>({ct.bairro})</span>
                        </div>
                        <span style={{ fontWeight: 900, color: ct.vagasHoje > 0 ? 'var(--status-available)' : 'var(--status-full)' }}>
                          {ct.vagasHoje > 0 ? `${ct.vagasHoje} vagas` : 'Lotado'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. GRADE CURRICULAR DAS 8 MODALIDADES EM TABELA ESCOLAR + EMENTA DETALHADA */}
        {shouldShow('modalidades') && (
          <section
            style={{
              padding: '1.75rem',
              borderRadius: '24px',
              background: 'var(--bg-surface-1)',
              border: '2px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  📚 CATÁLOGO CURRICULAR · 8 CÁTEDRAS DE ARTES MARCIAIS
                </span>
                <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.55rem', fontWeight: 900 }}>
                  Grade Curricular de Disciplinas & Ementas Semestrais
                </h2>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
                Clique em uma disciplina na tabela abaixo para abrir a ementa completa
              </span>
            </div>

            {/* TABELA ESCOLAR DE DISCIPLINAS (TOTALMENTE DIFERENTE DE CARDS!) */}
            <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface-2)', color: 'var(--text-muted-foreground)', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Cód.</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Disciplina / Modalidade</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Departamento</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Carga Horária</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Horários Letivos</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {FULL_MODALITIES.map((mod, idx) => {
                    const isSelected = idx === selectedModalityIdx;
                    return (
                      <tr
                        key={mod.id}
                        onClick={() => setSelectedModalityIdx(idx)}
                        style={{
                          cursor: 'pointer',
                          background: isSelected ? 'var(--color-primary-light)' : idx % 2 === 0 ? 'var(--bg-background)' : 'var(--bg-surface-1)',
                          borderTop: '1px solid var(--border-subtle)'
                        }}
                      >
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 900, color: 'var(--color-primary)' }}>
                          {mod.code}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 900 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <img src={mod.imageSchool} alt={mod.name} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }} />
                            <span>{mod.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted-foreground)' }}>{mod.category}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>{mod.workload}</td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', color: 'var(--text-muted-foreground)' }}>{mod.scheduleSummary}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ padding: '0.25rem 0.65rem', borderRadius: '999px', background: isSelected ? 'var(--color-primary)' : 'var(--bg-surface-2)', color: isSelected ? 'var(--text-primary-foreground)' : 'var(--text-foreground)', fontSize: '0.68rem', fontWeight: 900 }}>
                            {isSelected ? '📖 Ementa Aberta' : 'Ver Ementa'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* FICHA DE EMENTA DA DISCIPLINA SELECIONADA (IMAGEM REDONDA NA DIREITA, TEXTO NA ESQUERDA) */}
            <div style={{ padding: '1.35rem', borderRadius: '20px', background: 'var(--bg-background)', border: '2px solid var(--color-primary)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                  EMENTA OFICIAL · {activeModality.code} · {activeModality.workload}
                </div>
                <h3 style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 900 }}>{activeModality.schoolTitle}</h3>
                <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.82rem', color: 'var(--text-muted-foreground)', lineHeight: 1.55 }}>
                  {activeModality.schoolDesc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                  {activeModality.highlights.map(h => (
                    <span key={h} style={{ padding: '0.25rem 0.7rem', borderRadius: '999px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 800 }}>
                      🎓 {h}
                    </span>
                  ))}
                </div>
                <Link to="/agendar" style={{ display: 'inline-block', padding: '0.6rem 1.2rem', borderRadius: '999px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', fontWeight: 900, fontSize: '0.76rem', textDecoration: 'none' }}>
                  📝 Matricular / Agendar Aula Prática desta Disciplina →
                </Link>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={activeModality.imageSchool}
                  alt={activeModality.name}
                  style={{ width: '210px', height: '210px', borderRadius: '50%', objectFit: 'cover', border: '5px solid var(--color-primary)', boxShadow: 'var(--shadow-card)' }}
                />
              </div>
            </div>
          </section>
        )}

        {/* 3. QUADRO DE HORÁRIOS LETIVOS & CALENDÁRIO EM LARGURA TOTAL (SEM ESPREMER!) */}
        {shouldShow('horarios') && (
          <section
            style={{
              padding: '1.75rem',
              borderRadius: '24px',
              background: 'var(--bg-surface-1)',
              border: '2px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                📅 CALENDÁRIO ESCOLAR & CHAMADA DIGITAL POR HORÁRIO
              </span>
              <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.55rem', fontWeight: 900 }}>
                Quadro Semestral de Turmas & Lotação em Tempo Real
              </h2>
            </div>

            {/* Calendário 100% Full Width para nunca amassar */}
            <InteractiveCombatCalendar userRole="ALUNO" />
          </section>
        )}

        {/* 4. CORPO DOCENTE EM FORMATO DE LISTA HORIZONTAL COM RETRATOS CIRCULARES */}
        {shouldShow('professores') && (
          <section
            style={{
              padding: '1.75rem',
              borderRadius: '24px',
              background: 'var(--bg-surface-1)',
              border: '2px solid var(--border-subtle)'
            }}
          >
            <div style={{ marginBottom: '1.15rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                👨‍🏫 COLEGIADO & CORPO DOCENTE
              </span>
              <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.55rem', fontWeight: 900 }}>
                Cátedras & Mestres Responsáveis
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {FULL_INSTRUCTORS.map((inst, i) => (
                <div
                  key={inst.id}
                  style={{
                    padding: '1.15rem',
                    borderRadius: '999px',
                    background: 'var(--bg-background)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <img
                    src={inst.image}
                    alt={inst.name}
                    style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: '240px', textAlign: i % 2 === 0 ? 'left' : 'right' }}>
                    <div style={{ fontSize: '0.66rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                      {inst.academicTitle} · {inst.cref}
                    </div>
                    <h3 style={{ margin: '0.15rem 0', fontSize: '1.12rem', fontWeight: 900 }}>{inst.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted-foreground)' }}>{inst.bio}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 1rem' }}>
                    {inst.specialties.map(sp => (
                      <span key={sp} style={{ fontSize: '0.66rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: '999px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
                        🎓 {sp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. SECRETARIA ESCOLAR: MATRÍCULAS E MENSALIDADES EM FAIXAS HORIZONTAIS (BOLETOS/GUIAS DE MATRÍCULA) */}
        {shouldShow('planos') && (
          <section
            style={{
              padding: '1.75rem',
              borderRadius: '24px',
              background: 'var(--bg-surface-1)',
              border: '2px solid var(--border-subtle)'
            }}
          >
            <div style={{ marginBottom: '1.15rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                💳 SECRETARIA ACADÊMICA · GUIAS DE MATRÍCULA & BOLSAS
              </span>
              <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.55rem', fontWeight: 900 }}>
                Modalidades de Matrícula & Créditos Semanais
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {FULL_PLANS.map(plan => (
                <div
                  key={plan.id}
                  style={{
                    padding: '1.1rem 1.35rem',
                    borderRadius: '18px',
                    background: plan.highlighted ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                    border: plan.highlighted ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.64rem', fontWeight: 900, color: 'var(--color-primary)' }}>{plan.schoolCode}</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900 }}>{plan.icon} {plan.title}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted-foreground)' }}>{plan.subtitle}</div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {plan.features.map(f => (
                      <span key={f} style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', fontWeight: 700 }}>
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted-foreground)' }}>R$ </span>
                      <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-primary)' }}>{plan.price}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted-foreground)' }}>{plan.period}</span>
                    </div>
                    <Link
                      to={plan.ctaUrl}
                      style={{
                        padding: '0.6rem 1.1rem',
                        borderRadius: '999px',
                        background: 'var(--color-primary)',
                        color: 'var(--text-primary-foreground)',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Efetuar Matrícula →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. LABORATÓRIOS & INSTALAÇÕES + QUADRO DE HONRA (PÓDIO/MEDALHAS) + FAQ + MAPA */}
        {(shouldShow('estrutura') || shouldShow('gamificacao') || shouldShow('competitivo')) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {/* Laboratórios Escolares */}
            <div style={{ padding: '1.5rem', borderRadius: '24px', background: 'var(--bg-surface-1)', border: '2px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.66rem', fontWeight: 900, color: 'var(--color-primary)' }}>🏛️ INFRAESTRUTURA DO CAMPUS</span>
              <h3 style={{ margin: '0.2rem 0 1rem 0', fontSize: '1.25rem', fontWeight: 900 }}>6 Laboratórios & Áreas de Treino</h3>
              <div style={{ display: 'grid', gap: '0.55rem' }}>
                {FULL_FACILITIES.map(f => (
                  <div key={f.code} style={{ padding: '0.7rem 0.9rem', borderRadius: '14px', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{f.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 900 }}>{f.code} · {f.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)' }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quadro de Honra Escolar & Torneios */}
            <div style={{ padding: '1.5rem', borderRadius: '24px', background: 'var(--bg-surface-1)', border: '2px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.66rem', fontWeight: 900, color: 'var(--color-primary)' }}>🥇 QUADRO DE HONRA & MÉRITO ACADÊMICO</span>
                <h3 style={{ margin: '0.2rem 0 1rem 0', fontSize: '1.25rem', fontWeight: 900 }}>Alunos Destaques do Semestre & Conquistas</h3>
                <div style={{ display: 'grid', gap: '0.55rem', marginBottom: '1rem' }}>
                  {PODIUM_ATHLETES.map(ath => (
                    <div key={ath.name} style={{ padding: '0.65rem 0.9rem', borderRadius: '999px', background: 'var(--bg-background)', border: ath.rank === 1 ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img src={ath.img} alt={ath.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 900 }}>#{ath.rank} {ath.name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)' }}>{ath.badge}</div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 900, color: 'var(--color-primary)', fontSize: '0.82rem' }}>{ath.xp}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
                  {ACHIEVEMENT_BADGES.map(b => (
                    <div key={b.title} style={{ padding: '0.5rem', borderRadius: '12px', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem' }}>{b.icon}</div>
                      <div style={{ fontSize: '0.68rem', fontWeight: 900 }}>{b.title}</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--color-primary)', fontWeight: 800 }}>{b.xp}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link to="/portal?tab=torneios" style={{ flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: '999px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', fontWeight: 900, fontSize: '0.72rem', textDecoration: 'none' }}>
                  🏆 Ver Torneios
                </Link>
                <Link to="/portal?tab=ranking" style={{ flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: '999px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontWeight: 900, fontSize: '0.72rem', textDecoration: 'none' }}>
                  🌍 Ranking Global
                </Link>
                <Link to="/portal?tab=desempenho" style={{ flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: '999px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontWeight: 900, fontSize: '0.72rem', textDecoration: 'none' }}>
                  📊 Estatísticas
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 7. ECOSSISTEMA, GALERIA, FAQ E LOCALIZAÇÃO ESCOLAR */}
        {(shouldShow('ecossistema') || shouldShow('galeria') || shouldShow('faq') || shouldShow('localizacao')) && (
          <section style={{ padding: '1.75rem', borderRadius: '24px', background: 'var(--bg-surface-1)', border: '2px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)' }}>❓ REGIMENTO DE DÚVIDAS FREQUENTES</span>
              <h3 style={{ margin: '0.2rem 0 0.85rem 0', fontSize: '1.2rem', fontWeight: 900 }}>Manual do Calouro (FAQ)</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {FULL_FAQS.map((faq, idx) => (
                  <div key={faq.code} style={{ borderRadius: '14px', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                      style={{ width: '100%', padding: '0.75rem 0.9rem', background: 'transparent', border: 'none', color: 'var(--text-foreground)', fontWeight: 800, fontSize: '0.78rem', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span>{faq.code} · {faq.question}</span>
                      <span>{openFaqIdx === idx ? '−' : '+'}</span>
                    </button>
                    {openFaqIdx === idx && (
                      <div style={{ padding: '0 0.9rem 0.75rem 0.9rem', fontSize: '0.75rem', color: 'var(--text-muted-foreground)', lineHeight: 1.5 }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)' }}>📍 CAMPUS CENTRAL & CREDENCIAMENTO</span>
              <h3 style={{ margin: '0.2rem 0 0.85rem 0', fontSize: '1.2rem', fontWeight: 900 }}>Endereço, Galeria & Credenciamento</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem', marginBottom: '0.85rem' }}>
                {FULL_GALLERY.map(g => (
                  <img key={g.title} src={g.img} alt={g.title} style={{ width: '100%', height: '78px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-subtle)' }} />
                ))}
              </div>
              <div style={{ padding: '0.9rem', borderRadius: '14px', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)', fontSize: '0.76rem', color: 'var(--text-muted-foreground)' }}>
                <strong style={{ color: 'var(--text-foreground)' }}>📍 Av. Central das Artes Marciais, Nº 1000 — Centro</strong><br />
                Seg a Sex: 06h às 22h | Sábados: 08h às 14h · Estacionamento Próprio
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  // ============================================================================
  // ENGINE 2: REVISTA EDITORIAL & DOSSIÊ B2B (BORDAS RETAS 0PX, ZIG-ZAG ESQUERDA/DIREITA, MATRIZ COMPARATIVA)
  // ============================================================================
  if (variant === 'corporate_editorial') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* 1. ZIG-ZAG EDITORIAL ASSIMÉTRICO (TEXTO ESQUERDA / FOTO DIREITA, DEPOIS FOTO ESQUERDA / MÉTRICAS DIREITA) */}
        <section id="o-que-e-o-ct-react" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)' }}>
          {/* Linha 1: Texto na Esquerda, Foto Panorâmica na Direita */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.16em', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                CAPÍTULO I · TESE INSTITUCIONAL & INFRAESTRUTURA
              </div>
              <h2 style={{ margin: '0 0 0.85rem 0', fontSize: '1.95rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.08 }}>
                Excelência Técnica, Governança Esportiva & Saúde Corporativa.
              </h2>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted-foreground)', lineHeight: 1.65 }}>
                Projetado sob padrões internacionais de segurança biomecânica, o Centro de Combate integra formação marcial para iniciantes, programas de descompressão executiva e preparação atlética de alto rendimento em 180m² climatizados.
              </p>
            </div>
            <div style={{ minHeight: '280px', position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80"
                alt="Editorial Facility"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>

          {/* Linha 2 Invertida: Foto na Esquerda, Dossiê de Unidades Credenciadas na Direita */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            <div style={{ minHeight: '260px', position: 'relative', borderRight: '1px solid var(--border-subtle)' }}>
              <img
                src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1000&auto=format&fit=crop&q=80"
                alt="Editorial Combat"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-background)' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.14em', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                REDE CREDENCIADA COMBAT-PASS ({academies.length} UNIDADES AUDITADAS)
              </div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {academies.map((ct: any, idx: number) => (
                  <div key={ct.id} style={{ padding: '0.65rem 0.85rem', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 900, marginRight: '0.5rem' }}>0{idx + 1}</span>
                      <strong style={{ fontSize: '0.82rem' }}>{ct.nome}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)', marginLeft: '0.5rem' }}>— {ct.bairro}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 900, color: ct.vagasHoje > 0 ? 'var(--status-available)' : 'var(--status-full)' }}>
                      {ct.vagasHoje > 0 ? `[HÁ VAGAS: ${ct.vagasHoje}]` : '[LOTADO]'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. DOSSIÊ MASTER-DETAIL DAS 8 MODALIDADES (ÍNDICE NUMERADO À ESQUERDA + DOSSIÊ EDITORIAL WIDESCREEN À DIREITA) */}
        <section id="modalidades-react" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)' }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.16em', color: 'var(--color-primary)' }}>
                CAPÍTULO II · PORTFÓLIO TÉCNICO DE 8 MODALIDADES
              </div>
              <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.65rem', fontWeight: 900, textTransform: 'uppercase' }}>
                Dossiê Executivo de Programas Marciais
              </h2>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted-foreground)' }}>
              Selecione no índice lateral para inspecionar a ficha técnica
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 320px) 1fr' }}>
            {/* Coluna Índice Numerado */}
            <div style={{ borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-background)' }}>
              {FULL_MODALITIES.map((mod, idx) => {
                const active = idx === selectedModalityIdx;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setSelectedModalityIdx(idx)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      border: 'none',
                      borderBottom: '1px solid var(--border-subtle)',
                      borderLeft: active ? '4px solid var(--color-primary)' : '4px solid transparent',
                      background: active ? 'var(--bg-surface-1)' : 'transparent',
                      color: active ? 'var(--color-primary)' : 'var(--text-foreground)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.62rem', fontFamily: 'monospace', color: 'var(--text-muted-foreground)' }}>
                        PROGRAMA 0{idx + 1} · {mod.kcal}
                      </div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 900, textTransform: 'uppercase' }}>{mod.name}</div>
                    </div>
                    <span style={{ fontWeight: 900 }}>→</span>
                  </button>
                );
              })}
            </div>

            {/* Coluna Dossiê Widescreen */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
                <div>
                  <span style={{ padding: '0.2rem 0.6rem', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    {activeModality.badge} · {activeModality.category}
                  </span>
                  <h3 style={{ margin: '0.6rem 0', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    {activeModality.editorialTitle}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted-foreground)', lineHeight: 1.65 }}>
                    {activeModality.editorialDesc}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-foreground)', lineHeight: 1.55 }}>
                    {activeModality.desc}
                  </p>
                </div>
                <div style={{ height: '250px', border: '1px solid var(--border-subtle)' }}>
                  <img src={activeModality.imageEditorial} alt={activeModality.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted-foreground)', textTransform: 'uppercase' }}>Gasto Energético</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-primary)' }}>{activeModality.kcal}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted-foreground)', textTransform: 'uppercase' }}>Público-Alvo</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>{activeModality.target}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted-foreground)', textTransform: 'uppercase' }}>Disponibilidade</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>{activeModality.scheduleSummary}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Link to="/agendar" style={{ padding: '0.65rem 1.15rem', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', fontWeight: 900, fontSize: '0.75rem', textDecoration: 'none', textTransform: 'uppercase' }}>
                    SOLICITAR SESSÃO EXPERIMENTAL →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MATRIZ COMPARATIVA DE PLANOS EM TABELA EXECUTIVA (ZERO CARDS VERTICAIS!) */}
        <section id="planos-react" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.16em', color: 'var(--color-primary)' }}>
              CAPÍTULO III · MATRIZ FINANCEIRA & CONVÊNIOS CORPORATIVOS
            </div>
            <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.65rem', fontWeight: 900, textTransform: 'uppercase' }}>
              Tabela Comparativa de Assinaturas, Passes & Benefícios
            </h2>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-background)', borderBottom: '2px solid var(--color-primary)' }}>
                  <th style={{ padding: '1rem', width: '24%' }}>ESPECIFICAÇÃO / PLANO</th>
                  {FULL_PLANS.map(p => (
                    <th key={p.id} style={{ padding: '1rem', borderLeft: '1px solid var(--border-subtle)', background: p.highlighted ? 'var(--color-primary-light)' : 'transparent' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--color-primary)', fontWeight: 900 }}>{p.badge.toUpperCase()}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, margin: '0.2rem 0' }}>{p.title}</div>
                      <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                        R$ {p.price}<span style={{ fontSize: '0.7rem', color: 'var(--text-muted-foreground)' }}>{p.period}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Frequência Semanal', key: 'treinosSemanais' },
                  { label: 'Modalidades Liberadas', key: 'modalidadesInclusas' },
                  { label: 'Open Mat & Sparring Sábado', key: 'openMatSparring' },
                  { label: 'Exames de Faixa / Prajied', key: 'graduacaoOficial' },
                  { label: 'Multiplicador Combat Points', key: 'xpMultiplier' },
                  { label: 'Convênios Aceitos', key: 'convenios' }
                ].map((row, rIdx) => (
                  <tr key={row.key} style={{ borderBottom: '1px solid var(--border-subtle)', background: rIdx % 2 === 0 ? 'var(--bg-surface-1)' : 'var(--bg-background)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>{row.label}</td>
                    {FULL_PLANS.map(p => (
                      <td key={p.id} style={{ padding: '0.85rem 1rem', borderLeft: '1px solid var(--border-subtle)', fontWeight: 700 }}>
                        {(p.matrix as any)[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr style={{ background: 'var(--bg-background)' }}>
                  <td style={{ padding: '1rem', fontWeight: 900 }}>CONTRATAÇÃO DIRETA</td>
                  {FULL_PLANS.map(p => (
                    <td key={p.id} style={{ padding: '1rem', borderLeft: '1px solid var(--border-subtle)' }}>
                      <Link
                        to={p.ctaUrl}
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          padding: '0.65rem',
                          background: p.highlighted ? 'var(--color-primary)' : 'var(--bg-surface-2)',
                          color: p.highlighted ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                          border: '1px solid var(--border-subtle)',
                          fontWeight: 900,
                          fontSize: '0.74rem',
                          textDecoration: 'none',
                          textTransform: 'uppercase'
                        }}
                      >
                        {p.ctaLabel}
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. GRADE DE HORÁRIOS EM LARGURA TOTAL + TERMINAL DE CHECK-IN */}
        <section id="horarios-react" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.16em', color: 'var(--color-primary)' }}>
                CAPÍTULO IV · OPERAÇÃO DE TATAME & CRONOGRAMA OFICIAL
              </div>
              <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.65rem', fontWeight: 900, textTransform: 'uppercase' }}>
                Grade Oficial de Horários & Calendário Auditado
              </h2>
            </div>
          </div>

          <InteractiveCombatCalendar userRole="ALUNO" />
        </section>

        {/* 5. CORPO DIRETOR / MESTRES EM FORMATO EDITORIAL DE COLUNAS JORNALÍSTICAS */}
        <section id="professores-react" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.16em', color: 'var(--color-primary)' }}>
              CAPÍTULO V · LIDERANÇA TÉCNICA & CERTIFICAÇÕES
            </div>
            <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.65rem', fontWeight: 900, textTransform: 'uppercase' }}>
              Conselho de Mestres & Treinadores Chefes
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', border: '1px solid var(--border-subtle)' }}>
            {FULL_INSTRUCTORS.map(inst => (
              <div key={inst.id} style={{ padding: '1.5rem', borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-background)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <img src={inst.image} alt={inst.name} style={{ width: '68px', height: '84px', objectFit: 'cover', border: '1px solid var(--color-primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>{inst.cref}</div>
                    <h3 style={{ margin: '0.15rem 0', fontSize: '1.05rem', fontWeight: 900, textTransform: 'uppercase' }}>{inst.name}</h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)' }}>{inst.role}</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted-foreground)', lineHeight: 1.55, marginBottom: '0.85rem' }}>{inst.bio}</p>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {inst.record}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. ESTRUTURA, ERP ECOSSISTEMA & FAQ EXECUTIVO */}
        <section id="faq-react" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          <div style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', padding: '1.75rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.16em', color: 'var(--color-primary)' }}>
              CAPÍTULO VI · ESPECIFICAÇÕES DE INFRAESTRUTURA
            </div>
            <h3 style={{ margin: '0.3rem 0 1rem 0', fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase' }}>
              6 Zonas Técnicas do Centro de Combate
            </h3>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {FULL_FACILITIES.map(f => (
                <div key={f.code} style={{ padding: '0.75rem', border: '1px solid var(--border-subtle)', background: 'var(--bg-background)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 900 }}>{f.icon} {f.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)' }}>{f.desc}</div>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)' }}>{f.code}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', padding: '1.75rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.16em', color: 'var(--color-primary)' }}>
              CAPÍTULO VII · GOVERNANÇA & PERGUNTAS FREQUENTES
            </div>
            <h3 style={{ margin: '0.3rem 0 1rem 0', fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase' }}>
              Dossiê de Esclarecimentos (FAQ)
            </h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {FULL_FAQS.map((faq, idx) => (
                <div key={faq.code} style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-background)' }}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: 'none', color: 'var(--text-foreground)', fontWeight: 900, fontSize: '0.78rem', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>[{faq.code}] {faq.question}</span>
                    <span>{openFaqIdx === idx ? '−' : '+'}</span>
                  </button>
                  {openFaqIdx === idx && (
                    <div style={{ padding: '0 0.8rem 0.8rem 0.8rem', fontSize: '0.75rem', color: 'var(--text-muted-foreground)', lineHeight: 1.55 }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ============================================================================
  // ENGINE 3: ARENA FIGHTER HUD / OCTÓGONO CYBERPUNK (POLÍGONOS CHANFRADOS, BARRAS DE ATRIBUTOS RPG, BATTLE PASS TIERS)
  // ============================================================================
  const hudClip = 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. TELA DE SELEÇÃO DE ESTILO DE LUTA (FIGHT STYLE SELECTOR COM BARRAS DE ATRIBUTOS RPG!) */}
      <section
        id="modalidades-react"
        style={{
          padding: '1.75rem',
          clipPath: hudClip,
          background: 'var(--bg-surface-1)',
          border: '2px solid var(--color-primary)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.12em', fontFamily: 'monospace' }}>
              🎮 ARENA HUD // SELECT YOUR COMBAT STYLE [8 FIGHTING ARTS]
            </span>
            <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
              Seletor Tático das 8 Modalidades & Telemetria de Combate
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {FULL_MODALITIES.map((mod, idx) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => setSelectedModalityIdx(idx)}
                style={{
                  padding: '0.45rem 0.75rem',
                  clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                  border: idx === selectedModalityIdx ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  background: idx === selectedModalityIdx ? 'var(--color-primary)' : 'var(--bg-background)',
                  color: idx === selectedModalityIdx ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                0{idx + 1}. {mod.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* SPOTLIGHT DO ESTILO DE LUTA COM BARRAS DE FORÇA / STRIKING / GRAPPLING / CARDIO */}
        <div
          style={{
            padding: '1.35rem',
            clipPath: hudClip,
            background: 'var(--bg-background)',
            border: '1px solid var(--color-primary)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
            marginBottom: '1.35rem'
          }}
        >
          <div style={{ position: 'relative', height: '240px', clipPath: hudClip, overflow: 'hidden', border: '2px solid var(--color-primary)' }}>
            <img src={activeModality.imageHud} alt={activeModality.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 900 }}>
                {activeModality.hudTitle}
              </span>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>{activeModality.name}</div>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 900, marginBottom: '0.35rem' }}>
              ⚡ TELEMETRIA DE ATRIBUTOS MARCIAIS · QUEIMA DE {activeModality.kcal}
            </div>
            <p style={{ margin: '0 0 0.9rem 0', fontSize: '0.82rem', color: 'var(--text-muted-foreground)', lineHeight: 1.5 }}>
              {activeModality.desc}
            </p>

            {/* 4 Barras de Atributos estilo RPG / UFC Game */}
            <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
              {[
                { label: 'STRIKING (TROCAÇÃO EM PÉ)', val: activeModality.stats.striking },
                { label: 'GRAPPLING (DOMÍNIO NO SOLO / QUEDAS)', val: activeModality.stats.grappling },
                { label: 'CARDIO & EXPLOSÃO METABÓLICA', val: activeModality.stats.cardio },
                { label: 'POWER & IMPACTO TÉCNICO', val: activeModality.stats.power }
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', fontWeight: 900, fontFamily: 'monospace', marginBottom: '0.18rem' }}>
                    <span>{stat.label}</span>
                    <span style={{ color: 'var(--color-primary)' }}>{stat.val}/100</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-surface-2)', overflow: 'hidden' }}>
                    <div style={{ width: `${stat.val}%`, height: '100%', background: 'var(--color-primary)' }} />
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/agendar"
              style={{
                display: 'inline-block',
                padding: '0.65rem 1.25rem',
                clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
                background: 'var(--color-primary)',
                color: 'var(--text-primary-foreground)',
                fontWeight: 900,
                fontSize: '0.78rem',
                textDecoration: 'none',
                textTransform: 'uppercase'
              }}
            >
              🔥 ENTRAR NO OCTÓGONO · AGENDAR AULA DESTE ESTILO
            </Link>
          </div>
        </div>

        {/* MOSAICO COMPACTO DOS 8 ESTILOS EM CARDS POLIGONAIS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {FULL_MODALITIES.map((mod, idx) => (
            <div
              key={mod.id}
              onClick={() => setSelectedModalityIdx(idx)}
              style={{
                cursor: 'pointer',
                padding: '0.85rem',
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                background: idx === selectedModalityIdx ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                border: idx === selectedModalityIdx ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.64rem', fontWeight: 900, color: 'var(--color-primary)' }}>{mod.code}</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 900, color: 'var(--status-available)' }}>{mod.kcal}</span>
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, textTransform: 'uppercase' }}>{mod.name}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)', marginTop: '0.2rem' }}>{mod.scheduleSummary}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. BATTLE PASS TIERS (OS 4 PLANOS COMO NÍVEIS DE PASSE DE BATALHA!) */}
      <section
        id="planos-react"
        style={{
          padding: '1.75rem',
          clipPath: hudClip,
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
            🎫 SEASON BATTLE PASS // UNLOCK YOUR FIGHTER ACCESS
          </span>
          <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.65rem', fontWeight: 900, textTransform: 'uppercase' }}>
            Tiers de Passe de Combate & Multiplicadores de XP
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.9rem' }}>
          {FULL_PLANS.map(plan => (
            <div
              key={plan.id}
              style={{
                padding: '1.25rem',
                clipPath: hudClip,
                background: plan.highlighted ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                border: plan.highlighted ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.9rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace', fontSize: '0.64rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                  <span>{plan.tierCode}</span>
                  <span>{plan.xpBonus}</span>
                </div>
                <h3 style={{ margin: '0.35rem 0', fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  {plan.icon} {plan.title}
                </h3>
                <div style={{ fontSize: '1.95rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                  R$ {plan.price}<span style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)' }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0 0', display: 'grid', gap: '0.35rem' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: '0.74rem', display: 'flex', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 900 }}>▸</span>
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
                  padding: '0.7rem',
                  clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
                  background: plan.highlighted ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                  color: plan.highlighted ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                  border: '1px solid var(--color-primary)',
                  fontWeight: 900,
                  fontSize: '0.75rem',
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

      {/* 3. MESTRES / BOSS FIGHTER CARDS + RANKING PÓDIO & LOJA DE RECOMPENSAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {/* Boss Cards dos Mestres */}
        <section style={{ padding: '1.5rem', clipPath: hudClip, background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.66rem', fontWeight: 900, color: 'var(--color-primary)' }}>
            🥋 GRANDMASTERS // TALE OF THE TAPE
          </span>
          <h3 style={{ margin: '0.2rem 0 1rem 0', fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase' }}>
            4 Mestres Chefes de Arena
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {FULL_INSTRUCTORS.map(inst => (
              <div key={inst.id} style={{ padding: '0.85rem', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)', display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                <img src={inst.image} alt={inst.name} style={{ width: '64px', height: '64px', objectFit: 'cover', border: '2px solid var(--color-primary)' }} />
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'var(--color-primary)', fontWeight: 900 }}>{inst.hudAlias}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 900 }}>{inst.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-foreground)' }}>{inst.record}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pódio XP & Loja de Equipamentos por Points */}
        <section style={{ padding: '1.5rem', clipPath: hudClip, background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.66rem', fontWeight: 900, color: 'var(--color-primary)' }}>
            🏆 LEADERBOARD & LOOT STORE // COMBAT POINTS
          </span>
          <h3 style={{ margin: '0.2rem 0 1rem 0', fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase' }}>
            Top Lutadores & Loja de Recompensas
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
            {PODIUM_ATHLETES.map(ath => (
              <div key={ath.name} style={{ padding: '0.65rem', background: 'var(--bg-background)', border: ath.rank === 1 ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--color-primary)' }}>RANK #{ath.rank}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, margin: '0.2rem 0' }}>{ath.name}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--status-available)', fontWeight: 900 }}>{ath.xp}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            {(rewardsCatalog || []).slice(0, 4).map((item: any) => (
              <div key={item.id} style={{ padding: '0.65rem', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800 }}>{item.icone || '🥊'} {item.nome}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)' }}>{item.custoPoints} PTS</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 4. ZONAS DA ARENA (6 INSTALAÇÕES) + UNIDADES CREDENCIADAS + FAQ COMPACTO */}
      <section style={{ padding: '1.5rem', clipPath: hudClip, background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
          {FULL_FACILITIES.map(f => (
            <div key={f.code} style={{ padding: '0.9rem', background: 'var(--bg-background)', borderLeft: '4px solid var(--color-primary)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'var(--color-primary)', fontWeight: 900 }}>{f.zone}</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 900, margin: '0.2rem 0' }}>{f.icon} {f.title}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
