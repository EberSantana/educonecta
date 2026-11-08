import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Course, Discipline } from '../types';

/**
 * Cria com segurança uma instância do jsPDF compatível tanto em runtime Vite quanto Node.js
 */
function createDoc(options: any = { orientation: 'portrait', unit: 'mm', format: 'a4' }): jsPDF {
  const Constructor = (jsPDF as any) || (window as any)?.jspdf?.jsPDF;
  return new Constructor(options);
}

/**
 * Utilitário de Geração de PDFs Acessíveis e Oficiais do IFS Campus Tobias Barreto
 * - Segue as normas do PPC (Resolução CS/IFS nº 216/2023 e Resolução nº 09/2017/CS/IFS)
 * - Cores institucionais: Verde IFS (#1e7e34), Vermelho IFS (#ce2029), Cinza Grafite (#1f2937)
 * - Texto 100% pesquisável, legível por leitores de tela e compatível com acessibilidade
 */

const IFS_GREEN = [30, 126, 52] as const; // #1e7e34
const IFS_RED = [206, 32, 41] as const;   // #ce2029
const TEXT_DARK = [31, 41, 55] as const;  // #1f2937
const TEXT_MUTED = [100, 116, 139] as const;

/**
 * Desenha o cabeçalho institucional oficial do IFS em uma página
 */
function drawInstitutionalHeader(doc: jsPDF, title: string, subtitle?: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Barra decorativa superior verde e vermelha
  doc.setFillColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
  doc.rect(0, 0, pageWidth - 30, 4, 'F');
  doc.setFillColor(IFS_RED[0], IFS_RED[1], IFS_RED[2]);
  doc.rect(pageWidth - 30, 0, 30, 4, 'F');

  // Cabeçalho institucional MEC / IFS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('REPÚBLICA FEDERATIVA DO BRASIL · MINISTÉRIO DA EDUCAÇÃO · SETEC', 14, 11);

  doc.setFontSize(10.5);
  doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
  doc.text('INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE SERGIPE', 14, 16.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('CAMPUS TOBIAS BARRETO · COORDENAÇÃO DE INFORMÁTICA (COINF)', 14, 21);

  // Linha divisória
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 24, pageWidth - 14, 24);

  // Título do Documento
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
  doc.text(title, 14, 31);

  let nextY = 36;
  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(subtitle, 14, 36);
    nextY = 41;
  }

  return nextY;
}

/**
 * Adiciona rodapés numerados com identificador em todas as páginas
 */
function applyFooters(doc: jsPDF, documentCode: string) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const dateStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Linha divisória inferior
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);

    doc.text(
      `EduConecta IFS · Campus Tobias Barreto · Documento Oficial: ${documentCode} · Emitido em: ${dateStr}`,
      14,
      pageHeight - 7
    );

    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  }
}

const boldCell = (text: string) => ({
  content: text,
  styles: { fontStyle: 'bold' as const },
});

/**
 * Gera o documento PDF da Ementa de uma Disciplina Individual
 */
export function generateDisciplinePDF(discipline: Discipline, course?: Course): jsPDF {
  const doc = createDoc({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const subtitle = course
    ? `${course.name} (${course.code}) · ${course.resolution || 'Projeto Pedagógico de Curso'}`
    : 'EduConecta IFS · Campus Tobias Barreto';

  let currentY = drawInstitutionalHeader(
    doc,
    `EMENTA E PLANO DE ENSINO: ${discipline.name.toUpperCase()}`,
    subtitle
  );

  // Tabela com Dados Gerais do Componente Curricular
  const basicInfo = [
    [
      boldCell('Código do Componente:'),
      discipline.code,
      boldCell('Ano / Período:'),
      discipline.semester,
    ],
    [
      boldCell('Carga Horária (Relógio):'),
      `${discipline.workloadHours} horas`,
      boldCell('Carga Horária (Aulas):'),
      `${discipline.workloadLessons || Math.round((discipline.workloadHours * 60) / 50)} h/a (${discipline.weeklyHours || 4} aulas/sem)`,
    ],
    [
      boldCell('Teórica / Prática:'),
      `${discipline.theoryHours || 0}h teóricas · ${discipline.practiceHours || 0}h práticas`,
      boldCell('Pré-requisitos:'),
      discipline.prerequisites || 'Sem pré-requisito',
    ],
    [
      boldCell('Departamento / Coord.:'),
      discipline.department || 'COINF - Campus Tobias Barreto',
      boldCell('Local / Laboratório:'),
      discipline.room || 'Laboratório de Informática',
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    body: basicInfo as any,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 2,
      textColor: [31, 41, 55],
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 40, fillColor: [248, 250, 252] },
      1: { cellWidth: 50 },
      2: { cellWidth: 40, fillColor: [248, 250, 252] },
      3: { cellWidth: 50 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // Seção 1: Ementa Oficial do PPC
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
  doc.text('1. EMENTA OFICIAL NORMADA (PPC)', 14, currentY);

  currentY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);

  const splitSyllabus = doc.splitTextToSize(
    discipline.syllabus || discipline.description,
    pageWidth - 28
  );
  doc.text(splitSyllabus, 14, currentY);
  currentY += splitSyllabus.length * 4 + 4;

  // Seção 2: Objetivos
  if (discipline.objectives) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
    doc.text('2. OBJETIVOS DO COMPONENTE CURRICULAR', 14, currentY);

    currentY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);

    const splitObj = doc.splitTextToSize(discipline.objectives, pageWidth - 28);
    doc.text(splitObj, 14, currentY);
    currentY += splitObj.length * 4 + 4;
  }

  // Seção 3: Conteúdo Programático / Unidades Temáticas
  if (discipline.modules && discipline.modules.length > 0) {
    if (currentY > 230) {
      doc.addPage();
      currentY = drawInstitutionalHeader(doc, `EMENTA: ${discipline.name.toUpperCase()} (CONT.)`);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
    doc.text('3. CONTEÚDO PROGRAMÁTICO (UNIDADES E MÓDULOS TEMÁTICOS)', 14, currentY);

    currentY += 3;
    const modulesData = discipline.modules.map((m, index) => [
      `Módulo ${index + 1}`,
      m,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Módulo / Unidade', 'Detalhamento do Conteúdo Programático']],
      body: modulesData,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 126, 52],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8.5,
      },
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        textColor: [31, 41, 55],
        lineColor: [226, 232, 240],
      },
      columnStyles: {
        0: { cellWidth: 32, fontStyle: 'bold' },
        1: { cellWidth: 150 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;
  }

  // Seção 4: Bibliografia
  if (discipline.bibliography) {
    if (currentY > 210) {
      doc.addPage();
      currentY = drawInstitutionalHeader(doc, `EMENTA: ${discipline.name.toUpperCase()} (BIBLIOGRAFIA)`);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
    doc.text('4. BIBLIOGRAFIA RECOMENDADA PELO PPC', 14, currentY);

    currentY += 4;

    // Básica
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text('Bibliografia Básica:', 14, currentY);
    currentY += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    (discipline.bibliography.basic || []).forEach((item) => {
      const splitItem = doc.splitTextToSize(`• ${item}`, pageWidth - 28);
      if (currentY + splitItem.length * 3.5 > 280) {
        doc.addPage();
        currentY = drawInstitutionalHeader(doc, `EMENTA: ${discipline.name.toUpperCase()} (BIBLIOGRAFIA)`);
      }
      doc.text(splitItem, 14, currentY);
      currentY += splitItem.length * 3.5 + 1.5;
    });

    // Complementar
    const comp = discipline.bibliography.complementar || discipline.bibliography.complementary || [];
    if (comp.length > 0) {
      currentY += 2;
      if (currentY > 260) {
        doc.addPage();
        currentY = drawInstitutionalHeader(doc, `EMENTA: ${discipline.name.toUpperCase()} (BIBLIOGRAFIA)`);
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text('Bibliografia Complementar:', 14, currentY);
      currentY += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      comp.forEach((item) => {
        const splitItem = doc.splitTextToSize(`• ${item}`, pageWidth - 28);
        if (currentY + splitItem.length * 3.5 > 280) {
          doc.addPage();
          currentY = drawInstitutionalHeader(doc, `EMENTA: ${discipline.name.toUpperCase()} (BIBLIOGRAFIA)`);
        }
        doc.text(splitItem, 14, currentY);
        currentY += splitItem.length * 3.5 + 1.5;
      });
    }
  }

  // Aplica rodapés numerados com identificador único
  const docCode = `PPC-${discipline.code}-${discipline.courseId.toUpperCase()}`;
  applyFooters(doc, docCode);

  return doc;
}

/**
 * Gera o documento PDF Completo do Ementário e Matriz Curricular de um Curso
 */
export function generateCourseSyllabusPDF(course: Course, courseDisciplines: Discipline[]): jsPDF {
  const doc = createDoc({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Página 1: Capa & Informações Gerais do PPC
  let currentY = drawInstitutionalHeader(
    doc,
    `PROJETO PEDAGÓGICO DE CURSO (PPC) · EMENTÁRIO GERAL`,
    `${course.name.toUpperCase()} (${course.code})`
  );

  // Quadro de Identificação do Curso
  const courseDetails = [
    [boldCell('Curso:'), course.name],
    [boldCell('Código / Sigla:'), course.code],
    [boldCell('Modalidade / Grau:'), course.degree],
    [boldCell('Ato Regulatório / PPC:'), course.resolution || 'PPC Oficial'],
    [boldCell('Carga Horária Total:'), `${course.workloadTotalHours || 0} horas`],
    [boldCell('Duração Prevista:'), `${course.durationSemesters} semestres (${course.durationSemesters / 2} anos)`],
    [boldCell('Coordenação de Curso:'), course.coordinator],
    [boldCell('Departamento Responsável:'), course.department],
    [boldCell('Campus de Oferta:'), course.campus || 'IFS Campus Tobias Barreto'],
  ];

  autoTable(doc, {
    startY: currentY,
    body: courseDetails as any,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 2,
      textColor: [31, 41, 55],
      lineColor: [203, 213, 225],
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [248, 250, 252] },
      1: { cellWidth: 132 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // Perfil e Descrição do Curso
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
  doc.text('PERFIL PROFISSIONAL E DIRETRIZES DO CURSO', 14, currentY);

  currentY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  const splitDesc = doc.splitTextToSize(course.description, pageWidth - 28);
  doc.text(splitDesc, 14, currentY);
  currentY += splitDesc.length * 4 + 6;

  // Matriz Curricular Sintética (Tabela de todas as disciplinas do curso)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
  doc.text('MATRIZ CURRICULAR SINTÉTICA (COMPONENTES CURRICULARES)', 14, currentY);

  currentY += 3;

  const sortedDiscs = [...courseDisciplines].sort((a, b) => {
    if ((a.periodNumber || 0) !== (b.periodNumber || 0)) {
      return (a.periodNumber || 0) - (b.periodNumber || 0);
    }
    return a.code.localeCompare(b.code);
  });

  const matrixRows = sortedDiscs.map((d) => [
    d.semester || `${d.periodNumber}º`,
    d.code,
    d.name,
    `${d.workloadHours}h (${d.workloadLessons || 0} h/a)`,
    d.prerequisites || 'Sem pré-requisito',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Período / Ano', 'Código', 'Componente Curricular', 'Carga Horária', 'Pré-requisitos']],
    body: matrixRows,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 126, 52],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [31, 41, 55],
      lineColor: [226, 232, 240],
    },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 20, fontStyle: 'bold' },
      2: { cellWidth: 62 },
      3: { cellWidth: 32 },
      4: { cellWidth: 38 },
    },
  });

  // Próximas Páginas: Ementário Analítico (Ementa de cada disciplina)
  sortedDiscs.forEach((discipline, index) => {
    doc.addPage();
    currentY = drawInstitutionalHeader(
      doc,
      `EMENTA (${index + 1}/${sortedDiscs.length}): ${discipline.name.toUpperCase()}`,
      `${course.name} · ${discipline.code} · ${discipline.semester}`
    );

    // Dados Rápidos da Disciplina
    const quickData = [
      [
        boldCell('Carga Horária:'),
        `${discipline.workloadHours} horas-relógio (${discipline.workloadLessons || 0} h/a)`,
        boldCell('Pré-requisitos:'),
        discipline.prerequisites || 'Sem pré-requisito',
      ],
      [
        boldCell('Teórica / Prática:'),
        `${discipline.theoryHours || 0}h teóricas · ${discipline.practiceHours || 0}h práticas`,
        boldCell('Aulas Semanais:'),
        `${discipline.weeklyHours || 4} aulas/semana`,
      ],
    ];

    autoTable(doc, {
      startY: currentY,
      body: quickData as any,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 1.8,
        lineColor: [203, 213, 225],
      },
      columnStyles: {
        0: { cellWidth: 35, fillColor: [248, 250, 252] },
        1: { cellWidth: 55 },
        2: { cellWidth: 35, fillColor: [248, 250, 252] },
        3: { cellWidth: 55 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;

    // Ementa
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
    doc.text('Ementa Oficial do Componente:', 14, currentY);
    currentY += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    const splitSyl = doc.splitTextToSize(discipline.syllabus || discipline.description, pageWidth - 28);
    doc.text(splitSyl, 14, currentY);
    currentY += splitSyl.length * 3.5 + 4;

    // Objetivos
    if (discipline.objectives) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
      doc.text('Objetivos:', 14, currentY);
      currentY += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      const splitObj = doc.splitTextToSize(discipline.objectives, pageWidth - 28);
      doc.text(splitObj, 14, currentY);
      currentY += splitObj.length * 3.5 + 4;
    }

    // Módulos
    if (discipline.modules && discipline.modules.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
      doc.text('Unidades e Módulos Temáticos:', 14, currentY);
      currentY += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      discipline.modules.forEach((mod, modIdx) => {
        doc.text(`• Unidade ${modIdx + 1}: ${mod}`, 16, currentY);
        currentY += 3.2;
      });
      currentY += 2;
    }

    // Bibliografia
    if (discipline.bibliography) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
      doc.text('Bibliografia Básica e Complementar:', 14, currentY);
      currentY += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);

      (discipline.bibliography.basic || []).slice(0, 3).forEach((b) => {
        const splitB = doc.splitTextToSize(`[Básica] ${b}`, pageWidth - 30);
        doc.text(splitB, 16, currentY);
        currentY += splitB.length * 3 + 1;
      });

      const comp = discipline.bibliography.complementar || discipline.bibliography.complementary || [];
      comp.slice(0, 2).forEach((c) => {
        const splitC = doc.splitTextToSize(`[Complementar] ${c}`, pageWidth - 30);
        doc.text(splitC, 16, currentY);
        currentY += splitC.length * 3 + 1;
      });
    }
  });

  applyFooters(doc, `PPC-COMPLETO-${course.code}`);
  return doc;
}

/**
 * Dispara o download direto do PDF de uma disciplina
 */
export function downloadDisciplinePDF(discipline: Discipline, course?: Course): void {
  const doc = generateDisciplinePDF(discipline, course);
  const cleanCode = discipline.code.replace(/[^a-zA-Z0-9_-]/g, '');
  const cleanName = discipline.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Ementa_IFS_${cleanCode}_${cleanName}.pdf`;
  doc.save(filename);
}

/**
 * Dispara o download direto do Ementário Completo de um Curso
 */
export function downloadCourseSyllabusPDF(course: Course, courseDisciplines: Discipline[]): void {
  const doc = generateCourseSyllabusPDF(course, courseDisciplines);
  const cleanCode = course.code.replace(/[^a-zA-Z0-9_-]/g, '');
  const filename = `Ementario_Completo_IFS_${cleanCode}_PPC.pdf`;
  doc.save(filename);
}

/**
 * Gera e baixa o catálogo com todos os cursos e todas as ementas da instituição
 */
export function downloadAllCoursesCatalogPDF(courses: Course[], disciplines: Discipline[]): void {
  const doc = createDoc({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  drawInstitutionalHeader(
    doc,
    'CATÁLOGO GERAL DE CURSOS E EMENTÁRIOS DO PPC',
    'Instituto Federal de Sergipe · Campus Tobias Barreto · COINF'
  );

  let currentY = 46;

  courses.forEach((c, index) => {
    const courseDisciplines = disciplines.filter((d) => d.courseId === c.id);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(IFS_GREEN[0], IFS_GREEN[1], IFS_GREEN[2]);
    doc.text(`${index + 1}. ${c.name} (${c.code}) - ${c.degree}`, 14, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(`Ato: ${c.resolution || 'PPC Oficial'} · Carga Horária: ${c.workloadTotalHours || 0}h · Coordenação: ${c.coordinator}`, 14, currentY);
    currentY += 4;

    const summaryData = courseDisciplines.map((d) => [
      d.semester,
      d.code,
      d.name,
      `${d.workloadHours}h (${d.workloadLessons || 0} h/a)`,
      d.prerequisites || 'Sem pré-requisito',
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Ano / Período', 'Código', 'Disciplina', 'Carga Horária', 'Pré-requisitos']],
      body: summaryData,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 126, 52],
        textColor: 255,
        fontSize: 7.5,
      },
      styles: {
        fontSize: 7,
        cellPadding: 1.5,
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
    if (currentY > 250 && index < courses.length - 1) {
      doc.addPage();
      currentY = drawInstitutionalHeader(doc, 'CATÁLOGO GERAL DE CURSOS (CONTINUAÇÃO)');
    }
  });

  applyFooters(doc, 'CATALOGO-GERAL-IFS-COINF');
  doc.save('Catalogo_Geral_Cursos_e_Ementas_IFS_Tobias_Barreto.pdf');
}
