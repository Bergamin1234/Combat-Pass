import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutRouter } from '../layouts/LayoutRouter';
import NoticeCard from '../components/NoticeCard';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { adminApi, publicApi } from '../services/api';
import { AdminGamificationTab } from '../components/AdminGamificationTab';
import { CombatHubSandboxModal } from '../components/CombatHubSandboxModal';
import { ACADEMY_CONFIG } from '../config/academyConfig';
import { FileUploadInput } from '../components/FileUploadInput';
import { DevDashboardTab } from '../components/DevDashboardTab';
import { FinancialDashboardTab } from '../components/FinancialDashboardTab';
import { SplitRollCallTab } from '../components/SplitRollCallTab';
import { CashRegisterTab } from '../components/CashRegisterTab';
import { TeacherCommissionsTab } from '../components/TeacherCommissionsTab';
import { OccupancyDashboardTab } from '../components/OccupancyDashboardTab';
import { Student360Modal } from '../components/Student360Modal';
import { AdminStoreRedemptionsTab } from '../components/AdminStoreRedemptionsTab';
import { InteractiveCombatCalendar } from '../components/InteractiveCombatCalendar';
import {
  useLayoutEngine,
  JourneyLayoutToolbar,
  DynamicNavBuilder
} from '../config/layoutEngine';
import { AdminLayoutStudio } from '../components/AdminLayoutStudio';

const graduacoesPorModalidade: Record<string, string[]> = {
  'Muay Thai': [
    'Prajied Branco',
    'Prajied Branco e Amarelo',
    'Prajied Amarelo',
    'Prajied Amarelo e Branco Ponta',
    'Prajied Laranja',
    'Prajied Verde',
    'Prajied Azul Claro',
    'Prajied Azul Escuro',
    'Prajied Azul Escuro e Preto',
    'Prajied Marrom',
    'Prajied Vermelho',
    'Prajied Vermelho e Preto',
    'Prajied Preto'
  ],
  'Jiu-Jitsu': [
    'Faixa Branca',
    'Faixa Azul',
    'Faixa Roxa',
    'Faixa Marrom',
    'Faixa Preta 1º Grau',
    'Faixa Preta 2º Grau',
    'Faixa Preta 3º Grau',
    'Faixa Coral (Vermelha e Preta)',
    'Faixa Vermelha'
  ],
  'Taekwondo': [
    'Faixa Branca',
    'Faixa Amarela',
    'Faixa Verde',
    'Faixa Azul',
    'Faixa Vermelha',
    'Faixa Ponta Preta',
    'Faixa Preta 1º Dan',
    'Faixa Preta 2º Dan',
    'Faixa Preta 3º Dan',
    'Faixa Preta 4º Dan',
    'Faixa Preta 5º Dan'
  ],
  'Boxe': [
    'Sem faixa (Graduação por experiência e cartel)',
    '1 a 3 anos de prática',
    '3 a 5 anos de prática',
    '5 a 10 anos de prática',
    'Mais de 10 anos / Veterano',
    'Ex-Atleta Profissional'
  ],
  'MMA': [
    'Sem faixa (Graduação por experiência e cartel)',
    '1 a 3 anos de prática',
    '3 a 5 anos de prática',
    '5 a 10 anos de prática',
    'Mais de 10 anos / Veterano',
    'Ex-Atleta Profissional'
  ],
  '[DEV-SYSTEM]': [
    'Desenvolvedor do Sistema [DEV-SYSTEM]',
    'Arquiteto & Engenheiro de Software Full-Stack',
    'Tech Lead & DevOps / Cloud',
    'Administrador Técnico do Sistema',
    'Segurança & Infraestrutura de TI'
  ],
  'Administração Geral': [
    'Gestão Operacional & Financeira',
    'Diretoria & Coordenação Geral',
    'Supervisão & Atendimento',
    'Financeiro & Contabilidade'
  ]
};

const temposDeAula = ['45 min', '60 min', '75 min', '90 min', '120 min'];
const opcoesTempoDocencia = [
  'Iniciando docência (menos de 1 ano)',
  '1 a 3 anos dando aulas',
  '3 a 5 anos dando aulas',
  '5 a 10 anos lecionando',
  'Mais de 10 anos como professor / Mestre'
];

const ATENDENTE_ALLOWED_TABS = new Set([
  'alunos',
  'chamada_diaria',
  'calendario_geral',
  'presencas',
  'agendamentos',
  'ocupacao',
  'resgates_loja',
  'avisos',
]);

export default function AdminDashboard({
  modoInicial = 'ADMIN',
}: {
  modoInicial?: 'ADMIN' | 'ATENDENTE';
} = {}) {
  const { preferences, setJourneyPreset } = useLayoutEngine();
  const [modoAcessoLogin, setModoAcessoLogin] = useState<'ADMIN' | 'ATENDENTE'>(modoInicial);
  useEffect(() => {
    setModoAcessoLogin(modoInicial);
  }, [modoInicial]);
  const adminPreset = preferences.layoutPreset.admin;
  const adminArch =
    adminPreset === 'executive'
      ? 'school'
      : adminPreset === 'operational_360'
      ? 'hud'
      : adminPreset === 'customizer_studio'
      ? 'executive'
      : 'classic';
  const [showLayoutCustomDrawer, setShowLayoutCustomDrawer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [metricas, setMetricas] = useState<any>({
    totalAlunos: 0,
    assinaturasAtivas: 0,
    inadimplentes: 0,
    taxaPresencaMedia: 100,
    alunosEmRisco: 0,
    presencasHoje: 0
  });
  const [alunos, setAlunos] = useState<any[]>([]);
  const [agendamentos, setAgendamentos] = useState<any>({ pendentes: [], posAula: [], finalizados: [] });
  const [presencas, setPresencas] = useState<any[]>([]);
  const [professores, setProfessores] = useState<any[]>([]);
  const [avisos, setAvisos] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [categoriaFiltroLoja, setCategoriaFiltroLoja] = useState('TODOS');
  const [loading, setLoading] = useState(true);

  // Abas: 'alunos' | 'calendario_geral' | 'presencas' | 'avisos' | 'loja' | 'agendamentos' | 'professores'
  const [abaAtiva, setAbaAtiva] = useState('alunos');
  const [subAbaExperimental, setSubAbaExperimental] = useState<'pendentes' | 'posAula'>('pendentes');

  // Filtros e busca de Alunos
  const [buscaAluno, setBuscaAluno] = useState('');
  const [filtroAssiduidade, setFiltroAssiduidade] = useState<'TODOS' | 'ATIVO' | 'INATIVO' | 'ALTA' | 'REGULAR' | 'RISCO' | 'DIARIA'>('TODOS');
  const [aluno360Id, setAluno360Id] = useState<string | null>(null);
  const [subAbaCalendario, setSubAbaCalendario] = useState<'grade_aulas' | 'frequencia_mensal'>('grade_aulas');

  // Filtros e lote em Chamada & Presenças
  const [filtroChamada, setFiltroChamada] = useState<'TODOS' | 'PRESENTE' | 'FALTA' | 'DOENCA' | 'AGENDADO'>('TODOS');
  const [buscaPresenca, setBuscaPresenca] = useState('');
  const [selecionadosLote, setSelecionadosLote] = useState<string[]>([]);
  const [loteLoading, setLoteLoading] = useState(false);

  // Calendário Geral da Academia & Frequência Coletiva
  const [frequenciaGeral, setFrequenciaGeral] = useState<any>(null);
  const [loadingFrequenciaGeral, setLoadingFrequenciaGeral] = useState(false);
  const [mesFrequenciaGeral, setMesFrequenciaGeral] = useState(new Date().getMonth() + 1);
  const [anoFrequenciaGeral, setAnoFrequenciaGeral] = useState(new Date().getFullYear());
  const [diaSelecionadoGeral, setDiaSelecionadoGeral] = useState<string>(new Date().toISOString().split('T')[0]);
  const [buscaAlunoDiaGeral, setBuscaAlunoDiaGeral] = useState('');

  // Modal Lançar Aluno no Dia do Calendário Geral (Individual & Em Lote via Tabela)
  const [modalLancarDia, setModalLancarDia] = useState(false);
  const [modoLancarDia, setModoLancarDia] = useState<'LOTE' | 'INDIVIDUAL'>('LOTE');
  const [alunoLancarDia, setAlunoLancarDia] = useState('');
  const [buscaAlunoLancarIndividual, setBuscaAlunoLancarIndividual] = useState('');
  const [statusLancarDia, setStatusLancarDia] = useState('PRESENTE');
  const [justificativaLancarDia, setJustificativaLancarDia] = useState('');
  const [buscaLancarDia, setBuscaLancarDia] = useState('');
  const [filtroPlanoLancarDia, setFiltroPlanoLancarDia] = useState('TODOS');
  const [apenasNaoLancadosDia, setApenasNaoLancadosDia] = useState(false);
  const [alunosSelecionadosDia, setAlunosSelecionadosDia] = useState<string[]>([]);
  const [salvandoLoteDia, setSalvandoLoteDia] = useState(false);

  // Busca em Aulas Experimentais / Agendamentos
  const [buscaAgendamento, setBuscaAgendamento] = useState('');

  // Ref para rolagem suave da barra de abas com identidade visual Borü
  const tabsScrollRef = React.useRef<HTMLDivElement | null>(null);
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      tabsScrollRef.current.scrollBy({
        left: direction === 'left' ? -280 : 280,
        behavior: 'smooth',
      });
    }
  };

  // Modal Novo Aluno
  const [showModal, setShowModal] = useState(false);
  const [novoAluno, setNovoAluno] = useState({ nome: '', cpf: '', email: '', telefone: '', plano: '2x na semana', is_bolsista: false });

  // Modal Baixa Manual com DatePicker (Módulo 5)
  const [alunoBaixaModal, setAlunoBaixaModal] = useState<any>(null);
  const [dataPagamentoBaixa, setDataPagamentoBaixa] = useState<string>(new Date().toISOString().split('T')[0]);
  const [metodoPagamentoBaixa, setMetodoPagamentoBaixa] = useState<string>('PIX / Presencial');
  const [salvandoBaixaRapida, setSalvandoBaixaRapida] = useState(false);

  // Modal Novo Professor (Apenas Admin)
  const [showModalProf, setShowModalProf] = useState(false);
  const [novoProfessor, setNovoProfessor] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    cargo: 'PROFESSOR',
    telefone: '',
    modalidade: 'Muay Thai',
    graduacao: 'Prajied Azul Escuro e Preto',
    prajied_faixa: 'Prajied Azul Escuro e Preto',
    fotoPerfilUrl: '',
    tempoPratica: '',
    tempoDocencia: '3 a 5 anos dando aulas',
    tempoAula: '60 min',
    horariosAula: '',
    cargaHorariaSemanal: ''
  });

  // Modal Editar Professor
  const [showModalEditarProf, setShowModalEditarProf] = useState(false);
  const [professorParaEditar, setProfessorParaEditar] = useState<any>(null);

  // Modal Novo Aviso no Mural
  const [showModalAviso, setShowModalAviso] = useState(false);
  const [novoAviso, setNovoAviso] = useState({
    titulo: '',
    conteudo: '',
    tipo: 'GERAL',
    fixado: false
  });

  // Modal Novo / Editar Produto na Loja
  const [showModalProduto, setShowModalProduto] = useState(false);
  const [produtoEditandoId, setProdutoEditandoId] = useState<string | null>(null);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    categoria: 'PROTETOR_BUCAL',
    preco: '',
    estoque: '10',
    descricao: '',
    imagemUrl: ''
  });

  // Modal Calendário / Presença Detalhada do Aluno Individual
  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);
  const [calendarioDados, setCalendarioDados] = useState<any>(null);
  const [loadingCalendario, setLoadingCalendario] = useState(false);
  const [mesCalendario, setMesCalendario] = useState(new Date().getMonth() + 1);
  const [anoCalendario, setAnoCalendario] = useState(new Date().getFullYear());

  // Modal de Ação do Dia no Calendário Individual
  const [diaSelecionadoAcao, setDiaSelecionadoAcao] = useState<string | null>(null);
  const [statusAcaoDia, setStatusAcaoDia] = useState('PRESENTE');
  const [justificativaInput, setJustificativaInput] = useState('');
  const [tipoJustificativaInput, setTipoJustificativaInput] = useState('DOENCA');
  const [modalAcaoDia, setModalAcaoDia] = useState(false);

  // Modal Converter Experimental em Aluno
  const [leadParaConverter, setLeadParaConverter] = useState<any>(null);
  const [planoConversao, setPlanoConversao] = useState('2x na semana');
  const [valorConversao, setValorConversao] = useState('130');

  useEffect(() => {
    if (isLoggedIn) {
      carregarDashboard();
      carregarFrequenciaGeral(mesFrequenciaGeral, anoFrequenciaGeral);
    }
  }, [isLoggedIn]);

  // Travar o scroll da página de fundo (116 alunos) sempre que qualquer modal estiver aberto
  useEffect(() => {
    const algumModalAberto = Boolean(
      alunoSelecionado ||
      modalLancarDia ||
      showModalProduto ||
      showModal ||
      alunoBaixaModal ||
      showModalProf ||
      showModalEditarProf ||
      showModalAviso ||
      modalAcaoDia ||
      leadParaConverter
    );

    if (algumModalAberto) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [
    alunoSelecionado,
    modalLancarDia,
    showModalProduto,
    showModal,
    alunoBaixaModal,
    showModalProf,
    showModalEditarProf,
    showModalAviso,
    modalAcaoDia,
    leadParaConverter
  ]);

  const carregarDashboard = async () => {
    setLoading(true);
    try {
      const [dashRes, agendRes, presencasRes, avisosRes, produtosRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getAppointments(),
        adminApi.getAttendance(),
        publicApi.getNotices(),
        publicApi.getProducts()
      ]);
      setMetricas(dashRes.data.metricas);
      setAlunos(dashRes.data.alunos);
      setAgendamentos(agendRes.data);
      setPresencas(presencasRes.data);
      setAvisos(avisosRes.data);
      setProdutos(produtosRes.data);

      if (usuarioLogado?.cargo === 'ADMIN') {
        const profsRes = await adminApi.getTeachers();
        setProfessores(profsRes.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  const isAtendente = usuarioLogado?.cargo === 'ATENDENTE';

  useEffect(() => {
    if (isAtendente && !ATENDENTE_ALLOWED_TABS.has(abaAtiva)) {
      setAbaAtiva('alunos');
    }
  }, [isAtendente, abaAtiva]);

  const realizarLoginAdmin = async (
    usuarioParam: string,
    senhaParam: string,
    portalOverride?: 'admin' | 'atendente'
  ) => {
    setLoginLoading(true);
    try {
      const portalAlvo = portalOverride || (modoAcessoLogin === 'ATENDENTE' ? 'atendente' : 'admin');
      const response = await adminApi.login({
        emailOuUsuario: usuarioParam,
        senha: senhaParam,
        portal: portalAlvo
      });
      setUsuarioLogado(response.data.usuario);
      if (response.data.usuario?.cargo === 'ATENDENTE') {
        setAbaAtiva('alunos');
      }
      setIsLoggedIn(true);
    } catch (error: any) {
      alert(error.response?.data?.erro || 'Erro ao realizar login.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await realizarLoginAdmin(loginInput, password);
  };

  const handleDemoAdminLogin = async () => {
    if (modoAcessoLogin === 'ATENDENTE') {
      setLoginInput('atendente');
      setPassword('1');
      await realizarLoginAdmin('atendente', '1', 'atendente');
      return;
    }
    setLoginInput('1');
    setPassword('1');
    await realizarLoginAdmin('1', '1', 'admin');
  };

  // ==========================================
  // PROFESSORES (Exclusivo Admin)
  // ==========================================
  const criarProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((novoProfessor.cargo === 'PROFESSOR' || novoProfessor.cargo === 'ATENDENTE') && !novoProfessor.cpf) {
      alert(`O CPF do ${novoProfessor.cargo === 'ATENDENTE' ? 'atendente' : 'professor'} é obrigatório para que ele possa acessar o sistema.`);
      return;
    }
    try {
      await adminApi.createTeacher({
        ...novoProfessor,
        prajied_faixa: novoProfessor.prajied_faixa || novoProfessor.graduacao,
        horarios_aula: novoProfessor.horariosAula ? novoProfessor.horariosAula.split(/[,|]/).map((s) => s.trim()).filter(Boolean) : []
      });
      alert(`Professor ${novoProfessor.nome} cadastrado com sucesso!\n\nEle poderá acessar o painel informando o CPF e a senha cadastrada.`);
      setShowModalProf(false);
      setNovoProfessor({
        nome: '',
        email: '',
        cpf: '',
        senha: '',
        cargo: 'PROFESSOR',
        telefone: '',
        modalidade: 'Muay Thai',
        graduacao: 'Prajied Azul Escuro e Preto',
        prajied_faixa: 'Prajied Azul Escuro e Preto',
        fotoPerfilUrl: '',
        tempoPratica: '',
        tempoDocencia: '3 a 5 anos dando aulas',
        tempoAula: '60 min',
        horariosAula: '',
        cargaHorariaSemanal: ''
      });
      carregarDashboard();
    } catch (error: any) {
      alert(error.response?.data?.erro || 'Erro ao criar professor.');
    }
  };

  const handleRedefinirSenhaProfessor = async (prof: any) => {
    const nova = prompt(`Definir NOVA SENHA para o professor ${prof.nome} (Login CPF: ${prof.cpf || 'Não informado'}):\n\n(Apenas o Administrador pode redefinir esta senha caso o professor tenha esquecido)`);
    if (!nova) return;
    if (nova.trim().length < 4) {
      alert('A senha deve conter no mínimo 4 caracteres.');
      return;
    }
    try {
      await adminApi.resetTeacherPassword(prof.id, nova.trim());
      alert(`Senha do professor ${prof.nome} alterada com sucesso para: "${nova.trim()}"!\nInforme ao professor para ele acessar com seu CPF.`);
      carregarDashboard();
    } catch (error: any) {
      alert(error.response?.data?.erro || 'Erro ao redefinir senha do professor.');
    }
  };

  const abrirModalEdicaoProf = (prof: any) => {
    if (!prof) return;
    const mod = prof.modalidade || (prof.is_dev ? '[DEV-SYSTEM]' : 'Muay Thai');
    const grad = prof.prajied_faixa || prof.graduacao || prof.prajied || (graduacoesPorModalidade[mod]?.[0] || (prof.is_dev ? 'Desenvolvedor do Sistema [DEV-SYSTEM]' : ''));
    setProfessorParaEditar({
      id: prof.id,
      nome: prof.nome || '',
      email: prof.email || '',
      cpf: prof.cpf || '',
      telefone: prof.telefone || '',
      cargo: prof.cargo || 'PROFESSOR',
      modalidade: mod,
      graduacao: grad,
      prajied_faixa: grad,
      fotoPerfilUrl: prof.fotoPerfilUrl || '',
      tempoPratica: prof.tempoPratica || '',
      tempoDocencia: prof.tempoDocencia || (prof.is_dev ? 'Engenharia & Arquitetura de Software' : ''),
      tempoAula: prof.tempoAula || (prof.is_dev ? 'Disponibilidade Dev' : '60 min'),
      horariosAula: prof.horariosAula || (Array.isArray(prof.horarios_aula) ? prof.horarios_aula.join(', ') : (prof.horarios_aula || (prof.is_dev ? 'Suporte & Atualizações Contínuas' : ''))),
      cargaHorariaSemanal: prof.cargaHorariaSemanal || '',
      senha: ''
    });
    setShowModalEditarProf(true);
  };

  const salvarEdicaoProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professorParaEditar) return;
    try {
      const horariosTexto = professorParaEditar.horariosAula ? String(professorParaEditar.horariosAula).trim() : '';
      const payload: any = {
        nome: professorParaEditar.nome ? String(professorParaEditar.nome).trim() : '',
        email: professorParaEditar.email ? String(professorParaEditar.email).trim().toLowerCase() : undefined,
        cpf: professorParaEditar.cpf ? String(professorParaEditar.cpf).trim() : '',
        telefone: professorParaEditar.telefone ? String(professorParaEditar.telefone).trim() : '',
        cargo: professorParaEditar.cargo,
        modalidade: professorParaEditar.modalidade,
        graduacao: professorParaEditar.graduacao,
        prajied_faixa: professorParaEditar.prajied_faixa || professorParaEditar.graduacao,
        fotoPerfilUrl: professorParaEditar.fotoPerfilUrl || null,
        tempoPratica: professorParaEditar.tempoPratica || '',
        tempoDocencia: professorParaEditar.tempoDocencia || '',
        tempoAula: professorParaEditar.tempoAula || '60 min',
        horariosAula: horariosTexto,
        horarios_aula: horariosTexto,
        cargaHorariaSemanal: professorParaEditar.cargaHorariaSemanal || ''
      };
      if (professorParaEditar.senha && professorParaEditar.senha.trim().length > 0) {
        payload.senha = professorParaEditar.senha.trim();
      }
      const response = await adminApi.updateTeacher(professorParaEditar.id, payload);
      alert('Dados atualizados com sucesso!');

      // Sincroniza usuário logado caso ele tenha editado seu próprio perfil
      if (response.data?.professor && (
        professorParaEditar.id === usuarioLogado?.id ||
        professorParaEditar.email === usuarioLogado?.email ||
        (usuarioLogado?.cpf && professorParaEditar.cpf && usuarioLogado.cpf.replace(/\D/g, '') === professorParaEditar.cpf.replace(/\D/g, ''))
      )) {
        setUsuarioLogado((prev: any) => ({
          ...prev,
          ...response.data.professor
        }));
      }

      setShowModalEditarProf(false);
      setProfessorParaEditar(null);
      carregarDashboard();
    } catch (error: any) {
      alert(error.response?.data?.erro || 'Erro ao atualizar dados do professor.');
    }
  };

  const removerProfessor = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja remover o professor(a) ${nome}?`)) {
      try {
        await adminApi.deleteTeacher(id);
        alert('Professor removido.');
        carregarDashboard();
      } catch (error) {
        alert('Erro ao remover professor.');
      }
    }
  };

  // ==========================================
  // MURAL DE AVISOS
  // ==========================================
  const criarAviso = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createNotice({
        ...novoAviso,
        autorNome: usuarioLogado?.nome || 'Coordenação Técnica',
        autorCargo: usuarioLogado?.cargo === 'ADMIN' ? 'Administrador' : 'Professor'
      });
      alert('Aviso publicado no mural com sucesso!');
      setShowModalAviso(false);
      setNovoAviso({ titulo: '', conteudo: '', tipo: 'GERAL', fixado: false });
      carregarDashboard();
    } catch (error) {
      alert('Erro ao criar aviso.');
    }
  };

  const removerAviso = async (id: string) => {
    if (confirm('Deseja excluir este comunicado do mural?')) {
      try {
        await adminApi.deleteNotice(id);
        carregarDashboard();
      } catch (error) {
        alert('Erro ao excluir aviso.');
      }
    }
  };

  // ==========================================
  // LOJA & MERCADO (BETA)
  // ==========================================
  const criarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (produtoEditandoId) {
        await adminApi.updateProduct(produtoEditandoId, novoProduto);
        alert('Produto atualizado com sucesso!');
      } else {
        await adminApi.createProduct(novoProduto);
        alert('Produto adicionado ao catálogo da loja!');
      }
      setShowModalProduto(false);
      setProdutoEditandoId(null);
      setNovoProduto({ nome: '', categoria: 'PROTETOR_BUCAL', preco: '', estoque: '10', descricao: '', imagemUrl: '' });
      carregarDashboard();
    } catch (error) {
      alert('Erro ao salvar produto.');
    }
  };

  const abrirEditarProduto = (prod: any) => {
    setProdutoEditandoId(prod.id);
    setNovoProduto({
      nome: prod.nome || '',
      categoria: prod.categoria || 'PROTETOR_BUCAL',
      preco: String(prod.preco ?? ''),
      estoque: String(prod.estoque ?? '0'),
      descricao: prod.descricao || '',
      imagemUrl: prod.imagemUrl || ''
    });
    setShowModalProduto(true);
  };

  const removerProduto = async (id: string) => {
    if (confirm('Deseja excluir este produto do estoque?')) {
      try {
        await adminApi.deleteProduct(id);
        carregarDashboard();
      } catch (error) {
        alert('Erro ao remover produto.');
      }
    }
  };

  // ==========================================
  // ALUNOS & MENSALIDADES
  // ==========================================
  const criarAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminApi.createStudent(novoAluno);
      alert(`Aluno criado com sucesso!\n\nSenha temporária gerada: ${response.data.senhaTemporaria}\n(Envie isso para o aluno acessar o portal)`);
      carregarDashboard();
      setShowModal(false);
      setNovoAluno({ nome: '', cpf: '', email: '', telefone: '', plano: '2x na semana', is_bolsista: false });
    } catch (error: any) {
      alert(error.response?.data?.erro || 'Erro ao criar aluno.');
    }
  };

  // MÓDULO 5: Abre o Modal com DatePicker (Calendário) para Baixa Manual
  const handleRegistrarPagamento = async (aluno: any) => {
    setAlunoBaixaModal(aluno);
    setDataPagamentoBaixa(new Date().toISOString().split('T')[0]);
    setMetodoPagamentoBaixa('PIX / Presencial');
  };

  const confirmarBaixaComCalendario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoBaixaModal) return;
    setSalvandoBaixaRapida(true);
    try {
      const response = await adminApi.registerPayment(alunoBaixaModal.id, {
        dataPagamento: dataPagamentoBaixa,
        metodoPagamento: metodoPagamentoBaixa
      });
      alert(response.data.mensagem);
      setAlunoBaixaModal(null);
      carregarDashboard();
      if (alunoSelecionado && alunoSelecionado.id === alunoBaixaModal.id) {
        abrirCalendarioAluno(alunoSelecionado);
      }
    } catch (error: any) {
      alert(error.response?.data?.erro || 'Erro ao registrar pagamento.');
    } finally {
      setSalvandoBaixaRapida(false);
    }
  };

  // MÓDULO 1: Alternar flag is_bolsista
  const handleToggleBolsista = async (aluno: any) => {
    const novoStatus = !aluno.is_bolsista;
    if (!confirm(`Deseja definir ${aluno.nome} como ${novoStatus ? 'ALUNO BOLSISTA (Isento de mensalidades)' : 'ALUNO MENSALISTA REGULAR'}?`)) return;
    try {
      await adminApi.toggleStudentBolsista(aluno.id, novoStatus);
      carregarDashboard();
    } catch (error: any) {
      alert(error.response?.data?.erro || 'Erro ao atualizar status de bolsista.');
    }
  };

  // MÓDULO 4: Automação de WhatsApp para Aula Experimental
  const handleAvisarExperimentalWhatsApp = (ag: any) => {
    const nomeAlunos = ag.nome || 'Aluno(a)';
    const nomeProfessor = ag.professorNome || usuarioLogado?.nome || 'Coordenação Técnica';
    const dataHoraFormatada = `${ag.data || 'Data a confirmar'} às ${ag.horario || 'Horário a confirmar'}`;

    const textoMensagem = `${nomeAlunos}, agendada sua aula experimental de Muay Thai com o Professor ${nomeProfessor}, ${dataHoraFormatada} no CENTRO DE COMBATE (COMBAT-HUB).\n📍 Rua Doutor Agenor de Carvalho, n° 1168 - Bairro Agenor de Carvalho\nAguardamos vocês! Recomendamos chegar com 10 minutos de antecedência. Bem vindos(as)! 🐺`;

    let numeroLimpo = (ag.telefone || '').replace(/\D/g, '');
    if (numeroLimpo && !numeroLimpo.startsWith('55') && (numeroLimpo.length === 10 || numeroLimpo.length === 11)) {
      numeroLimpo = '55' + numeroLimpo;
    }

    const url = numeroLimpo
      ? `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(textoMensagem)}`
      : `https://wa.me/?text=${encodeURIComponent(textoMensagem)}`;

    window.open(url, '_blank');
  };

  const atualizarPrajied = async (alunoId: string, prajied: string) => {
    try {
      await adminApi.updateStudentGrade(alunoId, { prajied });
      alert(`Graduação alterada para ${prajied} com sucesso!`);
      carregarDashboard();
    } catch (error: any) {
      alert(error.response?.data?.erro || 'Erro ao atualizar Prajied.');
    }
  };

  const isDiariaOuConvenio = (plano?: string) => {
    if (!plano) return false;
    const p = plano.toLowerCase();
    return p.includes('diária') || p.includes('diaria') || p.includes('wellhub') || p.includes('totalpass') || p.includes('gympass');
  };

  const atualizarPlanoAluno = async (alunoId: string, plano: string) => {
    try {
      await adminApi.updateStudent(alunoId, { plano });
      alert(`Plano do aluno alterado para "${plano}" com sucesso!`);
      carregarDashboard();
    } catch (error: any) {
      alert(error.response?.data?.erro || 'Erro ao atualizar plano do aluno.');
    }
  };

  const formatarWhatsUrl = (telefone: string, mensagem: string) => {
    let limpo = (telefone || '').replace(/\D/g, '');
    if (!limpo) return '#';
    if (!limpo.startsWith('55') && (limpo.length === 10 || limpo.length === 11)) {
      limpo = '55' + limpo;
    }
    return `https://wa.me/${limpo}?text=${encodeURIComponent(mensagem)}`;
  };

  const handleCobrar = (aluno: any) => {
    if (!aluno.telefone) {
      alert(`O aluno ${aluno.nome} não possui número de telefone cadastrado.`);
      return;
    }
    const dias = aluno.diasVencimento;
    let msg = '';
    if (isDiariaOuConvenio(aluno.plano)) {
      msg = `Olá ${aluno.nome}, aqui é do CENTRO DE COMBATE Muay Thai! Tudo bem? Passando para saber quando você vem treinar conosco esta semana! Qualquer dúvida sobre os horários ou validação de passe (Wellhub/TotalPass/Diária), estamos à disposição. Oss!`;
    } else if (dias === null) {
      msg = `Olá ${aluno.nome}, aqui é do CENTRO DE COMBATE Muay Thai! Tudo bem? Passando para regularizar sua matrícula presencialmente no balcão.`;
    } else if (dias < 0) {
      msg = `Olá ${aluno.nome}, tudo bem? Aqui é do CENTRO DE COMBATE. Sua mensalidade venceu há ${Math.abs(dias)} dias. Por favor, acerte presencialmente na recepção ou via PIX (+55 69 9238-4491) para manter seu acesso aos treinos!`;
    } else if (dias === 0) {
      msg = `Olá ${aluno.nome}, passando para avisar que sua mensalidade no CENTRO DE COMBATE vence hoje! O acerto pode ser feito na recepção no início do treino.`;
    } else {
      msg = `Olá ${aluno.nome}, tudo bem? Passando para lembrar que sua mensalidade no CENTRO DE COMBATE vence em ${dias} dias. Bons treinos!`;
    }
    window.open(formatarWhatsUrl(aluno.telefone, msg), '_blank');
  };

  // ==========================================
  // CALENDÁRIO & FREQUÊNCIA DETALHADA
  // ==========================================
  const abrirCalendarioAluno = async (aluno: any) => {
    setAlunoSelecionado(aluno);
    setCalendarioDados(null);
    setLoadingCalendario(true);
    const mes = new Date().getMonth() + 1;
    const ano = new Date().getFullYear();
    setMesCalendario(mes);
    setAnoCalendario(ano);
    await carregarDadosCalendario(aluno.id, mes, ano);
  };

  const carregarDadosCalendario = async (alunoId: string, mes: number, ano: number) => {
    setLoadingCalendario(true);
    try {
      const res = await adminApi.getStudentCalendar(alunoId, { mes, ano });
      setCalendarioDados(res.data);
    } catch (error) {
      console.error('Erro ao carregar calendário do aluno', error);
    } finally {
      setLoadingCalendario(false);
    }
  };

  const mudarMesCalendario = (delta: number) => {
    let novoMes = mesCalendario + delta;
    let novoAno = anoCalendario;
    if (novoMes > 12) {
      novoMes = 1;
      novoAno += 1;
    } else if (novoMes < 1) {
      novoMes = 12;
      novoAno -= 1;
    }
    setMesCalendario(novoMes);
    setAnoCalendario(novoAno);
    if (alunoSelecionado) {
      carregarDadosCalendario(alunoSelecionado.id, novoMes, novoAno);
    }
  };

  const abrirAcaoDia = (dataIso: string) => {
    setDiaSelecionadoAcao(dataIso);
    const presencasDoDia = calendarioDados?.presencasPorDia?.[dataIso] || [];
    const presencaAtual = presencasDoDia[0];
    setStatusAcaoDia(presencaAtual?.status || 'PRESENTE');
    setJustificativaInput(presencaAtual?.justificativa || '');
    setTipoJustificativaInput(presencaAtual?.tipoJustificativa || 'DOENCA');
    setModalAcaoDia(true);
  };

  const salvarPresencaNoDia = async () => {
    if (!alunoSelecionado || !diaSelecionadoAcao) return;
    try {
      await adminApi.saveStudentAttendance(alunoSelecionado.id, {
        data: diaSelecionadoAcao,
        status: statusAcaoDia,
        justificativa: justificativaInput || null,
        tipoJustificativa: statusAcaoDia === 'DOENCA' ? 'DOENCA' : (statusAcaoDia === 'JUSTIFICADO' ? tipoJustificativaInput : null)
      });
      setModalAcaoDia(false);
      carregarDadosCalendario(alunoSelecionado.id, mesCalendario, anoCalendario);
      carregarDashboard();
    } catch (error) {
      alert('Erro ao salvar frequência.');
    }
  };

  const removerPresencaDoDia = async () => {
    if (!alunoSelecionado || !diaSelecionadoAcao) return;
    if (confirm('Deseja remover o registro de frequência deste dia?')) {
      try {
        await adminApi.deleteStudentAttendance(alunoSelecionado.id, { data: diaSelecionadoAcao });
        setModalAcaoDia(false);
        carregarDadosCalendario(alunoSelecionado.id, mesCalendario, anoCalendario);
        carregarDashboard();
      } catch (error) {
        alert('Erro ao remover registro.');
      }
    }
  };

  // ==========================================
  // CONFIRMAÇÃO DE CHECK-IN RÁPIDO & EM LOTE
  // ==========================================
  const handleAlterarStatusPresenca = async (presencaId: string, novoStatus: string) => {
    try {
      await adminApi.updateAttendanceStatus(presencaId, {
        status: novoStatus
      });
      setPresencas(prev => prev.map(p => p.id === presencaId ? { ...p, status: novoStatus } : p));
      if (alunoSelecionado) {
        carregarDadosCalendario(alunoSelecionado.id, mesCalendario, anoCalendario);
      }
      if (frequenciaGeral) {
        carregarFrequenciaGeral(mesFrequenciaGeral, anoFrequenciaGeral);
      }
    } catch (error) {
      alert('Erro ao atualizar presença.');
    }
  };

  const handleMarcarTodosAgendados = async () => {
    const agendados = presencas.filter(p => p.status === 'AGENDADO');
    if (agendados.length === 0) {
      alert('Não há presenças pendentes com status "AGENDADO" para marcar.');
      return;
    }
    if (confirm(`Confirmar presença de TODOS os ${agendados.length} alunos agendados em 1 clique?`)) {
      setLoteLoading(true);
      try {
        await adminApi.batchUpdateAttendance({
          presencaIds: agendados.map(p => p.id),
          status: 'PRESENTE'
        });
        alert(`Sucesso! ${agendados.length} presenças foram validadas como PRESENTES!`);
        carregarDashboard();
        carregarFrequenciaGeral(mesFrequenciaGeral, anoFrequenciaGeral);
      } catch (error) {
        alert('Erro ao confirmar lote de presenças.');
      } finally {
        setLoteLoading(false);
      }
    }
  };

  const handleMarcarLoteStatus = async (status: string) => {
    if (selecionadosLote.length === 0) {
      alert('Selecione pelo menos um registro na tabela.');
      return;
    }
    setLoteLoading(true);
    try {
      await adminApi.batchUpdateAttendance({
        presencaIds: selecionadosLote,
        status
      });
      alert(`${selecionadosLote.length} presenças atualizadas para ${status}!`);
      setSelecionadosLote([]);
      carregarDashboard();
      carregarFrequenciaGeral(mesFrequenciaGeral, anoFrequenciaGeral);
    } catch (error) {
      alert('Erro ao atualizar presenças em lote.');
    } finally {
      setLoteLoading(false);
    }
  };

  // ==========================================
  // CALENDÁRIO GERAL DA ACADEMIA
  // ==========================================
  const carregarFrequenciaGeral = async (mes: number, ano: number) => {
    setLoadingFrequenciaGeral(true);
    try {
      const res = await adminApi.getGeneralAttendance({ mes, ano });
      setFrequenciaGeral(res.data);
    } catch (error) {
      console.error('Erro ao carregar frequência geral da academia', error);
    } finally {
      setLoadingFrequenciaGeral(false);
    }
  };

  const mudarMesFrequenciaGeral = (delta: number) => {
    let novoMes = mesFrequenciaGeral + delta;
    let novoAno = anoFrequenciaGeral;
    if (novoMes > 12) {
      novoMes = 1;
      novoAno += 1;
    } else if (novoMes < 1) {
      novoMes = 12;
      novoAno -= 1;
    }
    setMesFrequenciaGeral(novoMes);
    setAnoFrequenciaGeral(novoAno);
    carregarFrequenciaGeral(novoMes, novoAno);
  };

  const handleLancarPresencaDiaGeral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoLancarDia || !diaSelecionadoGeral) return;
    try {
      await adminApi.saveStudentAttendance(alunoLancarDia, {
        data: diaSelecionadoGeral,
        status: statusLancarDia,
        justificativa: justificativaLancarDia || null,
        tipoJustificativa: statusLancarDia === 'DOENCA' ? 'DOENCA' : (statusLancarDia === 'JUSTIFICADO' ? 'TRABALHO' : null)
      });
      alert('Presença lançada com sucesso no calendário da academia!');
      setModalLancarDia(false);
      setAlunoLancarDia('');
      setJustificativaLancarDia('');
      carregarFrequenciaGeral(mesFrequenciaGeral, anoFrequenciaGeral);
      carregarDashboard();
    } catch (error) {
      alert('Erro ao registrar presença no calendário.');
    }
  };

  const handleLancarPresencaLoteDiaGeral = async () => {
    if (alunosSelecionadosDia.length === 0) {
      alert('Selecione pelo menos 1 aluno na tabela para lançar em lote.');
      return;
    }
    if (!diaSelecionadoGeral) return;

    setSalvandoLoteDia(true);
    try {
      const tipoJust = statusLancarDia === 'DOENCA' ? 'DOENCA' : (statusLancarDia === 'JUSTIFICADO' ? 'TRABALHO' : null);
      try {
        await adminApi.batchSaveGeneralAttendance({
          alunoIds: alunosSelecionadosDia,
          data: diaSelecionadoGeral,
          status: statusLancarDia,
          justificativa: justificativaLancarDia || null,
          tipoJustificativa: tipoJust,
        });
      } catch {
        // Fallback caso a rota em lote ainda esteja atualizando no servidor
        for (const aId of alunosSelecionadosDia) {
          await adminApi.saveStudentAttendance(aId, {
            data: diaSelecionadoGeral,
            status: statusLancarDia,
            justificativa: justificativaLancarDia || null,
            tipoJustificativa: tipoJust,
          });
        }
      }
      alert(`✅ Sucesso! ${alunosSelecionadosDia.length} aluno(s) foram lançados como ${statusLancarDia} no dia ${new Date(diaSelecionadoGeral + 'T12:00:00').toLocaleDateString('pt-BR')}!`);
      setAlunosSelecionadosDia([]);
      setJustificativaLancarDia('');
      setModalLancarDia(false);
      carregarFrequenciaGeral(mesFrequenciaGeral, anoFrequenciaGeral);
      carregarDashboard();
    } catch (error) {
      alert('Erro ao registrar presenças em lote.');
    } finally {
      setSalvandoLoteDia(false);
    }
  };

  const handleLancarAlunoRapidoNaTabela = async (alunoId: string, statusRapido = 'PRESENTE') => {
    if (!diaSelecionadoGeral) return;
    try {
      await adminApi.saveStudentAttendance(alunoId, {
        data: diaSelecionadoGeral,
        status: statusRapido,
        justificativa: justificativaLancarDia || null,
        tipoJustificativa: statusRapido === 'DOENCA' ? 'DOENCA' : null,
      });
      carregarFrequenciaGeral(mesFrequenciaGeral, anoFrequenciaGeral);
      carregarDashboard();
    } catch {
      alert('Erro ao lançar aluno rapidamente.');
    }
  };

  const handleMensagemAssiduidade = (aluno: any) => {
    if (!aluno.telefone) {
      alert(`O aluno ${aluno.nome} não possui telefone cadastrado.`);
      return;
    }
    const msg = `Olá ${aluno.nome}, tudo bem? Aqui é da equipe do CENTRO DE COMBATE Muay Thai! Sentimos sua falta nos treinos recentemente. Tá tudo certinho por aí? Esperamos você de volta ao tatame para continuarmos evoluindo juntos! Se precisar de algum ajuste nos seus horários, estamos à disposição. Oss! 🥊`;
    window.open(formatarWhatsUrl(aluno.telefone, msg), '_blank');
  };

  const handleChamarDeVolta = (aluno: any) => {
    if (!aluno.telefone) {
      alert(`O aluno ${aluno.nome} não possui telefone cadastrado.`);
      return;
    }
    const dias = aluno.diasSemTreinar ?? 18;
    const semanas = Math.max(2, Math.floor(dias / 7));
    const msg = `Fala ${aluno.nome}! Aqui é a coordenação técnica do Combat-Pass (${ACADEMY_CONFIG.nome}). 🥊🔥\n\nNotamos que você está há cerca de ${semanas} semanas (${dias} dias) sem fazer check-in nos treinos da rede. Tá tudo bem por aí?\n\nSeu passe continua ativo e os CTs parceiros estão esperando sua energia no tatame! Quando você volta para afiar os golpes?\n\nSe precisar de qualquer apoio ou ajuste nos seus horários, conta com a gente. Te esperamos no próximo treino! Oss! 🥋🔥`;
    window.open(formatarWhatsUrl(aluno.telefone, msg), '_blank');
  };

  // ==========================================
  // LEADS & AULAS EXPERIMENTAIS
  // ==========================================
  const marcarAulaRealizada = async (agendamentoId: string) => {
    if (confirm('Confirmar que a pessoa realizou a aula experimental?')) {
      try {
        await adminApi.updateAppointment(agendamentoId, { status: 'REALIZADA' });
        carregarDashboard();
        setSubAbaExperimental('posAula');
      } catch (error) {
        alert('Erro ao atualizar agendamento.');
      }
    }
  };

  const converterLeadEmAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadParaConverter) return;
    try {
      const response = await adminApi.convertAppointment(leadParaConverter.id, {
        plano: planoConversao,
        valorMensalidade: valorConversao
      });
      alert(`Parabéns! ${leadParaConverter.nome} agora é um aluno matriculado!\n\nSenha temporária: ${response.data.senhaTemporaria}`);
      setLeadParaConverter(null);
      carregarDashboard();
      setAbaAtiva('alunos');
    } catch (error) {
      alert('Erro ao converter lead em aluno.');
    }
  };

  // ==========================================
  // TELA DE LOGIN DO ADMIN / ERP MASTER
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-4 relative z-10"
        style={{ background: 'var(--bg-background)', color: 'var(--text-foreground)' }}
      >
        <div
          className="backdrop-blur-md p-7 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10"
          style={{
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div className="flex justify-between items-center mb-3 gap-2">
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                background: modoAcessoLogin === 'ATENDENTE' ? 'rgba(6, 182, 212, 0.16)' : 'var(--color-primary-light)',
                color: modoAcessoLogin === 'ATENDENTE' ? '#22d3ee' : 'var(--color-primary)',
                border: modoAcessoLogin === 'ATENDENTE' ? '1px solid rgba(6, 182, 212, 0.45)' : '1px solid var(--color-primary-border)'
              }}
            >
              {modoAcessoLogin === 'ATENDENTE' ? '🎧 ATENDIMENTO & RECEPÇÃO' : '🏛️ PAINEL ADMIN & ERP'}
            </span>
            <ThemeSwitcher compact />
          </div>

          {/* Seletor rápido de Perfil de Acesso: Admin vs Atendimento */}
          <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-xl" style={{ background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setModoAcessoLogin('ADMIN')}
              className="py-2 px-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition cursor-pointer"
              style={{
                background: modoAcessoLogin === 'ADMIN' ? 'var(--color-primary)' : 'transparent',
                color: modoAcessoLogin === 'ADMIN' ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)',
                border: 'none'
              }}
            >
              👑 Admin / ERP
            </button>
            <button
              type="button"
              onClick={() => setModoAcessoLogin('ATENDENTE')}
              className="py-2 px-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition cursor-pointer"
              style={{
                background: modoAcessoLogin === 'ATENDENTE' ? '#0891b2' : 'transparent',
                color: modoAcessoLogin === 'ATENDENTE' ? '#ffffff' : 'var(--text-muted-foreground)',
                border: 'none'
              }}
            >
              🎧 Atendimento
            </button>
          </div>

          <div className="text-center mb-5">
            <img
              src={ACADEMY_CONFIG.logoUrl}
              alt={ACADEMY_CONFIG.nome}
              className="w-20 h-20 rounded-full mx-auto mb-3 shadow-xl object-contain p-1.5"
              style={{
                border: modoAcessoLogin === 'ATENDENTE' ? '2px solid #06b6d4' : '2px solid var(--color-primary)',
                background: 'var(--bg-background)'
              }}
            />
            <h1 className="text-2xl sm:text-3xl font-black tracking-widest mb-1 leading-tight" style={{ color: 'var(--text-foreground)' }}>
              {ACADEMY_CONFIG.nome}
            </h1>
            <p
              className="font-extrabold text-xs uppercase tracking-widest"
              style={{ color: modoAcessoLogin === 'ATENDENTE' ? '#22d3ee' : 'var(--color-primary)' }}
            >
              {modoAcessoLogin === 'ATENDENTE'
                ? 'Central de Atendimento & Recepção Combat-Pass'
                : 'Gestão Administrativa & Rede Combat-Pass'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted-foreground)' }}>
              {modoAcessoLogin === 'ATENDENTE'
                ? 'Acesso exclusivo para Matrículas, Gestão de Alunos, Leads e Check-ins'
                : 'Controle de Alunos, Financeiro, Aulas, Professores e Layouts'}
            </p>
          </div>

          {/* Card de Acesso Rápido Homologado */}
          <div
            className="mb-4 p-3.5 rounded-xl"
            style={{
              background: modoAcessoLogin === 'ATENDENTE' ? 'rgba(6, 182, 212, 0.12)' : 'var(--color-primary-light)',
              border: modoAcessoLogin === 'ATENDENTE' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid var(--color-primary-border)'
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <div
                  className="text-[11px] font-black uppercase tracking-wider"
                  style={{ color: modoAcessoLogin === 'ATENDENTE' ? '#22d3ee' : 'var(--color-primary)' }}
                >
                  {modoAcessoLogin === 'ATENDENTE'
                    ? '⚡ Acesso Rápido Atendimento'
                    : '⚡ Acesso Rápido Admin Master'}
                </div>
                <div className="text-xs font-bold mt-0.5" style={{ color: 'var(--text-foreground)' }}>
                  Login:{' '}
                  <code className="px-1.5 py-0.5 rounded font-black" style={{ background: 'var(--bg-surface-1)' }}>
                    {modoAcessoLogin === 'ATENDENTE' ? 'atendente' : '1'}
                  </code>{' '}
                  · Senha:{' '}
                  <code className="px-1.5 py-0.5 rounded font-black" style={{ background: 'var(--bg-surface-1)' }}>1</code>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                disabled={loginLoading}
                className="px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wide shrink-0 transition cursor-pointer"
                style={{
                  background: modoAcessoLogin === 'ATENDENTE' ? '#0891b2' : 'var(--color-primary)',
                  color: modoAcessoLogin === 'ATENDENTE' ? '#ffffff' : 'var(--text-primary-foreground)',
                  border: 'none'
                }}
              >
                {modoAcessoLogin === 'ATENDENTE' ? '🎧 Entrar Atendente' : '⚡ Entrar Agora (1 / 1)'}
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted-foreground)' }}>
                Login de Acesso (ou digite 1 para demo)
              </label>
              <input
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition"
                style={{
                  background: 'var(--bg-background)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-foreground)'
                }}
                placeholder="Usuário, CPF ou 1"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted-foreground)' }}>
                Senha de Acesso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition"
                style={{
                  background: 'var(--bg-background)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-foreground)'
                }}
                placeholder="Sua senha (ou 1)"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full disabled:opacity-50 font-bold py-3 rounded-lg transition transform active:scale-95 text-sm uppercase tracking-wider"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--text-primary-foreground)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {loginLoading ? 'Verificando...' : 'Entrar no Painel Admin'}
            </button>
          </form>

          <div className="flex items-center justify-between gap-2 mt-5 pt-4 flex-wrap" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <Link to="/" className="text-xs font-bold transition" style={{ color: 'var(--text-muted-foreground)' }}>
              ← Site Principal
            </Link>
            <Link to="/professor" className="text-xs font-bold transition" style={{ color: 'var(--color-primary)' }}>
              🥋 Portal Professor
            </Link>
            <Link to="/portal" className="text-xs font-bold transition" style={{ color: 'var(--color-primary)' }}>
              👤 Portal Aluno
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Coleções filtradas para renderização ágil
  const alunosFiltrados = alunos.filter(a => {
    const termo = buscaAluno.trim().toLowerCase();
    const bateTexto = !termo ||
      (a.nome && a.nome.toLowerCase().includes(termo)) ||
      (a.cpf && a.cpf.toLowerCase().includes(termo)) ||
      (a.telefone && a.telefone.includes(termo));
    if (!bateTexto) return false;

    if (filtroAssiduidade === 'TODOS') return true;
    if (filtroAssiduidade === 'ATIVO') return (a.statusAtividade === 'ATIVO' || (a.diasSemTreinar !== undefined && a.diasSemTreinar < 14));
    if (filtroAssiduidade === 'INATIVO') return (a.statusAtividade === 'INATIVO' || (a.diasSemTreinar !== undefined && a.diasSemTreinar >= 14));
    if (filtroAssiduidade === 'DIARIA') return isDiariaOuConvenio(a.plano);
    if (filtroAssiduidade === 'ALTA') return a.statusAssiduidade === 'ALTA';
    if (filtroAssiduidade === 'REGULAR') return a.statusAssiduidade === 'REGULAR';
    if (filtroAssiduidade === 'RISCO') return a.statusAssiduidade === 'RISCO';
    return true;
  });

  const presencasFiltradas = presencas.filter(p => {
    if (filtroChamada !== 'TODOS' && p.status !== filtroChamada) return false;
    if (buscaPresenca.trim()) {
      const termo = buscaPresenca.trim().toLowerCase();
      const nome = (p.aluno?.nome || '').toLowerCase();
      const plano = (p.aluno?.plano || '').toLowerCase();
      const titulo = (p.evento?.titulo || '').toLowerCase();
      if (!nome.includes(termo) && !plano.includes(termo) && !titulo.includes(termo)) {
        return false;
      }
    }
    return true;
  });

  // ==========================================
  // PAINEL LOGADO
  // ==========================================
  const handleAdminLogout = () => {
    setIsLoggedIn(false);
    setUsuarioLogado(null);
  };

  // Intercepta os 4 Novos Paradigmas Estruturais (5 a 8) garantindo renderização 100% funcional
  if (['command_center', 'split_screen', 'floating_island', 'zen_focus'].includes(adminPreset)) {
    return (
      <LayoutRouter
        portal="admin"
        interfaceOption={adminPreset as any}
        activeTab={abaAtiva}
        onTabChange={(t) => {
          if (isAtendente && !ATENDENTE_ALLOWED_TABS.has(t)) return;
          setAbaAtiva(t as any);
        }}
        usuarioLogado={usuarioLogado}
        title={
          isAtendente
            ? 'Central de Atendimento & Recepção Combat-Pass'
            : 'Admin ERP & Centro de Controle Combat-Pass'
        }
        subtitle={
          isAtendente
            ? `Atendente: ${usuarioLogado?.nome || 'Recepção'} · Matrículas, Alunos & Check-ins`
            : `Administrador: ${usuarioLogado?.nome || 'Diretoria'} · Gestão Multi-Unidades`
        }
        headerActions={
          <div className="flex items-center gap-2">
            {isAtendente ? (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-cyan-600 hover:bg-cyan-500 text-white shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>➕</span>
                <span>Nova Matrícula</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLayoutCustomDrawer(!showLayoutCustomDrawer)}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)'
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>⚙️</span>
                <span>Layouts & Ordem</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleAdminLogout}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-red-600/80 hover:bg-red-600 text-white transition cursor-pointer"
            >
              Sair
            </button>
          </div>
        }
      >
        {showLayoutCustomDrawer && !isAtendente && (
          <div className="mb-6">
            <JourneyLayoutToolbar journey="admin" />
          </div>
        )}

        {/* NAVEGAÇÃO DE ABAS DO ADMIN: Omitida em Split-Screen e Command Center para não duplicar com o menu da esquerda */}
        {!['split_screen', 'command_center'].includes(adminPreset) && (
          <div className="p-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-thin mb-5">
            {(isAtendente
              ? [
                  { id: 'alunos', label: `👥 Alunos & Matrícula (${alunos.length})` },
                  { id: 'agendamentos', label: '🎯 Leads & Aulas Exp.' },
                  { id: 'chamada_diaria', label: '✅ Check-ins & Chamada' },
                  { id: 'calendario_geral', label: '📅 Grade & Horários' },
                  { id: 'ocupacao', label: '🔥 Ocupação' },
                  { id: 'resgates_loja', label: '🎟️ Vouchers & Retiradas' },
                  { id: 'avisos', label: `📢 Avisos (${avisos.length})` }
                ]
              : [
                  { id: 'alunos', label: `👥 Alunos (${alunos.length})` },
                  { id: 'calendario_geral', label: '📅 Grade & Horários' },
                  { id: 'financeiro_gestao', label: '💰 Gestão Financeira' },
                  { id: 'caixa_diario', label: '💵 Caixa PDV' },
                  { id: 'comissoes', label: '🥋 Comissões' },
                  { id: 'ocupacao', label: '🔥 Ocupação' },
                  { id: 'avisos', label: `📢 Avisos (${avisos.length})` },
                  { id: 'gamificacao', label: '🏆 Gamificação' },
                  { id: 'aparencia_layouts', label: '🎨 Estúdio & Temas' }
                ]
            ).map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAbaAtiva(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  abaAtiva === tab.id
                    ? 'bg-red-600 text-white font-black shadow-md shadow-red-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* CONTEÚDO DAS ABAS */}
        <div className="space-y-6">
          {abaAtiva === 'chamada_diaria' && (
            <SplitRollCallTab onRefreshDashboard={carregarDashboard} />
          )}

          {abaAtiva === 'resgates_loja' && (
            <AdminStoreRedemptionsTab usuarioLogado={usuarioLogado} />
          )}

          {abaAtiva === 'agendamentos' && (
            <div className="bg-[#141416] border border-zinc-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-lg font-black text-white">🎯 Leads & Aulas Experimentais</h2>
                  <p className="text-xs text-zinc-400">
                    Acompanhe agendamentos experimentais e converta visitantes em alunos matriculados.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black uppercase tracking-wider transition"
                >
                  ➕ Nova Matrícula Direta
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[...(agendamentos.pendentes || []), ...(agendamentos.posAula || [])].length === 0 ? (
                  <p className="text-xs text-zinc-500 col-span-2 py-6 text-center">
                    Nenhum lead ou aula experimental pendente no momento.
                  </p>
                ) : (
                  [...(agendamentos.pendentes || []), ...(agendamentos.posAula || [])].map((ag: any) => (
                    <div key={ag.id} className="p-4 rounded-xl bg-[#1A1A1E] border border-zinc-800 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-white">{ag.nome}</p>
                        <p className="text-xs text-zinc-400">{ag.telefone} • {ag.data} às {ag.horario}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                          {ag.status}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLeadParaConverter(ag)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition shrink-0"
                      >
                        ✅ Matricular
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {abaAtiva === 'calendario_geral' && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <InteractiveCombatCalendar userRole="ADMIN" />
            </div>
          )}

          {abaAtiva === 'financeiro_gestao' && usuarioLogado?.cargo === 'ADMIN' && (
            <FinancialDashboardTab
              onRefreshGlobal={carregarDashboard}
              usuarioLogadoNome={usuarioLogado?.nome || 'Administração'}
            />
          )}

          {abaAtiva === 'caixa_diario' && usuarioLogado?.cargo === 'ADMIN' && (
            <CashRegisterTab usuarioLogado={usuarioLogado} />
          )}

          {abaAtiva === 'comissoes' && usuarioLogado?.cargo === 'ADMIN' && (
            <TeacherCommissionsTab />
          )}

          {abaAtiva === 'ocupacao' && (
            <OccupancyDashboardTab />
          )}

          {abaAtiva === 'avisos' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {avisos.map(aviso => (
                  <NoticeCard key={aviso.id} aviso={aviso} variant="admin" />
                ))}
              </div>
            </div>
          )}

          {abaAtiva === 'gamificacao' && !isAtendente && (
            <AdminGamificationTab
              cargoUsuario={usuarioLogado?.cargo || 'ADMIN'}
              professorId={usuarioLogado?.id}
              alunosLista={alunos}
              isCombatHub={true}
              onRefreshDashboard={carregarDashboard}
            />
          )}

          {abaAtiva === 'aparencia_layouts' && !isAtendente && (
            <AdminLayoutStudio
              usuarioLogado={usuarioLogado}
              alunos={alunos}
              onOpenStudent360={(id) => setAluno360Id(id)}
              onSelectAdminTab={(tab) => setAbaAtiva(tab)}
            />
          )}

          {abaAtiva === 'alunos' && (
            <div className="bg-[#141416] border border-zinc-800 rounded-xl overflow-hidden shadow-xl space-y-4 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>👥 Alunos Matriculados</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      {alunosFiltrados.length} de {alunos.length}
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Acompanhe frequência individual mensal, retenção de alunos e planos ativos.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-zinc-800/80">
                {alunosFiltrados.slice(0, 15).map(aluno => (
                  <div key={aluno.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <strong className="text-white text-sm">{aluno.nome}</strong>
                      <div className="text-zinc-400">{aluno.cpf} · {aluno.prajied || 'Branco'} · {aluno.plano}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      aluno.status_financeiro === 'PAGO' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40' : 'bg-red-950/60 text-red-400 border border-red-500/40'
                    }`}>
                      {aluno.status_financeiro || 'REGULAR'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </LayoutRouter>
    );
  }

  return (
    <div
      data-layout-arch={adminArch}
      className="min-h-screen font-sans p-3 sm:p-6 pb-20 relative z-10 overflow-x-hidden"
      style={{
        background: adminArch === 'school' ? 'var(--bg-surface-muted, var(--bg-background))' : 'var(--bg-background)',
        color: 'var(--text-foreground)'
      }}
    >
      <div className={`${adminPreset === 'complete_erp' ? 'max-w-5xl' : 'max-w-[1560px]'} mx-auto space-y-5`}>

        {/* TOP CHROME POLIMÓRFICO POR ARQUITETURA DO ADMIN (EM LAYOUT 1 FICA TUDO NA SIDEBAR ESCOLAR INTEGRADA) */}
        {(() => {
          const adminLayoutChoices = [
            { id: 'executive' as const, short: '1. Escolar', tag: 'Sidebar 26px', icon: '🎓' },
            { id: 'operational_360' as const, short: '2. Command HUD', tag: 'Split 360°', icon: '⚡' },
            { id: 'customizer_studio' as const, short: '3. Contábil 0px', tag: 'B2B Matriz', icon: '🏛️' },
            { id: 'complete_erp' as const, short: '4. Super-App', tag: 'Hero Touch', icon: '📱' }
          ];

          const handleAdminLogout = () => {
            setIsLoggedIn(false);
            setUsuarioLogado(null);
          };

          /* HEADER LAYOUT 2: COMMAND CENTER TÁTICO 360° (HUD) */
          if (adminPreset === 'operational_360') {
            return (
              <header
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '6px',
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)',
                  borderLeft: '6px solid var(--color-primary)',
                  boxShadow: '0 0 0 1px var(--color-primary-border), 0 12px 28px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '6px',
                        background: 'var(--color-primary)',
                        color: 'var(--text-primary-foreground)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.35rem',
                        fontWeight: 900
                      }}
                    >
                      ⚡
                    </div>
                    <div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.64rem', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>
                        SYS://COMANDO_ADMIN_360 · TELEMETRIA DE REDE AO VIVO
                      </div>
                      <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-foreground)' }}>
                        {usuarioLogado?.nome} <span style={{ color: 'var(--color-primary)' }}>[{usuarioLogado?.cargo || 'ADMIN'}]</span>
                      </h1>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <ThemeSwitcher compact />
                    <button type="button" onClick={() => setShowModal(true)} style={{ padding: '0.42rem 0.75rem', borderRadius: '4px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', border: 'none', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}>
                      ➕ NOVO ALUNO
                    </button>
                    <button type="button" onClick={() => setShowLayoutCustomDrawer(v => !v)} style={{ padding: '0.42rem 0.75rem', borderRadius: '4px', background: showLayoutCustomDrawer ? 'var(--color-primary)' : 'var(--bg-surface-2)', color: showLayoutCustomDrawer ? 'var(--text-primary-foreground)' : 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}>
                      ⚙️ Ordenar & Loading
                    </button>
                    <Link to="/professor" style={{ padding: '0.42rem 0.75rem', borderRadius: '4px', background: 'var(--bg-background)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', fontSize: '0.7rem', fontWeight: 900, textDecoration: 'none' }}>
                      🥋 Professor
                    </Link>
                    <Link to="/" style={{ padding: '0.42rem 0.75rem', borderRadius: '4px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 800, textDecoration: 'none' }}>
                      🏛️ Hub
                    </Link>
                    <button type="button" onClick={handleAdminLogout} style={{ padding: '0.42rem 0.75rem', borderRadius: '4px', background: 'var(--status-full-bg)', color: 'var(--status-full)', border: '1px solid var(--status-full-border)', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}>
                      ✕ SAIR
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.6rem', borderTop: '1px dashed var(--border-subtle)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {adminLayoutChoices.map(lc => {
                      const active = adminPreset === lc.id;
                      return (
                        <button
                          key={lc.id}
                          type="button"
                          onClick={() => setJourneyPreset('admin', lc.id)}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontSize: '0.7rem',
                            fontWeight: 900,
                            cursor: 'pointer',
                            background: active ? 'var(--color-primary)' : 'var(--bg-background)',
                            color: active ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)',
                            border: active ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)'
                          }}
                        >
                          {lc.icon} {lc.short.toUpperCase()} {active ? '● ATIVO' : ''}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'var(--color-primary)', fontWeight: 900 }}>
                    ALUNOS: {metricas.totalAlunos} · ASSIDUIDADE: {metricas.taxaPresencaMedia ?? 100}% · PENDENTES: {metricas.inadimplentes}
                  </div>
                </div>
              </header>
            );
          }

          /* HEADER LAYOUT 3: TIMBRADO EXECUTIVO & CONTÁBIL B2B 0PX */
          if (adminPreset === 'customizer_studio') {
            return (
              <header
                style={{
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)',
                  borderTop: '6px solid var(--color-primary)',
                  borderBottom: '3px solid var(--text-foreground)',
                  borderRadius: '0px',
                  padding: '1rem 1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.64rem', fontWeight: 900, letterSpacing: '0.14em', color: 'var(--color-primary)' }}>
                      COMBAT-PASS ERP · DIRETORIA EXECUTIVA & CONTABILIDADE B2B
                    </div>
                    <h1 style={{ margin: '0.2rem 0 0', fontSize: '1.38rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-foreground)' }}>
                      {ACADEMY_CONFIG.nome} — CONTROLADORIA & STUDIO
                    </h1>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-muted-foreground)', marginTop: '0.18rem' }}>
                      OPERADOR: <strong>{usuarioLogado?.nome}</strong> ({usuarioLogado?.cargo}) | MATRICULADOS: <strong>{metricas.totalAlunos}</strong> | ADIMPLÊNCIA: <strong style={{ color: 'var(--status-available)' }}>{metricas.assinaturasAtivas}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <ThemeSwitcher compact />
                    <button type="button" onClick={() => setShowModal(true)} style={{ padding: '0.45rem 0.75rem', borderRadius: '0px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', border: 'none', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer' }}>
                      + NOVO ALUNO
                    </button>
                    <button type="button" onClick={() => setShowLayoutCustomDrawer(v => !v)} style={{ padding: '0.45rem 0.75rem', borderRadius: '0px', background: showLayoutCustomDrawer ? 'var(--color-primary)' : 'var(--bg-background)', color: showLayoutCustomDrawer ? 'var(--text-primary-foreground)' : 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer' }}>
                      CONFIG. BLOCOS
                    </button>
                    <Link to="/professor" style={{ padding: '0.45rem 0.75rem', borderRadius: '0px', background: 'var(--bg-background)', color: 'var(--color-primary)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 900, textDecoration: 'none', textTransform: 'uppercase' }}>
                      PORTAL PROF.
                    </Link>
                    <Link to="/" style={{ padding: '0.45rem 0.75rem', borderRadius: '0px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 900, textDecoration: 'none', textTransform: 'uppercase' }}>
                      HUB PRINCIPAL
                    </Link>
                    <button type="button" onClick={handleAdminLogout} style={{ padding: '0.45rem 0.75rem', borderRadius: '0px', background: 'var(--bg-surface-2)', color: 'var(--status-full)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase' }}>
                      ENCERRAR
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.7rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted-foreground)' }}>
                    MODO ESTRUTURAL DO ERP ADMIN:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', border: '1px solid var(--border-subtle)' }}>
                    {adminLayoutChoices.map(lc => {
                      const active = adminPreset === lc.id;
                      return (
                        <button
                          key={lc.id}
                          type="button"
                          onClick={() => setJourneyPreset('admin', lc.id)}
                          style={{
                            padding: '0.4rem 0.85rem',
                            borderRadius: '0px',
                            fontSize: '0.7rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            background: active ? 'var(--color-primary)' : 'var(--bg-background)',
                            color: active ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                            border: 'none',
                            borderRight: '1px solid var(--border-subtle)'
                          }}
                        >
                          {lc.short}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </header>
            );
          }

          /* HEADER LAYOUT 4: SUPER-APP ERP CLÁSSICO COM GRADIENTE HERO */
          if (adminPreset === 'complete_erp') {
            return (
              <header
                style={{
                  borderRadius: '22px',
                  background: 'var(--color-gradient)',
                  color: 'var(--text-primary-foreground)',
                  padding: '1.35rem 1.5rem',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.95rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={usuarioLogado?.fotoPerfilUrl || ACADEMY_CONFIG.logoUrl}
                      alt={ACADEMY_CONFIG.nome}
                      className="arch-keep-shape w-14 h-14 rounded-2xl object-contain p-1"
                      style={{ background: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.45)' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.9, letterSpacing: '0.08em' }}>
                        📱 SUPER-APP ERP CLÁSSICO · {ACADEMY_CONFIG.nome}
                      </div>
                      <h1 style={{ margin: '0.1rem 0 0', fontSize: '1.45rem', fontWeight: 900 }}>
                        Gestão Combat-Pass · {usuarioLogado?.nome}
                      </h1>
                      <div style={{ fontSize: '0.76rem', fontWeight: 700, opacity: 0.92 }}>
                        👥 {metricas.totalAlunos} Alunos · ✅ {metricas.assinaturasAtivas} Em Dia · 📊 {metricas.taxaPresencaMedia ?? 100}% Assiduidade
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <ThemeSwitcher compact />
                    <button type="button" onClick={() => setShowModal(true)} style={{ padding: '0.45rem 0.9rem', borderRadius: '12px', background: '#FFFFFF', color: '#111114', border: 'none', fontSize: '0.74rem', fontWeight: 900, cursor: 'pointer' }}>
                      ➕ Novo Aluno
                    </button>
                    <button type="button" onClick={() => setShowLayoutCustomDrawer(v => !v)} style={{ padding: '0.45rem 0.85rem', borderRadius: '12px', background: 'rgba(0,0,0,0.28)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.35)', fontSize: '0.74rem', fontWeight: 900, cursor: 'pointer' }}>
                      ⚙️ Customizar
                    </button>
                    <Link to="/professor" style={{ padding: '0.45rem 0.85rem', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.35)', fontSize: '0.74rem', fontWeight: 900, textDecoration: 'none' }}>
                      🥋 Professor
                    </Link>
                    <Link to="/" style={{ padding: '0.45rem 0.85rem', borderRadius: '12px', background: 'rgba(255,255,255,0.16)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.74rem', fontWeight: 900, textDecoration: 'none' }}>
                      🏠 Site
                    </Link>
                    <button type="button" onClick={handleAdminLogout} style={{ padding: '0.45rem 0.85rem', borderRadius: '12px', background: 'rgba(0,0,0,0.35)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.74rem', fontWeight: 900, cursor: 'pointer' }}>
                      🚪 Sair
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '0.5rem' }}>
                  {adminLayoutChoices.map(lc => {
                    const active = adminPreset === lc.id;
                    return (
                      <button
                        key={lc.id}
                        type="button"
                        onClick={() => setJourneyPreset('admin', lc.id)}
                        style={{
                          padding: '0.55rem 0.75rem',
                          borderRadius: '12px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          background: active ? '#FFFFFF' : 'rgba(0,0,0,0.24)',
                          color: active ? '#111114' : '#FFFFFF',
                          border: active ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.28)',
                          fontSize: '0.74rem',
                          fontWeight: 900
                        }}
                      >
                        <div>{lc.icon} {lc.short}</div>
                        <div style={{ fontSize: '0.62rem', opacity: 0.78 }}>{active ? '✓ Ativo agora' : lc.tag}</div>
                      </button>
                    );
                  })}
                </div>
              </header>
            );
          }

          /* EM LAYOUT 1 (executive = school): TUDO NA SIDEBAR ESCOLAR INTEGRADA DESDE O TOPO! */
          return null;
        })()}

        {/* MOTOR DE ORDENACAO EXPANSIVEL SOB DEMANDA */}
        {showLayoutCustomDrawer && <JourneyLayoutToolbar journey="admin" compact />}

        {/* SHELL POLIMÓRFICO DO ADMINISTRADOR */}
        <div
          className={(adminPreset === 'executive' || adminPreset === 'operational_360') ? 'responsive-portal-grid' : ''}
          style={
            adminPreset === 'executive'
              ? { display: 'grid', gridTemplateColumns: 'minmax(270px, 310px) 1fr', gap: '1.35rem', alignItems: 'start' }
              : adminPreset === 'operational_360'
              ? { display: 'grid', gridTemplateColumns: 'minmax(290px, 345px) 1fr', gap: '1.25rem', alignItems: 'start' }
              : { display: 'block' }
          }
        >
          {/* ABA LATERAL COMPLETA INTEGRADA DO SISTEMA ESCOLAR / ERP (QUANDO LAYOUT 1 ESTÁ ATIVO) */}
          {adminPreset === 'executive' && (
            <aside
              className="responsive-portal-aside"
              style={{
                position: 'sticky',
                top: '16px',
                borderRadius: '26px',
                background: 'var(--bg-surface-1)',
                border: '2px solid var(--border-subtle)',
                borderTop: '6px solid var(--color-primary)',
                padding: '1.15rem',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              {/* Topo Escolar da Sidebar + Troca Rápida de Layouts */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  🎓 ERP ESCOLAR · DIRETORIA
                </div>
                <ThemeSwitcher compact />
              </div>

              <div style={{ padding: '0.65rem', borderRadius: '20px', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  👁️ Alternar Interface (1 Clique):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                  {[
                    { id: 'executive' as const, label: '1. Escolar ✓' },
                    { id: 'operational_360' as const, label: '2. Command HUD' },
                    { id: 'customizer_studio' as const, label: '3. Contábil 0px' },
                    { id: 'complete_erp' as const, label: '4. Super-App' }
                  ].map(opt => {
                    const active = adminPreset === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setJourneyPreset('admin', opt.id)}
                        style={{
                          padding: '0.38rem 0.5rem',
                          borderRadius: '999px',
                          fontSize: '0.66rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          background: active ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                          color: active ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                          border: active ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)'
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  padding: '0.9rem',
                  borderRadius: '22px',
                  background: 'var(--bg-surface-2)',
                  border: '2px solid var(--color-primary-border)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.62rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  🏛️ GESTOR AUTENTICADO
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-foreground)', marginTop: '0.2rem' }}>
                  {usuarioLogado?.nome}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-foreground)', marginTop: '0.1rem' }}>
                  Cargo: <strong style={{ color: 'var(--color-primary)' }}>{usuarioLogado?.cargo}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  style={{
                    marginTop: '0.6rem',
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '999px',
                    background: 'var(--color-primary)',
                    color: 'var(--text-primary-foreground)',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  ➕ Matricular Novo Aluno
                </button>
              </div>

              {(isAtendente
                ? [
                    {
                      group: '🎧 1. Atendimento & Matrículas',
                      items: [
                        { id: 'alunos', icon: '👥', label: 'Alunos & Nova Matrícula' },
                        { id: 'agendamentos', icon: '🎯', label: 'Leads & Aulas Exp.' }
                      ]
                    },
                    {
                      group: '✅ 2. Check-ins, Vagas & Recepção',
                      items: [
                        { id: 'chamada_diaria', icon: '✅', label: 'Check-ins & Chamada' },
                        { id: 'calendario_geral', icon: '📅', label: 'Grade & Horários' },
                        { id: 'ocupacao', icon: '🔥', label: 'Ocupação de Turmas' },
                        { id: 'resgates_loja', icon: '🎟️', label: 'Vouchers & Retiradas' },
                        { id: 'avisos', icon: '📢', label: 'Mural de Avisos' }
                      ]
                    }
                  ]
                : [
                    {
                      group: '🎓 1. Secretaria & Alunos',
                      items: [
                        { id: 'alunos', icon: '👥', label: 'Todos os Alunos (Visão 360)' },
                        { id: 'chamada_diaria', icon: '✅', label: 'Chamada & Frequência' },
                        { id: 'avaliacoes', icon: '🏅', label: 'Avaliações & Exames' },
                        { id: 'agendamentos', icon: '🎯', label: 'Leads & Aulas Exp.' }
                      ]
                    },
                    {
                      group: '💰 2. Financeiro & Contratos',
                      items: [
                        { id: 'financeiro_gestao', icon: '💰', label: 'Gestão Financeira' },
                        { id: 'caixa_diario', icon: '💵', label: 'Caixa Diário (PDV)' },
                        { id: 'planos_contratos', icon: '📄', label: 'Planos & Contratos' },
                        { id: 'comissoes', icon: '🥋', label: 'Comissões Professores' }
                      ]
                    },
                    {
                      group: '🏆 3. Competitivo & Loja',
                      items: [
                        { id: 'gamificacao', icon: '🏆', label: 'Gamificação (30 Medalhas)' },
                        { id: 'torneios_gestao', icon: '🏅', label: 'Torneios & Brackets' },
                        { id: 'resgates_loja', icon: '🎟️', label: 'Vouchers & Loja Points' },
                        { id: 'ocupacao', icon: '🔥', label: 'Ocupação & Unidades' }
                      ]
                    },
                    {
                      group: '⚙️ 4. Equipe, Estoque & Layouts',
                      items: [
                        { id: 'professores', icon: '👑', label: 'Professores & Equipe' },
                        { id: 'loja', icon: '🛍️', label: 'Loja Física & Estoque' },
                        { id: 'avisos', icon: '📢', label: 'Mural de Avisos' },
                        { id: 'aparencia_layouts', icon: '🎨', label: 'Estúdio de Layouts & Cores' },
                        { id: 'auditoria_logs', icon: '🛡️', label: 'Logs de Auditoria' }
                      ]
                    }
                  ]
              ).map(section => (
                <div key={section.group}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 900, color: 'var(--text-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                    {section.group}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.22rem' }}>
                    {section.items.map(it => (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => setAbaAtiva(it.id as any)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.7rem',
                          borderRadius: '9px',
                          border: abaAtiva === it.id ? '1px solid var(--color-primary)' : '1px solid transparent',
                          borderLeft: abaAtiva === it.id ? '4px solid var(--color-primary)' : '4px solid transparent',
                          background: abaAtiva === it.id ? 'var(--color-primary-light)' : 'transparent',
                          color: abaAtiva === it.id ? 'var(--color-primary)' : 'var(--text-foreground)',
                          fontSize: '0.74rem',
                          fontWeight: abaAtiva === it.id ? 900 : 700,
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem'
                        }}
                      >
                        <span>{it.icon}</span>
                        <span>{it.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Controles Administrativos no Rodapé da Barra Lateral Escolar */}
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setShowLayoutCustomDrawer(v => !v)}
                  style={{
                    padding: '0.45rem 0.6rem',
                    borderRadius: '999px',
                    background: showLayoutCustomDrawer ? 'var(--color-primary)' : 'var(--bg-background)',
                    color: showLayoutCustomDrawer ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  ⚙️ Ordenar
                </button>
                <button
                  type="button"
                  onClick={() => abrirModalEdicaoProf(usuarioLogado)}
                  style={{
                    padding: '0.45rem 0.6rem',
                    borderRadius: '999px',
                    background: 'var(--bg-background)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  👤 Perfil
                </button>
                <Link to="/professor" style={{ padding: '0.45rem 0.6rem', borderRadius: '999px', background: 'var(--bg-background)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', fontSize: '0.68rem', fontWeight: 900, textDecoration: 'none', textAlign: 'center' }}>
                  🥋 Professor
                </Link>
                <Link to="/" style={{ padding: '0.45rem 0.6rem', borderRadius: '999px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.68rem', fontWeight: 900, textDecoration: 'none', textAlign: 'center' }}>
                  🏠 Site
                </Link>
                <button
                  type="button"
                  onClick={() => { setIsLoggedIn(false); setUsuarioLogado(null); }}
                  style={{
                    gridColumn: 'span 2',
                    padding: '0.45rem 0.6rem',
                    borderRadius: '999px',
                    background: 'var(--status-full-bg)',
                    color: 'var(--status-full)',
                    border: '1px solid var(--status-full-border)',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  🚪 Sair da Diretoria
                </button>
              </div>
            </aside>
          )}

          {/* DECK LATERAL DE RECEPÇÃO 360° (QUANDO LAYOUT 2 ESTÁ ATIVO) */}
          {adminPreset === 'operational_360' && (
            <aside
              className="responsive-portal-aside"
              style={{
                position: 'sticky',
                top: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem'
              }}
            >
              <AdminLayoutStudio
                usuarioLogado={usuarioLogado}
                alunos={alunos}
                onOpenStudent360={(id) => setAluno360Id(id)}
                onSelectAdminTab={(tab) => setAbaAtiva(tab)}
              />
            </aside>
          )}

          {/* COLUNA PRINCIPAL DO ERP ADMINISTRATIVO */}
          <div className="space-y-6 min-w-0">

        {abaAtiva === 'aparencia_layouts' && !isAtendente && (
          <AdminLayoutStudio
            usuarioLogado={usuarioLogado}
            alunos={alunos}
            onOpenStudent360={(id) => setAluno360Id(id)}
            onSelectAdminTab={(tab) => setAbaAtiva(tab)}
          />
        )}

        {/* CARDS DE MÉTRICAS & NAVEGAÇÃO POLIMÓRFICA POR PRESET DO ADMIN */}
        {(() => {
          const isAdminRole = usuarioLogado?.cargo === 'ADMIN';
          const isDevRole = usuarioLogado?.is_dev || usuarioLogado?.email === 'brgadmin@boru.com';
          const kpis = [
            {
              key: 'total',
              icon: '👥',
              label: 'Total de Alunos',
              value: metricas.totalAlunos,
              sub: 'Matriculados ativos →',
              status: 'primary',
              pct: 100,
              onClick: () => { setAbaAtiva('alunos'); setFiltroAssiduidade('TODOS'); }
            },
            {
              key: 'emdia',
              icon: '✅',
              label: 'Em Dia',
              value: metricas.assinaturasAtivas,
              sub: 'Mensalidade vigente →',
              status: 'available',
              pct: metricas.totalAlunos > 0 ? Math.round((metricas.assinaturasAtivas / metricas.totalAlunos) * 100) : 100,
              onClick: () => { if (isAdminRole) setAbaAtiva('financeiro_gestao'); else setAbaAtiva('alunos'); }
            },
            {
              key: 'pendentes',
              icon: '⏳',
              label: 'Atrasados / Pendentes',
              value: metricas.inadimplentes,
              sub: 'Vencidas ou sem plano →',
              status: 'full',
              pct: metricas.totalAlunos > 0 ? Math.round((metricas.inadimplentes / metricas.totalAlunos) * 100) : 0,
              onClick: () => { if (isAdminRole) setAbaAtiva('financeiro_gestao'); else setAbaAtiva('alunos'); }
            },
            {
              key: 'assiduidade',
              icon: '📊',
              label: 'Assiduidade Geral',
              value: `${metricas.taxaPresencaMedia ?? 100}%`,
              sub: 'Chamada & Frequência →',
              status: 'accent',
              pct: Number(metricas.taxaPresencaMedia ?? 100),
              onClick: () => setAbaAtiva('chamada_diaria')
            },
            {
              key: 'risco',
              icon: '⚠️',
              label: 'Alunos em Risco',
              value: metricas.alunosEmRisco || 0,
              sub: 'Frequência < 50% →',
              status: (metricas.alunosEmRisco || 0) > 0 ? 'full' : 'available',
              pct: metricas.totalAlunos > 0 ? Math.round(((metricas.alunosEmRisco || 0) / metricas.totalAlunos) * 100) : 0,
              onClick: () => { setAbaAtiva('alunos'); setFiltroAssiduidade('RISCO'); }
            }
          ];

          const adminTabs = isAtendente
            ? [
                { id: 'alunos', num: '01', icon: '👥', label: `Alunos & Matrícula (${alunos.length})`, activeMatch: abaAtiva === 'alunos' },
                { id: 'agendamentos', num: '02', icon: '🎯', label: 'Leads & Aulas Exp.', activeMatch: abaAtiva === 'agendamentos' },
                { id: 'chamada_diaria', num: '03', icon: '✅', label: 'Check-ins & Chamada', activeMatch: ['chamada_diaria', 'calendario_geral', 'presencas'].includes(abaAtiva) },
                { id: 'ocupacao', num: '04', icon: '🔥', label: 'Ocupação de Turmas', activeMatch: abaAtiva === 'ocupacao' },
                { id: 'resgates_loja', num: '05', icon: '🎟️', label: 'Vouchers & Retiradas', activeMatch: abaAtiva === 'resgates_loja' },
                { id: 'avisos', num: '06', icon: '📢', label: `Mural de Avisos (${avisos.length})`, activeMatch: abaAtiva === 'avisos' }
              ]
            : [
                { id: 'alunos', num: '01', icon: '👥', label: `Alunos (${alunos.length})`, activeMatch: abaAtiva === 'alunos' },
                { id: 'chamada_diaria', num: '02', icon: '✅', label: 'Chamada & Frequência', activeMatch: ['chamada_diaria', 'calendario_geral', 'presencas'].includes(abaAtiva) },
                ...(isAdminRole ? [
                  { id: 'financeiro_gestao', num: '03', icon: '💰', label: 'Gestão Financeira & Baixa', activeMatch: abaAtiva === 'financeiro_gestao' },
                  { id: 'caixa_diario', num: '04', icon: '💵', label: 'Caixa Diário (PDV)', activeMatch: abaAtiva === 'caixa_diario' },
                  { id: 'comissoes', num: '05', icon: '🥋', label: 'Comissões Professores', activeMatch: abaAtiva === 'comissoes' }
                ] : []),
                { id: 'ocupacao', num: '06', icon: '🔥', label: 'Ocupação de Turmas', activeMatch: abaAtiva === 'ocupacao' },
                { id: 'resgates_loja', num: '07', icon: '🎟️', label: 'Vouchers & Retiradas', activeMatch: abaAtiva === 'resgates_loja' },
                { id: 'avisos', num: '08', icon: '📢', label: `Mural de Avisos (${avisos.length})`, activeMatch: abaAtiva === 'avisos' },
                { id: 'loja', num: '09', icon: '🛍️', label: 'Loja & Mercado', activeMatch: abaAtiva === 'loja' },
                { id: 'agendamentos', num: '10', icon: '🎯', label: 'Leads & Aulas Exp.', activeMatch: abaAtiva === 'agendamentos' },
                { id: 'gamificacao', num: '11', icon: '🏆', label: 'Gestão de Gamificação', activeMatch: abaAtiva === 'gamificacao' },
                { id: 'aparencia_layouts', num: '12', icon: '🎨', label: 'Estúdio & Temas', activeMatch: abaAtiva === 'aparencia_layouts' },
                ...(isAdminRole ? [{ id: 'professores', num: '13', icon: '👑', label: 'Professores & Equipe', activeMatch: abaAtiva === 'professores' }] : []),
                ...(isDevRole ? [{ id: 'dev_dashboard', num: '14', icon: '💻', label: 'Dev Dashboard', activeMatch: abaAtiva === 'dev_dashboard' }] : [])
              ];

          const getStatusColor = (s: string) => {
            if (s === 'available') return 'var(--status-available)';
            if (s === 'full') return 'var(--status-full)';
            if (s === 'accent') return 'var(--color-accent)';
            return 'var(--color-primary)';
          };

          if (adminPreset === 'executive') {
            return (
              <>
                {/* LAYOUT 1: CARDS ESCOLARES ARREDONDADOS EM PÍLULA COM MEDALHA CIRCULAR */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))', gap: '0.75rem' }}>
                  {kpis.map(k => (
                    <button
                      key={k.key}
                      type="button"
                      onClick={k.onClick}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        textAlign: 'left',
                        padding: '0.85rem 1rem',
                        borderRadius: '24px',
                        background: 'var(--bg-surface-1)',
                        border: '2px solid var(--border-subtle)',
                        boxShadow: 'var(--shadow-card)',
                        cursor: 'pointer'
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: 'var(--bg-background)',
                          border: `2px solid ${getStatusColor(k.status)}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.15rem',
                          flexShrink: 0
                        }}
                      >
                        {k.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted-foreground)' }}>
                          {k.label}
                        </div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 900, color: getStatusColor(k.status), lineHeight: 1.1 }}>
                          {k.value}
                        </div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted-foreground)', marginTop: '0.1rem' }}>
                          {k.sub}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Atalho Mobile / Tablet em Pílulas Escolares (Desktop usa Sidebar à Esquerda) */}
                <div className="flex lg:hidden gap-2 overflow-x-auto boru-scrollbar pb-1">
                  {adminTabs.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAbaAtiva(t.id)}
                      style={{
                        padding: '0.5rem 0.9rem',
                        borderRadius: '999px',
                        whiteSpace: 'nowrap',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        background: t.activeMatch ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                        color: t.activeMatch ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </>
            );
          }

          if (adminPreset === 'operational_360') {
            return (
              <>
                {/* LAYOUT 2: COMMAND CENTER TÁTICO 360° (GAUGES COM BARRA DE PROGRESSO & GRADE DE HOTKEYS) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 195px), 1fr))', gap: '0.75rem' }}>
                  {kpis.map(k => (
                    <div
                      key={k.key}
                      onClick={k.onClick}
                      style={{
                        cursor: 'pointer',
                        padding: '0.9rem 1rem',
                        borderRadius: '10px',
                        background: 'var(--bg-surface-1)',
                        border: '1px solid var(--border-subtle)',
                        borderBottom: `3px solid ${getStatusColor(k.status)}`,
                        boxShadow: 'var(--shadow-card)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.64rem', fontWeight: 900, fontFamily: 'monospace', color: 'var(--text-muted-foreground)', textTransform: 'uppercase' }}>
                          {k.label}
                        </span>
                        <span>{k.icon}</span>
                      </div>
                      <div style={{ fontSize: '1.65rem', fontWeight: 900, color: getStatusColor(k.status), margin: '0.2rem 0' }}>
                        {k.value}
                      </div>
                      <div style={{ height: '5px', borderRadius: '2px', background: 'var(--bg-background)', overflow: 'hidden', marginBottom: '0.35rem' }}>
                        <div style={{ width: `${Math.min(100, Math.max(8, k.pct))}%`, height: '100%', background: getStatusColor(k.status) }} />
                      </div>
                      <div style={{ fontSize: '0.64rem', fontWeight: 700, color: 'var(--text-muted-foreground)' }}>
                        {k.sub}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grade Tática de Acesso Rápido [01..13] */}
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-1)',
                    border: '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 165px), 1fr))',
                    gap: '0.45rem'
                  }}
                >
                  {adminTabs.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAbaAtiva(t.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.55rem 0.7rem',
                        borderRadius: '6px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        background: t.activeMatch ? 'var(--color-primary)' : 'var(--bg-background)',
                        color: t.activeMatch ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                        border: t.activeMatch ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                        fontSize: '0.72rem',
                        fontWeight: 900
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', fontSize: '0.64rem', opacity: 0.75 }}>{t.num}</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.icon} {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            );
          }

          if (adminPreset === 'customizer_studio') {
            return (
              <>
                {/* LAYOUT 3: BALANCETE EXECUTIVO FORMAL B2B (0PX SHARP GRID & ÍNDICE TABULAR) */}
                <section
                  style={{
                    borderRadius: '0px',
                    background: 'var(--bg-surface-1)',
                    border: '1px solid var(--border-subtle)',
                    borderTop: '4px solid var(--color-primary)',
                    padding: '1.1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.1em', color: 'var(--color-primary)' }}>
                      BALANCETE OPERACIONAL B2B · INDICADORES CONSOLIDADOS
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.66rem', color: 'var(--text-muted-foreground)' }}>
                      CLIQUE EM QUALQUER INDICADOR PARA FILTRAR
                    </span>
                  </div>

                  <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-background)', borderBottom: '2px solid var(--color-primary)' }}>
                          <th style={{ padding: '0.6rem 0.85rem' }}>INDICADOR ERP</th>
                          <th style={{ padding: '0.6rem 0.85rem' }}>VALOR ATUAL</th>
                          <th style={{ padding: '0.6rem 0.85rem' }}>AÇÃO DIRETA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kpis.map((k, idx) => (
                          <tr
                            key={k.key}
                            onClick={k.onClick}
                            style={{
                              cursor: 'pointer',
                              borderBottom: '1px solid var(--border-subtle)',
                              background: idx % 2 === 0 ? 'var(--bg-surface-1)' : 'var(--bg-background)'
                            }}
                          >
                            <td style={{ padding: '0.55rem 0.85rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                              {k.icon} {k.label}
                            </td>
                            <td style={{ padding: '0.55rem 0.85rem', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.95rem', color: getStatusColor(k.status) }}>
                              {k.value}
                            </td>
                            <td style={{ padding: '0.55rem 0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                              {k.sub}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Índice B2B Formal sem Cantos Arredondados */}
                  <div
                    className="flex gap-1 overflow-x-auto boru-scrollbar mt-4"
                    style={{ borderBottom: '2px solid var(--border-subtle)' }}
                  >
                    {adminTabs.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setAbaAtiva(t.id)}
                        style={{
                          padding: '0.6rem 0.9rem',
                          borderRadius: '0px',
                          whiteSpace: 'nowrap',
                          fontSize: '0.74rem',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          background: t.activeMatch ? 'var(--color-primary)' : 'transparent',
                          color: t.activeMatch ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)',
                          border: 'none',
                          borderBottom: t.activeMatch ? '3px solid var(--color-primary)' : '3px solid transparent'
                        }}
                      >
                        {t.num}. {t.label}
                      </button>
                    ))}
                  </div>
                </section>
              </>
            );
          }

          /* LAYOUT 4: CLÁSSICO ERP ADAPTADO 100% ÀS VARIÁVEIS DO TEMA ATIVO */
          return (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {kpis.map((k, idx) => (
                  <div
                    key={k.key}
                    onClick={k.onClick}
                    className={`rounded-xl p-3 sm:p-4 cursor-pointer transition group ${idx === kpis.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
                    style={{
                      background: 'var(--bg-surface-1)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-card)'
                    }}
                    title={k.sub}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted-foreground)' }}>
                        {k.label}
                      </p>
                      <span className="text-xs">{k.icon}</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black" style={{ color: getStatusColor(k.status) }}>
                      {k.value}
                    </p>
                    <span className="text-[10px] block mt-0.5" style={{ color: 'var(--text-muted-foreground)' }}>
                      {k.sub}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="relative flex items-center gap-1.5 rounded-2xl p-2 shadow-xl"
                style={{
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <button
                  type="button"
                  onClick={() => scrollTabs('left')}
                  title="Deslizar abas para a esquerda"
                  className="shrink-0 w-8 h-9 rounded-xl flex items-center justify-center font-black text-base transition shadow-sm cursor-pointer"
                  style={{
                    background: 'var(--bg-background)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  ‹
                </button>

                <div
                  ref={tabsScrollRef}
                  className="flex gap-2 sm:gap-2.5 pb-2 pt-0.5 px-1 overflow-x-auto boru-scrollbar scroll-smooth flex-1"
                >
                  {adminTabs.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAbaAtiva(t.id)}
                      className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                      style={{
                        background: t.activeMatch ? 'var(--color-primary)' : 'var(--bg-background)',
                        color: t.activeMatch ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)',
                        border: t.activeMatch ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => scrollTabs('right')}
                  title="Deslizar abas para a direita"
                  className="shrink-0 w-8 h-9 rounded-xl flex items-center justify-center font-black text-base transition shadow-sm cursor-pointer"
                  style={{
                    background: 'var(--bg-background)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  ›
                </button>
              </div>
            </>
          );
        })()}

        {/* SUB-BARRA UNIFICADA DE CHAMADA & FREQUÊNCIA (ELIMINA REDUNDÂNCIAS) */}
        {['chamada_diaria', 'calendario_geral', 'presencas'].includes(abaAtiva) && (
          <div className="bg-[#141416] border border-zinc-800 rounded-2xl p-2.5 sm:p-3 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 overflow-x-auto boru-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs font-black text-zinc-300 hidden sm:inline mr-1">Visão:</span>
              <button
                type="button"
                onClick={() => setAbaAtiva('chamada_diaria')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  abaAtiva === 'chamada_diaria'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                    : 'bg-[#1A1A1E] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <span>✅ Chamada de Hoje (Split-List)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAbaAtiva('calendario_geral');
                  if (!frequenciaGeral) {
                    carregarFrequenciaGeral(mesFrequenciaGeral, anoFrequenciaGeral);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  abaAtiva === 'calendario_geral'
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                    : 'bg-[#1A1A1E] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <span>📅 Calendário Geral Mensal</span>
              </button>

              <button
                type="button"
                onClick={() => setAbaAtiva('presencas')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  abaAtiva === 'presencas'
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                    : 'bg-[#1A1A1E] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <span>📋 Histórico de Check-ins ({presencas.length})</span>
              </button>
            </div>

            <span className="text-[11px] text-zinc-500 font-medium hidden md:inline">
              {abaAtiva === 'chamada_diaria' && 'Lista rápida: quem já treinou hoje e quem falta'}
              {abaAtiva === 'calendario_geral' && 'Frequência da academia dia a dia com roster completo'}
              {abaAtiva === 'presencas' && 'Tabela detalhada com filtros e ações em lote'}
            </span>
          </div>
        )}

        {/* MÓDULO 6: CHAMADA DIÁRIA SPLIT-LIST */}
        {abaAtiva === 'chamada_diaria' && (
          <SplitRollCallTab onRefreshDashboard={carregarDashboard} />
        )}

        {/* MÓDULO 5: GESTÃO FINANCEIRA & BAIXA MANUAL COM CALENDÁRIO */}
        {abaAtiva === 'financeiro_gestao' && usuarioLogado?.cargo === 'ADMIN' && (
          <FinancialDashboardTab
            onRefreshGlobal={carregarDashboard}
            usuarioLogadoNome={usuarioLogado?.nome || 'Administração'}
          />
        )}

        {/* MÓDULO 1: DEV DASHBOARD (EXCLUSIVO ADMINDEV / BRGADMIN) */}
        {abaAtiva === 'dev_dashboard' && (usuarioLogado?.is_dev || usuarioLogado?.email === 'brgadmin@boru.com') && (
          <DevDashboardTab usuarioLogado={usuarioLogado} />
        )}

        {/* CONTEÚDO DA ABA: ALUNOS */}
        {abaAtiva === 'alunos' && (
          <div className="bg-[#141416] border border-zinc-800 rounded-xl overflow-hidden shadow-xl space-y-4 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>👥 Alunos Matriculados</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    {alunosFiltrados.length} de {alunos.length}
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Acompanhe frequência individual mensal, retenção de alunos e planos ativos.
                </p>
              </div>

              {/* BARRA DE PESQUISA RÁPIDA */}
              <div className="w-full sm:w-72">
                <input
                  type="text"
                  value={buscaAluno}
                  onChange={(e) => setBuscaAluno(e.target.value)}
                  placeholder="🔍 Buscar aluno por nome, CPF ou telefone..."
                  className="w-full bg-[#1A1A1E] border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition"
                />
              </div>
            </div>

            {/* FILTROS DE ASSIDUIDADE E CATEGORIA */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setFiltroAssiduidade('TODOS')}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                  filtroAssiduidade === 'TODOS'
                    ? 'bg-zinc-700 text-white'
                    : 'bg-[#1A1A1E] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                Todos ({alunos.length})
              </button>
              <button
                onClick={() => setFiltroAssiduidade('ATIVO')}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  filtroAssiduidade === 'ATIVO'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1A1A1E] text-emerald-400 hover:text-white border border-emerald-900/40'
                }`}
              >
                <span>🟢 Ativos (Treinando)</span>
                <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full">
                  {alunos.filter(a => a.statusAtividade === 'ATIVO' || (a.diasSemTreinar !== undefined && a.diasSemTreinar < 14)).length}
                </span>
              </button>
              <button
                onClick={() => setFiltroAssiduidade('INATIVO')}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  filtroAssiduidade === 'INATIVO'
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#1A1A1E] text-amber-400 hover:text-white border border-amber-900/40'
                }`}
              >
                <span>⚠️ Inativos (2 a 3 sem sem treinar)</span>
                <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full">
                  {alunos.filter(a => a.statusAtividade === 'INATIVO' || (a.diasSemTreinar !== undefined && a.diasSemTreinar >= 14)).length}
                </span>
              </button>
              <button
                onClick={() => setFiltroAssiduidade('ALTA')}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  filtroAssiduidade === 'ALTA'
                    ? 'bg-green-600 text-white'
                    : 'bg-[#1A1A1E] text-green-400 hover:text-white border border-green-900/40'
                }`}
              >
                <span>🟢 Alta Presença (≥ 75%)</span>
                <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full">
                  {alunos.filter(a => a.statusAssiduidade === 'ALTA').length}
                </span>
              </button>
              <button
                onClick={() => setFiltroAssiduidade('REGULAR')}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  filtroAssiduidade === 'REGULAR'
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#1A1A1E] text-amber-400 hover:text-white border border-amber-900/40'
                }`}
              >
                <span>🟡 Regular (50% a 74%)</span>
                <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full">
                  {alunos.filter(a => a.statusAssiduidade === 'REGULAR').length}
                </span>
              </button>
              <button
                onClick={() => setFiltroAssiduidade('RISCO')}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  filtroAssiduidade === 'RISCO'
                    ? 'bg-red-600 text-white'
                    : 'bg-[#1A1A1E] text-red-400 hover:text-white border border-red-900/40'
                }`}
              >
                <span>🔴 Em Risco (&lt; 50%)</span>
                <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full">
                  {alunos.filter(a => a.statusAssiduidade === 'RISCO').length}
                </span>
              </button>
              <button
                onClick={() => setFiltroAssiduidade('DIARIA')}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  filtroAssiduidade === 'DIARIA'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-[#1A1A1E] text-cyan-400 hover:text-white border border-cyan-900/40'
                }`}
              >
                <span>⚡ Diárias & Passes</span>
                <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full">
                  {alunos.filter(a => isDiariaOuConvenio(a.plano)).length}
                </span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#1A1A1E] text-zinc-400 uppercase text-[11px] tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="p-3 sm:p-4">Aluno</th>
                    <th className="p-3 sm:p-4">Plano</th>
                    <th className="p-3 sm:p-4">Prajied</th>
                    <th className="p-3 sm:p-4">Mensalidade</th>
                    <th className="p-3 sm:p-4">Frequência no Mês</th>
                    <th className="p-3 sm:p-4 text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {alunosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-500">
                        Nenhum aluno encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    alunosFiltrados.map(aluno => (
                      <tr key={aluno.id} className="hover:bg-zinc-800/30 transition">
                        <td className="p-3 sm:p-4 font-bold text-white">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>{aluno.nome}</span>
                            {aluno.is_bolsista && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-950 text-purple-300 border border-purple-500/40" title="Aluno Bolsista (Isento de mensalidades)">
                                🎓 BOLSISTA
                              </span>
                            )}
                            {aluno.statusAssiduidade === 'RISCO' && !isDiariaOuConvenio(aluno.plano) && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-red-950 text-red-400 border border-red-500/40" title="Aluno com frequência menor que 50%">
                                RISCO
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-normal mt-0.5">
                            {aluno.telefone || 'Sem telefone'} {aluno.cpf ? `• CPF: ${aluno.cpf}` : ''}
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 text-zinc-300 font-medium">
                          <select 
                            value={aluno.plano || '2x na semana'}
                            onChange={(e) => atualizarPlanoAluno(aluno.id, e.target.value)}
                            className="bg-[#1A1A1E] border border-zinc-700 text-white text-xs rounded-lg px-2 py-1 font-semibold focus:border-red-500 outline-none"
                          >
                            <option value="2x na semana">2x na semana (R$ 130)</option>
                            <option value="3x na semana">3x na semana (R$ 160)</option>
                            <option value="Todos os Horários">Todos os Horários (R$ 280)</option>
                            <option value="Diária">Diária Avulsa (R$ 40/aula)</option>
                            <option value="Wellhub">Wellhub / Gympass</option>
                            <option value="TotalPass">TotalPass</option>
                          </select>
                        </td>
                        <td className="p-3 sm:p-4">
                          <select 
                            value={aluno.prajied || 'Branco'}
                            onChange={(e) => atualizarPrajied(aluno.id, e.target.value)}
                            className="bg-[#1A1A1E] border border-zinc-700 text-white text-xs rounded-lg px-2 py-1 font-semibold focus:border-red-500 outline-none"
                          >
                            <option value="Branco">Branco</option>
                            <option value="Branco e Vermelho">Branco e Vermelho</option>
                            <option value="Vermelho">Vermelho</option>
                            <option value="Vermelho e Azul">Vermelho e Azul</option>
                            <option value="Azul Claro">Azul Claro</option>
                            <option value="Azul Escuro">Azul Escuro</option>
                            <option value="Preto">Preto</option>
                          </select>
                        </td>
                        <td className="p-3 sm:p-4">
                          {aluno.is_bolsista ? (
                            <>
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                🎓 BOLSISTA
                              </span>
                              <span className="block text-[10px] text-zinc-400 mt-0.5 font-medium">
                                Isento • Acesso Liberado
                              </span>
                            </>
                          ) : isDiariaOuConvenio(aluno.plano) ? (
                            <>
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                ⚡ Diária / Convênio
                              </span>
                              <span className="block text-[10px] text-zinc-400 mt-0.5 font-medium">
                                {aluno.plano?.toLowerCase().includes('wellhub') ? 'Check-in Wellhub' :
                                 aluno.plano?.toLowerCase().includes('totalpass') ? 'Check-in TotalPass' :
                                 'R$ 40 avulso p/ treino'}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                aluno.status === 'PAGO' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {aluno.status}
                              </span>
                              {aluno.diasVencimento !== null && (
                                <span className="block text-[10px] text-zinc-400 mt-0.5">
                                  {aluno.diasVencimento < 0 ? `Venceu há ${Math.abs(aluno.diasVencimento)}d` : `Vence em ${aluno.diasVencimento}d`}
                                </span>
                              )}
                            </>
                          )}
                        </td>
                        {/* FREQUÊNCIA & PORCENTAGEM DE PRESENÇA NO MÊS */}
                        <td className="p-3 sm:p-4">
                          {isDiariaOuConvenio(aluno.plano) ? (
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-cyan-300">
                                  ⚡ {aluno.treinosSemana || 0} treino(s)
                                </span>
                                <span className="text-[10px] text-zinc-500 font-medium">esta semana</span>
                              </div>
                              <span className="block text-[10px] text-zinc-400 mt-0.5">
                                Total no mês: <strong className="text-zinc-200">{aluno.presencasMes || 0}</strong>
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <span className={
                                  aluno.statusAssiduidade === 'RISCO' ? 'text-red-400' :
                                  aluno.statusAssiduidade === 'REGULAR' ? 'text-amber-400' : 'text-green-400'
                                }>
                                  {aluno.porcentagemPresenca ?? 100}%
                                </span>
                                <span className="text-[10px] text-zinc-400 font-normal">
                                  {aluno.presencasMes || 0} presenças
                                  {aluno.faltasMes > 0 && <span className="text-red-400 ml-1">({aluno.faltasMes} faltas)</span>}
                                </span>
                              </div>
                              <div className="w-28 sm:w-32 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    aluno.statusAssiduidade === 'RISCO' ? 'bg-red-500' :
                                    aluno.statusAssiduidade === 'REGULAR' ? 'bg-amber-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(aluno.porcentagemPresenca ?? 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="p-3 sm:p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {(aluno.statusAtividade === 'INATIVO' || (aluno.diasSemTreinar !== undefined && aluno.diasSemTreinar >= 14)) && (
                              <button
                                onClick={() => handleChamarDeVolta(aluno)}
                                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition flex items-center gap-1 shadow-sm"
                                title="Enviar mensagem de retorno aos treinos no WhatsApp"
                              >
                                <span>🥊 Chamar de Volta</span>
                              </button>
                            )}
                            <button
                              onClick={() => setAluno360Id(aluno.id)}
                              className="px-2.5 py-1 rounded bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white border border-red-500/40 text-xs font-black transition flex items-center gap-1"
                              title="Abrir Visão 360° do Aluno (Contratos, Graduações, Wallet de Points e Frequência)"
                            >
                              <span>🔍 Visão 360°</span>
                            </button>
                            <button 
                              onClick={() => abrirCalendarioAluno(aluno)}
                              className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-bold transition flex items-center gap-1"
                              title="Ver frequência e calendário detalhado"
                            >
                              <span>📅 Calendário</span>
                            </button>
                            <button 
                              onClick={() => handleRegistrarPagamento(aluno)}
                              className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-xs font-bold transition"
                              title="Confirmar pagamento presencial (balcão) com escolha de data no Calendário"
                            >
                              💵 Pago (+30d)
                            </button>
                            <button
                              onClick={() => handleToggleBolsista(aluno)}
                              className={`px-2 py-1 rounded border text-[11px] font-bold transition ${
                                aluno.is_bolsista
                                  ? 'bg-purple-600 text-white border-purple-400'
                                  : 'bg-purple-950/30 text-purple-300 border-purple-500/30 hover:bg-purple-600 hover:text-white'
                              }`}
                              title="Alternar status de Aluno Bolsista (Isento de cobranças)"
                            >
                              🎓 {aluno.is_bolsista ? 'Bolsista ✓' : 'Bolsista'}
                            </button>
                            {aluno.statusAssiduidade === 'RISCO' && !isDiariaOuConvenio(aluno.plano) ? (
                              <button 
                                onClick={() => handleMensagemAssiduidade(aluno)}
                                className="px-2.5 py-1 rounded bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white border border-red-500/40 text-xs font-bold transition flex items-center gap-1"
                                title="Enviar mensagem de incentivo e reengajamento via WhatsApp"
                              >
                                <span>⚠️ Resgatar</span>
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleCobrar(aluno)}
                                className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-xs font-bold transition"
                                title="Enviar lembrete via WhatsApp"
                              >
                                📲 WhatsApp
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA: CALENDÁRIO DA ACADEMIA & FREQUÊNCIA GERAL */}
        {abaAtiva === 'calendario_geral' && (
          <div className="space-y-5">
            {/* SELETOR DE MODO DO CALENDÁRIO: GRADE DE HORÁRIOS vs ROSTER COLETIVO */}
            <div className="bg-[#141416] border border-zinc-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSubAbaCalendario('grade_aulas')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                    subAbaCalendario === 'grade_aulas'
                      ? 'bg-[var(--color-primary)] text-[var(--color-btn-text)] shadow-lg'
                      : 'bg-[#1A1A1E] text-zinc-300 hover:text-white border border-zinc-800'
                  }`}
                >
                  <span>📅 Grade de Horários, Check-ins & Vagas (Multi-Academias)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubAbaCalendario('frequencia_mensal')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                    subAbaCalendario === 'frequencia_mensal'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                      : 'bg-[#1A1A1E] text-zinc-300 hover:text-white border border-zinc-800'
                  }`}
                >
                  <span>📋 Roster Geral por Dia (Lançamento em Lote)</span>
                </button>
              </div>
              <span className="text-[11px] text-zinc-400">
                Clique em qualquer dia da grade para ver horários, cancelar aula (riscar) ou marcar presença na turma
              </span>
            </div>

            {subAbaCalendario === 'grade_aulas' ? (
              <InteractiveCombatCalendar
                userRole={usuarioLogado?.cargo === 'ADMIN' ? 'ADMIN' : 'PROFESSOR'}
                usuarioProfessor={usuarioLogado}
                onRefreshExternal={() => {
                  carregarDashboard();
                  carregarFrequenciaGeral(mesFrequenciaGeral, anoFrequenciaGeral);
                }}
              />
            ) : (
              <div className="space-y-5">
            {/* CABEÇALHO DO CALENDÁRIO GERAL */}
            <div className="bg-[#141416] border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <span>📅 Calendário Geral da Academia</span>
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    Visão Coletiva
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Acompanhe a assiduidade diária de todas as turmas, faltas coletivas e confirme presenças em lote.
                </p>
              </div>

              {/* SELETOR DE MÊS & AÇÃO RÁPIDA */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-[#1A1A1E] border border-zinc-700 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => mudarMesFrequenciaGeral(-1)}
                    className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 font-bold text-xs transition"
                  >
                    ← Mês Anterior
                  </button>
                  <span className="px-3 py-2 text-white font-black text-xs border-x border-zinc-700">
                    {new Date(anoFrequenciaGeral, mesFrequenciaGeral - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
                  </span>
                  <button 
                    onClick={() => mudarMesFrequenciaGeral(1)}
                    className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 font-bold text-xs transition"
                  >
                    Próximo Mês →
                  </button>
                </div>

                <button 
                  onClick={() => {
                    setModoLancarDia('LOTE');
                    setModalLancarDia(true);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
                >
                  <span>📋 Abrir Tabela em Lote (+ Alunos)</span>
                </button>

                <button 
                  onClick={() => {
                    setModoLancarDia('INDIVIDUAL');
                    setModalLancarDia(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-900/30"
                >
                  <span>➕ Lançar Individual</span>
                </button>
              </div>
            </div>

            {/* BANNER DE RESUMO DO MÊS COLETIVO */}
            {frequenciaGeral?.resumo && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-[#141416] border border-zinc-800 rounded-xl p-3.5">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Aulas Realizadas</p>
                  <p className="text-2xl font-black text-green-400 mt-0.5">{frequenciaGeral.resumo.totalPresentes}</p>
                  <span className="text-[10px] text-zinc-500">Presenças confirmadas</span>
                </div>
                <div className="bg-[#141416] border border-zinc-800 rounded-xl p-3.5">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Taxa de Assiduidade</p>
                  <p className="text-2xl font-black text-cyan-400 mt-0.5">{frequenciaGeral.resumo.taxaGeral}%</p>
                  <span className="text-[10px] text-zinc-500">Média geral do mês</span>
                </div>
                <div className="bg-[#141416] border border-zinc-800 rounded-xl p-3.5">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Faltas no Mês</p>
                  <p className="text-2xl font-black text-red-400 mt-0.5">{frequenciaGeral.resumo.totalFaltas}</p>
                  <span className="text-[10px] text-zinc-500">Ausências sem atestado</span>
                </div>
                <div className="bg-[#141416] border border-zinc-800 rounded-xl p-3.5">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Atestados Médicos</p>
                  <p className="text-2xl font-black text-blue-400 mt-0.5">{frequenciaGeral.resumo.totalDoenca}</p>
                  <span className="text-[10px] text-zinc-500">Doença / justificados</span>
                </div>
                <div className="bg-[#141416] border border-zinc-800 rounded-xl p-3.5 col-span-2 sm:col-span-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Dias com Treino</p>
                  <p className="text-2xl font-black text-amber-400 mt-0.5">{frequenciaGeral.resumo.diasComTreino}</p>
                  <span className="text-[10px] text-zinc-500">Dias ativos na academia</span>
                </div>
              </div>
            )}

            {/* GRID DO CALENDÁRIO COLETIVO + PAINEL DO DIA SELECIONADO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* COLUNA ESQUERDA: GRADE MENSAL (2/3) */}
              <div className="lg:col-span-2 bg-[#141416] border border-zinc-800 rounded-xl p-4 sm:p-5 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Grade do Mês</span>
                    <span className="text-xs text-zinc-400 font-normal">
                      (Clique em qualquer dia para ver a lista de presença e lançar notas)
                    </span>
                  </h3>
                </div>

                {loadingFrequenciaGeral ? (
                  <div className="py-16 text-center text-zinc-400 text-sm">
                    Carregando frequência do mês...
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      <div className="text-red-400">Dom</div>
                      <div>Seg</div>
                      <div>Ter</div>
                      <div>Qua</div>
                      <div>Qui</div>
                      <div>Sex</div>
                      <div>Sáb</div>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5">
                      {Array.from({ length: new Date(anoFrequenciaGeral, mesFrequenciaGeral - 1, 1).getDay() }).map((_, i) => (
                        <div key={`emp-g-${i}`} className="min-h-[75px] rounded-lg bg-zinc-900/30 border border-zinc-900"></div>
                      ))}

                      {Array.from({ length: new Date(anoFrequenciaGeral, mesFrequenciaGeral, 0).getDate() }).map((_, i) => {
                        const dia = i + 1;
                        const dataIso = `${anoFrequenciaGeral}-${String(mesFrequenciaGeral).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
                        const diaInfo = frequenciaGeral?.mapaDias?.[dataIso];
                        const hojeIso = new Date().toISOString().split('T')[0];
                        const ehHoje = dataIso === hojeIso;
                        const estaSelecionado = diaSelecionadoGeral === dataIso;

                        return (
                          <div
                            key={`dia-g-${dia}`}
                            onClick={() => setDiaSelecionadoGeral(dataIso)}
                            className={`min-h-[86px] p-2 rounded-lg border text-left flex flex-col justify-between transition group relative cursor-pointer ${
                              estaSelecionado
                                ? 'bg-red-950/40 border-red-500 shadow-md shadow-red-950/50 ring-1 ring-red-500'
                                : diaInfo?.total && diaInfo.total > 0
                                  ? 'bg-[#1A1A1E] border-zinc-700/80 hover:border-zinc-500'
                                  : 'bg-[#141416] border-zinc-800/80 hover:border-zinc-700 text-zinc-600'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full gap-1">
                              <span className={`text-xs font-black ${
                                estaSelecionado ? 'text-white' : ehHoje ? 'text-red-400' : 'text-zinc-300'
                              }`}>
                                {dia}
                              </span>
                              <div className="flex items-center gap-1">
                                {ehHoje && (
                                  <span className="text-[8px] font-black bg-red-600 text-white px-1 py-0.2 rounded">
                                    Hoje
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDiaSelecionadoGeral(dataIso);
                                    setModoLancarDia('LOTE');
                                    setModalLancarDia(true);
                                  }}
                                  title={`Abrir tabela completa para adicionar alunos em ${dia}/${mesFrequenciaGeral}`}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-black transition flex items-center gap-0.5 ${
                                    estaSelecionado
                                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                                      : 'bg-zinc-800/90 hover:bg-emerald-600 text-zinc-300 hover:text-white opacity-85 group-hover:opacity-100'
                                  }`}
                                >
                                  <span>+Tabela</span>
                                </button>
                              </div>
                            </div>

                            {diaInfo?.total && diaInfo.total > 0 ? (
                              <div className="space-y-1 w-full mt-1">
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                  <span className="text-green-400">✓ {diaInfo.presentes}</span>
                                  {diaInfo.faltas > 0 && <span className="text-red-400">✗ {diaInfo.faltas}</span>}
                                  {diaInfo.doenca > 0 && <span className="text-blue-400">🩺 {diaInfo.doenca}</span>}
                                </div>
                                <div className="flex items-center justify-between text-[9px] text-zinc-400">
                                  <span>{diaInfo.taxaPresenca}% freq.</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-[10px] text-zinc-600 italic mt-auto">
                                Sem registros
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* COLUNA DIREITA: ROSTER DO DIA SELECIONADO (1/3) */}
              <div className="bg-[#141416] border border-zinc-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col">
                <div className="border-b border-zinc-800 pb-3 mb-4 flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-500 block">Chamada do Dia</span>
                    <h3 className="text-base font-black text-white">
                      {new Date(diaSelecionadoGeral + 'T12:00:00').toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long'
                      })}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button 
                      onClick={() => {
                        setModoLancarDia('LOTE');
                        setModalLancarDia(true);
                      }}
                      className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black transition flex items-center gap-1 shadow-sm"
                      title="Abrir tabela completa para adicionar vários alunos presentes de uma vez"
                    >
                      <span>📋 Tabela em Lote</span>
                    </button>
                    <button 
                      onClick={() => {
                        setModoLancarDia('INDIVIDUAL');
                        setModalLancarDia(true);
                      }}
                      className="px-2.5 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-sm"
                    >
                      <span>➕ Lançar Aluno</span>
                    </button>
                  </div>
                </div>

                {/* RESUMO DO DIA */}
                {frequenciaGeral?.mapaDias?.[diaSelecionadoGeral] ? (
                  <div className="space-y-3 flex-1 flex flex-col">
                    <div className="bg-[#1A1A1E] border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Total de Treinos</span>
                        <strong className="text-white text-base">
                          {frequenciaGeral.mapaDias[diaSelecionadoGeral].total}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-400 block text-[10px]">Presença do Dia</span>
                        <strong className="text-green-400 text-base">
                          {frequenciaGeral.mapaDias[diaSelecionadoGeral].taxaPresenca}%
                        </strong>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={buscaAlunoDiaGeral}
                        onChange={(e) => setBuscaAlunoDiaGeral(e.target.value)}
                        placeholder="🔍 Filtrar aluno neste dia por nome..."
                        className="w-full bg-[#1A1A1E] border border-zinc-800 focus:border-red-500 rounded-lg pl-3 pr-8 py-1.5 text-xs text-white placeholder-zinc-500 outline-none"
                      />
                      {buscaAlunoDiaGeral && (
                        <button
                          type="button"
                          onClick={() => setBuscaAlunoDiaGeral('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[420px] space-y-2 pr-1 boru-scrollbar">
                      {frequenciaGeral.mapaDias[diaSelecionadoGeral].alunos
                        .filter((item: any) => {
                          if (!buscaAlunoDiaGeral.trim()) return true;
                          const t = buscaAlunoDiaGeral.trim().toLowerCase();
                          return (
                            (item.nome && item.nome.toLowerCase().includes(t)) ||
                            (item.plano && item.plano.toLowerCase().includes(t))
                          );
                        })
                        .map((item: any) => (
                        <div 
                          key={item.id}
                          className="bg-[#1A1A1E] border border-zinc-800 hover:border-zinc-700 rounded-lg p-3 transition"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div>
                              <h4 className="text-xs font-bold text-white">{item.nome}</h4>
                              <p className="text-[10px] text-zinc-400">{item.plano} • Prajied {item.prajied}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === 'PRESENTE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              item.status === 'DOENCA' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              item.status === 'FALTA' || item.status === 'AUSENTE' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {item.status}
                            </span>
                          </div>

                          {item.justificativa && (
                            <p className="text-[10px] text-zinc-400 italic mb-2 bg-black/40 p-1.5 rounded">
                              Motivo: {item.justificativa}
                            </p>
                          )}

                          {/* BOTÕES DE AÇÃO RÁPIDA NO ROSTER */}
                          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 gap-1">
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleAlterarStatusPresenca(item.id, 'PRESENTE')}
                                className="px-2 py-0.5 rounded bg-green-950 text-green-300 hover:bg-green-800 text-[10px] font-bold border border-green-700/40"
                                title="Marcar como presente"
                              >
                                ✓ Presente
                              </button>
                              <button
                                onClick={() => handleAlterarStatusPresenca(item.id, 'DOENCA')}
                                className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 hover:bg-blue-800 text-[10px] font-bold border border-blue-700/40"
                                title="Falta por doença / atestado"
                              >
                                🩺 Doença
                              </button>
                              <button
                                onClick={() => handleAlterarStatusPresenca(item.id, 'FALTA')}
                                className="px-2 py-0.5 rounded bg-red-950 text-red-300 hover:bg-red-800 text-[10px] font-bold border border-red-700/40"
                                title="Marcar falta"
                              >
                                ✗ Falta
                              </button>
                            </div>

                            {item.telefone && (
                              <button
                                onClick={() => window.open(formatarWhatsUrl(item.telefone, `Olá ${item.nome}, equipe CENTRO DE COMBATE entrando em contato sobre o treino do dia ${diaSelecionadoGeral}.`), '_blank')}
                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
                                title="Enviar WhatsApp"
                              >
                                📲
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-500">
                    <span className="text-3xl mb-2">🥋</span>
                    <p className="text-xs font-semibold text-zinc-400">Nenhum treino registrado neste dia.</p>
                    <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">
                      Clique no botão abaixo para adicionar a presença de um aluno ou registrar check-ins.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setModoLancarDia('LOTE');
                          setModalLancarDia(true);
                        }}
                        className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition shadow-md shadow-emerald-900/30"
                      >
                        📋 Abrir Tabela de Alunos (Em Lote)
                      </button>
                      <button
                        onClick={() => {
                          setModoLancarDia('INDIVIDUAL');
                          setModalLancarDia(true);
                        }}
                        className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
                      >
                        ➕ Lançar 1 Aluno
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
              </div>
            )}
          </div>
        )}

        {/* CONTEÚDO DA ABA: CHAMADA RÁPIDA & PRESENÇAS EM LOTE */}
        {abaAtiva === 'presencas' && (
          <div className="bg-[#141416] border border-zinc-800 rounded-xl overflow-hidden shadow-xl space-y-4 p-4 sm:p-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>📋 Chamada Rápida dos Treinos</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    {presencasFiltradas.length} registros
                  </span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Valide os check-ins individuais ou confirme toda a turma em 1 clique.
                </p>
              </div>

              {/* BOTÃO MÁGICO DE 1 CLIQUE: CONFIRMAR TODOS AGENDADOS */}
              <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                <button
                  onClick={handleMarcarTodosAgendados}
                  disabled={loteLoading}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-900/30 uppercase tracking-wider"
                >
                  <span>⚡ Confirmar Todos Agendados (1 Clique)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAbaAtiva('gamificacao')}
                  className="px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 text-xs font-black transition flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <span>🏅 Check-in Especial / Trilha Nak Muay</span>
                </button>
              </div>
            </div>

            {/* FILTROS DE STATUS E AÇÕES EM LOTE SELECIONADOS */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 pt-1 border-t border-zinc-800/80">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={buscaPresenca}
                  onChange={(e) => setBuscaPresenca(e.target.value)}
                  placeholder="🔍 Buscar aluno por nome na chamada..."
                  className="w-full bg-[#1A1A1E] border border-zinc-700 focus:border-red-500 rounded-lg pl-3 pr-8 py-1.5 text-xs text-white placeholder-zinc-500 outline-none"
                />
                {buscaPresenca && (
                  <button
                    type="button"
                    onClick={() => setBuscaPresenca('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {['TODOS', 'AGENDADO', 'PRESENTE', 'DOENCA', 'FALTA'].map(st => (
                  <button
                    key={st}
                    onClick={() => setFiltroChamada(st as any)}
                    className={`px-3 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                      filtroChamada === st
                        ? 'bg-red-600 text-white'
                        : 'bg-[#1A1A1E] text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {st === 'TODOS' ? `Todos (${presencas.length})` :
                     st === 'AGENDADO' ? `⏳ Agendados (${presencas.filter(p => p.status === 'AGENDADO').length})` :
                     st === 'PRESENTE' ? `✓ Presentes (${presencas.filter(p => p.status === 'PRESENTE').length})` :
                     st === 'DOENCA' ? `🩺 Doença (${presencas.filter(p => p.status === 'DOENCA').length})` :
                     `✗ Faltas (${presencas.filter(p => p.status === 'FALTA' || p.status === 'AUSENTE').length})`}
                  </button>
                ))}
              </div>

              {/* BARRA DE AÇÃO EM LOTE SE TIVER ITENS MARCADOS */}
              {selecionadosLote.length > 0 && (
                <div className="flex items-center gap-2 bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-700 text-xs">
                  <span className="text-zinc-300 font-bold">{selecionadosLote.length} selecionado(s):</span>
                  <button
                    onClick={() => handleMarcarLoteStatus('PRESENTE')}
                    disabled={loteLoading}
                    className="px-2 py-0.5 rounded bg-green-600 hover:bg-green-700 text-white font-bold"
                  >
                    ✓ Presente
                  </button>
                  <button
                    onClick={() => handleMarcarLoteStatus('DOENCA')}
                    disabled={loteLoading}
                    className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    🩺 Doença
                  </button>
                  <button
                    onClick={() => handleMarcarLoteStatus('FALTA')}
                    disabled={loteLoading}
                    className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold"
                  >
                    ✗ Falta
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#1A1A1E] text-zinc-400 uppercase text-[11px] tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selecionadosLote.length > 0 && selecionadosLote.length === presencasFiltradas.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelecionadosLote(presencasFiltradas.map(p => p.id));
                          } else {
                            setSelecionadosLote([]);
                          }
                        }}
                        className="rounded bg-zinc-800 border-zinc-700 text-red-600"
                      />
                    </th>
                    <th className="p-3 sm:p-4">Aluno</th>
                    <th className="p-3 sm:p-4">Aula / Data</th>
                    <th className="p-3 sm:p-4">Status Atual</th>
                    <th className="p-3 sm:p-4 text-right">Lançar Chamada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {presencasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500">
                        Nenhuma presença encontrada para este filtro.
                      </td>
                    </tr>
                  ) : (
                    presencasFiltradas.map(p => {
                      const estaMarcado = selecionadosLote.includes(p.id);
                      return (
                        <tr key={p.id} className={`hover:bg-zinc-800/30 transition ${estaMarcado ? 'bg-red-950/20' : ''}`}>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={estaMarcado}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelecionadosLote(prev => [...prev, p.id]);
                                } else {
                                  setSelecionadosLote(prev => prev.filter(id => id !== p.id));
                                }
                              }}
                              className="rounded bg-zinc-800 border-zinc-700 text-red-600"
                            />
                          </td>
                          <td className="p-3 sm:p-4 font-bold text-white">
                            {p.aluno?.nome}
                            <span className="block text-[11px] text-zinc-400 font-normal">
                              {p.aluno?.plano} • Prajied {p.aluno?.prajied || 'Branco'}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4 text-zinc-300">
                            {p.evento?.titulo || 'Treino de Muay Thai'}
                            <span className="block text-[11px] text-zinc-500">
                              {new Date(p.data).toLocaleDateString('pt-BR')} às {new Date(p.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              p.status === 'PRESENTE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              p.status === 'DOENCA' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              p.status === 'JUSTIFICADO' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                              p.status === 'FALTA' || p.status === 'AUSENTE' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {p.status}
                            </span>
                            {p.justificativa && (
                              <span className="block text-[10px] text-zinc-400 mt-1 italic">
                                Motivo: {p.justificativa}
                              </span>
                            )}
                          </td>
                          <td className="p-3 sm:p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              <button 
                                onClick={() => handleAlterarStatusPresenca(p.id, 'PRESENTE')}
                                className="px-2 py-1 rounded bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white border border-green-500/30 text-xs font-bold transition"
                              >
                                ✓ Presente
                              </button>
                              <button 
                                onClick={() => handleAlterarStatusPresenca(p.id, 'DOENCA')}
                                className="px-2 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-bold transition"
                                title="Registrar falta por motivo de doença / atestado"
                              >
                                🩺 Doença
                              </button>
                              <button 
                                onClick={() => handleAlterarStatusPresenca(p.id, 'FALTA')}
                                className="px-2 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 text-xs font-bold transition"
                              >
                                ✗ Falta
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA: GESTÃO DE GAMIFICAÇÃO & APROVAÇÃO RÁPIDA (TRILHA DO NAK MUAY) */}
        {abaAtiva === 'gamificacao' && !isAtendente && (
          <AdminGamificationTab
            cargoUsuario={usuarioLogado?.cargo || 'ADMIN'}
            professorId={usuarioLogado?.id}
            alunosLista={alunos}
            isCombatHub={true}
            
            onRefreshDashboard={carregarDashboard}
          />
        )}

        {/* CONTEÚDO DA ABA: MURAL DE AVISOS */}
        {abaAtiva === 'avisos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-bold text-white">Mural de Avisos da Academia</h2>
                <p className="text-xs text-zinc-400">Publicações e recados oficiais vistos por todos os alunos no portal.</p>
              </div>
              <button 
                onClick={() => setShowModalAviso(true)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-900/30"
              >
                <span>➕ Publicar Novo Aviso</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {avisos.map(aviso => (
                <NoticeCard
                  key={aviso.id}
                  aviso={aviso}
                  variant="admin"
                  onDelete={removerAviso}
                />
              ))}
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA: LOJA & MERCADO (BETA) */}
        {abaAtiva === 'loja' && !isAtendente && (
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">Mercado & Loja do CT</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    VERSÃO BETA
                  </span>
                </div>
                <p className="text-xs text-zinc-400">Controle de estoque dos itens físicos vendidos presencialmente na recepção.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {usuarioLogado?.cargo === 'ADMIN' && (
                  <button
                    onClick={() => setAbaAtiva('financeiro_gestao')}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
                  >
                    <span>🛍️ Registrar Venda no Caixa (PDV)</span>
                  </button>
                )}
                <button 
                  onClick={() => {
                    setProdutoEditandoId(null);
                    setNovoProduto({ nome: '', categoria: 'PROTETOR_BUCAL', preco: '', estoque: '10', descricao: '', imagemUrl: '' });
                    setShowModalProduto(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-900/30"
                >
                  <span>➕ Adicionar Produto</span>
                </button>
              </div>
            </div>

            {/* Categorias */}
            <div className="flex gap-2 overflow-x-auto pb-2 boru-scrollbar">
              {['TODOS', 'PROTETOR_BUCAL', 'LUVAS', 'CANELEIRAS', 'BANDAGENS', 'ALIMENTOS'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoriaFiltroLoja(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    categoriaFiltroLoja === cat ? 'bg-red-600 text-white' : 'bg-[#141416] text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {cat === 'TODOS' ? 'Todos os Produtos' :
                   cat === 'PROTETOR_BUCAL' ? 'Protetor Bucal' :
                   cat === 'LUVAS' ? 'Luvas' :
                   cat === 'CANELEIRAS' ? 'Caneleiras' :
                   cat === 'BANDAGENS' ? 'Bandagens' : 'Alimentos & Bebidas'}
                </button>
              ))}
            </div>

            {/* Grid de produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {produtos
                .filter(p => categoriaFiltroLoja === 'TODOS' || p.categoria === categoriaFiltroLoja)
                .map(prod => (
                  <div key={prod.id} className="bg-[#141416] border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition group">
                    <div className="h-44 bg-zinc-900 relative overflow-hidden">
                      <img 
                        src={prod.imagemUrl || 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500&q=80'} 
                        alt={prod.nome} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white border border-zinc-700">
                        Estoque: {prod.estoque}
                      </span>
                      <button
                        type="button"
                        onClick={() => abrirEditarProduto(prod)}
                        className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/85 hover:bg-red-600 text-white border border-zinc-700 hover:border-red-500 transition flex items-center gap-1 shadow"
                      >
                        <span>📷 Trocar Foto / Editar</span>
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-red-500">
                          {prod.categoria.replace('_', ' ')}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1 leading-snug">{prod.nome}</h4>
                        {prod.descricao && (
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{prod.descricao}</p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center">
                        <span className="text-base font-black text-white">
                          R$ {prod.preco.toFixed(2).replace('.', ',')}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            onClick={() => abrirEditarProduto(prod)}
                            className="text-xs text-amber-400 hover:text-amber-300 transition font-semibold"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => removerProduto(prod.id)}
                            className="text-xs text-red-500 hover:text-red-400 transition font-semibold"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA: PROFESSORES & EQUIPE (ADMIN) */}
        {abaAtiva === 'professores' && usuarioLogado?.cargo === 'ADMIN' && (
          <div className="bg-[#141416] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center flex-wrap gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Professores e Membros da Equipe</h2>
                <p className="text-xs text-zinc-400">Gestão completa de instrutores, modalidades marciais, graduações e tempo de aula/docência.</p>
              </div>
              <button 
                onClick={() => setShowModalProf(true)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-900/30"
              >
                <span>➕ Cadastrar Professor</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#1A1A1E] text-zinc-400 uppercase text-[11px] tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="p-3 sm:p-4">Professor / Contato</th>
                    <th className="p-3 sm:p-4">Modalidade</th>
                    <th className="p-3 sm:p-4">Graduação / Prática</th>
                    <th className="p-3 sm:p-4">Tempo de Aulas (Docência)</th>
                    <th className="p-3 sm:p-4">Grade & Duração de Aula</th>
                    <th className="p-3 sm:p-4">Cargo</th>
                    <th className="p-3 sm:p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {professores.map(prof => (
                    <tr key={prof.id} className="hover:bg-zinc-800/30 transition">
                      <td className="p-3 sm:p-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          {prof.fotoPerfilUrl ? (
                            <img src={prof.fotoPerfilUrl} alt={prof.nome} className="w-9 h-9 rounded-full object-cover border border-amber-500/60 shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-xs text-amber-400">
                              {prof.nome.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <span className="text-white font-bold">{prof.nome}</span>
                            <span className="block text-[11px] text-amber-400 font-bold">
                              CPF Login: {prof.cpf || 'Não cadastrado'}
                            </span>
                            <span className="block text-[10px] text-zinc-500 font-normal">
                              {prof.telefone || 'Sem telefone'} • {prof.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${
                          prof.is_dev || prof.modalidade?.includes('DEV') ? 'bg-purple-950/40 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-950/50' :
                          prof.modalidade?.toLowerCase().includes('administra') ? 'bg-rose-950/40 text-rose-300 border-rose-800/50' :
                          prof.modalidade === 'Jiu-Jitsu' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                          prof.modalidade === 'Boxe' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                          prof.modalidade === 'MMA' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          prof.modalidade === 'Taekwondo' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                          'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}>
                          {prof.is_dev || prof.modalidade?.includes('DEV') ? '💻 [DEV-SYSTEM]' : (prof.modalidade || 'Muay Thai')}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-zinc-200">
                        <div className="font-semibold text-xs text-white">
                          {prof.graduacao || prof.prajied || (prof.is_dev ? 'Desenvolvedor do Sistema [DEV-SYSTEM]' : 'Sem faixa')}
                        </div>
                        {prof.tempoPratica && (
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            {prof.is_dev ? `💻 ${prof.tempoPratica}` : `🥋 Treino: ${prof.tempoPratica}`}
                          </div>
                        )}
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="text-xs font-bold text-amber-300">
                          {prof.tempoDocencia || (prof.is_dev ? 'Engenharia & Arquitetura de Software' : 'Tempo de docência não informado')}
                        </div>
                        {prof.cargaHorariaSemanal && (
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            ⏱️ {prof.cargaHorariaSemanal}
                          </div>
                        )}
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700/80">
                          <span>⏱️ {prof.is_dev ? 'Disponibilidade Dev' : (prof.tempoAula || '60 min')}</span>
                        </div>
                        {prof.horariosAula && (
                          <div className="text-[11px] text-zinc-400 mt-1 max-w-[200px] leading-tight line-clamp-2" title={prof.horariosAula}>
                            📅 {prof.horariosAula}
                          </div>
                        )}
                      </td>
                      <td className="p-3 sm:p-4">
                        {prof.is_dev || prof.email === 'brgadmin@boru.com' ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1 w-fit shadow-sm">
                            💻 DEV-SYSTEM
                          </span>
                        ) : prof.cargo === 'ADMIN' ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            ADMIN
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            PROFESSOR
                          </span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleRedefinirSenhaProfessor(prof)}
                            className="px-2.5 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-xs font-semibold transition border border-amber-800/40 flex items-center gap-1"
                            title="Redefinir Senha do Professor"
                          >
                            <span>🔑</span> Trocar Senha
                          </button>
                          <button
                            onClick={() => abrirModalEdicaoProf(prof)}
                            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition border border-zinc-700 flex items-center gap-1"
                            title="Editar Dados do Professor"
                          >
                            <span>✏️</span> Editar
                          </button>
                          {prof.id !== usuarioLogado?.id && (
                            <button 
                              onClick={() => removerProfessor(prof.id, prof.nome)}
                              className="px-2.5 py-1 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-semibold transition border border-red-800/40"
                              title="Excluir Professor"
                            >
                              Excluir
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA: LEADS & AGENDAMENTOS EXPERIMENTAIS */}
        {abaAtiva === 'agendamentos' && (
          <div className="bg-[#141416] border border-zinc-800 rounded-xl overflow-hidden shadow-xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-b border-zinc-800 pb-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => setSubAbaExperimental('pendentes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    subAbaExperimental === 'pendentes' ? 'bg-red-600 text-white' : 'bg-[#1A1A1E] text-zinc-400'
                  }`}
                >
                  Aulas Agendadas ({agendamentos.pendentes?.length || 0})
                </button>
                <button 
                  onClick={() => setSubAbaExperimental('posAula')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    subAbaExperimental === 'posAula' ? 'bg-red-600 text-white' : 'bg-[#1A1A1E] text-zinc-400'
                  }`}
                >
                  Pós-Aula / Fechar Contrato ({agendamentos.posAula?.length || 0})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={buscaAgendamento}
                  onChange={(e) => setBuscaAgendamento(e.target.value)}
                  placeholder="🔍 Buscar por nome ou telefone..."
                  className="w-full bg-[#1A1A1E] border border-zinc-700 focus:border-red-500 rounded-lg pl-3 pr-8 py-1.5 text-xs text-white placeholder-zinc-500 outline-none"
                />
                {buscaAgendamento && (
                  <button
                    type="button"
                    onClick={() => setBuscaAgendamento('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {subAbaExperimental === 'pendentes' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#1A1A1E] text-zinc-400 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="p-3">Nome</th>
                      <th className="p-3">Telefone</th>
                      <th className="p-3">Data Prevista</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {agendamentos.pendentes
                      ?.filter((ag: any) => {
                        if (!buscaAgendamento.trim()) return true;
                        const t = buscaAgendamento.trim().toLowerCase();
                        return (ag.nome && ag.nome.toLowerCase().includes(t)) || (ag.telefone && ag.telefone.includes(t));
                      })
                      .map((ag: any) => (
                      <tr key={ag.id} className="hover:bg-zinc-800/30">
                        <td className="p-3 font-bold text-white">{ag.nome}</td>
                        <td className="p-3 text-zinc-300">{ag.telefone}</td>
                        <td className="p-3 text-zinc-300">{ag.data} às {ag.horario}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* MÓDULO 4: BOTÃO AVISAR NO WHATSAPP */}
                            <button
                              type="button"
                              onClick={() => handleAvisarExperimentalWhatsApp(ag)}
                              className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1"
                              title="Enviar confirmação de agendamento experimental via WhatsApp"
                            >
                              <span>📲 Avisar no WhatsApp</span>
                            </button>
                            <button 
                              onClick={() => marcarAulaRealizada(ag.id)}
                              className="px-2.5 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition"
                            >
                              ✓ Fez a Aula
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#1A1A1E] text-zinc-400 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="p-3">Lead (Fez Aula)</th>
                      <th className="p-3">Dias Desde o Treino</th>
                      <th className="p-3">Observação</th>
                      <th className="p-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {agendamentos.posAula
                      ?.filter((ag: any) => {
                        if (!buscaAgendamento.trim()) return true;
                        const t = buscaAgendamento.trim().toLowerCase();
                        return (ag.nome && ag.nome.toLowerCase().includes(t)) || (ag.telefone && ag.telefone.includes(t));
                      })
                      .map((ag: any) => (
                      <tr key={ag.id} className="hover:bg-zinc-800/30">
                        <td className="p-3 font-bold text-white">
                          {ag.nome}
                          <span className="block text-[11px] text-zinc-400 font-normal">{ag.telefone}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            ag.diasDesdeAula > 3 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {ag.diasDesdeAula} dias atrás
                          </span>
                        </td>
                        <td className="p-3 text-zinc-400 text-xs italic">{ag.observacao || 'Sem observação'}</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => setLeadParaConverter(ag)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                          >
                            Matricular Aluno
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CONTEÚDO DA ABA: CAIXA DIÁRIO OBRIGATÓRIO (FASE 1 - COMBAT-PASS HUB) */}
        {abaAtiva === 'caixa_diario' && usuarioLogado?.cargo === 'ADMIN' && (
          <CashRegisterTab usuarioLogado={usuarioLogado} />
        )}

        {/* CONTEÚDO DA ABA: COMISSIONAMENTO DINÂMICO DE PROFESSORES (FASE 1) */}
        {abaAtiva === 'comissoes' && usuarioLogado?.cargo === 'ADMIN' && (
          <TeacherCommissionsTab />
        )}

        {/* CONTEÚDO DA ABA: DASHBOARD DE OCUPAÇÃO & HEATMAP (FASE 1) */}
        {abaAtiva === 'ocupacao' && (
          <OccupancyDashboardTab />
        )}

        {/* CONTEÚDO DA ABA: VOUCHERS & RESGATES DA LOJA NA RECEPÇÃO (FASE 1) */}
        {abaAtiva === 'resgates_loja' && (
          <AdminStoreRedemptionsTab usuarioLogado={usuarioLogado} />
        )}

          </div>
        </div>
      </div>

      {/* MODAL NOVO ALUNO */}
      {showModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[99999] overflow-y-auto boru-scrollbar"
        >
          <div className="bg-[#141416] border border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl my-auto">
            <h3 className="text-xl font-bold text-white mb-4">Matricular Novo Aluno</h3>
            <form onSubmit={criarAluno} className="space-y-3">
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">Nome Completo</label>
                <input required type="text" value={novoAluno.nome} onChange={(e) => setNovoAluno({...novoAluno, nome: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">CPF (Obrigatório)</label>
                <input required type="text" value={novoAluno.cpf} onChange={(e) => setNovoAluno({...novoAluno, cpf: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" placeholder="000.000.000-00" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">WhatsApp</label>
                  <input type="text" value={novoAluno.telefone} onChange={(e) => setNovoAluno({...novoAluno, telefone: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">Plano</label>
                  <select value={novoAluno.plano} onChange={(e) => setNovoAluno({...novoAluno, plano: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-xs text-white">
                    <option value="2x na semana">2x na semana (R$ 130/mês)</option>
                    <option value="3x na semana">3x na semana (R$ 160/mês)</option>
                    <option value="Todos os Horários">Todos os Horários (R$ 280/mês)</option>
                    <option value="Diária">Diária Avulsa (R$ 40/treino)</option>
                    <option value="Wellhub">Wellhub / Gympass (Individual)</option>
                    <option value="TotalPass">TotalPass (Individual)</option>
                  </select>
                </div>
              </div>
              {/* MÓDULO 1: FLAG BOLSISTA */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer bg-purple-950/20 border border-purple-500/30 rounded-lg p-2.5">
                  <input
                    type="checkbox"
                    checked={novoAluno.is_bolsista}
                    onChange={(e) => setNovoAluno({...novoAluno, is_bolsista: e.target.checked})}
                    className="w-4 h-4 rounded accent-purple-500"
                  />
                  <div>
                    <span className="text-xs font-black text-purple-300 block">🎓 Aluno Bolsista Integral (is_bolsista)</span>
                    <span className="text-[10px] text-zinc-400">Não gera faturas mensais automáticas e nunca perde acesso por inadimplência.</span>
                  </div>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold">Salvar Matrícula</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MÓDULO 5: MODAL DE BAIXA MANUAL COM DATEPICKER (CALENDÁRIO) */}
      {alunoBaixaModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setAlunoBaixaModal(null);
          }}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-[999999] overflow-y-auto boru-scrollbar"
        >
          <div className="bg-[#141416] border border-emerald-500/40 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block">
                  Baixa Manual de Mensalidade (+30 dias)
                </span>
                <h3 className="text-lg font-black text-white">{alunoBaixaModal.nome}</h3>
              </div>
              <button
                onClick={() => setAlunoBaixaModal(null)}
                className="text-zinc-500 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={confirmarBaixaComCalendario} className="space-y-4">
              <div>
                <label className="block text-emerald-300 text-xs font-black mb-1 uppercase tracking-wider">
                  📅 Data Real do Pagamento (Calendário Obrigatório)
                </label>
                <p className="text-[11px] text-zinc-400 mb-2">
                  Selecione no calendário em qual data (passada ou presente) este pagamento ocorreu:
                </p>
                <input
                  type="date"
                  required
                  value={dataPagamentoBaixa}
                  onChange={(e) => setDataPagamentoBaixa(e.target.value)}
                  className="w-full bg-[#1A1A1E] border-2 border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs font-bold mb-1">Método de Recebimento</label>
                <select
                  value={metodoPagamentoBaixa}
                  onChange={(e) => setMetodoPagamentoBaixa(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white font-semibold"
                >
                  <option value="PIX / Presencial">PIX Presencial</option>
                  <option value="Dinheiro em Espécie">Dinheiro em Espécie</option>
                  <option value="Cartão Débito/Crédito">Cartão de Débito / Crédito</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setAlunoBaixaModal(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoBaixaRapida}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-900/30"
                >
                  {salvandoBaixaRapida ? 'Confirmando...' : '✓ Confirmar Baixa (+30d)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO PROFESSOR (EXCLUSIVO ADMIN) */}
      {showModalProf && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModalProf(false);
          }}
          className="fixed inset-0 bg-black/85 flex items-center justify-center p-3 sm:p-4 z-[99999] overflow-y-auto boru-scrollbar"
        >
          <div className="bg-[#141416] border border-zinc-800 p-5 sm:p-6 rounded-2xl w-full max-w-xl shadow-2xl my-auto">
            <h3 className="text-xl font-bold text-amber-400 mb-1">Cadastrar Professor / Usuário</h3>
            <p className="text-zinc-400 text-xs mb-4">Adicione um novo instrutor com permissão de lançar chamadas, gerenciar horários e graduar alunos.</p>
            
            <form onSubmit={criarProfessor} className="space-y-3">
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">Nome Completo</label>
                <input required type="text" value={novoProfessor.nome} onChange={(e) => setNovoProfessor({...novoProfessor, nome: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" placeholder="Ex: Coordenação Técnica" />
              </div>

              {/* DIRETRIZ 3 & MÓDULO 1: UPLOAD REAL DE FOTO DE PERFIL DO PROFESSOR */}
              <div className="pt-1">
                <FileUploadInput
                  label="Foto de Perfil do Professor (Storage Local / Sem URL Externa)"
                  value={novoProfessor.fotoPerfilUrl}
                  onChange={(url) => setNovoProfessor({ ...novoProfessor, fotoPerfilUrl: url })}
                  folder="professores"
                  helperText="Faça upload da foto oficial do professor (PNG, JPG ou WEBP)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-amber-400 text-xs font-bold mb-1">CPF (Login do Professor - Obrigatório)</label>
                  <input required type="text" value={novoProfessor.cpf} onChange={(e) => setNovoProfessor({...novoProfessor, cpf: e.target.value})} className="w-full bg-[#1A1A1E] border border-amber-500/50 rounded-lg p-2.5 text-sm text-white font-mono" placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">WhatsApp / Telefone</label>
                  <input type="text" value={novoProfessor.telefone} onChange={(e) => setNovoProfessor({...novoProfessor, telefone: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" placeholder="(69) 99999-9999" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">E-mail (Contato / Opcional)</label>
                  <input type="email" value={novoProfessor.email} onChange={(e) => setNovoProfessor({...novoProfessor, email: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" placeholder="professor@boru.com" />
                </div>
                <div>
                  <label className="block text-amber-400 text-xs font-bold mb-1">Senha Inicial (Registrada pelo Admin)</label>
                  <input required type="password" value={novoProfessor.senha} onChange={(e) => setNovoProfessor({...novoProfessor, senha: e.target.value})} className="w-full bg-[#1A1A1E] border border-amber-500/50 rounded-lg p-2.5 text-sm text-white" placeholder="Senha do professor" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">Cargo no Sistema</label>
                <select value={novoProfessor.cargo} onChange={(e) => setNovoProfessor({...novoProfessor, cargo: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white">
                  <option value="PROFESSOR">🥋 Professor / Instrutor</option>
                  <option value="ATENDENTE">🎧 Atendente / Recepção (Matrículas, Alunos & Check-ins)</option>
                  <option value="ADMIN">👑 Administrador Geral</option>
                </select>
              </div>

              {/* SELEÇÃO DA ARTE MARCIAL E DURAÇÃO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                <div>
                  <label className="block text-amber-400 text-xs font-bold mb-1">Arte Marcial / Modalidade</label>
                  <select 
                    value={novoProfessor.modalidade} 
                    onChange={(e) => {
                      const mod = e.target.value;
                      const primeiraGrad = graduacoesPorModalidade[mod]?.[0] || '';
                      setNovoProfessor({
                        ...novoProfessor,
                        modalidade: mod,
                        graduacao: primeiraGrad,
                        tempoPratica: (mod === 'Boxe' || mod === 'MMA') ? primeiraGrad : ''
                      });
                    }} 
                    className="w-full bg-[#1A1A1E] border border-amber-500/50 rounded-lg p-2.5 text-sm text-white font-bold"
                  >
                    <option value="Muay Thai">🥊 Muay Thai</option>
                    <option value="Jiu-Jitsu">🥋 Jiu-Jitsu</option>
                    <option value="Boxe">🥊 Boxe</option>
                    <option value="MMA">🤼 MMA</option>
                    <option value="Taekwondo">🥋 Taekwondo</option>
                    <option value="[DEV-SYSTEM]">💻 [DEV-SYSTEM] - Desenvolvimento de Software</option>
                    <option value="Administração Geral">🏢 Administração Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 text-xs font-semibold mb-1">Duração de Cada Aula</label>
                  <select 
                    value={novoProfessor.tempoAula} 
                    onChange={(e) => setNovoProfessor({...novoProfessor, tempoAula: e.target.value})} 
                    className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white font-medium"
                  >
                    {temposDeAula.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* GRADUAÇÃO DINÂMICA OU TEMPO DE PRÁTICA */}
              <div>
                <label className="block text-zinc-300 text-xs font-semibold mb-1">
                  {novoProfessor.modalidade === '[DEV-SYSTEM]'
                    ? 'Função & Nível Técnico / Atuação ([DEV-SYSTEM])'
                    : novoProfessor.modalidade === 'Administração Geral'
                    ? 'Função Administrativa & Gestão'
                    : novoProfessor.modalidade === 'Boxe' || novoProfessor.modalidade === 'MMA'
                    ? `Tempo de Prática / Experiência (${novoProfessor.modalidade})`
                    : `Graduação de Faixa / Prajied (${novoProfessor.modalidade})`}
                </label>
                
                <select 
                  value={novoProfessor.graduacao} 
                  onChange={(e) => setNovoProfessor({
                    ...novoProfessor, 
                    graduacao: e.target.value,
                    tempoPratica: (novoProfessor.modalidade === 'Boxe' || novoProfessor.modalidade === 'MMA') ? e.target.value : novoProfessor.tempoPratica
                  })} 
                  className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white font-medium"
                >
                  {(graduacoesPorModalidade[novoProfessor.modalidade] || []).map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                {(novoProfessor.modalidade === 'Boxe' || novoProfessor.modalidade === 'MMA') && (
                  <div className="mt-2">
                    <input 
                      type="text" 
                      value={novoProfessor.tempoPratica} 
                      onChange={(e) => setNovoProfessor({...novoProfessor, tempoPratica: e.target.value, graduacao: e.target.value})} 
                      placeholder="Ou digite o cartel / experiência (Ex: 8 anos de ringue, 12 lutas profissionais)"
                      className="w-full bg-[#1A1A1E] border border-zinc-700/80 rounded-lg p-2 text-xs text-zinc-300 placeholder-zinc-500"
                    />
                  </div>
                )}
              </div>

              {/* TEMPO QUE O PROFESSOR TEM DE AULAS (DOCÊNCIA) E CARGA HORÁRIA */}
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-amber-300 text-xs font-bold mb-1">
                      Tempo de Aulas / Docência
                    </label>
                    <select
                      value={novoProfessor.tempoDocencia}
                      onChange={(e) => setNovoProfessor({...novoProfessor, tempoDocencia: e.target.value})}
                      className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2 text-xs text-white"
                    >
                      {opcoesTempoDocencia.map(op => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1">
                      Carga Horária Semanal
                    </label>
                    <input 
                      type="text" 
                      value={novoProfessor.cargaHorariaSemanal} 
                      onChange={(e) => setNovoProfessor({...novoProfessor, cargaHorariaSemanal: e.target.value})} 
                      placeholder="Ex: 8 horas/semana, 12h/sem"
                      className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2 text-xs text-white placeholder-zinc-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">
                    Grade de Horários das Aulas do Professor no CT
                  </label>
                  <input 
                    type="text" 
                    value={novoProfessor.horariosAula} 
                    onChange={(e) => setNovoProfessor({...novoProfessor, horariosAula: e.target.value})} 
                    placeholder="Ex: Seg, Qua e Sex (18h e 19h30) | Ter e Qui (07h)"
                    className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2 text-xs text-white placeholder-zinc-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setShowModalProf(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold">Criar Professor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR PROFESSOR (EXCLUSIVO ADMIN & MEU PERFIL) */}
      {showModalEditarProf && professorParaEditar && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModalEditarProf(false);
          }}
          className="fixed inset-0 bg-black/85 flex items-center justify-center p-3 sm:p-4 z-[99999] overflow-y-auto boru-scrollbar"
        >
          <div className="bg-[#141416] border border-zinc-800 p-5 sm:p-6 rounded-2xl w-full max-w-xl shadow-2xl my-auto">
            <h3 className="text-xl font-bold text-white mb-1">
              {professorParaEditar.id === usuarioLogado?.id ? '👤 Editar Meus Dados de Perfil' : 'Editar Dados do Professor'}
            </h3>
            <p className="text-zinc-400 text-xs mb-4">
              {professorParaEditar.id === usuarioLogado?.id 
                ? 'Atualize seu nome, foto de perfil oficial, CPF, telefone, e-mail e dados de graduação.' 
                : `Altere modalidade, faixa, tempo de aulas/docência e horários de ${professorParaEditar.nome}.`}
            </p>
            
            <form onSubmit={salvarEdicaoProfessor} className="space-y-3">
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">Nome Completo</label>
                <input required type="text" value={professorParaEditar.nome} onChange={(e) => setProfessorParaEditar({...professorParaEditar, nome: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" />
              </div>

              {/* DIRETRIZ 3 & MÓDULO 1: UPLOAD REAL DE FOTO DE PERFIL DO PROFESSOR */}
              <div className="pt-1">
                <FileUploadInput
                  label="Foto de Perfil (Storage Local / Sem URL Externa)"
                  value={professorParaEditar.fotoPerfilUrl || ''}
                  onChange={(url) => setProfessorParaEditar({ ...professorParaEditar, fotoPerfilUrl: url })}
                  folder="professores"
                  helperText="Faça upload da foto oficial (PNG, JPG ou WEBP)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-amber-400 text-xs font-bold mb-1">CPF (Login Principal - Obrigatório)</label>
                  <input required type="text" value={professorParaEditar.cpf || ''} onChange={(e) => setProfessorParaEditar({...professorParaEditar, cpf: e.target.value})} className="w-full bg-[#1A1A1E] border border-amber-500/50 rounded-lg p-2.5 text-sm text-white font-mono" placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">E-mail (Login Alternativo)</label>
                  <input type="email" value={professorParaEditar.email || ''} onChange={(e) => setProfessorParaEditar({...professorParaEditar, email: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" placeholder="email@boru.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">WhatsApp / Telefone</label>
                  <input type="text" value={professorParaEditar.telefone || ''} onChange={(e) => setProfessorParaEditar({...professorParaEditar, telefone: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" placeholder="(69) 99999-9999" />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">Cargo</label>
                  <select value={professorParaEditar.cargo} onChange={(e) => setProfessorParaEditar({...professorParaEditar, cargo: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white">
                    <option value="PROFESSOR">🥋 Professor / Instrutor</option>
                    <option value="ATENDENTE">🎧 Atendente / Recepção (Matrículas, Alunos & Check-ins)</option>
                    <option value="ADMIN">👑 Administrador Geral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-zinc-800">
                <div>
                  <label className="block text-amber-400 text-xs font-bold mb-1">Arte Marcial / Modalidade</label>
                  <select 
                    value={professorParaEditar.modalidade} 
                    onChange={(e) => {
                      const mod = e.target.value;
                      const primeiraGrad = graduacoesPorModalidade[mod]?.[0] || '';
                      setProfessorParaEditar({
                        ...professorParaEditar,
                        modalidade: mod,
                        graduacao: primeiraGrad,
                        tempoPratica: (mod === 'Boxe' || mod === 'MMA') ? primeiraGrad : ''
                      });
                    }} 
                    className="w-full bg-[#1A1A1E] border border-amber-500/50 rounded-lg p-2.5 text-sm text-white font-bold"
                  >
                    <option value="Muay Thai">🥊 Muay Thai</option>
                    <option value="Jiu-Jitsu">🥋 Jiu-Jitsu</option>
                    <option value="Boxe">🥊 Boxe</option>
                    <option value="MMA">🤼 MMA</option>
                    <option value="Taekwondo">🥋 Taekwondo</option>
                    <option value="[DEV-SYSTEM]">💻 [DEV-SYSTEM] - Desenvolvimento de Software</option>
                    <option value="Administração Geral">🏢 Administração Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">Duração de Cada Aula</label>
                  <select 
                    value={professorParaEditar.tempoAula || '60 min'} 
                    onChange={(e) => setProfessorParaEditar({...professorParaEditar, tempoAula: e.target.value})} 
                    className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white"
                  >
                    {temposDeAula.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 text-xs font-semibold mb-1">
                  {professorParaEditar.modalidade === '[DEV-SYSTEM]'
                    ? 'Função & Nível Técnico / Atuação ([DEV-SYSTEM])'
                    : professorParaEditar.modalidade === 'Administração Geral'
                    ? 'Função Administrativa & Gestão'
                    : professorParaEditar.modalidade === 'Boxe' || professorParaEditar.modalidade === 'MMA'
                    ? `Tempo de Prática / Experiência (${professorParaEditar.modalidade})`
                    : `Graduação de Faixa / Prajied (${professorParaEditar.modalidade})`}
                </label>
                
                <select 
                  value={professorParaEditar.graduacao} 
                  onChange={(e) => setProfessorParaEditar({
                    ...professorParaEditar, 
                    graduacao: e.target.value,
                    tempoPratica: (professorParaEditar.modalidade === 'Boxe' || professorParaEditar.modalidade === 'MMA') ? e.target.value : professorParaEditar.tempoPratica
                  })} 
                  className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white font-medium"
                >
                  {(graduacoesPorModalidade[professorParaEditar.modalidade] || []).map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                {(professorParaEditar.modalidade === 'Boxe' || professorParaEditar.modalidade === 'MMA' || professorParaEditar.modalidade === '[DEV-SYSTEM]' || professorParaEditar.modalidade === 'Administração Geral') && (
                  <div className="mt-2">
                    <input 
                      type="text" 
                      value={professorParaEditar.graduacao || ''} 
                      onChange={(e) => setProfessorParaEditar({...professorParaEditar, graduacao: e.target.value, prajied_faixa: e.target.value})} 
                      placeholder="Ou digite o título / cargo personalizado (Ex: Desenvolvedor do Sistema [DEV-SYSTEM])"
                      className="w-full bg-[#1A1A1E] border border-zinc-700/80 rounded-lg p-2 text-xs text-zinc-300 placeholder-zinc-500"
                    />
                  </div>
                )}
              </div>

              {/* TEMPO QUE O PROFESSOR TEM DE AULAS (DOCÊNCIA) E CARGA HORÁRIA */}
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-amber-300 text-xs font-bold mb-1">
                      Tempo de Aulas / Docência
                    </label>
                    <input
                      type="text"
                      value={professorParaEditar.tempoDocencia || ''}
                      onChange={(e) => setProfessorParaEditar({...professorParaEditar, tempoDocencia: e.target.value})}
                      placeholder="Ex: 6 anos ministrando aulas"
                      className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1">
                      Carga Horária Semanal
                    </label>
                    <input 
                      type="text" 
                      value={professorParaEditar.cargaHorariaSemanal || ''} 
                      onChange={(e) => setProfessorParaEditar({...professorParaEditar, cargaHorariaSemanal: e.target.value})} 
                      placeholder="Ex: 8 horas/semana"
                      className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">
                    Grade de Horários das Aulas do Professor no CT
                  </label>
                  <input 
                    type="text" 
                    value={professorParaEditar.horariosAula || ''} 
                    onChange={(e) => setProfessorParaEditar({...professorParaEditar, horariosAula: e.target.value})} 
                    placeholder="Ex: Seg, Qua e Sex (18h e 19h30)"
                    className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                <label className="block text-amber-300 text-xs font-bold mb-1">🔑 Alterar Senha do Professor (Exclusivo Administrador)</label>
                <p className="text-[11px] text-zinc-400 mb-2 leading-relaxed">
                  Caso o professor tenha esquecido a senha ou precise de uma nova, digite abaixo. Se deixar em branco, a senha atual continuará a mesma.
                </p>
                <input 
                  type="password" 
                  value={professorParaEditar.senha || ''} 
                  onChange={(e) => setProfessorParaEditar({...professorParaEditar, senha: e.target.value})} 
                  placeholder="Digite a nova senha (ou deixe em branco)"
                  className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setShowModalEditarProf(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO AVISO */}
      {showModalAviso && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[99999]">
          <div className="bg-[#141416] border border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-3">Publicar no Mural</h3>
            <form onSubmit={criarAviso} className="space-y-3">
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">Título do Aviso</label>
                <input required type="text" value={novoAviso.titulo} onChange={(e) => setNovoAviso({...novoAviso, titulo: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" placeholder="Ex: Exame de Graduação" />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">Categoria / Tipo</label>
                <select value={novoAviso.tipo} onChange={(e) => setNovoAviso({...novoAviso, tipo: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white">
                  <option value="GERAL">Geral</option>
                  <option value="URGENTE">Urgente</option>
                  <option value="GRADUACAO">Graduação / Prajied</option>
                  <option value="EVENTO">Evento / Workshop</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">Conteúdo da Mensagem</label>
                <textarea required rows={4} value={novoAviso.conteudo} onChange={(e) => setNovoAviso({...novoAviso, conteudo: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" placeholder="Escreva o comunicado para os alunos..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="fixarAviso" checked={novoAviso.fixado} onChange={(e) => setNovoAviso({...novoAviso, fixado: e.target.checked})} className="rounded bg-zinc-800 border-zinc-700 text-red-600" />
                <label htmlFor="fixarAviso" className="text-xs text-zinc-300 font-semibold cursor-pointer">Fixar no topo do mural</label>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowModalAviso(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold">Publicar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO / EDITAR PRODUTO NA LOJA (COM UPLOAD DE IMAGEM LOCAL DO PC OU CELULAR) */}
      {showModalProduto && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModalProduto(false);
              setProdutoEditandoId(null);
            }
          }}
          className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[99999] overflow-y-auto boru-scrollbar"
        >
          <div className="bg-[#141416] border border-zinc-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl my-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {produtoEditandoId ? 'Editar Produto na Loja' : 'Adicionar Produto na Loja'}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Envie uma foto baixada no seu computador ou direto da galeria/câmera do celular.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowModalProduto(false);
                  setProdutoEditandoId(null);
                }}
                className="text-zinc-500 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={criarProduto} className="space-y-3.5">
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">Nome do Produto</label>
                <input required type="text" value={novoProduto.nome} onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" placeholder="Ex: Luva Muay Thai 14oz" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">Categoria</label>
                  <select value={novoProduto.categoria} onChange={(e) => setNovoProduto({...novoProduto, categoria: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-xs sm:text-sm text-white">
                    <option value="PROTETOR_BUCAL">Protetor Bucal</option>
                    <option value="LUVAS">Luvas</option>
                    <option value="CANELEIRAS">Caneleiras</option>
                    <option value="BANDAGENS">Bandagens</option>
                    <option value="ALIMENTOS">Alimentos & Bebidas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">Preço (R$)</label>
                  <input required type="number" step="0.5" value={novoProduto.preco} onChange={(e) => setNovoProduto({...novoProduto, preco: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" placeholder="Ex: 45.00" />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">Estoque</label>
                  <input type="number" value={novoProduto.estoque} onChange={(e) => setNovoProduto({...novoProduto, estoque: e.target.value})} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-sm text-white" />
                </div>
              </div>

              {/* UPLOAD DE ARQUIVO DO COMPUTADOR OU CELULAR */}
              <div className="pt-2 border-t border-zinc-800 space-y-2.5">
                <FileUploadInput
                  label="📸 Foto do Produto (Baixada no Computador ou Galeria do Celular)"
                  value={novoProduto.imagemUrl}
                  onChange={(uploadedUrl) => setNovoProduto({ ...novoProduto, imagemUrl: uploadedUrl })}
                  folder="produtos_loja"
                  helperText="Clique em 'Escolher Arquivo Local' para enviar foto do PC ou Celular (PNG, JPG, WEBP)"
                />

                {novoProduto.imagemUrl && (
                  <div className="relative h-36 w-full rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900">
                    <img
                      src={novoProduto.imagemUrl}
                      alt="Pré-visualização do Produto"
                      className="w-full h-full object-contain bg-black/50"
                    />
                    <button
                      type="button"
                      onClick={() => setNovoProduto({ ...novoProduto, imagemUrl: '' })}
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-black/80 hover:bg-red-600 text-white text-[10px] font-bold transition"
                    >
                      ✕ Remover Foto
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-zinc-500 text-[11px] font-semibold mb-1">
                    Ou cole uma URL de Imagem externa (Opcional)
                  </label>
                  <input
                    type="text"
                    value={novoProduto.imagemUrl?.startsWith('data:') ? '' : novoProduto.imagemUrl}
                    onChange={(e) => setNovoProduto({ ...novoProduto, imagemUrl: e.target.value })}
                    className="w-full bg-[#1A1A1E] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300"
                    placeholder="https://... (opcional se você já escolheu uma foto acima)"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowModalProduto(false);
                    setProdutoEditandoId(null);
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-red-900/30">
                  {produtoEditandoId ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CALENDÁRIO & FREQUÊNCIA DETALHADA COM PORCENTAGENS */}
      {alunoSelecionado && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setAlunoSelecionado(null);
          }}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 z-[999999] overflow-y-auto boru-scrollbar"
        >
          {loadingCalendario || !calendarioDados ? (
            <div className="bg-[#141416] border border-zinc-800 rounded-2xl w-full max-w-sm p-7 shadow-2xl flex flex-col items-center justify-center gap-4 text-center my-auto">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h4 className="text-base font-black text-white">Carregando Calendário...</h4>
                <p className="text-xs text-zinc-400 mt-1">{alunoSelecionado.nome}</p>
              </div>
              <button
                type="button"
                onClick={() => setAlunoSelecionado(null)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="bg-[#141416] border border-zinc-800 rounded-2xl w-full max-w-3xl p-4 sm:p-6 md:p-7 shadow-2xl my-auto max-h-[92vh] overflow-y-auto boru-scrollbar">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  📅 Frequência: {alunoSelecionado.nome}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Plano: <strong className="text-white">{alunoSelecionado.plano}</strong> • Prajied: <strong className="text-red-400">{alunoSelecionado.prajied}</strong>
                </p>
              </div>
              <button 
                onClick={() => setAlunoSelecionado(null)}
                className="text-zinc-500 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* DESTAQUE DE FREQUÊNCIA SEMANAL PARA ALUNOS DE DIÁRIA OU CONVÊNIO */}
            {isDiariaOuConvenio(alunoSelecionado.plano) && (
              <div className="bg-gradient-to-r from-red-950/40 via-[#1A1A1E] to-[#141416] border border-red-500/30 rounded-xl p-4 mb-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      <h4 className="text-sm font-bold text-white">Frequência Individual da Semana Atual</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {alunoSelecionado.plano}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Dias frequentados nesta semana: <strong className="text-zinc-200">{calendarioDados.estatisticas?.frequenciaSemanal?.diasFormatadosTexto || 'Nenhum treino registrado'}</strong>
                    </p>
                  </div>
                  <div className="bg-black/50 px-4 py-2 rounded-lg border border-zinc-800 text-center sm:text-right min-w-[120px]">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Nesta Semana</span>
                    <span className="text-2xl font-black text-amber-400">
                      {calendarioDados.estatisticas?.frequenciaSemanal?.totalNaSemana || 0}
                    </span>
                    <span className="text-xs text-zinc-400 ml-1">treino(s)</span>
                  </div>
                </div>
              </div>
            )}

            {/* CARDS COM AS PORCENTAGENS REQUISITADAS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-[#1A1A1E] border border-zinc-800 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold text-green-400 mb-0.5">🟢 Presença Real</p>
                <p className="text-2xl font-black text-white">{calendarioDados.estatisticas.porcentagemPresenca}%</p>
                <span className="text-[10px] text-zinc-500">{calendarioDados.estatisticas.presentes} aulas feitas</span>
              </div>
              <div className="bg-[#1A1A1E] border border-zinc-800 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold text-blue-400 mb-0.5">🔵 Ausência Doença</p>
                <p className="text-2xl font-black text-blue-400">{calendarioDados.estatisticas.porcentagemDoenca}%</p>
                <span className="text-[10px] text-zinc-500">{calendarioDados.estatisticas.doenca} com atestado</span>
              </div>
              <div className="bg-[#1A1A1E] border border-zinc-800 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold text-red-400 mb-0.5">🔴 Falta Comum</p>
                <p className="text-2xl font-black text-red-500">{calendarioDados.estatisticas.porcentagemFalta}%</p>
                <span className="text-[10px] text-zinc-500">{calendarioDados.estatisticas.faltasNaoJustificadas} sem aviso</span>
              </div>
              <div className="bg-[#1A1A1E] border border-zinc-800 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold text-amber-400 mb-0.5">⭐ Presença Efetiva</p>
                <p className="text-2xl font-black text-amber-400">{calendarioDados.estatisticas.porcentagemGeral}%</p>
                <span className="text-[10px] text-zinc-500">Considera atestados</span>
              </div>
            </div>

            {/* MÊS E DIAS */}
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm sm:text-base font-bold text-white">
                Mês: {mesCalendario} / {anoCalendario}
              </h4>
              <div className="flex gap-2">
                <button onClick={() => mudarMesCalendario(-1)} className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded">← Anterior</button>
                <button onClick={() => mudarMesCalendario(1)} className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded">Próximo →</button>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 mb-2">Clique em qualquer dia para registrar Presença, Falta ou Doença:</p>

            {/* Grid dos dias */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-zinc-500 mb-1">
              <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: new Date(anoCalendario, mesCalendario - 1, 1).getDay() }).map((_, i) => (
                <div key={`emp-${i}`} className="h-16 rounded bg-zinc-900/20"></div>
              ))}
              {Array.from({ length: new Date(anoCalendario, mesCalendario, 0).getDate() }).map((_, i) => {
                const dia = i + 1;
                const dataIso = `${anoCalendario}-${String(mesCalendario).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
                const pres = calendarioDados.presencasPorDia?.[dataIso]?.[0];
                return (
                  <button
                    key={`d-${dia}`}
                    onClick={() => abrirAcaoDia(dataIso)}
                    className={`h-16 p-1.5 rounded-lg border text-left flex flex-col justify-between transition hover:scale-105 ${
                      pres?.status === 'PRESENTE' ? 'bg-green-500/20 border-green-500/50 text-white' :
                      pres?.status === 'DOENCA' ? 'bg-blue-500/20 border-blue-500/50 text-white' :
                      pres?.status === 'FALTA' ? 'bg-red-500/20 border-red-500/50 text-white' :
                      'bg-[#1A1A1E] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <span className="font-bold text-xs">{dia}</span>
                    <span className="text-[9px] font-bold truncate">
                      {pres?.status === 'PRESENTE' ? '✓ Presente' :
                       pres?.status === 'DOENCA' ? '🩺 Doença' :
                       pres?.status === 'FALTA' ? '✗ Falta' : '+ Marcar'}
                    </span>
                  </button>
                );
              })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL AÇÃO DO DIA (PRESENÇA / FALTA / DOENÇA) */}
      {modalAcaoDia && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalAcaoDia(false);
          }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[999999] overflow-y-auto boru-scrollbar"
        >
          <div className="bg-[#141416] border border-zinc-800 p-5 rounded-2xl w-full max-w-sm shadow-2xl my-auto">
            <h4 className="text-base font-bold text-white mb-2">Lançar Registro para {diaSelecionadoAcao}</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">Status da Chamada</label>
                <select 
                  value={statusAcaoDia} 
                  onChange={(e) => setStatusAcaoDia(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-xs text-white"
                >
                  <option value="PRESENTE">🟢 PRESENTE (Treinou normalmente)</option>
                  <option value="DOENCA">🔵 FALTA POR DOENÇA (Com atestado médico)</option>
                  <option value="FALTA">🔴 FALTA NÃO JUSTIFICADA (Sem comparecimento)</option>
                  <option value="JUSTIFICADO">ℹ️ OUTRA JUSTIFICATIVA (Trabalho/Viagem)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">Motivo / Detalhes (Opcional)</label>
                <input 
                  type="text" 
                  value={justificativaInput} 
                  onChange={(e) => setJustificativaInput(e.target.value)}
                  placeholder="Ex: Gripe forte, Atestado de 2 dias..."
                  className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-xs text-white" 
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
                <button 
                  type="button" 
                  onClick={removerPresencaDoDia}
                  className="text-red-500 hover:text-red-400 text-xs font-bold"
                >
                  Limpar Dia
                </button>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setModalAcaoDia(false)} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold">Cancelar</button>
                  <button type="button" onClick={salvarPresencaNoDia} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold">Salvar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONVERTER LEAD EM ALUNO */}
      {leadParaConverter && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[99999]">
          <div className="bg-[#141416] border border-zinc-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Matricular {leadParaConverter.nome}</h3>
            <p className="text-zinc-400 text-xs mb-4">A pessoa já fez a aula experimental e agora será inserida como aluno ativo.</p>
            <form onSubmit={converterLeadEmAluno} className="space-y-3">
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">Plano Escolhido</label>
                <select value={planoConversao} onChange={(e) => setPlanoConversao(e.target.value)} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-xs text-white">
                  <option value="2x na semana">2x na semana (R$ 130/mês)</option>
                  <option value="3x na semana">3x na semana (R$ 160/mês)</option>
                  <option value="Todos os Horários">Todos os Horários (R$ 280/mês)</option>
                  <option value="Diária">Diária Avulsa (R$ 40/treino)</option>
                  <option value="Wellhub">Wellhub / Gympass (Individual)</option>
                  <option value="TotalPass">TotalPass (Individual)</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1">Valor da Mensalidade (R$)</label>
                <input type="number" value={valorConversao} onChange={(e) => setValorConversao(e.target.value)} className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-xs text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setLeadParaConverter(null)} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold">Cancelar</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold">Concluir Matrícula</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LANÇAR ALUNO NO DIA DO CALENDÁRIO GERAL (EM LOTE COM TABELA COMPLETA OU INDIVIDUAL) */}
      {modalLancarDia && (() => {
        const registrosDoDiaMap = new Map<string, any>();
        const listaDiaAtual = frequenciaGeral?.mapaDias?.[diaSelecionadoGeral]?.alunos || [];
        listaDiaAtual.forEach((item: any) => {
          if (item.alunoId) registrosDoDiaMap.set(item.alunoId, item);
        });

        const alunosTabelaDiaFiltrados = alunos.filter((a) => {
          const termo = buscaLancarDia.trim().toLowerCase();
          const bateBusca =
            !termo ||
            (a.nome && a.nome.toLowerCase().includes(termo)) ||
            (a.cpf && a.cpf.toLowerCase().includes(termo));
          if (!bateBusca) return false;

          if (filtroPlanoLancarDia !== 'TODOS') {
            if (filtroPlanoLancarDia === 'BOLSISTA' && !a.is_bolsista) return false;
            if (filtroPlanoLancarDia === 'CONVENIO_DIARIA' && !isDiariaOuConvenio(a.plano)) return false;
            if (
              filtroPlanoLancarDia !== 'BOLSISTA' &&
              filtroPlanoLancarDia !== 'CONVENIO_DIARIA' &&
              (a.plano || '') !== filtroPlanoLancarDia
            ) {
              return false;
            }
          }

          if (apenasNaoLancadosDia && registrosDoDiaMap.has(a.id)) {
            return false;
          }

          return true;
        });

        const todosFiltradosMarcados =
          alunosTabelaDiaFiltrados.length > 0 &&
          alunosTabelaDiaFiltrados.every((a) => alunosSelecionadosDia.includes(a.id));

        return (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-3 sm:p-5 z-[999999] overflow-y-auto">
            <div
              className={`bg-[#141416] border border-zinc-800 p-5 sm:p-6 rounded-2xl w-full shadow-2xl my-6 transition-all ${
                modoLancarDia === 'LOTE' ? 'max-w-4xl' : 'max-w-md'
              }`}
            >
              {/* CABEÇALHO DO MODAL + SELETOR DE MODO (EM LOTE vs INDIVIDUAL) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800 mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <span>Lançar Presença na Turma</span>
                    {modoLancarDia === 'LOTE' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                        Modo Tabela em Lote
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-400">Data:</span>
                    <input
                      type="date"
                      value={diaSelecionadoGeral}
                      onChange={(e) => {
                        if (e.target.value) setDiaSelecionadoGeral(e.target.value);
                      }}
                      className="bg-[#1A1A1E] border border-red-500/50 rounded-lg px-2.5 py-1 text-xs font-bold text-red-400 focus:outline-none focus:border-red-500"
                    />
                    <span className="text-xs text-zinc-300 font-semibold">
                      ({new Date(diaSelecionadoGeral + 'T12:00:00').toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div className="flex bg-[#1A1A1E] p-1 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setModoLancarDia('LOTE')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                        modoLancarDia === 'LOTE'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      📋 Em Lote (Tabela)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModoLancarDia('INDIVIDUAL')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        modoLancarDia === 'INDIVIDUAL'
                          ? 'bg-red-600 text-white shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      👤 Individual (1 Aluno)
                    </button>
                  </div>

                  <button
                    onClick={() => setModalLancarDia(false)}
                    className="text-zinc-500 hover:text-white text-lg font-bold px-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* MODO 1: TABELA COMPLETA PARA LANÇAR NOVOS ALUNOS PRESENTES EM LOTE */}
              {modoLancarDia === 'LOTE' ? (
                <div className="space-y-4">
                  {/* CONFIGURAÇÃO DE STATUS E OBSERVAÇÃO DO LOTE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#1A1A1E]/80 border border-zinc-800 rounded-xl p-3.5">
                    <div>
                      <label className="block text-zinc-300 text-xs font-bold mb-1">
                        Status da Presença para os Selecionados
                      </label>
                      <select
                        value={statusLancarDia}
                        onChange={(e) => setStatusLancarDia(e.target.value)}
                        className="w-full bg-[#141416] border border-zinc-700 rounded-lg p-2.5 text-xs text-white font-bold"
                      >
                        <option value="PRESENTE">🟢 PRESENTE (Treinou normalmente)</option>
                        <option value="DOENCA">🔵 FALTA POR DOENÇA (Com atestado)</option>
                        <option value="FALTA">🔴 FALTA NÃO JUSTIFICADA</option>
                        <option value="JUSTIFICADO">ℹ️ OUTRA JUSTIFICATIVA (Trabalho/Viagem)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-300 text-xs font-bold mb-1">
                        Observação / Justificativa (Opcional)
                      </label>
                      <input
                        type="text"
                        value={justificativaLancarDia}
                        onChange={(e) => setJustificativaLancarDia(e.target.value)}
                        placeholder="Ex: Turma das 19h30, Treino coletivo, Atestado..."
                        className="w-full bg-[#141416] border border-zinc-700 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* BARRA DE BUSCA, FILTROS E SELEÇÃO EM MASSA */}
                  <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-2.5">
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={buscaLancarDia}
                        onChange={(e) => setBuscaLancarDia(e.target.value)}
                        placeholder="🔍 Buscar aluno por nome ou CPF..."
                        className="flex-1 min-w-[200px] bg-[#1A1A1E] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                      />

                      <select
                        value={filtroPlanoLancarDia}
                        onChange={(e) => setFiltroPlanoLancarDia(e.target.value)}
                        className="bg-[#1A1A1E] border border-zinc-700 rounded-lg px-2.5 py-2 text-xs text-zinc-200 font-semibold"
                      >
                        <option value="TODOS">Todos os Planos ({alunos.length})</option>
                        <option value="2x na semana">2x na semana</option>
                        <option value="3x na semana">3x na semana</option>
                        <option value="Todos os Horários">Todos os Horários</option>
                        <option value="CONVENIO_DIARIA">Wellhub / TotalPass / Diária</option>
                        <option value="BOLSISTA">Alunos Bolsistas</option>
                      </select>

                      <label className="flex items-center gap-1.5 text-xs text-zinc-300 bg-[#1A1A1E] border border-zinc-800 px-2.5 py-2 rounded-lg cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={apenasNaoLancadosDia}
                          onChange={(e) => setApenasNaoLancadosDia(e.target.checked)}
                          className="rounded bg-zinc-800 border-zinc-700 text-red-600"
                        />
                        <span>Ocultar já lançados no dia</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (todosFiltradosMarcados) {
                            const idsFiltrados = new Set(alunosTabelaDiaFiltrados.map((a) => a.id));
                            setAlunosSelecionadosDia((prev) => prev.filter((id) => !idsFiltrados.has(id)));
                          } else {
                            const novos = new Set([
                              ...alunosSelecionadosDia,
                              ...alunosTabelaDiaFiltrados.map((a) => a.id),
                            ]);
                            setAlunosSelecionadosDia(Array.from(novos));
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition whitespace-nowrap"
                      >
                        {todosFiltradosMarcados
                          ? 'Desmarcar Filtrados'
                          : `☑️ Selecionar Todos (${alunosTabelaDiaFiltrados.length})`}
                      </button>

                      {alunosSelecionadosDia.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setAlunosSelecionadosDia([])}
                          className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold transition"
                        >
                          Limpar ({alunosSelecionadosDia.length})
                        </button>
                      )}
                    </div>
                  </div>

                  {/* TABELA COMPLETA DE ALUNOS */}
                  <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#101012]">
                    <div className="max-h-[360px] overflow-y-auto boru-scrollbar">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#1A1A1E] text-zinc-400 uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-zinc-800">
                          <tr>
                            <th className="p-3 w-10 text-center">
                              <input
                                type="checkbox"
                                checked={todosFiltradosMarcados}
                                onChange={() => {
                                  if (todosFiltradosMarcados) {
                                    const idsFiltrados = new Set(alunosTabelaDiaFiltrados.map((a) => a.id));
                                    setAlunosSelecionadosDia((prev) => prev.filter((id) => !idsFiltrados.has(id)));
                                  } else {
                                    const novos = new Set([
                                      ...alunosSelecionadosDia,
                                      ...alunosTabelaDiaFiltrados.map((a) => a.id),
                                    ]);
                                    setAlunosSelecionadosDia(Array.from(novos));
                                  }
                                }}
                                className="rounded bg-zinc-800 border-zinc-700 text-red-600"
                              />
                            </th>
                            <th className="p-3">Aluno</th>
                            <th className="p-3">Plano</th>
                            <th className="p-3">Graduação</th>
                            <th className="p-3">Status neste Dia</th>
                            <th className="p-3 text-right">1-Clique Rápido</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                          {alunosTabelaDiaFiltrados.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-zinc-500">
                                Nenhum aluno encontrado para este filtro.
                              </td>
                            </tr>
                          ) : (
                            alunosTabelaDiaFiltrados.map((aluno) => {
                              const selecionado = alunosSelecionadosDia.includes(aluno.id);
                              const regHoje = registrosDoDiaMap.get(aluno.id);

                              return (
                                <tr
                                  key={aluno.id}
                                  onClick={() => {
                                    if (selecionado) {
                                      setAlunosSelecionadosDia((prev) => prev.filter((id) => id !== aluno.id));
                                    } else {
                                      setAlunosSelecionadosDia((prev) => [...prev, aluno.id]);
                                    }
                                  }}
                                  className={`cursor-pointer transition ${
                                    selecionado
                                      ? 'bg-emerald-950/30 hover:bg-emerald-950/40'
                                      : 'hover:bg-zinc-800/40'
                                  }`}
                                >
                                  <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="checkbox"
                                      checked={selecionado}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setAlunosSelecionadosDia((prev) => [...prev, aluno.id]);
                                        } else {
                                          setAlunosSelecionadosDia((prev) => prev.filter((id) => id !== aluno.id));
                                        }
                                      }}
                                      className="rounded bg-zinc-800 border-zinc-700 text-emerald-500"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <div className="font-bold text-white flex items-center gap-1.5">
                                      <span>{aluno.nome}</span>
                                      {aluno.is_bolsista && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                          BOLSISTA
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-zinc-500">CPF: {aluno.cpf}</span>
                                  </td>
                                  <td className="p-3 text-zinc-300 font-medium">{aluno.plano || '2x na semana'}</td>
                                  <td className="p-3 text-zinc-400">{aluno.prajied || 'Branco'}</td>
                                  <td className="p-3">
                                    {regHoje ? (
                                      <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                          regHoje.status === 'PRESENTE'
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : regHoje.status === 'DOENCA'
                                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}
                                      >
                                        ✓ Já lançado ({regHoje.status})
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-zinc-500 italic">Sem registro no dia</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="inline-flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleLancarAlunoRapidoNaTabela(aluno.id, 'PRESENTE')}
                                        className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[10px] font-black transition"
                                        title="Adicionar este aluno como Presente imediatamente"
                                      >
                                        + Presente
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleLancarAlunoRapidoNaTabela(aluno.id, 'FALTA')}
                                        className="px-2 py-1 rounded bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-[10px] font-bold transition"
                                        title="Marcar Falta imediatamente"
                                      >
                                        ✗ Falta
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* RODAPÉ DO LOTE */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-zinc-800">
                    <div className="text-xs text-zinc-400">
                      Selecionados para lançar em lote:{' '}
                      <strong className="text-emerald-400 text-sm">{alunosSelecionadosDia.length} aluno(s)</strong>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => setModalLancarDia(false)}
                        className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition"
                      >
                        Fechar
                      </button>
                      <button
                        type="button"
                        disabled={salvandoLoteDia || alunosSelecionadosDia.length === 0}
                        onClick={handleLancarPresencaLoteDiaGeral}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-black transition shadow-lg shadow-emerald-900/30 flex items-center gap-1.5"
                      >
                        <span>✅</span>
                        <span>
                          {salvandoLoteDia
                            ? 'Salvando Lote...'
                            : `Salvar Presença em Lote (${alunosSelecionadosDia.length} alunos)`}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* MODO 2: LANÇAMENTO INDIVIDUAL CLÁSSICO */
                <form onSubmit={handleLancarPresencaDiaGeral} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 text-xs font-semibold">Selecione o Aluno</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={buscaAlunoLancarIndividual}
                        onChange={(e) => setBuscaAlunoLancarIndividual(e.target.value)}
                        placeholder="🔍 Digite para pesquisar aluno por nome..."
                        className="w-full bg-[#141416] border border-zinc-700 focus:border-red-500 rounded-lg pl-3 pr-8 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                      />
                      {buscaAlunoLancarIndividual && (
                        <button
                          type="button"
                          onClick={() => setBuscaAlunoLancarIndividual('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {(() => {
                      const filtrados = alunos.filter((a) => {
                        if (!buscaAlunoLancarIndividual.trim()) return true;
                        const t = buscaAlunoLancarIndividual.trim().toLowerCase();
                        return a.nome.toLowerCase().includes(t) || (a.cpf && a.cpf.includes(t));
                      });
                      return (
                        <select
                          required
                          value={alunoLancarDia}
                          onChange={(e) => setAlunoLancarDia(e.target.value)}
                          className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-xs text-white font-medium"
                        >
                          <option value="">-- Escolha um aluno ({filtrados.length} encontrados) --</option>
                          {filtrados.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.nome} ({a.plano || 'Geral'}) - Prajied {a.prajied || 'Branco'}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1">Status da Presença</label>
                    <select
                      value={statusLancarDia}
                      onChange={(e) => setStatusLancarDia(e.target.value)}
                      className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-xs text-white font-medium"
                    >
                      <option value="PRESENTE">🟢 PRESENTE (Treinou normalmente)</option>
                      <option value="DOENCA">🔵 FALTA POR DOENÇA (Com atestado)</option>
                      <option value="FALTA">🔴 FALTA NÃO JUSTIFICADA</option>
                      <option value="JUSTIFICADO">ℹ️ OUTRA JUSTIFICATIVA (Trabalho/Viagem)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1">
                      Observação / Justificativa (Opcional)
                    </label>
                    <input
                      type="text"
                      value={justificativaLancarDia}
                      onChange={(e) => setJustificativaLancarDia(e.target.value)}
                      placeholder="Ex: Treino das 18h, Atestado de 2 dias, etc."
                      className="w-full bg-[#1A1A1E] border border-zinc-700 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setModoLancarDia('LOTE')}
                      className="w-full py-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition"
                    >
                      📋 Quer selecionar vários alunos de uma vez? Abrir Tabela em Lote →
                    </button>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setModalLancarDia(false)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition"
                    >
                      Salvar Presença
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        );
      })()}

      {/* MODAL: VISÃO 360 DO ALUNO (FASE 1 - COMBAT-PASS HUB) */}
      {aluno360Id && (
        <Student360Modal
          studentId={aluno360Id}
          onClose={() => setAluno360Id(null)}
          onRefreshStudentList={carregarDashboard}
        />
      )}

    </div>
  );
}
