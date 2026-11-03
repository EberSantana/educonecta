import {
  Course,
  Turma,
  Student,
  Professor,
  Discipline,
  Lesson,
  Material,
  Announcement,
  Discussion,
  Assignment,
  OfficeHour,
  UserProfile,
} from '../types';

/**
 * Cursos Oficiais do Instituto Federal de Sergipe (IFS) - Campus Tobias Barreto
 * 1. Técnico Integrado em Desenvolvimento de Sistemas (Resolução CS/IFS nº 216/2023 - 3.333,3h)
 * 2. Técnico em Informática (Subsequente) (Resolução nº 09/2017/CS/IFS - 1.203h)
 */
export const initialCourses: Course[] = [
  {
    id: 'course-tds',
    code: 'TDS-INT',
    name: 'Técnico Integrado em Desenvolvimento de Sistemas',
    degree: 'Técnico Integrado',
    durationSemesters: 6,
    coordinator: 'Prof. Eber Santana',
    department: 'Coordenação de Informática (COINF) - Campus Tobias Barreto',
    description:
      'Curso Técnico de Nível Médio Integrado ao Ensino Médio do IFS Campus Tobias Barreto (Resolução CS/IFS nº 216/2023). O Núcleo Tecnológico e Práticas Profissionais Integradoras capacitam para projetar, desenvolver, testar e manter softwares desktop, web e mobile, modelar bancos de dados e gerenciar infraestrutura e segurança da informação.',
    activeStudentsCount: 84,
    campus: 'IFS Campus Tobias Barreto',
    resolution: 'Resolução CS/IFS nº 216/2023 (PPC 3.333,3h)',
    workloadTotalHours: 3333,
  },
  {
    id: 'course-inf',
    code: 'INF-SUB',
    name: 'Técnico em Informática (Subsequente)',
    degree: 'Técnico Subsequente',
    durationSemesters: 4,
    coordinator: 'Prof. Eber Santana',
    department: 'Coordenação de Informática (COINF) - Campus Tobias Barreto',
    description:
      'Curso Técnico Subsequente ao Ensino Médio do IFS Campus Tobias Barreto regido pela Resolução nº 09/2017/CS/IFS. Forma profissionais qualificados em desenvolvimento web e sistemas, modelagem de banco de dados, arquitetura e sistemas operacionais, infraestrutura de redes e segurança da informação.',
    activeStudentsCount: 68,
    campus: 'IFS Campus Tobias Barreto',
    resolution: 'Resolução nº 09/2017/CS/IFS (PPC 1.203h - 1.444 h/a)',
    workloadTotalHours: 1203,
  },
];

/**
 * Matrizes Curriculares Oficiais - IFS Campus Tobias Barreto
 * 1. Curso Técnico Integrado em Desenvolvimento de Sistemas (Núcleo Tecnológico & Projetos Integradores)
 * 2. Curso Técnico em Informática Subsequente (4 Períodos)
 */
export const initialDisciplines: Discipline[] = [
  // =========================================================================
  // CURSO: TÉCNICO INTEGRADO EM DESENVOLVIMENTO DE SISTEMAS (TDS-INT)
  // Resolução CS/IFS nº 216/2023 - Núcleo Tecnológico & Práticas Integradas
  // =========================================================================

  // --- 1º ANO TDS (Núcleo Tecnológico) ---
  {
    id: 'tds-prog1',
    code: 'TDS101',
    name: 'Programação 1',
    courseId: 'course-tds',
    credits: 5,
    workloadHours: 167,
    workloadLessons: 200,
    weeklyHours: 5,
    theoryHours: 50,
    practiceHours: 150,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 1,
    semester: '1º Ano (Núcleo Tecnológico)',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 01',
    schedule: 'Segundas e Terças, 07:30 - 09:45',
    description:
      'Introdução à linguagem de programação, algoritmos, variáveis, tipos de dados, estruturas sequenciais, condicionais e repetição, vetores, matrizes, funções, strings, introdução à POO e exceções.',
    syllabus:
      'Introdução à Linguagem de Programação; Conceito de Algoritmo; Ambiente de Programação; Conceito de Variável; Tipos de Dados; Tipos de Linguagens; Estruturas (sequencial, condicional e de repetição); Vetor e Matriz; Funções; Manipulação de Cadeias de Caracteres; Introdução ao Paradigma de Orientação a Objetos; Classes, objetos, atributos e métodos; Associação entre classes (agregação, composição, herança e polimorfismo); Classes abstratas e interfaces; Tratamento de exceção.',
    objectives:
      'Capacitar quanto à lógica e linguagens de programação, preparando para o paradigma orientado a objetos e resolução de problemas.',
    color: '#3b82f6',
    studentsCount: 38,
    modules: [
      'Introdução a Algoritmos, Variáveis e Tipos Primitivos',
      'Estruturas Condicionais (if/switch) e de Repetição (for/while)',
      'Estruturas de Dados: Vetores e Matrizes',
      'Modularização com Funções e Manipulação de Strings',
      'Introdução à POO: Classes, Objetos, Encapsulamento, Herança e Exceções',
    ],
    lessonsCount: 38,
    bibliography: {
      basic: [
        'DEITEL, Paul; DEITEL, Harvey. Java: como programar. 10. ed. São Paulo: Pearson Education do Brasil, 2017. ISBN 9788543004792.',
        'RIBEIRO, João Araújo. Introdução à programação e aos algoritmos. Rio de Janeiro: LTC, 2019. ISBN 9788521636410.',
      ],
      complementar: [
        'FÉLIX, Rafael (org.). Programação Orientada a Objetos. São Paulo: Pearson Education do Brasil, 2016. ISBN 9788543020174.',
        'JUNIOR, Dilermando et al. Algoritmos e programação de computadores. 2. ed. Rio de Janeiro: Elsevier, 2019. ISBN 9788535292480.',
        'MANZANO, José Augusto N. G. Algoritmos: lógica para desenvolvimento de programação de computadores. 29. ed. São Paulo: Érica, 2019. ISBN 9788536531472.',
      ],
    },
  },
  {
    id: 'tds-sites1',
    code: 'TDS102',
    name: 'Construção de Sites 1',
    courseId: 'course-tds',
    credits: 2,
    workloadHours: 67,
    workloadLessons: 80,
    weeklyHours: 2,
    theoryHours: 20,
    practiceHours: 60,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 1,
    semester: '1º Ano (Núcleo Tecnológico)',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 02',
    schedule: 'Quartas-feiras, 07:30 - 09:10',
    description:
      'Layout e páginas estáticas com HTML (estrutura e tags principais), CSS, design e boas práticas visuais (harmonia, formas, equilíbrio, imagens, cores e botões).',
    syllabus:
      'Layout e páginas estáticas com HTML (estrutura e tags principais); CSS; Design e boas práticas (harmonia, formas, equilíbrio, imagens, cores e botões).',
    objectives:
      'Dominar a criação de websites estáticos estruturados semanticamente com HTML5 e estilizados com CSS3, aplicando harmonia visual e acessibilidade.',
    color: '#06b6d4',
    studentsCount: 38,
    modules: [
      'História da Web e Estrutura Semântica HTML5',
      'Hiperlinks, Mídias, Tabelas e Formulários',
      'Estilização com CSS3, Cores, Tipografia e Box Model',
      'Fundamentos de Web Design, Harmonia Visual e Publicação',
    ],
    lessonsCount: 19,
    bibliography: {
      basic: [
        'TERUEL, Evandro Carlos. HTML 5: guia prático. 2. ed. São Paulo: Érica, 2014. ISBN 9788536519296.',
        'FLATSCHART, Fábio. HTML 5 - Embarque Imediato. Rio de Janeiro: Brasport, 2011. ISBN 9788574525778.',
      ],
      complementar: [
        'MARINHO, Antônio Lopes M.; CRUZ, Jorge Luiz da (org.). Desenvolvimento de aplicações para Internet. Pearson, 2020. ISBN 9786550110604.',
        'BONATTI, Denilson. Desenvolvimento de Sites Dinâmicos com Dreamweaver CC. Brasport, 2014. ISBN 9788574526447.',
        'WILLIAMS, Robin. Design para quem não é designer. 4. ed. Callis, 2008. ISBN 9788574168364.',
      ],
    },
  },
  {
    id: 'tds-intro',
    code: 'TDS103',
    name: 'Introdução à Informática',
    courseId: 'course-tds',
    credits: 3,
    workloadHours: 100,
    workloadLessons: 120,
    weeklyHours: 3,
    theoryHours: 30,
    practiceHours: 90,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 1,
    semester: '1º Ano (Núcleo Tecnológico)',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 02',
    schedule: 'Quintas-feiras, 07:30 - 10:00',
    description:
      'Evolução dos computadores, ferramentas de escritório, navegação web segura, arquitetura de Von Neumann, sistemas de numeração, processadores, memórias, montagem e fundamentos de SO.',
    syllabus:
      'Introdução à Informática e evolução dos computadores; Manuseio de Sistemas Operacionais e ferramentas de escritório (editores de texto, apresentação e planilha); Navegação web (pesquisa, e-mail e aspectos de segurança); Arquitetura de Von Neumann; Sistemas de Numeração; Processadores, memórias e dispositivos de E/S; Montagem de computadores; Sistemas Operacionais (conceitos, instalação, processos, estados, threads, arquivos e diretórios).',
    objectives:
      'Compreender o funcionamento da máquina e periféricos, capacitando para utilizar softwares utilitários, configurar sistemas operacionais e realizar montagem básica de computadores.',
    color: '#059669',
    studentsCount: 38,
    modules: [
      'Evolução da Computação e Sistemas de Numeração (Binário, Hexadecimal)',
      'Arquitetura de Von Neumann, CPU, Barramentos e Memórias',
      'Montagem e Manutenção Básica de Computadores e Periféricos',
      'Sistemas Operacionais (Instalação, Processos, Threads e Arquivos)',
      'Ferramentas de Escritório e Produtividade Acadêmica',
    ],
    lessonsCount: 24,
    bibliography: {
      basic: [
        'BELMIRO N. João (org.). Informática aplicada. 2. ed. São Paulo: Pearson Education do Brasil, 2019. ISBN 9788570160393.',
        'MARÇULA, Marcelo. Informática: conceitos e aplicações. 5. ed. São Paulo: Érica, 2019. ISBN 9788536531984.',
      ],
      complementar: [
        'CARVALHO, André C. P. L. F. de; LORENA, Ana Carolina. Introdução à computação: hardware, software e dados. LTC, 2017. ISBN 9788521633150.',
        'DELGADO, José; RIBEIRO, Carlos. Arquitetura de Computadores. 5. ed. LTC, 2017. ISBN 9788521633921.',
        'JUNIOR, Ramiro Sebastião C. et al. Sistemas Operacionais. SAGAH, 2018. ISBN 9788595027336.',
      ],
    },
  },

  // --- 2º ANO TDS (Núcleo Tecnológico & Projeto Integrador 1) ---
  {
    id: 'tds-prog2',
    code: 'TDS201',
    name: 'Programação 2',
    courseId: 'course-tds',
    credits: 4,
    workloadHours: 133,
    workloadLessons: 160,
    weeklyHours: 4,
    theoryHours: 40,
    practiceHours: 120,
    prerequisites: 'Programação 1',
    periodNumber: 2,
    semester: '2º Ano (Núcleo Tecnológico)',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 01',
    schedule: 'Segundas e Terças, 09:30 - 11:10',
    description:
      'Aplicações cliente-servidor, fundamentos de desenvolvimento para web, variáveis, expressões, estruturas de controle, funções, formulários web, classes, objetos e integração com banco de dados.',
    syllabus:
      'Conceitos básicos sobre aplicações cliente-servidor; Fundamentos de programação para desenvolvimento cliente-servidor; Instalação e configuração de ambientes de desenvolvimento; Sintaxe básica, variáveis, tipos de dados, constantes, operadores, expressões, estruturas de controle e funções; Formulários Web; Interação entre aplicações Web; Classes e objetos; Integração com banco de dados.',
    objectives:
      'Desenvolver sistemas cliente-servidor com conexão a banco de dados relacional e manipulação de formulários web.',
    color: '#6366f1',
    studentsCount: 35,
    modules: [
      'Arquitetura Cliente-Servidor e Configuração do Ambiente Backend',
      'Estruturas de Controle, Funções e Tratamento de Formulários Web',
      'Programação Orientada a Objetos Aplicada ao Backend',
      'Integração e Persistência de Dados em Banco de Dados',
    ],
    lessonsCount: 28,
    bibliography: {
      basic: [
        'DEITEL, Paul; DEITEL, Harvey. Java: como programar. 10. ed. Pearson Education do Brasil, 2017. ISBN 9788543004792.',
        'RIBEIRO, João Araújo. Introdução à programação e aos algoritmos. LTC, 2019. ISBN 9788521636410.',
      ],
      complementar: [
        'FÉLIX, Rafael (org.). Programação orientada a objetos. Pearson, 2016. ISBN 9788543020174.',
        'JUNIOR, Dilermando et al. Algoritmos e programação de computadores. Elsevier, 2019. ISBN 9788535292480.',
        'MANZANO, José Augusto N. G. Algoritmos. Érica, 2019. ISBN 9788536531472.',
      ],
    },
  },
  {
    id: 'tds-sites2',
    code: 'TDS202',
    name: 'Construção de Sites 2',
    courseId: 'course-tds',
    credits: 2,
    workloadHours: 67,
    workloadLessons: 80,
    weeklyHours: 2,
    theoryHours: 20,
    practiceHours: 60,
    prerequisites: 'Construção de Sites 1',
    periodNumber: 2,
    semester: '2º Ano (Núcleo Tecnológico)',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 02',
    schedule: 'Quartas-feiras, 09:30 - 11:10',
    description:
      'Linguagens de programação client-side, manipulação dinâmica do DOM, comunicação assíncrona com APIs, bibliotecas e frameworks para front-end.',
    syllabus:
      'Linguagens de programação client-side; Bibliotecas e frameworks para front-end.',
    objectives:
      'Construir aplicações front-end ricas e responsivas utilizando JavaScript moderno, manipulação de eventos e consumo assíncrono de APIs.',
    color: '#8b5cf6',
    studentsCount: 35,
    modules: [
      'JavaScript ES6+ para Web: Sintaxe, Escopo e Funções',
      'Manipulação Dinâmica do Document Object Model (DOM)',
      'Comunicação Assíncrona e Consumo de APIs (Fetch API / JSON)',
      'Bibliotecas e Frameworks Modernos de Front-End',
    ],
    lessonsCount: 19,
    bibliography: {
      basic: [
        'OLIVEIRA, Cláudio Luís V.; ZANETTI, Humberto Augusto P. JavaScript descomplicado: programação para a Web, IoT e dispositivos móveis. Érica, 2020. ISBN 9788536533100.',
        'FLANAGAN, David. JavaScript: o guia definitivo. 6. ed. Bookman, 2014. ISBN 9788565837484.',
      ],
      complementar: [
        'BONATTI, Denilson. Desenvolvimento de Sites Dinâmicos com Dreamweaver CC. Brasport, 2014. ISBN 9788574526447.',
        'MARINHO & CRUZ. Desenvolvimento de aplicações para Internet. Pearson, 2020. ISBN 9786550110604.',
        'BREITMAN, Karin. Web semântica: a Internet do futuro. LTC, 2005. ISBN 9788521619581.',
      ],
    },
  },
  {
    id: 'tds-bdes',
    code: 'TDS203',
    name: 'Banco de Dados e Engenharia de Software',
    courseId: 'course-tds',
    credits: 3,
    workloadHours: 100,
    workloadLessons: 120,
    weeklyHours: 3,
    theoryHours: 30,
    practiceHours: 90,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 2,
    semester: '2º Ano (Núcleo Tecnológico)',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 03',
    schedule: 'Sextas-feiras, 07:30 - 10:00',
    description:
      'SGBD, modelagem conceitual (DER), lógica e física, normalização, SQL (DDL, DML, DQL), introdução à Engenharia de Software (processos, metodologias ágeis), gestão de projetos, requisitos e UML.',
    syllabus:
      'Introdução a Banco de Dados e a Sistema Gerenciador de Banco de Dados (SGBD); Modelagem de Dados (conceitual, lógica e física); Normalização; Linguagem SQL; Introdução à Engenharia de Software (processos, metodologias tradicionais e ágeis); Gestão de Projetos; Análise de Requisitos e Linguagem UML.',
    objectives:
      'Modelar, normalizar e implementar bancos relacionais e documentar requisitos de software com diagramas UML sob processos ágeis.',
    color: '#d97706',
    studentsCount: 35,
    modules: [
      'SGBDs e Modelagem Conceitual: Diagrama Entidade-Relacionamento (DER)',
      'Projeto Lógico Relacional, Normalização (1FN a 3FN) e SQL Completo',
      'Engenharia de Software: Ciclo de Vida, Cascata e Metodologias Ágeis (Scrum)',
      'Elicitação de Requisitos e Modelagem Estrutural/Comportamental com UML',
    ],
    lessonsCount: 28,
    bibliography: {
      basic: [
        'ALVES, William Pereira. Banco de Dados: teoria e desenvolvimento. 2. ed. São Paulo: Érica, 2021. ISBN 9788536533759.',
        'PRESSMAN, Roger S. Engenharia de Software: uma abordagem profissional. 8. ed. AMGH, 2016. ISBN 9788580555332.',
      ],
      complementar: [
        'MACHADO, Felipe Nery Rodrigues. Banco de Dados: projeto e implementação. 4. ed. Érica, 2020. ISBN 9788536532707.',
        'ELMASRI, Ramez; NAVATHE, Shamkant B. Sistemas de Banco de Dados. 7. ed. Pearson, 2018. ISBN 9788543025001.',
        'SOMMERVILLE, Ian. Engenharia de Software. 10. ed. Pearson, 2018. ISBN 9788543024974.',
      ],
    },
  },
  {
    id: 'tds-pi1',
    code: 'TDS204',
    name: 'Projeto Integrador 1',
    courseId: 'course-tds',
    credits: 2,
    workloadHours: 67,
    workloadLessons: 80,
    weeklyHours: 2,
    theoryHours: 20,
    practiceHours: 60,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 2,
    semester: '2º Ano (Prática Profissional Integrada)',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 01',
    schedule: 'Quintas-feiras, 09:30 - 11:10',
    description:
      'Definição do tema e do problema a ser resolvido em equipe. Termo de Abertura de Projeto (TAP), elicitação de requisitos funcionais, diagrama de Casos de Uso com especificação estendida, diagrama de Classes e modelagens conceitual e lógica do banco de dados.',
    syllabus:
      'Definição do tema e do problema: definição do componente curricular e do tema a ser estudado; definição do problema a ser resolvido. Planejamento e modelagem da solução/software: Termo de Abertura de Projeto; Elicitação de Requisitos Funcionais; Diagrama de Casos de Uso e sua documentação estendida; Diagrama de Classes. Modelagens Conceitual e Lógica dos dados.',
    objectives:
      'Integrar os conhecimentos técnicos do 1º e 2º anos na identificação de um problema real da comunidade e na modelagem completa da solução de software.',
    color: '#f59e0b',
    studentsCount: 35,
    modules: [
      'Identificação de Demanda Real e Elaboração do Termo de Abertura de Projeto (TAP)',
      'Elicitação e Validação de Requisitos Funcionais e Não-Funcionais',
      'Modelagem UML: Diagramas de Casos de Uso com Cenários e Diagramas de Classes',
      'Modelagens Conceitual (DER) e Lógica do Banco de Dados Relacional',
    ],
    lessonsCount: 19,
    bibliography: {
      basic: [
        'ALVES, William Pereira. Banco de Dados: teoria e desenvolvimento. Érica, 2021. ISBN 9788536533759.',
        'PRESSMAN, Roger S. Engenharia de Software. AMGH, 2016. ISBN 9788580555332.',
      ],
      complementar: [
        'BELMIRO N. João (org.). Informática aplicada. Pearson, 2019. ISBN 9788570160393.',
        'DEITEL, Paul; DEITEL, Harvey. Java: como programar. Pearson, 2017. ISBN 9788543004792.',
        'TERUEL, Evandro Carlos. HTML 5: guia prático. Érica, 2014. ISBN 9788536519296.',
      ],
    },
  },

  // --- 3º ANO TDS (Núcleo Tecnológico & Projeto Integrador 2) ---
  {
    id: 'tds-redes-seg',
    code: 'TDS301',
    name: 'Redes de Computadores e Segurança da Informação',
    courseId: 'course-tds',
    credits: 3,
    workloadHours: 100,
    workloadLessons: 120,
    weeklyHours: 3,
    theoryHours: 60,
    practiceHours: 60,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 3,
    semester: '3º Ano (Núcleo Tecnológico)',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Redes e Manutenção',
    schedule: 'Quartas-feiras, 07:30 - 10:00',
    description:
      'Modelos TCP/IP e ISO/OSI, camadas, protocolos, endereçamento IP, equipamentos, cabeamento. Segurança: conceitos, vulnerabilidades, ameaças, riscos, autenticação, mecanismos de defesa, criptografia e implementação de rede com segurança.',
    syllabus:
      'Redes de Computadores: Conceitos; Modelos TCP/IP e ISO/OSI; Camadas e protocolos; Endereçamento IP; Equipamentos e Cabeamentos. Segurança da Informação: Conceitos e propriedades; Vulnerabilidades, ameaças, risco e impacto; Sistemas de Autenticação; Mecanismos de Defesa; Criptografia; Implementação de projeto de rede com requisitos de segurança.',
    objectives:
      'Planejar e implantar redes de computadores cabeadas e sem fio, aplicando políticas de segurança, criptografia e mecanismos de defesa perimetral.',
    color: '#dc2626',
    studentsCount: 32,
    modules: [
      'Modelos OSI e TCP/IP, Camadas, Protocolos e Meios Físicos de Transmissão',
      'Endereçamento IPv4/IPv6, Cálculo de Sub-redes e Roteamento de Redes',
      'Segurança da Informação: Pilares (CIDAN), Riscos e Ameaças Cibernéticas',
      'Criptografia, Autenticação Segura, Firewalls e Projeto Prático de Redes',
    ],
    lessonsCount: 24,
    bibliography: {
      basic: [
        'MORAES, Alexandre Fernandes D. Redes de Computadores: fundamentos. 8. ed. Érica, 2020. ISBN 9788536532981.',
        'STALLINGS, William; CASE, Thomas. Redes e Sistemas de Comunicação de Dados. 2. ed. Elsevier, 2016. ISBN 9788535283587.',
      ],
      complementar: [
        'BARRETO, Jeanine dos S. et al. Fundamentos de segurança da informação. SAGAH, 2018. ISBN 9788595025875.',
        'MACHADO, Felipe Nery Rodrigues. Segurança da Informação: princípios e controle de ameaças. Érica, 2019. ISBN 9788536531212.',
        'SOUZA, Lindeberg Barros de. Administração de redes locais. 2. ed. Érica, 2021. ISBN 9788536533698.',
      ],
    },
  },
  {
    id: 'tds-topicos',
    code: 'TDS302',
    name: 'Tópicos Especiais',
    courseId: 'course-tds',
    credits: 3,
    workloadHours: 100,
    workloadLessons: 120,
    weeklyHours: 3,
    theoryHours: 60,
    practiceHours: 60,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 3,
    semester: '3º Ano (Núcleo Tecnológico)',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 03',
    schedule: 'Sextas-feiras, 07:30 - 10:00',
    description:
      'Temas e conteúdos relevantes em Informática: minicursos, seminários e projetos em linguagens modernas, arquitetura de software, Mineração de Dados (Data Mining) e Business Intelligence (BI).',
    syllabus:
      'Trabalhar temas e conteúdos relevantes no âmbito da Informática através do desenvolvimento de atividades, minicursos, seminários e projetos, de modo a desenvolver no aluno novas competências e habilidades, assim como a capacidade de continuar o seu processo de desenvolvimento profissional.',
    objectives:
      'Desenvolver competências em tópicos contemporâneos de TI, incluindo arquitetura de software, inteligência analítica de negócios e mineração de dados.',
    color: '#0284c7',
    studentsCount: 32,
    modules: [
      'Arquitetura de Software e Padrões de Projeto (Design Patterns)',
      'Fundamentos de Mineração de Dados (Data Mining) e Descoberta de Conhecimento',
      'Business Intelligence (BI) e Painéis de Indicadores (Dashboards)',
      'Tendências Tecnológicas Contemporâneas e Mercado Profissional de TI',
    ],
    lessonsCount: 24,
    bibliography: {
      basic: [
        'GALLOTTI, Giocondo Marino Antônio (org.). Arquitetura de software. Pearson, 2016. ISBN 9788543017358.',
        'OLIVEIRA, Cláudio Luís V.; ZANETTI, Humberto Augusto P. JavaScript descomplicado. Érica, 2020. ISBN 9788536533100.',
      ],
      complementar: [
        'GONÇALVES, Priscila et al. Testes de Software e Gerência de Configuração. Grupo A, 2019. ISBN 9788595029361.',
        'GOLDSCHMIDT, Ronaldo. Data Mining: Conceitos, técnicas, algoritmos e aplicações. GEN LTC, 2015. ISBN 978859515639.',
        'SHARDA, Ramesh. Business Intelligence e Análise de Dados para Gestão do Negócio. Bookman, 2019. ISBN 9788582605202.',
      ],
    },
  },
  {
    id: 'tds-pi2',
    code: 'TDS303',
    name: 'Projeto Integrador 2',
    courseId: 'course-tds',
    credits: 4,
    workloadHours: 133,
    workloadLessons: 160,
    weeklyHours: 4,
    theoryHours: 40,
    practiceHours: 120,
    prerequisites: 'Projeto Integrador 1',
    periodNumber: 3,
    semester: '3º Ano (Prática Profissional Integrada)',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 01',
    schedule: 'Segundas e Terças, 10:15 - 11:55',
    description:
      'Revisão da modelagem de software. Construção, testes e validação do sistema: banco de dados, front-end, back-end, integração das camadas, operações completas de CRUD e apresentação pública da solução para a comunidade.',
    syllabus:
      'Revisão da modelagem do software: Termo de Abertura de Projeto; Diagrama de Casos de Uso e sua documentação estendida; Diagrama de Classes. Construção, testes e validação do software: construção e manipulação do Banco de Dados; Implementação do front-end; Implementação do back-end; Integração das camadas (front-end, back-end e banco de dados); Implementação das funcionalidades básicas do CRUD.',
    objectives:
      'Construir e disponibilizar a solução de software funcional para a comunidade, aplicando banco de dados, front-end, back-end, integração de camadas e operações de CRUD.',
    color: '#10b981',
    studentsCount: 32,
    modules: [
      'Revisão dos Requisitos e Configuração do Repositório Git/GitHub',
      'Implementação do Banco de Dados e Camada de Acesso a Dados (DAO/ORM)',
      'Desenvolvimento do Front-End Responsivo e Acessível',
      'Desenvolvimento do Back-End e Funcionalidades do CRUD Completo',
      'Testes de Sistema, Homologação e Apresentação Pública de Extensão',
    ],
    lessonsCount: 32,
    bibliography: {
      basic: [
        'DEITEL, Paul; DEITEL, Harvey. Java: como programar. Pearson, 2017. ISBN 9788543004792.',
        'TERUEL, Evandro Carlos. HTML 5: guia prático. Érica, 2014. ISBN 9788536519296.',
      ],
      complementar: [
        'OLIVEIRA, Cláudio Luís V.; ZANETTI, Humberto Augusto P. JavaScript descomplicado. Érica, 2020. ISBN 9788536533100.',
        'ALVES, William Pereira. Banco de Dados: teoria e desenvolvimento. Érica, 2021. ISBN 9788536533759.',
        'PRESSMAN, Roger S. Engenharia de Software. AMGH, 2016. ISBN 9788580555332.',
      ],
    },
  },

  // =========================================================================
  // CURSO: TÉCNICO EM INFORMÁTICA SUBSEQUENTE (INF-SUB)
  // Resolução nº 09/2017/CS/IFS - 4 Períodos (15 Disciplinas)
  // =========================================================================
  {
    id: 'inf-prog1',
    code: 'INF101',
    name: 'Programação I',
    courseId: 'course-inf',
    credits: 8,
    workloadHours: 127,
    workloadLessons: 152,
    weeklyHours: 8,
    theoryHours: 42,
    practiceHours: 85,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 1,
    semester: '1º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 01',
    schedule: 'Segundas e Terças, 19:00 - 22:15',
    description:
      'Fundamentos de algoritmos e lógica de programação, variáveis, estruturas condicionais e de repetição, vetores, matrizes, funções, strings, registros e arquivos.',
    syllabus:
      'Conceito de Algoritmo; Variável; Tipos de Dados; Tipos de Linguagens; Estrutura Sequencial; Estrutura Condicional; Estrutura de Repetição; Vetor e Matriz; Procedimentos, Funções e Métodos; Strings; Registros; Manipulação de Arquivos.',
    objectives:
      'Desenvolver o raciocínio lógico formal para resolução de problemas computacionais, dominando a sintaxe de programação estruturada e manipulação de memória.',
    color: '#3b82f6',
    studentsCount: 32,
    modules: [
      'Introdução aos Algoritmos e Tipos de Dados',
      'Estruturas de Controle: Decisão (if/switch) e Repetição (for/while)',
      'Estruturas de Dados Homogêneas: Vetores e Matrizes',
      'Modularização: Procedimentos, Funções e Escopo',
      'Strings, Registros (Structs) e Manipulação de Arquivos',
    ],
    lessonsCount: 38,
    bibliography: {
      basic: [
        'ASCENCIO, Ana Fernanda Gomes; CAMPOS, Edilene Aparecida Veneruchi de. Fundamentos da Programação de Computadores: algoritmos, Pascal, C/C++ e Java. 3. ed. São Paulo: Pearson, 2012.',
        'MANZANO, José Augusto N. G.; OLIVEIRA, Jayr Figueiredo de. Algoritmos: Lógica para Desenvolvimento de Programação de Computadores. 28. ed. São Paulo: Érica, 2016.',
      ],
      complementar: [
        'FORBELLONE, André Luiz Villar; EBERSPÄCHER, Henri Frederico. Lógica de Programação: a construção de algoritmos e estruturas de dados. 3. ed. São Paulo: Prentice Hall, 2005.',
        'DEITEL, Paul; DEITEL, Harvey. Java: como programar. 10. ed. São Paulo: Pearson, 2016.',
        'ZIVIANI, Nivio. Projeto de Algoritmos com implementações em Pascal e C. São Paulo: Cengage Learning, 2011.',
      ],
    },
  },
  {
    id: 'inf-orgso',
    code: 'INF102',
    name: 'Organização de Computadores e Sistemas Operacionais',
    courseId: 'course-inf',
    credits: 6,
    workloadHours: 95,
    workloadLessons: 114,
    weeklyHours: 6,
    theoryHours: 63,
    practiceHours: 32,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 1,
    semester: '1º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Manutenção e SO',
    schedule: 'Quartas-feiras, 19:00 - 21:30 e Sextas-feiras, 19:00 - 20:40',
    description:
      'Evolução dos computadores, representação binária e hexadecimal, arquitetura de Von Neumann, CPU, memória, barramentos, fundamentos de SO, processos, threads, Linux Shell e Windows.',
    syllabus:
      'A evolução dos computadores; Representação de dados: binário, octal e hexadecimal; Arquitetura de Von Neumann; Unidade Central de Processamento (CPU), Memória e Dispositivos de Entrada e Saída; Sistemas operacionais modernos; Processos e threads; Gerenciamento de memória; Sistemas de arquivos e diretórios; Prática de comandos e administração em Linux e Windows.',
    objectives:
      'Compreender o funcionamento do hardware e sua integração com o software básico, capacitando para configurar e administrar sistemas operacionais modernos via interface e terminal.',
    color: '#059669',
    studentsCount: 32,
    modules: [
      'Histórico, Evolução e Sistemas de Numeração',
      'Arquitetura de Von Neumann: CPU, Barramentos e Hierarquia de Memória',
      'Princípios de Sistemas Operacionais: Processos, Threads e Escalonamento',
      'Gerenciamento de Memória Virtual e Sistemas de Arquivos',
      'Administração Prática em Linux (Bash, Permissões, Serviços) e Windows',
    ],
    lessonsCount: 28,
    bibliography: {
      basic: [
        'TANENBAUM, Andrew S. Organização Estruturada de Computadores. 6. ed. São Paulo: Pearson, 2013.',
        'TANENBAUM, Andrew S.; BOS, Herbert. Sistemas Operacionais Modernos. 4. ed. São Paulo: Pearson, 2015.',
      ],
      complementar: [
        'STALLINGS, William. Arquitetura e Organização de Computadores. 10. ed. São Paulo: Pearson, 2017.',
        'SILBERSCHATZ, Abraham; GALVIN, Peter B.; GAGNE, Greg. Fundamentos de Sistemas Operacionais. 9. ed. Rio de Janeiro: LTC, 2015.',
        'MACHADO, Francis Berenger; MAIA, Luiz Paulo. Arquitetura de Sistemas Operacionais. 5. ed. Rio de Janeiro: LTC, 2013.',
      ],
    },
  },
  {
    id: 'inf-basica',
    code: 'INF103',
    name: 'Informática Básica',
    courseId: 'course-inf',
    credits: 4,
    workloadHours: 63,
    workloadLessons: 76,
    weeklyHours: 4,
    theoryHours: 21,
    practiceHours: 42,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 1,
    semester: '1º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 02',
    schedule: 'Quintas-feiras, 19:00 - 22:15',
    description:
      'Fundamentos de informática, hardware e software, Microsoft Windows, pacote LibreOffice (Writer, Impress, Calc), navegação segura na internet e produtividade em nuvem.',
    syllabus:
      'Conceitos fundamentais de informática, hardware e software; Sistema operacional Microsoft Windows: organização de pastas e arquivos, painel de controle; Pacote LibreOffice: Writer (processador de textos com normas ABNT), Impress (apresentações dinâmicas), Calc (planilhas de cálculo, fórmulas matemáticas, estatísticas e gráficos); Navegação segura na Internet, correio eletrônico e armazenamento em nuvem.',
    objectives:
      'Dominar o uso produtivo de sistemas computacionais, editores de texto sob normas acadêmicas, planilhas eletrônicas com modelagem de fórmulas e apresentações profissionais.',
    color: '#0284c7',
    studentsCount: 32,
    modules: [
      'Conceitos de Informática e Gerenciamento de Arquivos no Windows',
      'Editoração de Textos Acadêmicos com LibreOffice Writer (Normas ABNT)',
      'Planilhas Eletrônicas Avançadas com LibreOffice Calc (Fórmulas e Gráficos)',
      'Apresentações Visuais Profissionais com LibreOffice Impress',
      'Serviços em Nuvem, Armazenamento Colaborativo e Segurança Básica',
    ],
    lessonsCount: 19,
    bibliography: {
      basic: [
        'VELLOSO, Fernando de Castro. Informática: conceitos básicos. 9. ed. Rio de Janeiro: Elsevier, 2014.',
        'MANZANO, José Augusto N. G. Estudo Dirigido de Informática Básica. São Paulo: Érica, 2015.',
      ],
      complementar: [
        'NORTON, Peter. Introdução à Informática. São Paulo: Pearson, 2010.',
        'CAPRON, H. L.; JOHNSON, J. A. Introdução à Informática. 8. ed. São Paulo: Pearson, 2004.',
      ],
    },
  },
  {
    id: 'inf-ingles',
    code: 'INF104',
    name: 'Inglês Instrumental',
    courseId: 'course-inf',
    credits: 2,
    workloadHours: 32,
    workloadLessons: 38,
    weeklyHours: 2,
    theoryHours: 16,
    practiceHours: 16,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 1,
    semester: '1º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Sala B-02',
    schedule: 'Sextas-feiras, 20:50 - 22:15',
    description:
      'Estratégias de leitura e compreensão de textos técnicos em língua inglesa, vocabulário especializado em TI, manuais, documentação de software e termos técnicos.',
    syllabus:
      'Estratégias de leitura e compreensão de textos técnicos em língua inglesa (skimming, scanning, cognatos e falsos cognatos); Vocabulário técnico específico da área de Informática e Tecnologia da Informação; Estruturas gramaticais essenciais: tempos verbais, verbos modais, afixos (prefixos e sufixos), voz passiva; Interpretação de manuais de instalação, especificações técnicas, documentações de APIs e mensagens de erro de compiladores.',
    objectives:
      'Capacitar o futuro técnico a ler e interpretar com autonomia especificações de hardware, manuais técnicos de software e documentações de linguagens de programação.',
    color: '#8b5cf6',
    studentsCount: 32,
    modules: [
      'Técnicas de Leitura Rápida: Skimming, Scanning e Cognatos',
      'Glossário Técnico e Terminologias da Tecnologia da Informação',
      'Gramática Funcional: Afixos, Verbos Modais e Voz Passiva em Manuais',
      'Interpretação de Documentações de APIs, Logs e Especificações de TI',
    ],
    lessonsCount: 10,
    bibliography: {
      basic: [
        'GLENDINNING, Eric H.; MCEWAN, John. Oxford English for Information Technology. 2. ed. Oxford: Oxford University Press, 2006.',
        'SOUZA, Adriana Grade F. et al. Leitura em Língua Inglesa: uma abordagem instrumental. São Paulo: Disal, 2005.',
      ],
      complementar: [
        'ESTERAS, Santiago Remacha. Infotech: English for Computer Users. 4. ed. Cambridge: Cambridge University Press, 2008.',
        'MURPHY, Raymond. English Grammar in Use. 4. ed. Cambridge: Cambridge University Press, 2012.',
      ],
    },
  },

  // --- 2º PERÍODO SUBSEQUENTE ---
  {
    id: 'inf-prog2',
    code: 'INF201',
    name: 'Programação II',
    courseId: 'course-inf',
    credits: 8,
    workloadHours: 127,
    workloadLessons: 152,
    weeklyHours: 8,
    theoryHours: 42,
    practiceHours: 85,
    prerequisites: 'Programação I',
    periodNumber: 2,
    semester: '2º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 01',
    schedule: 'Segundas e Terças, 19:00 - 22:15',
    description:
      'Programação Orientada a Objetos (POO), classes, objetos, atributos, métodos, encapsulamento, herança, polimorfismo, classes abstratas, interfaces, exceções e coleções.',
    syllabus:
      'Paradigma da Programação Orientada a Objetos (POO); Conceito de Classes, Objetos, Métodos, Atributos e Construtores; Encapsulamento e modificadores de visibilidade; Relacionamentos entre classes: Associação, Agregação e Composição; Herança de classes e Polimorfismo; Classes Abstratas e Interfaces; Tratamento estruturado de exceções (try/catch/finally); Estruturas de dados em coleções (Listas, Filas, Pilhas); Manipulação e persistência de dados em arquivos e banco de dados.',
    objectives:
      'Dominar o paradigma orientado a objetos, desenvolvendo sistemas robustos, modulares e de fácil manutenção utilizando boas práticas de encapsulamento e polimorfismo.',
    color: '#6366f1',
    studentsCount: 28,
    modules: [
      'Fundamentos da Orientação a Objetos: Classes, Objetos e Métodos',
      'Encapsulamento, Modificadores de Acesso e Sobrecarga de Métodos',
      'Associação, Agregação e Composição entre Objetos',
      'Herança, Polimorfismo, Classes Abstratas e Interfaces',
      'Tratamento Estruturado de Exceções e Coleções (Collections Framework)',
    ],
    lessonsCount: 38,
    bibliography: {
      basic: [
        'DEITEL, Paul; DEITEL, Harvey. Java: como programar. 10. ed. São Paulo: Pearson, 2016.',
        'SIERRA, Kathy; BATES, Bert. Use a Cabeça! Java. 2. ed. Rio de Janeiro: Alta Books, 2007.',
      ],
      complementar: [
        'SANTOS, Rafael. Introdução à Programação Orientada a Objetos Usando Java. 2. ed. Rio de Janeiro: Campus, 2013.',
        'BARNES, David J.; KÖLLING, Michael. Programação Orientada a Objetos com Java. 4. ed. São Paulo: Pearson, 2009.',
        'HORSTMANN, Cay S. Core Java: Fundamentos. 10. ed. São Paulo: Pearson, 2017.',
      ],
    },
  },
  {
    id: 'inf-bd',
    code: 'INF202',
    name: 'Banco de Dados',
    courseId: 'course-inf',
    credits: 6,
    workloadHours: 95,
    workloadLessons: 114,
    weeklyHours: 6,
    theoryHours: 35,
    practiceHours: 60,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 2,
    semester: '2º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 03',
    schedule: 'Quartas-feiras, 19:00 - 21:30 e Quintas-feiras, 19:00 - 20:40',
    description:
      'SGBDs relacionais, modelagem conceitual (MER/DER), modelo relacional, normalização de dados (1FN, 2FN, 3FN), linguagem SQL (DDL, DML, DQL), junções e integridade.',
    syllabus:
      'Fundamentos de Sistemas Gerenciadores de Banco de Dados (SGBD); Arquitetura ANSI/SPARC; Modelagem conceitual com Modelo Entidade-Relacionamento (MER/DER): entidades, atributos, relacionamentos, cardinalidades e generalização/especialização; Projeto Lógico Relacional e regras de mapeamento; Normalização de Dados (1FN, 2FN, 3FN); Linguagem SQL: Data Definition Language (DDL - CREATE, ALTER, DROP), Data Manipulation Language (DML - INSERT, UPDATE, DELETE) e consultas avançadas (DQL - SELECT, WHERE, ORDER BY, GROUP BY, HAVING, INNER/LEFT/RIGHT JOIN, subconsultas); Índices, integridade referencial e transações ACID.',
    objectives:
      'Modelar, normalizar e implementar bancos de dados relacionais eficientes, utilizando a linguagem SQL para consultas e manipulação em SGBDs de mercado como MySQL e PostgreSQL.',
    color: '#d97706',
    studentsCount: 28,
    modules: [
      'Introdução aos SGBDs e Arquitetura Relacional',
      'Modelagem Conceitual: Diagrama Entidade-Relacionamento (DER)',
      'Mapeamento Lógico Relacional e Formas Normais (1FN, 2FN, 3FN)',
      'Linguagem SQL: Definição e Manipulação de Dados (DDL e DML)',
      'Consultas Analíticas Avançadas (DQL): Agrupamentos, Junções e Subqueries',
    ],
    lessonsCount: 28,
    bibliography: {
      basic: [
        'ELMASRI, Ramez; NAVATHE, Shamkant B. Sistemas de Banco de Dados. 6. ed. São Paulo: Pearson, 2011.',
        'SILBERSCHATZ, Abraham; KORTH, Henry F.; SUDARSHAN, S. Sistema de Banco de Dados. 6. ed. Rio de Janeiro: Campus, 2012.',
      ],
      complementar: [
        'DATE, C. J. Introdução a Sistemas de Bancos de Dados. 8. ed. Rio de Janeiro: Campus, 2004.',
        'HEUSER, Carlos Alberto. Projeto de Banco de Dados. 6. ed. Porto Alegre: Sagra Luzzatto, 2009.',
        'PUGA, Sandra; FRANÇA, Edson; GOYA, Milton. Banco de Dados: Implementação em SQL, PL/SQL e Oracle 11g. São Paulo: Pearson, 2013.',
      ],
    },
  },
  {
    id: 'inf-sites1',
    code: 'INF203',
    name: 'Construção de Sites I',
    courseId: 'course-inf',
    credits: 4,
    workloadHours: 63,
    workloadLessons: 76,
    weeklyHours: 4,
    theoryHours: 23,
    practiceHours: 40,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 2,
    semester: '2º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 02',
    schedule: 'Sextas-feiras, 19:00 - 22:15',
    description:
      'Arquitetura da Web, HTML5 semântico, estilização com CSS3, Box Model, alinhamentos com Flexbox, teoria de cores, tipografia e boas práticas de web design e acessibilidade.',
    syllabus:
      'Visão geral da arquitetura Web e protocolos HTTP/HTTPS; Linguagem de marcação HTML5: estruturação semântica, cabeçalhos, parágrafos, listas, tabelas, links e formulários interativos com validações; Estilização com CSS3: sintaxe, seletores, herança e especificidade; O Modelo de Caixas (Box Model: margin, border, padding, content); Posicionamento e layouts com Flexbox; Fundamentos de Web Design: teoria das cores, tipografia digital, contraste, ergonomia visual e acessibilidade web (WCAG); Otimização de imagens e vetores para a web.',
    objectives:
      'Projetar e construir interfaces web modernas e atraentes com HTML5 semântico e CSS3, aplicando padrões de acessibilidade e design responsivo.',
    color: '#06b6d4',
    studentsCount: 28,
    modules: [
      'Fundamentos da Web e Estrutura Semântica HTML5',
      'Hiperlinks, Mídias, Tabelas e Formulários Interativos',
      'Estilização CSS3: Seletores, Cores, Tipografia e Especificidade',
      'O Modelo de Caixas (Box Model) e Layouts Flexíveis com Flexbox',
      'Design Visual, Acessibilidade Web (WCAG) e Publicação',
    ],
    lessonsCount: 19,
    bibliography: {
      basic: [
        'SILVA, Maurício Samy. Construindo Sites com HTML5 e CSS3. 2. ed. São Paulo: Novatec, 2014.',
        'ROBBINS, Jennifer. Aprenda Design Web: Um guia para iniciantes em HTML, CSS, JavaScript e gráficos para a Web. 4. ed. São Paulo: Novatec, 2014.',
      ],
      complementar: [
        'NIELSEN, Jakob; BUDIU, Raluca. Usabilidade Móvel. Rio de Janeiro: Campus, 2013.',
        'DUCKETT, Jon. HTML e CSS: projete e construa websites. Rio de Janeiro: Alta Books, 2014.',
        'FLANAGAN, David. JavaScript: O Guia Definitivo. 6. ed. Porto Alegre: Bookman, 2013.',
      ],
    },
  },

  // --- 3º PERÍODO SUBSEQUENTE ---
  {
    id: 'inf-prog3',
    code: 'INF301',
    name: 'Programação III',
    courseId: 'course-inf',
    credits: 6,
    workloadHours: 95,
    workloadLessons: 114,
    weeklyHours: 6,
    theoryHours: 25,
    practiceHours: 70,
    prerequisites: 'Programação II e Banco de Dados',
    periodNumber: 3,
    semester: '3º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 01',
    schedule: 'Segundas e Terças, 19:00 - 21:30',
    description:
      'Arquitetura cliente-servidor, desenvolvimento web backend, padrão MVC, gerenciamento de sessões, persistência com banco de dados, APIs RESTful e segurança web.',
    syllabus:
      'Arquitetura Cliente-Servidor e Desenvolvimento Web Backend; Padrão arquitetural MVC (Model-View-Controller); Processamento de requisições HTTP (GET, POST, PUT, DELETE); Manipulação de sessões de usuário e cookies; Criação e processamento de formulários dinâmicos; Mapeamento Objeto-Relacional (ORM/DAO) e integração com banco de dados; Desenvolvimento de APIs RESTful e serialização JSON; Boas práticas de segurança em aplicações web (injeção SQL, CSRF, XSS).',
    objectives:
      'Desenvolver aplicações web robustas no lado do servidor, integrando sistemas a bancos de dados através de APIs RESTful estruturadas sob o padrão MVC.',
    color: '#8b5cf6',
    studentsCount: 24,
    modules: [
      'Arquitetura Web Cliente-Servidor e o Padrão MVC',
      'Processamento de Requisições HTTP e Ciclo de Vida do Servidor',
      'Sessões de Usuário, Autenticação e Segurança (Criptografia de Senhas)',
      'Integração com Banco de Dados: Padrão DAO e Conexões Seguras',
      'Construção de APIs RESTful e Serviços Web com JSON',
    ],
    lessonsCount: 28,
    bibliography: {
      basic: [
        'DALL’OGLIO, Pablo. PHP: Programando com Orientação a Objetos. 3. ed. São Paulo: Novatec, 2015.',
        'FLANAGAN, David. JavaScript: O Guia Definitivo. 6. ed. Porto Alegre: Bookman, 2013.',
      ],
      complementar: [
        'NIEDERAUER, Juliano. Desenvolvendo Websites com PHP. 3. ed. São Paulo: Novatec, 2017.',
        'WENZ, Christian. Programação Web com PHP e MySQL. São Paulo: Bookman, 2012.',
        'DEITEL, Paul; DEITEL, Harvey. Ajax, Rich Internet Applications e Desenvolvimento Web para Programadores. São Paulo: Pearson, 2008.',
      ],
    },
  },
  {
    id: 'inf-eng',
    code: 'INF302',
    name: 'Engenharia de Software',
    courseId: 'course-inf',
    credits: 6,
    workloadHours: 95,
    workloadLessons: 114,
    weeklyHours: 6,
    theoryHours: 25,
    practiceHours: 70,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 3,
    semester: '3º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 03',
    schedule: 'Quartas-feiras, 19:00 - 21:30 e Quintas-feiras, 19:00 - 20:40',
    description:
      'Ciclo de vida do software, processos cascata e ágeis (Scrum/Kanban), engenharia de requisitos funcionais e não-funcionais, modelagem UML e ferramentas CASE.',
    syllabus:
      'Conceitos de software e ciclo de vida do desenvolvimento; Modelos de processo de software: cascata, prototipação, incremental, espiral e metodologias ágeis (Scrum, Kanban e XP); Engenharia de requisitos: elicitação, análise, especificação (requisitos funcionais e não-funcionais) e validação; Modelagem de sistemas com a Unified Modeling Language (UML): diagramas de casos de uso, diagrama de classes, diagrama de sequência e diagrama de atividades; Ferramentas CASE para modelagem; Gestão e estimativa de projetos de software; Introdução a testes de software (unitários, integração e sistema) e garantia da qualidade.',
    objectives:
      'Planejar, especificar e documentar soluções de software com base em requisitos claros e diagramas UML, utilizando métodos ágeis de gestão e princípios de qualidade.',
    color: '#f59e0b',
    studentsCount: 24,
    modules: [
      'Ciclo de Vida do Software e Modelos de Processo (Cascata vs Ágil/Scrum)',
      'Engenharia de Requisitos: Elicitação, Requisitos Funcionais e SRS',
      'Modelagem Estrutural e Comportamental com UML (Casos de Uso, Classes, Sequência)',
      'Uso de Ferramentas CASE e Documentação Técnica de Projetos',
      'Qualidade de Software: Testes Unitários e Gestão de Versões',
    ],
    lessonsCount: 28,
    bibliography: {
      basic: [
        'PRESSMAN, Roger S.; MAXIM, Bruce R. Engenharia de Software: uma abordagem profissional. 8. ed. Porto Alegre: McGraw-Hill, 2016.',
        'SOMMERVILLE, Ian. Engenharia de Software. 10. ed. São Paulo: Pearson, 2019.',
      ],
      complementar: [
        'BEZERRA, Eduardo. Princípios de Análise e Projeto de Sistemas com UML. 3. ed. Rio de Janeiro: Campus, 2015.',
        'LARMAN, Craig. Utilizando UML e Padrões: uma introdução à análise e ao projeto orientados a objetos. 3. ed. Porto Alegre: Bookman, 2007.',
        'FOWLER, Martin. UML Essencial: Um Breve Guia para a Linguagem Padrão de Modelagem de Objetos. 3. ed. Porto Alegre: Bookman, 2005.',
      ],
    },
  },
  {
    id: 'inf-sites2',
    code: 'INF303',
    name: 'Construção de Sites II',
    courseId: 'course-inf',
    credits: 4,
    workloadHours: 63,
    workloadLessons: 76,
    weeklyHours: 4,
    theoryHours: 23,
    practiceHours: 40,
    prerequisites: 'Construção de Sites I',
    periodNumber: 3,
    semester: '3º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 02',
    schedule: 'Quintas-feiras, 20:50 - 22:15 e Sextas-feiras, 19:00 - 20:40',
    description:
      'JavaScript client-side moderno (ES6+), manipulação dinâmica do DOM, consumo de APIs assíncronas (Fetch/Async/Await), CSS Grid Layout e frameworks front-end.',
    syllabus:
      'A linguagem JavaScript no lado cliente (client-side): sintaxe moderna (ES6+), variáveis, funções de seta, eventos do navegador; Manipulação dinâmica do Document Object Model (DOM) e CSSOM; Validações assíncronas de formulários; Requisições assíncronas e consumo de APIs com Fetch API e Ajax; Design Responsivo avançado: CSS Grid Layout e Media Queries; Utilização de frameworks e bibliotecas front-end contemporâneas (Bootstrap, Tailwind CSS ou React); Princípios de Usabilidade, UI/UX e Progressive Web Apps (PWA).',
    objectives:
      'Construir aplicações web dinâmicas e responsivas no cliente, manipulando a árvore DOM, consumindo serviços assíncronos e aplicando bibliotecas modernas de estilização.',
    color: '#10b981',
    studentsCount: 24,
    modules: [
      'JavaScript ES6+: Sintaxe Moderna, Arrow Functions e Eventos',
      'Manipulação Dinâmica do DOM e Validação de Formulários',
      'Comunicação Assíncrona: Promises, Fetch API e Consumo de JSON',
      'Layouts Bidimensionais Avançados com CSS Grid e Media Queries',
      'Frameworks Modernos de Front-End e Princípios de UX/UI',
    ],
    lessonsCount: 19,
    bibliography: {
      basic: [
        'FLANAGAN, David. JavaScript: O Guia Definitivo. 6. ed. Porto Alegre: Bookman, 2013.',
        'SILVA, Maurício Samy. CSS Grid Layout: Criando layouts com CSS Grid. São Paulo: Novatec, 2017.',
      ],
      complementar: [
        'HAVERBEKE, Marijn. Eloquent JavaScript: Uma introdução moderna à programação. São Paulo: Novatec, 2019.',
        'SIMPSON, Kyle. Série Você Não Sabe JS (Up & Going, Scope & Closures). São Paulo: Novatec, 2016.',
        'FREEMAN, Eric; ROBSON, Elisabeth. Use a Cabeça! Programação JavaScript. Rio de Janeiro: Alta Books, 2015.',
      ],
    },
  },
  {
    id: 'inf-top1',
    code: 'INF304',
    name: 'Tópicos Especiais I',
    courseId: 'course-inf',
    credits: 2,
    workloadHours: 32,
    workloadLessons: 38,
    weeklyHours: 2,
    theoryHours: 16,
    practiceHours: 16,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 3,
    semester: '3º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Sala B-03',
    schedule: 'Sextas-feiras, 20:50 - 22:15',
    description:
      'Tendências e inovações do setor de TI, minicursos práticos, versionamento com Git e GitHub, pesquisa aplicada, ética profissional e legislação de software.',
    syllabus:
      'Estudo de tecnologias emergentes e inovações no mercado de Tecnologia da Informação; Minicursos práticos sobre ferramentas atuais de desenvolvimento, controle de versão avançado com Git/GitHub; Pesquisa científica aplicada em informática; Elaboração de resumos técnicos, pôsteres e artigos; Apresentação de seminários temáticos; Ética profissional, legislação da informática e direitos autorais de software no Brasil.',
    objectives:
      'Fomentar a pesquisa, o domínio de ferramentas contemporâneas como Git e a reflexão crítica sobre ética profissional e novas demandas tecnológicas.',
    color: '#ec4899',
    studentsCount: 24,
    modules: [
      'Inovações Tecnológicas e Tendências de Mercado em TI',
      'Controle de Versão Colaborativo com Git e GitHub',
      'Metodologia de Pesquisa Científica Aplicada à Informática',
      'Ética Profissional, Propriedade Intelectual e Legislação de Software',
    ],
    lessonsCount: 10,
    bibliography: {
      basic: [
        'CHACON, Scott; STRAUB, Ben. Pro Git. 2. ed. Nova York: Apress, 2014.',
        'WAZLAWICK, Raul Sidnei. Metodologia de Pesquisa para Ciência da Computação. 2. ed. Rio de Janeiro: Elsevier, 2014.',
      ],
      complementar: [
        'MASIERO, Paulo Cesar. Ética em Computação. São Paulo: Edusp, 2012.',
        'Publicações Periódicas e Anais da Sociedade Brasileira de Computação (SBC).',
      ],
    },
  },

  // --- 4º PERÍODO SUBSEQUENTE ---
  {
    id: 'inf-proj',
    code: 'INF401',
    name: 'Projeto de Informática',
    courseId: 'course-inf',
    credits: 8,
    workloadHours: 127,
    workloadLessons: 152,
    weeklyHours: 8,
    theoryHours: 27,
    practiceHours: 100,
    prerequisites: 'Engenharia de Software e Programação III',
    periodNumber: 4,
    semester: '4º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 01',
    schedule: 'Segundas e Terças, 19:00 - 22:15',
    description:
      'Desenvolvimento de software prático completo voltado a demandas reais da comunidade ou comércio local de Tobias Barreto, cobrindo requisitos, DER, UML, código full-stack e defesa pública.',
    syllabus:
      'Concepção, planejamento, modelagem, desenvolvimento e entrega de um projeto de software prático completo e funcional voltado para atender a uma demanda real da comunidade ou do mercado de Tobias Barreto e região; Elaboração do Documento de Especificação de Requisitos (SRS); Modelagem conceitual e lógica do banco de dados (DER/scripts SQL); Modelagem UML da arquitetura do sistema; Implementação full-stack com interface intuitiva; Realização de testes de software; Elaboração da documentação técnica e manual do usuário; Apresentação e defesa pública do produto perante banca de avaliação.',
    objectives:
      'Consolidar todas as competências do curso técnico no desenvolvimento e apresentação de um sistema de software real, completo e com documentação técnica profissional.',
    color: '#6366f1',
    studentsCount: 22,
    modules: [
      'Definição do Problema, Escopo e Especificação de Requisitos (SRS)',
      'Modelagem Completa do Sistema (UML e Banco de Dados Relacional)',
      'Implementação Full-Stack: Backend, Frontend e Persistência de Dados',
      'Testes de Sistema, Homologação e Manual do Usuário',
      'Entrega Final, Apresentação Pública e Defesa perante Banca',
    ],
    lessonsCount: 38,
    bibliography: {
      basic: [
        'PRESSMAN, Roger S.; MAXIM, Bruce R. Engenharia de Software: uma abordagem profissional. 8. ed. Porto Alegre: McGraw-Hill, 2016.',
        'SOMMERVILLE, Ian. Engenharia de Software. 10. ed. São Paulo: Pearson, 2019.',
      ],
      complementar: [
        'WAZLAWICK, Raul Sidnei. Metodologia de Pesquisa para Ciência da Computação. 2. ed. Rio de Janeiro: Elsevier, 2014.',
        'FOWLER, Martin. Padrões de Arquitetura de Aplicações Corporativas. Porto Alegre: Bookman, 2006.',
        'KNIBERG, Henrik. Scrum e XP direto das Trincheiras: Como nós fazemos Scrum. C4Media, 2007.',
      ],
    },
  },
  {
    id: 'inf-redes',
    code: 'INF402',
    name: 'Redes de Computadores',
    courseId: 'course-inf',
    credits: 4,
    workloadHours: 63,
    workloadLessons: 76,
    weeklyHours: 4,
    theoryHours: 23,
    practiceHours: 40,
    prerequisites: 'Organização de Computadores e Sistemas Operacionais',
    periodNumber: 4,
    semester: '4º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Redes e Manutenção',
    schedule: 'Quartas-feiras, 19:00 - 22:15',
    description:
      'Modelos OSI e TCP/IP, cabeamento estruturado (normas EIA/TIA), equipamentos de rede (switches e roteadores), endereçamento IPv4, cálculo de sub-redes, serviços essenciais e simulação no Cisco Packet Tracer.',
    syllabus:
      'Conceitos fundamentais de redes e transmissão de dados; Topologias físicas e lógicas de redes; Arquitetura em camadas: Modelo de Referência OSI/ISO e Arquitetura TCP/IP; Meios de transmissão guiados (cabo de par trançado UTP, fibra óptica) e não-guiados (redes sem fio Wi-Fi); Normas e boas práticas de cabeamento estruturado (EIA/TIA 568); Equipamentos de interconexão: repetidores, hubs, switches gerenciáveis e roteadores; Camada de Rede: protocolo IP, endereçamento IPv4, máscaras de sub-rede, cálculo de sub-redes (CIDR) e noções de IPv6; Camada de Transporte: protocolos TCP e UDP; Serviços da Camada de Aplicação: DNS, DHCP, HTTP/HTTPS, FTP e SSH; Simulação e configuração de topologias com software simulador de redes (Cisco Packet Tracer).',
    objectives:
      'Planejar, implantar e diagnosticar redes locais de computadores cabeadas e sem fio, configurando equipamentos ativos e calculando planos de endereçamento IP.',
    color: '#059669',
    studentsCount: 22,
    modules: [
      'Fundamentos de Redes, Topologias e Modelos OSI vs TCP/IP',
      'Meios de Transmissão Físicos e Normas de Cabeamento Estruturado',
      'Equipamentos de Interconexão: Hubs, Switches e Roteadores',
      'Camada de Rede: Endereçamento IPv4, Máscaras e Cálculo de Sub-redes',
      'Camadas de Transporte e Aplicação: Serviços DHCP, DNS e Simulação no Packet Tracer',
    ],
    lessonsCount: 19,
    bibliography: {
      basic: [
        'KUROSE, James F.; ROSS, Keith W. Redes de Computadores e a Internet: uma abordagem top-down. 6. ed. São Paulo: Pearson, 2013.',
        'TANENBAUM, Andrew S.; WETHERALL, David. Redes de Computadores. 5. ed. São Paulo: Pearson, 2011.',
      ],
      complementar: [
        'TORRES, Gabriel. Redes de Computadores: versão revisada e atualizada. Rio de Janeiro: Nova Terra, 2009.',
        'COMER, Douglas E. Interligação em Rede com TCP/IP: Princípios, Protocolos e Arquitetura. 6. ed. Rio de Janeiro: Elsevier, 2015.',
        'SOARES, Luiz Fernando Gomes; LEMOS, Guido; COLCHER, Sérgio. Redes de Computadores: das LANs, MANs e WANs às Redes ATM. 2. ed. Rio de Janeiro: Campus, 1995.',
      ],
    },
  },
  {
    id: 'inf-seg',
    code: 'INF403',
    name: 'Segurança da Informação',
    courseId: 'course-inf',
    credits: 4,
    workloadHours: 63,
    workloadLessons: 76,
    weeklyHours: 4,
    theoryHours: 32,
    practiceHours: 31,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 4,
    semester: '4º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 03',
    schedule: 'Quintas-feiras, 19:00 - 22:15',
    description:
      'Pilares da segurança (CIDAN), ameaças cibernéticas, criptografia simétrica e assimétrica, hash, certificados digitais, firewalls, políticas de segurança (PSI), LGPD e planos de contingência.',
    syllabus:
      'Princípios fundamentais da segurança da informação: Confidencialidade, Integridade, Disponibilidade, Autenticidade e Não-repúdio (CIDAN); Ameaças, vulnerabilidades, riscos e ataques cibernéticos comuns (malware, phishing, ransomware, DoS/DDoS, engenharia social, injeção SQL); Criptografia simétrica e assimétrica; Funções de Hash criptográfico e assinaturas digitais; Certificados digitais e protocolos SSL/TLS; Segurança perimetral: Firewalls, DMZ e Sistemas de Detecção e Prevenção de Intrusão (IDS/IPS); Elaboração e implementação de Políticas de Segurança da Informação (PSI); Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018) e conformidade legal; Planos de continuidade de negócios, procedimentos de backup e recuperação de desastres (Disaster Recovery).',
    objectives:
      'Implementar medidas de proteção de dados, configurar firewalls e elaborar políticas institucionais de segurança alinhadas à legislação vigente e normas ISO/IEC 27001.',
    color: '#dc2626',
    studentsCount: 22,
    modules: [
      'Pilares da Segurança (CIDAN), Ameaças Cibernéticas e Engenharia Social',
      'Criptografia Simétrica, Assimétrica, Hashes e Certificação Digital',
      'Segurança Perimetral: Firewalls, IDS/IPS, DMZ e Defesa em Profundidade',
      'Políticas de Segurança da Informação (PSI) e Conformidade com a LGPD',
      'Gestão de Continuidade de Negócios, Backups e Recuperação de Desastres',
    ],
    lessonsCount: 19,
    bibliography: {
      basic: [
        'STALLINGS, William. Criptografia e Segurança de Redes: princípios e práticas. 6. ed. São Paulo: Pearson, 2014.',
        'NAKAMURA, Emilio Tissato; GEUS, Paulo Lício de. Segurança de Redes em Ambientes de Cooperativas. São Paulo: Novatec, 2007.',
      ],
      complementar: [
        'DIAS, Cláudia. Segurança e Auditoria da Informação. Rio de Janeiro: Axcel Books, 2000.',
        'SEMEDO, Paulo. Segurança da Informação: Conceitos e Práticas. São Paulo: Érica, 2015.',
        'Normas ABNT NBR ISO/IEC 27001 e 27002.',
      ],
    },
  },
  {
    id: 'inf-top2',
    code: 'INF404',
    name: 'Tópicos Especiais II',
    courseId: 'course-inf',
    credits: 4,
    workloadHours: 63,
    workloadLessons: 76,
    weeklyHours: 4,
    theoryHours: 32,
    practiceHours: 31,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 4,
    semester: '4º Período',
    department: 'COINF - Campus Tobias Barreto',
    room: 'Laboratório de Informática 02',
    schedule: 'Sextas-feiras, 19:00 - 22:15',
    description:
      'Computação em nuvem (IaaS, PaaS, SaaS), virtualização e contêineres Docker, automação e esteiras CI/CD, fundamentos de IA aplicada e inserção no mercado de trabalho.',
    syllabus:
      'Tópicos contemporâneos e avançados em Tecnologia da Informação; Computação em Nuvem (Cloud Computing: IaaS, PaaS, SaaS, AWS/GCP); Virtualização e containers com Docker; Integração e Entrega Contínuas (CI/CD) e cultura DevOps; Fundamentos e aplicações de Inteligência Artificial e Aprendizado de Máquina (Machine Learning); Internet das Coisas (IoT) e automação; Preparação profissional: elaboração de currículo técnico, portfólio no GitHub, postura em entrevistas técnicas de TI e mercado de trabalho regional e remoto.',
    objectives:
      'Preparar o concluinte para os desafios mais recentes do setor tecnológico, abordando contêineres, nuvem, automação e empregabilidade.',
    color: '#0284c7',
    studentsCount: 22,
    modules: [
      'Computação em Nuvem: Modelos de Serviço (IaaS, PaaS, SaaS) e Provedores',
      'Virtualização Moderna: Contêineres com Docker e Orquestração Básica',
      'Cultura DevOps: Automação, Versionamento e Integração Contínua (CI/CD)',
      'Fundamentos de Inteligência Artificial Aplicada e Inovação em TI',
      'Carreira em TI: Portfólio Profissional, GitHub e Empregabilidade no Mercado',
    ],
    lessonsCount: 19,
    bibliography: {
      basic: [
        'VERAS, Manoel. Cloud Computing: migração de sistemas para a nuvem. Rio de Janeiro: Brasport, 2015.',
        'MELO, Robson. Docker para Desenvolvedores. São Paulo: Novatec, 2018.',
      ],
      complementar: [
        'KIM, Gene et al. Manual de DevOps: Como obter agilidade, confiabilidade e segurança em organizações tecnológicas. Rio de Janeiro: Alta Books, 2018.',
        'RUSSELL, Stuart; NORVIG, Peter. Inteligência Artificial: Uma abordagem moderna. 3. ed. Rio de Janeiro: Elsevier, 2013.',
        'Artigos científicos e publicações da SBC e IEEE Computer Society.',
      ],
    },
  },
];

/**
 * Aulas Oficiais Planejadas (Lessons) por Disciplina com base nas Ementas dos PPCs
 */
export const initialLessons: Lesson[] = [
  // --- PROGRAMAÇÃO 1 (TDS101 - Integrado) ---
  {
    id: 'les-tds101-01',
    disciplineId: 'tds-prog1',
    courseId: 'course-tds',
    lessonNumber: 1,
    bimestre: 1,
    title: 'Aula 01: Apresentação da Disciplina, Resolução 216/2023 e Lógica Computacional',
    summary:
      'Apresentação do plano de ensino do Núcleo Tecnológico (200 aulas), conceitos de algoritmos e fases de processamento de dados.',
    contentDetails: [
      'Visão geral da matriz do Curso Técnico Integrado em Desenvolvimento de Sistemas',
      'O que é um algoritmo e representação em fluxogramas e pseudocódigo',
      'Compiladores e interpretadores modernos',
    ],
    technologies: ['Algoritmos', 'Lógica'],
    durationHours: 4,
    status: 'concluida',
  },
  {
    id: 'les-tds101-02',
    disciplineId: 'tds-prog1',
    courseId: 'course-tds',
    lessonNumber: 2,
    bimestre: 1,
    title: 'Aula 02: Memória, Variáveis, Tipos de Dados e Operadores Aritméticos',
    summary:
      'Declaração e inicialização de variáveis, tipos primitivos e precedência de operadores matemáticos em Java/C.',
    contentDetails: [
      'Alocação na memória RAM',
      'Tipos inteiros, ponto flutuante, caracteres e booleanos',
      'Operações com entrada e saída de dados no terminal',
    ],
    technologies: ['Java', 'VS Code'],
    durationHours: 4,
    status: 'concluida',
  },
  {
    id: 'les-tds101-03',
    disciplineId: 'tds-prog1',
    courseId: 'course-tds',
    lessonNumber: 3,
    bimestre: 1,
    title: 'Aula 03: Estruturas Condicionais Simples, Compostas e Aninhadas (if/else)',
    summary:
      'Expressões booleanas, operadores relacionais e desvios de fluxo de controle.',
    contentDetails: [
      'Tabelas-verdade e operadores lógicos (&&, ||, !)',
      'Desvios condicionais simples, compostos e aninhados',
    ],
    technologies: ['Java', 'Lógica'],
    durationHours: 4,
    status: 'concluida',
  },
  {
    id: 'les-tds101-04',
    disciplineId: 'tds-prog1',
    courseId: 'course-tds',
    lessonNumber: 4,
    bimestre: 2,
    title: 'Aula 04: Estruturas de Repetição (for, while, do-while) e Vetores',
    summary:
      'Laços com contadores e acumuladores, arrays unidimensionais e iteração de listas.',
    contentDetails: [
      'Controle de iteração e prevenção de loops infinitos',
      'Declaração e busca sequencial em vetores',
    ],
    technologies: ['Arrays', 'Java'],
    durationHours: 4,
    status: 'em_andamento',
  },
  {
    id: 'les-tds101-05',
    disciplineId: 'tds-prog1',
    courseId: 'course-tds',
    lessonNumber: 5,
    bimestre: 3,
    title: 'Aula 05: Introdução à Programação Orientada a Objetos: Classes e Métodos',
    summary:
      'Transição da lógica estruturada para o paradigma orientado a objetos: abstração, classes, instâncias e construtores.',
    contentDetails: [
      'Conceito de classes e objetos no mundo real',
      'Atributos, métodos, visibilidade (private/public) e construtores',
    ],
    technologies: ['POO', 'Java'],
    durationHours: 4,
    status: 'prevista',
  },

  // --- CONSTRUÇÃO DE SITES 1 (TDS102 - Integrado) ---
  {
    id: 'les-tds102-01',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 1,
    bimestre: 1,
    title: 'Aula 01: Apresentação da Disciplina, Arquitetura da Web e HTML5 Semântico',
    summary:
      'Apresentação do plano de ensino de Construção de Sites 1, funcionamento da Internet (cliente/servidor, requisições HTTP) e a estrutura básica de um documento HTML5.',
    contentDetails: [
      'Visão geral da matriz do Curso Técnico Integrado em Desenvolvimento de Sistemas',
      'Estrutura essencial: <!DOCTYPE html>, <html>, <head>, <meta charset="UTF-8"> e <body>',
      'Configuração do ambiente de desenvolvimento: VS Code, Live Server e extensões recomendadas',
    ],
    technologies: ['HTML5', 'VS Code', 'HTTP'],
    durationHours: 4,
    status: 'concluida',
  },
  {
    id: 'les-tds102-02',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 2,
    bimestre: 1,
    title: 'Aula 02: Marcação de Textos, Títulos Semânticos e Hiperlinks',
    summary:
      'Hierarquia de títulos (h1 a h6), parágrafos, ênfases semânticas, links internos, relativos e absolutos com o elemento <a>.',
    contentDetails: [
      'Hierarquia de cabeçalhos semânticos e boas práticas de SEO e acessibilidade',
      'Criação de âncoras na mesma página e links para navegação entre páginas',
      'Atributos href, target="_blank", rel="noopener noreferrer"',
    ],
    technologies: ['HTML5', 'Semântica', 'Links'],
    durationHours: 4,
    status: 'concluida',
  },
  {
    id: 'les-tds102-03',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 3,
    bimestre: 1,
    title: 'Aula 03: Mídias na Web: Imagens, Formatos Gráficos e Vetoriais (SVG)',
    summary:
      'Inserção e otimização de imagens na web, tags <figure> e <figcaption>, texto alternativo (alt) para acessibilidade e uso de SVG.',
    contentDetails: [
      'Formatos de imagem na web: JPEG, PNG, WebP e SVG vetorial',
      'Atributos essenciais: src, alt, width e height',
      'Otimização de peso de imagens para carregamento rápido',
    ],
    technologies: ['HTML5', 'SVG', 'Otimização'],
    durationHours: 4,
    status: 'concluida',
  },
  {
    id: 'les-tds102-04',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 4,
    bimestre: 1,
    title: 'Aula 04: Avaliação 1: Criação de Portal Estático Semântico em HTML5',
    summary:
      'Avaliação prática bimestral: construção de um portal de notícias institucional com navegação interna, imagens otimizadas e semântica estrita.',
    contentDetails: [
      'Estruturação com tags semânticas (<header>, <nav>, <main>, <article>, <aside>, <footer>)',
      'Validação de conformidade W3C Validator',
      'Acessibilidade com tags de descrição e títulos coerentes',
    ],
    technologies: ['HTML5', 'W3C', 'Avaliação'],
    durationHours: 4,
    status: 'concluida',
    isEvaluation: true,
    evaluationType: 'prova',
  },
  {
    id: 'les-tds102-05',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 5,
    bimestre: 2,
    title: 'Aula 05: Tabelas e Dados Tabulares com Acessibilidade',
    summary:
      'Estruturação de tabelas semânticas utilizando <table>, <thead>, <tbody>, <tfoot>, <tr>, <th> e atributos de mesclagem colspan e rowspan.',
    contentDetails: [
      'Estrutura tabular acessível com elemento <caption> e escopo <th scope="col/row">',
      'Mesclagem de células com colspan e rowspan',
      'Boas práticas: quando usar e quando NÃO usar tabelas (proibição de layout tabular)',
    ],
    technologies: ['HTML5', 'Tabelas', 'Acessibilidade'],
    durationHours: 4,
    status: 'em_andamento',
  },
  {
    id: 'les-tds102-06',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 6,
    bimestre: 2,
    title: 'Aula 06: Formulários HTML5: Entradas de Dados e Validação Nativa',
    summary:
      'Construção de formulários com tags <form>, <input> de diversos tipos (text, email, tel, number, date), <select>, <textarea> e validações required, pattern, min/max.',
    contentDetails: [
      'Associação correta de rótulos com o atributo <label for="id">',
      'Tipos modernos de input HTML5 e restrições nativas do navegador',
      'Diferença entre métodos HTTP GET e POST',
    ],
    technologies: ['HTML5', 'Formulários', 'Validação'],
    durationHours: 4,
    status: 'prevista',
  },
  {
    id: 'les-tds102-07',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 7,
    bimestre: 2,
    title: 'Aula 07: Avaliação 2: Sistema de Cadastro com Formulários e Tabelas',
    summary:
      'Trabalho prático avaliativo em laboratório: elaboração de uma página de inscrição de eventos acadêmicos do IFS com tabela descritiva e formulário.',
    contentDetails: [
      'Aplicação de validações completas em formulários',
      'Exibição de cronograma em tabela semântica',
      'Entrega de código organizado no repositório didático',
    ],
    technologies: ['HTML5', 'Formulários', 'Projeto'],
    durationHours: 4,
    status: 'prevista',
    isEvaluation: true,
    evaluationType: 'prova',
  },
  {
    id: 'les-tds102-08',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 8,
    bimestre: 3,
    title: 'Aula 08: Introdução ao CSS3: Sintaxe, Formas de Inclusão e Seletores',
    summary:
      'Conceitos de folhas de estilo em cascata (CSS3), folha externa vs interna vs inline, seletores de tipo, classe e id, e especificidade.',
    contentDetails: [
      'Princípio de separação de conteúdo (HTML) e apresentação visual (CSS)',
      'Seletores básicos (.classe, #id, tag) e combinadores',
      'Ordem de cascata e herança de propriedades',
    ],
    technologies: ['CSS3', 'Estilização', 'Seletores'],
    durationHours: 4,
    status: 'prevista',
  },
  {
    id: 'les-tds102-09',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 9,
    bimestre: 3,
    title: 'Aula 09: Tipografia na Web e Sistemas de Cores (RGB, Hexadecimal, HSL)',
    summary:
      'Trabalho com fontes do sistema e web fonts (Google Fonts), propriedades font-family, font-size (rem, em, px), line-height, text-align e modelos de cor.',
    contentDetails: [
      'Unidades de medida absolutas (px) vs relativas (rem, em, %)',
      'Importação de fontes com @import e <link> do Google Fonts',
      'Contraste de cores (WCAG) para leitura acessível',
    ],
    technologies: ['CSS3', 'Tipografia', 'WCAG'],
    durationHours: 4,
    status: 'prevista',
  },
  {
    id: 'les-tds102-10',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 10,
    bimestre: 3,
    title: 'Aula 10: O Modelo de Caixas (CSS Box Model): Margin, Border, Padding e Content',
    summary:
      'Compreensão aprofundada do Box Model, propriedade box-sizing: border-box, colapso de margens e controle visual de dimensões.',
    contentDetails: [
      'Camadas de uma caixa CSS: Content, Padding, Border e Margin',
      'Diferença crucial entre content-box e border-box no reset CSS',
      'Estilização de bordas, cantos arredondados (border-radius) e sombras (box-shadow)',
    ],
    technologies: ['CSS3', 'Box Model', 'Layout'],
    durationHours: 4,
    status: 'prevista',
  },
  {
    id: 'les-tds102-11',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 11,
    bimestre: 3,
    title: 'Aula 11: Avaliação 3: Aplicação de Estilos Visuais e Box Model',
    summary:
      'Prova prática de desenvolvimento: receber um wireframe e código HTML cru e estilizá-lo fielmente aplicando Box Model e tipografia.',
    contentDetails: [
      'Fidelidade visual com o protótipo de design fornecido',
      'Uso correto de espaçamentos e border-box',
      'Código CSS limpo, modular e sem seletores redundantes',
    ],
    technologies: ['CSS3', 'Box Model', 'Avaliação'],
    durationHours: 4,
    status: 'prevista',
    isEvaluation: true,
    evaluationType: 'prova',
  },
  {
    id: 'les-tds102-12',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 12,
    bimestre: 4,
    title: 'Aula 12: Layout Moderno com Flexbox: Eixos, Alinhamento e Distribuição',
    summary:
      'Introdução ao display: flex, eixo principal (main axis) e cruzado (cross axis), justify-content, align-items, flex-direction e gap.',
    contentDetails: [
      'Substituição de floats e posicionamento arcaico por Flexbox',
      'Criação de barras de navegação alinhadas e cards flexíveis',
      'Propriedades dos filhos: flex-grow, flex-shrink e flex-basis',
    ],
    technologies: ['CSS3', 'Flexbox', 'Layout'],
    durationHours: 4,
    status: 'prevista',
  },
  {
    id: 'les-tds102-13',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 13,
    bimestre: 4,
    title: 'Aula 13: Fundamentos de Web Design, Harmonia Visual e Publicação no GitHub Pages',
    summary:
      'Princípios de design visual (harmonia, equilíbrio, respiro, contraste), boas práticas de deploy de páginas estáticas e hospedagem gratuita no GitHub Pages.',
    contentDetails: [
      'Organização de pastas para deploy (/assets, index.html, styles.css)',
      'Controle de versão básico com Git e ativação de GitHub Pages',
      'Checklist final de validação e compatibilidade entre navegadores',
    ],
    technologies: ['Design', 'GitHub Pages', 'Deploy'],
    durationHours: 4,
    status: 'prevista',
  },
  {
    id: 'les-tds102-14',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 14,
    bimestre: 4,
    title: 'Aula 14: Avaliação Final: Apresentação do Projeto Integrador de Website Institucional',
    summary:
      'Apresentação dos projetos práticos finais desenvolvidos pelos alunos, avaliando semântica HTML5, estilização CSS3, harmonia visual e publicação online.',
    contentDetails: [
      'Apresentação oral e demonstração do website funcionando online no GitHub Pages',
      'Defesa das decisões de arquitetura de informação e acessibilidade',
      'Fechamento de notas do diário e feedback pedagógico final da COINF',
    ],
    technologies: ['Projeto Final', 'HTML5', 'CSS3'],
    durationHours: 4,
    status: 'prevista',
    isEvaluation: true,
    evaluationType: 'projeto',
  },

  // --- PROGRAMAÇÃO I (INF101 - Subsequente) ---
  {
    id: 'les-inf101-01',
    disciplineId: 'inf-prog1',
    courseId: 'course-inf',
    lessonNumber: 1,
    bimestre: 1,
    title: 'Aula 01: Apresentação do PPC, Lógica Computacional e Conceito de Algoritmo',
    summary:
      'Apresentação da matriz do curso técnico, critérios avaliativos da COINF e os princípios fundamentais de um algoritmo na resolução de problemas.',
    contentDetails: [
      'Apresentação do plano de ensino e cronograma de 152 h/a',
      'O que é um algoritmo e as fases de processamento de dados',
      'Pseudocódigo (Portugol) vs Linguagem de programação executável',
    ],
    technologies: ['Algoritmos', 'Lógica'],
    durationHours: 4,
    status: 'concluida',
  },
  {
    id: 'les-inf101-02',
    disciplineId: 'inf-prog1',
    courseId: 'course-inf',
    lessonNumber: 2,
    bimestre: 1,
    title: 'Aula 02: Memória do Computador, Variáveis e Tipos Primitivos de Dados',
    summary:
      'Declaração de variáveis, tipos primitivos (inteiro, real, texto/string, lógico) e operadores aritméticos básicos.',
    contentDetails: [
      'Alocação de variáveis na memória RAM',
      'Operadores aritméticos (+, -, *, /, %) e ordem de precedência',
      'Comandos de entrada (leia) e saída (escreva)',
    ],
    technologies: ['C/Java', 'VS Code'],
    durationHours: 4,
    status: 'concluida',
  },
  {
    id: 'les-inf101-03',
    disciplineId: 'inf-prog1',
    courseId: 'course-inf',
    lessonNumber: 3,
    bimestre: 1,
    title: 'Aula 03: Estruturas Condicionais Simples e Compostas (if / else)',
    summary:
      'Tomada de decisão em programação através de expressões relacionais (>, <, ==, !=) e operadores lógicos (AND, OR, NOT).',
    contentDetails: [
      'Tabelas-verdade aplicadas à lógica de controle',
      'Estruturas if-else e desvios condicionais aninhados',
      'Exercícios de fixação em laboratório',
    ],
    technologies: ['C/Java', 'Algoritmos'],
    durationHours: 4,
    status: 'concluida',
  },
  {
    id: 'les-inf101-04',
    disciplineId: 'inf-prog1',
    courseId: 'course-inf',
    lessonNumber: 4,
    bimestre: 1,
    title: 'Aula 04: Estrutura de Seleção Múltipla (switch / case)',
    summary:
      'Construção de menus interativos no terminal com switch-case e tratamento de opção default.',
    contentDetails: [
      'Sintaxe do switch, case e comando break',
      'Criação de menus de opções para sistemas de console',
    ],
    technologies: ['C/Java'],
    durationHours: 4,
    status: 'concluida',
  },
  {
    id: 'les-inf101-05',
    disciplineId: 'inf-prog1',
    courseId: 'course-inf',
    lessonNumber: 5,
    bimestre: 2,
    title: 'Aula 05: Estruturas de Repetição Determinadas e Indeterminadas',
    summary:
      'Laços de repetição for, while e do-while, contadores, acumuladores e critérios de parada.',
    contentDetails: [
      'Laço for para repetições com número fixo de iterações',
      'Laços while e do-while com verificação prévia e posterior',
      'Prevenção de laços infinitos e depuração de código',
    ],
    technologies: ['C/Java', 'Terminal'],
    durationHours: 4,
    status: 'em_andamento',
  },
  {
    id: 'les-inf101-06',
    disciplineId: 'inf-prog1',
    courseId: 'course-inf',
    lessonNumber: 6,
    bimestre: 2,
    title: 'Aula 06: Estruturas de Dados Homogêneas - Vetores (Arrays Unidimensionais)',
    summary:
      'Armazenamento de múltiplos valores do mesmo tipo, índices, iteração e algoritmos de busca e ordenação em vetores.',
    contentDetails: [
      'Declaração e indexação de vetores em memória contígua',
      'Preenchimento automático e exibição de dados',
      'Busca linear e cálculo de média, maior e menor elemento',
    ],
    technologies: ['Arrays', 'C/Java'],
    durationHours: 4,
    status: 'prevista',
  },

  // --- BANCO DE DADOS E ENGENHARIA DE SOFTWARE (TDS203) ---
  {
    id: 'les-tds203-01',
    disciplineId: 'tds-bdes',
    courseId: 'course-tds',
    lessonNumber: 1,
    bimestre: 1,
    title: 'Aula 01: Introdução a Banco de Dados e Modelagem Conceitual (DER)',
    summary:
      'Arquitetura de SGBD relacional, entidades, atributos, relacionamentos e cardinalidades.',
    contentDetails: [
      'Vantagens de bancos de dados relacionais',
      'Construção do Diagrama Entidade-Relacionamento (DER)',
      'Chaves primárias e integridade de dados',
    ],
    technologies: ['DER', 'Modelagem'],
    durationHours: 3,
    status: 'concluida',
  },
  {
    id: 'les-tds203-02',
    disciplineId: 'tds-bdes',
    courseId: 'course-tds',
    lessonNumber: 2,
    bimestre: 1,
    title: 'Aula 02: Projeto Lógico Relacional, Normalização (1FN a 3FN) e SQL DDL',
    summary:
      'Mapeamento para tabelas relacionais, formas normais e scripts de criação física no PostgreSQL/MySQL.',
    contentDetails: [
      'Regras formais de mapeamento de relacionamentos 1:N e N:M',
      'Aplicação prática de 1FN, 2FN e 3FN',
      'Comandos CREATE TABLE, ALTER TABLE e constraints de chave estrangeira',
    ],
    technologies: ['SQL DDL', 'PostgreSQL'],
    durationHours: 3,
    status: 'concluida',
  },
  {
    id: 'les-tds203-03',
    disciplineId: 'tds-bdes',
    courseId: 'course-tds',
    lessonNumber: 3,
    bimestre: 2,
    title: 'Aula 03: Metodologias Ágeis de Software: Scrum, Kanban e User Stories',
    summary:
      'Ciclo de vida do software, papéis do Scrum (Product Owner, Scrum Master, Dev Team) e escrita de requisitos ágeis.',
    contentDetails: [
      'Diferença entre processo em cascata e métodos ágeis',
      'Cerimônias do Scrum: Sprint Planning, Daily, Review e Retrospective',
      'Critérios de aceitação e estimativas em pontos de história',
    ],
    technologies: ['Scrum', 'UML'],
    durationHours: 3,
    status: 'em_andamento',
  },
];

/**
 * Material de Apoio ao Aluno Rico para Ambos os Cursos do IFS Tobias Barreto
 */
export const initialMaterials: Material[] = [
  // =========================================================================
  // MATERIAIS DE APOIO: TÉCNICO INTEGRADO EM DESENVOLVIMENTO DE SISTEMAS (TDS)
  // =========================================================================
  {
    id: 'mat-tds-prog1-apostila',
    disciplineId: 'tds-prog1',
    courseId: 'course-tds',
    lessonNumber: 1,
    module: 'Introdução a Algoritmos, Variáveis e Tipos Primitivos',
    title: 'Apostila Oficial de Programação 1: Algoritmos Estruturados e Introdução à POO',
    description:
      'Apostila didática do Núcleo Tecnológico (Resolução 216/2023) com 200 aulas de conteúdo prático, sintaxe em Java, operadores lógicos, estruturas de decisão, vetores, matrizes e classes.',
    type: 'pdf',
    fileSize: '5.6 MB',
    dateAdded: '2026-10-15',
    downloadCount: 168,
    contentSnippet: `INSTITUTO FEDERAL DE SERGIPE - CAMPUS TOBIAS BARRETO
CURSO TÉCNICO INTEGRADO EM DESENVOLVIMENTO DE SISTEMAS
DISCIPLINA: PROGRAMAÇÃO 1 (TDS101) - 166,7 HORAS (200 AULAS)
DOCENTE: PROF. EBER SANTANA

CAPÍTULO 1: LÓGICA DE PROGRAMAÇÃO E ALGORITMOS
Um algoritmo é a sequência ordenada de instruções para resolução de problemas computacionais.

1.1 Estrutura de um Programa em Java:
public class MeuPrimeiroPrograma {
    public static void main(String[] args) {
        System.out.println("Bem-vindo ao TDS do IFS Campus Tobias Barreto!");
    }
}

1.2 Tipos Primitivos:
- byte, short, int, long (Valores Inteiros)
- float, double (Ponto Flutuante)
- char (Caractere Unicode)
- boolean (Verdadeiro/Falso)
- String (Classe para Cadeia de Caracteres)`,
  },
  {
    id: 'mat-tds-prog1-slides',
    disciplineId: 'tds-prog1',
    courseId: 'course-tds',
    lessonNumber: 3,
    module: 'Estruturas Condicionais (if/switch) e de Repetição (for/while)',
    title: 'Slides de Aula: Controle de Fluxo, Operadores Lógicos e Repetição em Java',
    description:
      'Lâminas visuais com tabelas-verdade, sintaxe de desvios condicionais e laços de repetição (for, while, do-while).',
    type: 'slides',
    fileSize: '3.4 MB',
    dateAdded: '2026-10-18',
    downloadCount: 135,
    contentSnippet: `SLIDE 1: Controle de Fluxo em Linguagens de Programação
SLIDE 2: Tomada de Decisão com if, else if e else
SLIDE 3: Operadores Relacionais (==, !=, >, <, >=, <=) e Lógicos (&&, ||, !)
SLIDE 4: Laços de Repetição for e laços com condição pré/pós-teste (while, do-while)
SLIDE 5: Boas práticas de indentação e legibilidade de código`,
  },
  {
    id: 'mat-tds-sites1-guia',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 1,
    module: 'Estrutura e Tags Principais do HTML5',
    title: 'Guia Visual de HTML5 Semântico, CSS3 e Design de Interfaces Web',
    description:
      'Manual com estruturação semântica de websites, seletores CSS3, Box Model, alinhamentos e boas práticas de tipografia e paleta de cores.',
    type: 'pdf',
    fileSize: '4.1 MB',
    dateAdded: '2026-10-16',
    downloadCount: 140,
    contentSnippet: `ESTRUTURA DE UM DOCUMENTO HTML5 SEMÂNTICO:
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Web - TDS IFS Tobias Barreto</title>
</head>
<body>
    <header>
        <h1>EduConecta - IFS Campus Tobias Barreto</h1>
        <nav><a href="#inicio">Início</a></nav>
    </header>
    <main>
        <section><h2>Núcleo Tecnológico</h2></section>
    </main>
    <footer><p>&copy; 2026 COINF Tobias Barreto</p></footer>
</body>
</html>`,
  },
  {
    id: 'mat-tds-bdes-sql',
    disciplineId: 'tds-bdes',
    courseId: 'course-tds',
    lessonNumber: 2,
    module: 'Projeto Lógico Relacional, Normalização (1FN a 3FN) e SQL Completo',
    title: 'Apostila de Banco de Dados e Engenharia de Software: Modelagem DER, SQL e UML',
    description:
      'Apostila completa cobrindo modelagem conceitual (DER), regras de normalização de dados (1FN a 3FN), scripts SQL completos em PostgreSQL e diagramas de Casos de Uso e Classes UML.',
    type: 'pdf',
    fileSize: '6.2 MB',
    dateAdded: '2026-10-20',
    downloadCount: 155,
    contentSnippet: `MODELAGEM DE BANCO DE DADOS E ENGENHARIA DE SOFTWARE
SCRIPT DE CRIAÇÃO DO BANCO DO SISTEMA:

CREATE TABLE estudantes (
    matricula VARCHAR(20) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    data_ingresso DATE NOT NULL
);

CREATE TABLE projetos_integradores (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    ano_letivo INT NOT NULL,
    orientador VARCHAR(100) NOT NULL
);`,
  },
  {
    id: 'mat-tds-pi1-template',
    disciplineId: 'tds-pi1',
    courseId: 'course-tds',
    module: 'Identificação de Demanda Real e Elaboração do Termo de Abertura de Projeto (TAP)',
    title: 'Template Oficial do Projeto Integrador 1: Termo de Abertura e Especificação de Requisitos',
    description:
      'Modelo formal em PDF e Word para documentação do Projeto Integrador 1 do 2º ano: definição do problema comunitário de Tobias Barreto, cronograma, elicitação de requisitos e diagramas UML.',
    type: 'exercise',
    fileSize: '1.7 MB',
    dateAdded: '2026-10-22',
    downloadCount: 110,
    contentSnippet: `MODELO DO PROJETO INTEGRADOR 1 (TDS204)
IFS CAMPUS TOBIAS BARRETO

1. IDENTIFICAÇÃO DO PROJETO
1.1 Título da Solução Tecnológica:
1.2 Integrantes da Equipe:
1.3 Professor Orientador (Núcleo Tecnológico):

2. JUSTIFICATIVA E IMPACTO REGIONAL EM TOBIAS BARRETO
(Descrever qual demanda real do comércio, indústria têxtil, órgãos públicos ou da comunidade de Tobias Barreto será atendida pelo software).

3. ESPECIFICAÇÃO DE REQUISITOS DO SISTEMA
[RF01] O sistema deve autenticar usuários com segurança.
[RF02] O sistema deve realizar operações de CRUD para os dados centrais do negócio.`,
  },

  // =========================================================================
  // MATERIAIS DE APOIO: TÉCNICO EM INFORMÁTICA SUBSEQUENTE (INF)
  // =========================================================================
  {
    id: 'mat-inf101-apostila',
    disciplineId: 'inf-prog1',
    courseId: 'course-inf',
    lessonNumber: 1,
    module: 'Introdução aos Algoritmos e Tipos de Dados',
    title: 'Apostila Completa: Lógica de Programação e Algoritmos Estruturados',
    description:
      'Apostila didática oficial da COINF para Programação I. Contém explicações passo a passo sobre raciocínio lógico, tabelas-verdade, sintaxe de comandos e mais de 40 exemplos comentados.',
    type: 'pdf',
    fileSize: '4.8 MB',
    dateAdded: '2026-10-15',
    downloadCount: 142,
    contentSnippet: `INSTITUTO FEDERAL DE SERGIPE - CAMPUS TOBIAS BARRETO
COORDENAÇÃO DE INFORMÁTICA (COINF)
DISCIPLINA: PROGRAMAÇÃO I (INF101) - 152 HORAS-AULA
DOCENTE: PROF. EBER SANTANA

CAPÍTULO 1: INTRODUÇÃO À LÓGICA E CONCEITO DE ALGORITMO
Um algoritmo é uma sequência finita de instruções claras, bem definidas e não ambíguas que, quando executadas, conduzem à solução de um determinado problema.`,
  },
  {
    id: 'mat-inf101-slides',
    disciplineId: 'inf-prog1',
    courseId: 'course-inf',
    lessonNumber: 3,
    module: 'Estruturas de Controle: Decisão (if/switch) e Repetição (for/while)',
    title: 'Slides de Aula: Estruturas de Decisão e Controle de Fluxo',
    description:
      'Conjunto de lâminas visuais em alta resolução sobre operadores relacionais, lógica booleana e implementação limpa de comandos if, else e switch/case.',
    type: 'slides',
    fileSize: '3.1 MB',
    dateAdded: '2026-10-18',
    downloadCount: 118,
  },
  {
    id: 'mat-inf102-apostila',
    disciplineId: 'inf-orgso',
    courseId: 'course-inf',
    lessonNumber: 1,
    module: 'Histórico, Evolução e Sistemas de Numeração',
    title: 'Apostila Teórica: Arquitetura de Computadores e Sistemas Operacionais',
    description:
      'Material de apoio aprofundado com diagramas esquemáticos da arquitetura de Von Neumann, tabela de conversão binária/hexadecimal e gestão de memória virtual.',
    type: 'pdf',
    fileSize: '5.2 MB',
    dateAdded: '2026-10-16',
    downloadCount: 104,
  },
  {
    id: 'mat-inf202-apostila-sql',
    disciplineId: 'inf-bd',
    courseId: 'course-inf',
    module: 'Linguagem SQL: Definição e Manipulação de Dados (DDL e DML)',
    title: 'Apostila Oficial: Modelagem Entidade-Relacionamento e Manual Prático de SQL',
    description:
      'Guia completo com regras de normalização de dados (1FN, 2FN, 3FN), scripts completos em PostgreSQL e MySQL, índices e integridade referencial.',
    type: 'pdf',
    fileSize: '4.5 MB',
    dateAdded: '2026-10-18',
    downloadCount: 135,
  },
  {
    id: 'mat-inf402-apostila-redes',
    disciplineId: 'inf-redes',
    courseId: 'course-inf',
    module: 'Fundamentos de Redes, Topologias e Modelos OSI vs TCP/IP',
    title: 'Apostila Completa: Redes de Computadores, Arquitetura TCP/IP e Sub-redes',
    description:
      'Material de apoio com cálculo de sub-redes passo a passo, tabela de classes IP, RFC 1918, normas de cabeamento 568A/568B e laboratórios no Cisco Packet Tracer.',
    type: 'pdf',
    fileSize: '6.5 MB',
    dateAdded: '2026-10-20',
    downloadCount: 129,
  },
];

/**
 * Turmas Oficiais do IFS Campus Tobias Barreto
 */
export const initialTurmas: Turma[] = [
  // --- Turmas de Técnico Integrado em Desenvolvimento de Sistemas (TDS) ---
  {
    id: 'turma-tds-1m-prog1',
    code: 'TDS-2026.1-1M',
    courseId: 'course-tds',
    disciplineId: 'tds-prog1',
    name: 'Turma 1º Ano A - Programação 1 (Matutino)',
    semester: '2026.1',
    shift: 'Matutino',
    professorId: 'prof-eber',
    professorName: 'Prof. Eber Santana',
    room: 'Laboratório de Informática 01 (Campus Tobias Barreto)',
    schedule: 'Segundas e Terças, 07:30 - 09:45',
    maxStudents: 40,
    enrolledStudentIds: ['student-lucas', 'student-mariana'],
  },
  {
    id: 'turma-tds-2m-bdes',
    code: 'TDS-2026.1-2M',
    courseId: 'course-tds',
    disciplineId: 'tds-bdes',
    name: 'Turma 2º Ano A - BD e Engenharia de Software (Matutino)',
    semester: '2026.1',
    shift: 'Matutino',
    professorId: 'prof-eber',
    professorName: 'Prof. Eber Santana',
    room: 'Laboratório de Informática 03 (Campus Tobias Barreto)',
    schedule: 'Sextas-feiras, 07:30 - 10:00',
    maxStudents: 40,
    enrolledStudentIds: ['student-lucas', 'student-mariana'],
  },
  {
    id: 'turma-tds-3m-redes',
    code: 'TDS-2026.1-3M',
    courseId: 'course-tds',
    disciplineId: 'tds-redes-seg',
    name: 'Turma 3º Ano A - Redes e Segurança da Informação (Matutino)',
    semester: '2026.1',
    shift: 'Matutino',
    professorId: 'prof-eber',
    professorName: 'Prof. Eber Santana',
    room: 'Laboratório de Redes e Manutenção (Campus Tobias Barreto)',
    schedule: 'Quartas-feiras, 07:30 - 10:00',
    maxStudents: 40,
    enrolledStudentIds: ['student-lucas'],
  },

  // --- Turmas de Informática Subsequente (Noturno) ---
  {
    id: 'turma-inf-1n-prog1',
    code: 'INF-2026.1-1N-PROG',
    courseId: 'course-inf',
    disciplineId: 'inf-prog1',
    name: 'Turma 1º Período - Programação I (Noturno)',
    semester: '2026.1',
    shift: 'Noturno',
    professorId: 'prof-eber',
    professorName: 'Prof. Eber Santana',
    room: 'Laboratório de Informática 01 (Campus Tobias Barreto)',
    schedule: 'Segundas e Terças, 19:00 - 22:15',
    maxStudents: 35,
    enrolledStudentIds: ['student-felipe', 'student-ana'],
  },
  {
    id: 'turma-inf-1n-orgso',
    code: 'INF-2026.1-1N-ORG',
    courseId: 'course-inf',
    disciplineId: 'inf-orgso',
    name: 'Turma 1º Período - Org. Computadores e SO (Noturno)',
    semester: '2026.1',
    shift: 'Noturno',
    professorId: 'prof-eber',
    professorName: 'Prof. Eber Santana',
    room: 'Laboratório de Manutenção e SO (Campus Tobias Barreto)',
    schedule: 'Quartas-feiras, 19:00 - 21:30 e Sextas-feiras, 19:00 - 20:40',
    maxStudents: 35,
    enrolledStudentIds: ['student-felipe', 'student-ana'],
  },
  {
    id: 'turma-inf-2n-bd',
    code: 'INF-2026.1-2N-BD',
    courseId: 'course-inf',
    disciplineId: 'inf-bd',
    name: 'Turma 2º Período - Banco de Dados (Noturno)',
    semester: '2026.1',
    shift: 'Noturno',
    professorId: 'prof-eber',
    professorName: 'Prof. Eber Santana',
    room: 'Laboratório de Informática 03 (Campus Tobias Barreto)',
    schedule: 'Quartas-feiras, 19:00 - 21:30 e Quintas-feiras, 19:00 - 20:40',
    maxStudents: 35,
    enrolledStudentIds: ['student-felipe'],
  },
  {
    id: 'turma-inf-4n-redes',
    code: 'INF-2026.1-4N-RED',
    courseId: 'course-inf',
    disciplineId: 'inf-redes',
    name: 'Turma 4º Período - Redes de Computadores (Noturno)',
    semester: '2026.1',
    shift: 'Noturno',
    professorId: 'prof-eber',
    professorName: 'Prof. Eber Santana',
    room: 'Laboratório de Redes e Manutenção (Campus Tobias Barreto)',
    schedule: 'Quartas-feiras, 19:00 - 22:15',
    maxStudents: 35,
    enrolledStudentIds: ['student-felipe'],
  },
];

/**
 * Alunos Cadastrados no IFS Campus Tobias Barreto
 */
export const initialStudents: Student[] = [
  {
    id: 'student-lucas',
    matricula: '20261TDS001',
    name: 'Lucas Alencar Santos',
    email: 'lucas.alencar@aluno.ifs.edu.br',
    courseId: 'course-tds',
    status: 'Ativo',
    enrolledTurmaIds: ['turma-tds-1m-prog1', 'turma-tds-2m-bdes', 'turma-tds-3m-redes'],
    phone: '(79) 98877-6655',
    entryYear: '2026',
    avatarInitials: 'LA',
  },
  {
    id: 'student-mariana',
    matricula: '20261TDS002',
    name: 'Mariana Silva Barreto',
    email: 'mariana.silva@aluno.ifs.edu.br',
    courseId: 'course-tds',
    status: 'Ativo',
    enrolledTurmaIds: ['turma-tds-1m-prog1', 'turma-tds-2m-bdes'],
    phone: '(79) 98855-4433',
    entryYear: '2026',
    avatarInitials: 'MS',
  },
  {
    id: 'student-felipe',
    matricula: '20261INF001',
    name: 'Felipe Duarte',
    email: 'felipe.duarte@aluno.ifs.edu.br',
    courseId: 'course-inf',
    status: 'Ativo',
    enrolledTurmaIds: ['turma-inf-1n-prog1', 'turma-inf-1n-orgso', 'turma-inf-2n-bd', 'turma-inf-4n-redes'],
    phone: '(79) 98822-1100',
    entryYear: '2026',
    avatarInitials: 'FD',
  },
  {
    id: 'student-ana',
    matricula: '20261INF002',
    name: 'Ana Carolina Lima',
    email: 'ana.lima@aluno.ifs.edu.br',
    courseId: 'course-inf',
    status: 'Ativo',
    enrolledTurmaIds: ['turma-inf-1n-prog1', 'turma-inf-1n-orgso'],
    phone: '(79) 98811-0099',
    entryYear: '2026',
    avatarInitials: 'AL',
  },
];

/**
 * Corpo Docente (Professores) - IFS Campus Tobias Barreto (COINF)
 */
export const initialProfessors: Professor[] = [
  {
    id: 'prof-eber',
    name: 'Prof. Eber Santana',
    email: 'eberss@gmail.com',
    siape: '1984210',
    title: 'Mestre',
    department: 'Coordenação de Informática (COINF)',
    campus: 'IFS Campus Tobias Barreto',
    assignedDisciplineIds: ['tds-prog1', 'tds-prog2', 'inf-prog1', 'tds-pi1', 'tds-pi2'],
    assignedTurmaIds: ['turma-tds-1m-prog1', 'turma-tds-2m-bdes', 'turma-inf-1n-prog1'],
    bio: 'Professor EBTT e Coordenador do Curso na COINF do IFS Campus Tobias Barreto. Atua nas áreas de Algoritmos, Linguagens de Programação e Engenharia de Software.',
    phone: '(79) 3541-1200',
    room: 'Coordenação de Informática - Sala 12',
    avatarInitials: 'ES',
    googleConnected: true,
  },
  {
    id: 'prof-camila',
    name: 'Profª. Camila Rodrigues',
    email: 'camila.rodrigues@ifs.edu.br',
    siape: '2104592',
    title: 'Mestre',
    department: 'Coordenação de Informática (COINF)',
    campus: 'IFS Campus Tobias Barreto',
    assignedDisciplineIds: ['tds-sites1', 'tds-sites2', 'inf-web1', 'inf-web2'],
    assignedTurmaIds: ['turma-tds-1m-prog1'],
    bio: 'Docente da COINF atuante em Desenvolvimento Web Front-End e Back-End, Design de Interfaces e Acessibilidade Digital.',
    phone: '(79) 3541-1204',
    room: 'Gabinete Docente 04',
    avatarInitials: 'CR',
  },
  {
    id: 'prof-lucas',
    name: 'Prof. Lucas Almeida',
    email: 'lucas.almeida@ifs.edu.br',
    siape: '1876523',
    title: 'Especialista',
    department: 'Coordenação de Informática (COINF)',
    campus: 'IFS Campus Tobias Barreto',
    assignedDisciplineIds: ['tds-redes', 'inf-redes', 'inf-seginfo', 'inf-orgso'],
    assignedTurmaIds: ['turma-tds-3m-redes', 'turma-inf-1n-orgso', 'turma-inf-4n-redes'],
    bio: 'Especialista em Redes de Computadores, Infraestrutura em Nuvem, Sistemas Operacionais Linux e Segurança da Informação.',
    phone: '(79) 3541-1205',
    room: 'Laboratório de Redes e Manutenção',
    avatarInitials: 'LA',
  },
  {
    id: 'prof-rafael',
    name: 'Prof. Rafael Silveira',
    email: 'rafael.silveira@ifs.edu.br',
    siape: '2341987',
    title: 'Doutor',
    department: 'Coordenação de Informática (COINF)',
    campus: 'IFS Campus Tobias Barreto',
    assignedDisciplineIds: ['tds-bdes', 'tds-topicos', 'inf-bd', 'inf-bd-avancado'],
    assignedTurmaIds: ['turma-tds-2m-bdes', 'turma-inf-2n-bd'],
    bio: 'Doutor em Ciência da Computação com ênfase em Modelagem de Banco de Dados, Inteligência Artificial e Engenharia de Requisitos.',
    phone: '(79) 3541-1206',
    room: 'Gabinete Docente 07',
    avatarInitials: 'RS',
  },
];

/**
 * Usuários para Autenticação
 */
export const initialUsers: UserProfile[] = [
  {
    id: 'prof-eber',
    name: 'Prof. Eber Santana',
    email: 'eberss@gmail.com',
    password: '123',
    role: 'professor',
    avatarInitials: 'ES',
    department: 'Coordenação de Informática (COINF) - Campus Tobias Barreto',
    title: 'Professor EBTT - IFS Campus Tobias Barreto',
  },
  {
    id: 'student-lucas',
    name: 'Lucas Alencar Santos',
    email: 'lucas.alencar@aluno.ifs.edu.br',
    password: '123',
    role: 'student',
    avatarInitials: 'LA',
    matricula: '20261TDS001',
    courseId: 'course-tds',
    enrolledTurmaIds: ['turma-tds-1m-prog1', 'turma-tds-2m-bdes'],
  },
  {
    id: 'student-felipe',
    name: 'Felipe Duarte',
    email: 'felipe.duarte@aluno.ifs.edu.br',
    password: '123',
    role: 'student',
    avatarInitials: 'FD',
    matricula: '20261INF001',
    courseId: 'course-inf',
    enrolledTurmaIds: ['turma-inf-1n-prog1', 'turma-inf-1n-orgso', 'turma-inf-4n-redes'],
  },
];

export const initialProfessor: UserProfile = initialUsers[0];
export const initialStudent: UserProfile = initialUsers[1];

/**
 * Avisos Acadêmicos Oficiais
 */
export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-01',
    disciplineId: 'tds-prog1',
    title: 'Início das Aulas Práticas do Núcleo Tecnológico (Programação 1)',
    content:
      'Prezados alunos do Técnico Integrado em Desenvolvimento de Sistemas, iniciamos nossas aulas no Laboratório 01 com ambiente Java e VS Code configurados. Estudem pela apostila de Programação 1 na aba de Materiais de Apoio!',
    priority: 'importante',
    date: '2026-10-28',
    authorName: 'Prof. Eber Santana',
    authorRole: 'professor',
    pinned: true,
    comments: [
      {
        id: 'c-01',
        authorName: 'Lucas Alencar Santos',
        authorRole: 'student',
        date: '2026-10-28 10:15',
        text: 'Professor Eber, as listas avaliativas de Programação 1 serão entregues via portal EduConecta?',
      },
      {
        id: 'c-02',
        authorName: 'Prof. Eber Santana',
        authorRole: 'professor',
        date: '2026-10-28 10:30',
        text: 'Olá Lucas! Sim, todas as tarefas avaliativas e materiais de aula estarão centralizados aqui.',
      },
    ],
  },
  {
    id: 'ann-02',
    disciplineId: 'inf-prog1',
    title: 'Orientações para a 1ª Prova Prática de Programação I no Laboratório (Subsequente)',
    content:
      'Prezados alunos do Técnico em Informática Subsequente, nossa 1ª Avaliação Bimestral abrangerá algoritmos, variáveis, operadores relacionais e estruturas condicionais (if/else e switch). Estudem pela Lista 01!',
    priority: 'normal',
    date: '2026-10-26',
    authorName: 'Prof. Eber Santana',
    authorRole: 'professor',
    pinned: false,
    comments: [],
  },
];

/**
 * Fórum de Dúvidas Acadêmicas
 */
export const initialDiscussions: Discussion[] = [
  {
    id: 'disc-01',
    disciplineId: 'tds-prog1',
    title: 'Dúvida sobre a diferença entre variáveis primitivas e objetos em Java',
    content:
      'Olá professor Eber! Na Aula 02 de Programação 1, qual a diferença prática na alocação de memória entre uma variável int e uma String?',
    authorName: 'Mariana Silva Barreto',
    authorRole: 'student',
    date: '2026-10-27',
    likes: 6,
    status: 'resolvida',
    tags: ['Programação 1', 'Java', 'Memória'],
    responses: [
      {
        id: 'resp-01',
        authorName: 'Prof. Eber Santana',
        authorRole: 'professor',
        date: '2026-10-27 11:00',
        content:
          'Excelente pergunta, Mariana! O int é um tipo primitivo que armazena diretamente o valor binário na memória Stack. Já a String é uma classe (objeto): a variável armazena apenas a referência (endereço) na Stack, enquanto os caracteres do texto ficam alocados na memória Heap.',
        isOfficialAnswer: true,
      },
    ],
  },
  {
    id: 'disc-02',
    disciplineId: 'tds-bdes',
    title: 'Diferença entre o Projeto Integrador 1 e 2 na Resolução 216/2023',
    content:
      'Professor, a modelagem feita no Projeto Integrador 1 no 2º ano servirá de base direta para a implementação do software no Projeto Integrador 2 no 3º ano?',
    authorName: 'Lucas Alencar Santos',
    authorRole: 'student',
    date: '2026-10-29',
    likes: 5,
    status: 'resolvida',
    tags: ['Projeto Integrador', 'PPC 216/2023', 'CRUD'],
    responses: [
      {
        id: 'resp-02',
        authorName: 'Prof. Eber Santana',
        authorRole: 'professor',
        date: '2026-10-29 11:30',
        content:
          'Exatamente, Lucas! O Projeto Integrador 1 (2º ano) foca no Termo de Abertura, elicitação de requisitos, DER e diagramas UML. No Projeto Integrador 2 (3º ano), a equipe implementa o software com CRUD completo, banco de dados, front-end e apresenta para a comunidade externa.',
        isOfficialAnswer: true,
      },
    ],
  },
];

/**
 * Atividades e Avaliações Oficiais
 */
export const initialAssignments: Assignment[] = [
  {
    id: 'assign-tds-01',
    disciplineId: 'tds-prog1',
    title: 'Lista de Exercícios Práticos 01: Algoritmos Condicionais em Java',
    description:
      'Implementação de 5 exercícios de tomada de decisão, operadores relacionais e cálculo de médias no laboratório.',
    module: 'Estruturas Condicionais (if/switch) e de Repetição (for/while)',
    dueDate: '2026-11-18T10:00:00',
    maxScore: 10.0,
    weight: 25,
    instructions:
      'Submeter os arquivos .java compactados em formato .zip com indentação limpa e comentários pertinentes.',
    rubricCriteria: [
      { criterion: 'Corretude lógica e testes passando em todos os cenários', points: 4.0 },
      { criterion: 'Boas práticas de nomenclatura e indentação', points: 3.0 },
      { criterion: 'Tratamento de entradas e validações de dados', points: 3.0 },
    ],
    attachmentName: 'lista01_prog1_tds.pdf',
    submissions: [
      {
        id: 'sub-tds-01',
        assignmentId: 'assign-tds-01',
        studentId: 'student-lucas',
        studentName: 'Lucas Alencar Santos',
        studentEmail: 'lucas.alencar@aluno.ifs.edu.br',
        submittedAt: '2026-10-30T09:45:00',
        fileName: 'lucas_alencar_lista01_java.zip',
        fileSize: '750 KB',
        notes: 'Professor Eber, todos os 5 exercícios foram testados no terminal do laboratório.',
        grade: 9.8,
        feedback: 'Excelente trabalho, Lucas! O uso de constantes e a organização do código estão exemplares.',
        gradedAt: '2026-10-31T10:00:00',
      },
    ],
  },
  {
    id: 'assign-tds-02',
    disciplineId: 'tds-bdes',
    title: 'Modelagem Conceitual: Diagrama Entidade-Relacionamento (DER)',
    description:
      'Construção do modelo conceitual de dados para o sistema de gestão do Campus Tobias Barreto, contemplando entidades, atributos e relacionamentos.',
    module: 'Modelagem Conceitual e Lógica de Banco de Dados',
    dueDate: '2026-11-05T23:59:00',
    maxScore: 10.0,
    weight: 30,
    instructions:
      'Desenhar o diagrama no brModel ou ferramenta CASE similar e exportar em PDF ou imagem com o dicionário de dados anexo.',
    rubricCriteria: [
      { criterion: 'Identificação correta de cardinalidades e chaves primárias', points: 4.0 },
      { criterion: 'Normalização inicial até a 3ª Forma Normal', points: 3.0 },
      { criterion: 'Dicionário de dados completo e documentado', points: 3.0 },
    ],
    attachmentName: 'roteiro_pratico_der_bdes.pdf',
    submissions: [],
  },
  {
    id: 'assign-inf-01',
    disciplineId: 'inf-prog1',
    title: 'Prática de Laboratório 01: Vetores e Estruturas de Repetição',
    description:
      'Desenvolvimento de algoritmos estruturados para busca, ordenação simples e manipulação de arrays unidimensionais.',
    module: 'Estruturas de Dados Homogêneas: Vetores e Matrizes',
    dueDate: '2026-11-06T22:00:00',
    maxScore: 10.0,
    weight: 25,
    instructions:
      'Submeter o código-fonte devidamente comentado e testado com os casos de teste do laboratório.',
    rubricCriteria: [
      { criterion: 'Lógica e corretude algorítmica', points: 5.0 },
      { criterion: 'Indentação, comentários e clareza de variáveis', points: 3.0 },
      { criterion: 'Otimização de laços de repetição', points: 2.0 },
    ],
    attachmentName: 'guia_laboratorio_vetores.pdf',
    submissions: [],
  },
];

/**
 * Horários de Atendimento Docente (Plantão de Dúvidas) - Campus Tobias Barreto
 */
export const initialOfficeHours: OfficeHour[] = [
  {
    id: 'oh-01',
    disciplineId: 'tds-prog1',
    dayOfWeek: 'Segundas-feiras',
    time: '10:00 às 11:30',
    location: 'Sala da COINF - Campus Tobias Barreto',
    virtualRoomUrl: 'https://meet.google.com/ifs-coinf-eber',
    slotsAvailable: 4,
    bookedStudents: ['Lucas Alencar Santos'],
  },
  {
    id: 'oh-02',
    disciplineId: 'tds-bdes',
    dayOfWeek: 'Quartas-feiras',
    time: '10:00 às 11:30',
    location: 'Laboratório de Informática 03 - Campus Tobias Barreto',
    virtualRoomUrl: 'https://meet.google.com/ifs-bdes-eber',
    slotsAvailable: 4,
    bookedStudents: ['Mariana Silva Barreto'],
  },
  {
    id: 'oh-03',
    disciplineId: 'inf-prog1',
    dayOfWeek: 'Quintas-feiras',
    time: '18:00 às 19:00',
    location: 'Laboratório de Informática 01 - Campus Tobias Barreto',
    virtualRoomUrl: 'https://meet.google.com/ifs-prog1-eber',
    slotsAvailable: 4,
    bookedStudents: ['Felipe Duarte'],
  },
];
