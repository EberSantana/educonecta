# EduConecta - Portal Acadêmico do Professor & Aluno

Portal de gestão acadêmica e pedagógica integrado para o Instituto Federal de Sergipe (IFS - Campus Tobias Barreto / COINF), desenvolvido para o **Prof. Eber Santana** gerenciar disciplinas, turmas, planos de aula baseados em PPCs oficiais, materiais didáticos, tarefas, notas e interação direta com os estudantes.

🌐 **Acesso Online (GitHub Pages)**: [https://ebersantana.github.io/EduConecta/](https://ebersantana.github.io/EduConecta/)

---

## 🚀 Funcionalidades Principais

### 1. Sistema de Autenticação com Perfis Distintos
- **Perfil Professor / Docente**: Gestão completa de cursos, turmas, criação de disciplinas, publicação de cronogramas de aula com ementa oficial, disponibilização de materiais, avaliação de atividades e moderação de avisos.
- **Perfil Aluno**: Visualização personalizada das turmas matriculadas, download de materiais segregados por curso/disciplina, entrega de trabalhos com anexo/link, visualização de notas com feedback e participação no fórum de dúvidas.
- **Acessos Rápidos de Demonstração**: Permite alternar com um clique entre o perfil docente (Prof. Eber Santana) e os estudantes dos cursos técnicos.

### 2. Estrutura Baseada nos PPCs Oficiais do IFS
O sistema já vem pré-configurado e estruturado de acordo com os Projetos Pedagógicos de Curso (PPCs) e Conteúdos Programáticos da COINF:
- **Técnico em Desenvolvimento de Sistemas (Integrado)** - Resolução CS/IFS nº 216/2023:
  - Programação I (Lógica, Tipos, Condicionais, Laços, Funções, Vetores e Matrizes - 80h)
  - Construção de Sites I (HTML5 semântico, CSS3 Flexbox/Grid, Responsividade - 80h)
  - Banco de Dados I & II (Modelagem conceitual/lógica, SQL DDL/DML, Normalização)
- **Técnico em Programação de Jogos Digitais (Integrado)**:
  - Programação de Jogos I (Loops de jogo, física 2D, colisão AABB, animação por sprites)
  - Arte e Conceito para Jogos (Pixel art, tilesets, color scripts)
- **Técnico em Informática (Subsequente)**:
  - Programação para Web e Arquitetura de Computadores.

### 3. Gestão Completa de Aulas & Cronogramas
- Aulas divididas rigorosamente por bimestres (1º e 2º Bimestres).
- Cada aula com tema, objetivo de aprendizagem, metodologia, recursos necessários e status (concluída / planejada).
- Modal interativo para visualização de cronograma de aulas com filtros e busca rápida.

### 4. Materiais Didáticos & Arquivos
- Materiais separados estritamente por curso e disciplina (PDFs, Slides, Vídeos, Exercícios e Códigos).
- Contador de downloads, busca instantânea e filtro por módulos do conteúdo programático.

### 5. Atividades, Entregas e Avaliações
- Criação de tarefas com data limite e pontuação máxima.
- Envio de trabalhos pelos alunos com status em tempo real (*Pendente*, *Enviado*, *Avaliado*, *Atrasado*).
- Interface do professor para correção com nota e parecer pedagógico personalizado.

### 6. Interação Docente-Discente
- **Mural de Avisos**: Comunicados com níveis de prioridade (*Importante*, *Normal*, *Urgente*), avisos fixados e área para dúvidas nos comentários.
- **Fórum de Dúvidas**: Perguntas categorizadas por disciplina com respostas oficiais do professor destacadas.
- **Plantão de Dúvidas (Office Hours)**: Agendamento de horários presenciais e link direto para atendimento no Google Meet.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript + Vite
- **Estilização**: Tailwind CSS v4 (Design limpo, profissional e responsivo)
- **Ícones**: Lucide React
- **Persistência**: LocalStorage com migração de estado versionada
- **Testes Unitários**: Node.js Test Runner nativo (`node:test`)

---

## 💻 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- Gerenciador de pacotes `npm`

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/EberSantana/EduConecta.git
cd EduConecta
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:3000
```

### Executar Testes Unitários

```bash
npx tsx --test src/utils/academic-logic.test.ts
```

### Compilar para Produção

```bash
npm run build
```

---

## 👨‍🏫 Autor & Coordenação

- **Professor**: Prof. Eber Santana (`eberss@gmail.com`)
- **Instituição**: Instituto Federal de Sergipe (IFS) - Campus Tobias Barreto
- **Coordenação**: Coordenação de Informática (COINF)
