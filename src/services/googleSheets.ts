import { Professor, Discipline, Turma } from '../types';

/**
 * Helper to extract Google Spreadsheet ID from a shared link or return the raw ID
 */
export function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Creates a brand new Google Spreadsheet in the user's Google Drive with formatted professor data
 */
export async function createProfessorSpreadsheet(
  accessToken: string,
  title: string,
  professors: Professor[],
  disciplines: Discipline[],
  turmas: Turma[]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  // 1. Create spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: title || 'IFS Tobias Barreto - Quadro de Professores e Disciplinas',
      },
      sheets: [
        {
          properties: {
            title: 'Professores_COINF',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(err.error?.message || 'Falha ao criar planilha no Google Sheets.');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // 2. Format rows
  const headerRow = [
    'SIAPE',
    'Nome Completo',
    'Email Institucional',
    'Titulação',
    'Departamento',
    'Campus',
    'Telefone',
    'Gabinete / Sala',
    'Disciplinas Ministradas (Códigos)',
    'Turmas Atribuídas (Códigos)',
  ];

  const dataRows = professors.map((p) => {
    const discCodes = p.assignedDisciplineIds
      .map((id) => disciplines.find((d) => d.id === id)?.code || id)
      .join(', ');
    const turmaCodes = p.assignedTurmaIds
      .map((id) => turmas.find((t) => t.id === id)?.code || id)
      .join(', ');

    return [
      p.siape,
      p.name,
      p.email,
      p.title,
      p.department,
      p.campus,
      p.phone || '',
      p.room || '',
      discCodes,
      turmaCodes,
    ];
  });

  const allValues = [headerRow, ...dataRows];

  // 3. Write data to sheet
  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Professores_COINF!A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: allValues,
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json();
    throw new Error(err.error?.message || 'Falha ao preencher dados na planilha.');
  }

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Updates an existing Google Spreadsheet with current professor data
 */
export async function syncProfessorsToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  professors: Professor[],
  disciplines: Discipline[],
  turmas: Turma[]
): Promise<void> {
  const cleanId = extractSpreadsheetId(spreadsheetId);

  const headerRow = [
    'SIAPE',
    'Nome Completo',
    'Email Institucional',
    'Titulação',
    'Departamento',
    'Campus',
    'Telefone',
    'Gabinete / Sala',
    'Disciplinas Ministradas (Códigos)',
    'Turmas Atribuídas (Códigos)',
  ];

  const dataRows = professors.map((p) => {
    const discCodes = p.assignedDisciplineIds
      .map((id) => disciplines.find((d) => d.id === id)?.code || id)
      .join(', ');
    const turmaCodes = p.assignedTurmaIds
      .map((id) => turmas.find((t) => t.id === id)?.code || id)
      .join(', ');

    return [
      p.siape,
      p.name,
      p.email,
      p.title,
      p.department,
      p.campus,
      p.phone || '',
      p.room || '',
      discCodes,
      turmaCodes,
    ];
  });

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [headerRow, ...dataRows],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Falha ao atualizar dados na planilha Google.');
  }
}

/**
 * Reads values from a Google Spreadsheet
 */
export async function fetchSpreadsheetRows(
  accessToken: string,
  spreadsheetId: string,
  range = 'A1:Z100'
): Promise<string[][]> {
  const cleanId = extractSpreadsheetId(spreadsheetId);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(range)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Erro ao carregar dados da planilha Google.');
  }

  const data = await res.json();
  return data.values || [];
}

/**
 * Parses raw 2D array rows (from Google Sheets or CSV) into Professor entities
 */
export function parseSheetRowsToProfessors(
  rows: string[][],
  existingDisciplines: Discipline[],
  existingTurmas: Turma[]
): { professors: Professor[]; warnings: string[] } {
  const warnings: string[] = [];
  if (!rows || rows.length <= 1) {
    return { professors: [], warnings: ['A planilha está vazia ou contém apenas o cabeçalho.'] };
  }

  const header = rows[0].map((h) => (h || '').trim().toLowerCase());

  // Find column indices with flexible matching
  const findCol = (keywords: string[]) => {
    return header.findIndex((h) => keywords.some((k) => h.includes(k)));
  };

  const siapeIdx = findCol(['siape', 'matricula', 'código', 'id']);
  const nameIdx = findCol(['nome', 'docente', 'professor']);
  const emailIdx = findCol(['email', 'e-mail']);
  const titleIdx = findCol(['titula', 'grau', 'formacao']);
  const deptIdx = findCol(['departamento', 'coinf', 'area']);
  const campusIdx = findCol(['campus', 'unidade']);
  const phoneIdx = findCol(['telefone', 'celular', 'contato']);
  const roomIdx = findCol(['sala', 'gabinete', 'laboratorio']);
  const discIdx = findCol(['disciplina', 'materia', 'componente']);
  const turmaIdx = findCol(['turma']);

  if (nameIdx === -1) {
    throw new Error('Coluna de "Nome do Professor" não foi encontrada na primeira linha da planilha.');
  }

  const result: Professor[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || !row[nameIdx] || !row[nameIdx].trim()) {
      continue;
    }

    const name = row[nameIdx].trim();
    const siape = siapeIdx >= 0 && row[siapeIdx] ? row[siapeIdx].trim() : `SIAPE-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const email = emailIdx >= 0 && row[emailIdx] ? row[emailIdx].trim() : `${name.toLowerCase().replace(/\s+/g, '.')}@ifs.edu.br`;

    const rawTitle = titleIdx >= 0 && row[titleIdx] ? row[titleIdx].trim() : 'Mestre';
    let validTitle: Professor['title'] = 'Mestre';
    if (/doutor|dr|phd/i.test(rawTitle)) validTitle = 'Doutor';
    else if (/especialista|esp/i.test(rawTitle)) validTitle = 'Especialista';
    else if (/pos-doutor|pós/i.test(rawTitle)) validTitle = 'Pós-Doutor';
    else if (/graduad/i.test(rawTitle)) validTitle = 'Graduado';

    const department = deptIdx >= 0 && row[deptIdx] ? row[deptIdx].trim() : 'Coordenação de Informática (COINF)';
    const campus = campusIdx >= 0 && row[campusIdx] ? row[campusIdx].trim() : 'IFS Campus Tobias Barreto';
    const phone = phoneIdx >= 0 && row[phoneIdx] ? row[phoneIdx].trim() : undefined;
    const room = roomIdx >= 0 && row[roomIdx] ? row[roomIdx].trim() : undefined;

    // Parse disciplines
    const assignedDisciplineIds: string[] = [];
    if (discIdx >= 0 && row[discIdx]) {
      const discTokens = row[discIdx].split(/[,;]/).map((t) => t.trim().toUpperCase());
      for (const token of discTokens) {
        if (!token) continue;
        const matched = existingDisciplines.find(
          (d) => d.code.toUpperCase() === token || d.name.toUpperCase().includes(token) || d.id === token.toLowerCase()
        );
        if (matched) {
          assignedDisciplineIds.push(matched.id);
        } else {
          warnings.push(`Linha ${i + 1} (${name}): Disciplina "${token}" não localizada no catálogo.`);
        }
      }
    }

    // Parse turmas
    const assignedTurmaIds: string[] = [];
    if (turmaIdx >= 0 && row[turmaIdx]) {
      const turmaTokens = row[turmaIdx].split(/[,;]/).map((t) => t.trim().toUpperCase());
      for (const token of turmaTokens) {
        if (!token) continue;
        const matched = existingTurmas.find(
          (t) => t.code.toUpperCase() === token || t.name.toUpperCase().includes(token) || t.id === token.toLowerCase()
        );
        if (matched) {
          assignedTurmaIds.push(matched.id);
        } else {
          warnings.push(`Linha ${i + 1} (${name}): Turma "${token}" não localizada no cadastro.`);
        }
      }
    }

    // Initials
    const parts = name.split(' ').filter(Boolean);
    const initials = parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();

    result.push({
      id: `prof-${Date.now()}-${i}`,
      name,
      siape,
      email,
      title: validTitle,
      department,
      campus,
      assignedDisciplineIds,
      assignedTurmaIds,
      phone,
      room,
      avatarInitials: initials,
    });
  }

  return { professors: result, warnings };
}
