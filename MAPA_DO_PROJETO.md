# Mapa de Localização do Código — Zenix Education

Documento de referência para localizar rapidamente telas, comportamentos, dados e pontos de integração do projeto.

> Este mapa descreve somente arquivos e funções que existem atualmente. Não há banco de dados, upload ou camada de permissões persistida.

## Estrutura atual

```text
app/
  (auth)/login/[role]/page.tsx
  (platform)/[role]/page.tsx
  (platform)/[role]/rede-social/[section]/page.tsx
  globals.css
  layout.tsx
  page.tsx

components/
  administrador/admin-dashboard.tsx
  aluno/student-dashboard.tsx
  professor/professor-dashboard.tsx
  shared/area-dashboard.tsx
  shared/platform-shell.tsx
  shared/social-network.tsx
  ui/button.tsx

data/
  shared/social.ts

lib/
  utils.ts

public/
  assets estáticos e ícones
```

## 1. Aluno

### Dashboard do Aluno

- **Arquivo:** `components/aluno/student-dashboard.tsx`
- **Componente:** `StudentDashboard`
- **Trecho:** componente completo; o modo é definido pela prop `role="student"`.
- **Responsabilidade:** cabeçalho do portal, saudação do aluno, RA, card de comunicados, acesso rápido, link da Rede Social e saída.
- **Pode alterar:** conteúdo e composição específica do dashboard do aluno.
- **Escopo:** compartilhado com Responsável no mesmo componente.
- **Impacto:** alterações em estruturas comuns, `quickItems`, `Brand` ou classes do portal podem afetar Responsável.

### Acesso à Rede Social pelo dashboard

- **Arquivo:** `components/aluno/student-dashboard.tsx`
- **Trecho:** card `.social-quick-item` e link `href="/aluno/rede-social/feed"`.
- **Responsabilidade:** destaque de Rede Social em “ACESSO RÁPIDO” e link inferior.
- **Escopo:** específico do modo Aluno (`!isParent`).
- **Impacto:** somente Aluno, salvo alterações nas classes compartilhadas do CSS.

### Feed e publicações

- **Arquivo:** `components/shared/social-network.tsx`
- **Componentes:** `SocialNetwork`, `PostComposer`, `PostCard`.
- **Responsabilidade:** publicação de texto, autoria do usuário atual, curtidas/descurtidas, comentários, edição/exclusão de publicações próprias e renderização do feed.
- **Dados locais:** estado React dentro de `SocialNetwork`; conteúdo inicial vem de `mockPosts`.
- **Escopo:** compartilhado com Professor e demais perfis habilitados pela rota social.
- **Impacto:** alto. Alterações em `PostCard`, `SocialNetwork` ou tipos de publicação podem afetar todos os perfis da Rede Social.

### Murais e comunicados

- **Arquivo:** `components/shared/social-network.tsx`
- **Componentes:** `MuralView`, `PageIntro`.
- **Responsabilidade:** cards de `Mural geral`, `Avisos da turma` e `Eventos da escola`; abertura das publicações de cada mural; curtidas e comentários locais nas publicações exibidas.
- **Dados:** `muralPosts` usa partes de `mockPosts`.
- **Escopo:** compartilhado.
- **Impacto:** alto dentro da Rede Social; não altera dashboard se forem mantidas as interfaces atuais.

### Grupos de estudo

- **Arquivo:** `components/shared/social-network.tsx`
- **Componente:** `GroupCard`.
- **Responsabilidade:** renderização dos cards de grupos quando a seção de grupos é exibida.
- **Dados:** `mockGroups` em `data/shared/social.ts`.
- **Escopo:** compartilhado pela Rede Social.
- **Impacto:** alterações no card ou nos tipos de grupo afetam os perfis que acessam Grupos.

### Hobbies

- **Arquivo:** `components/shared/social-network.tsx`
- **Renderização:** seção de hobbies dentro de `SocialNetwork`.
- **Dados:** `mockHobbies` em `data/shared/social.ts`.
- **Escopo:** compartilhado pela Rede Social.
- **Impacto:** alterações na seção ou nos tipos de hobby podem afetar qualquer perfil que a utilize.

### Vídeo-aulas

- **Arquivo:** `components/shared/social-network.tsx`
- **Componentes:** `VideoCard`, `VideoModal`.
- **Responsabilidade:** lista mockada, abertura do modal, metadados da aula e reprodução temporária da aula com `videoUrl`.
- **Dados:** `mockVideos` em `data/shared/social.ts`.
- **Escopo:** compartilhado pela Rede Social.
- **Impacto:** alterações em `VideoModal` ou no tipo `Video` afetam a tela de Vídeo-aulas.

### Perfil

- **Arquivo:** `components/shared/social-network.tsx`
- **Renderização:** seção `perfil` dentro de `SocialNetwork`.
- **Responsabilidade atual:** exibição dos campos e informações de perfil mockados.
- **Edição:** não existe atualmente um componente ou função separado de edição persistente de perfil.
- **Escopo:** compartilhado.
- **Impacto:** alterações devem ser feitas com cuidado porque o mesmo componente atende várias seções.

## 2. Responsável

### Dashboard do Responsável

- **Arquivo:** `components/aluno/student-dashboard.tsx`
- **Componente:** `StudentDashboard` com `role="responsible"`.
- **Responsabilidade:** portal do responsável, aluno vinculado, identificação de parentesco, acesso rápido, Rede Social e saída.
- **Escopo:** compartilhado no mesmo arquivo com o dashboard do Aluno.
- **Impacto:** alto. Qualquer alteração estrutural no componente pode afetar o Aluno.

### Filhos vinculados

- **Arquivo:** `components/aluno/student-dashboard.tsx`
- **Trechos:** bloco `isParent` com `student-select` e `student-row`.
- **Responsabilidade:** exibir o aluno vinculado, RA e vínculo “Mãe”.
- **Escopo:** específico do Responsável.
- **Impacto:** visual do portal compartilhado pode afetar Aluno.

### Notas, horários, calendário, agenda e comunicados

- **Arquivo atual:** `components/aluno/student-dashboard.tsx`
- **Estado:** aparecem como itens mockados de `quickItems`; não há telas ou componentes independentes para essas funcionalidades.
- **Escopo:** `quickItems` é declarado no mesmo arquivo e é exibido também no modo Aluno.
- **Impacto:** alterar `quickItems` afeta ambos os perfis.

### Rede Social do Responsável

- **Arquivo de entrada:** `app/(platform)/[role]/rede-social/[section]/page.tsx`
- **Componente:** `SocialNetwork` em `components/shared/social-network.tsx`.
- **Dados:** `data/shared/social.ts`.
- **Escopo:** compartilhado; a seção recebe `role` pela rota dinâmica.
- **Impacto:** alto dentro da Rede Social.

## 3. Professor/Funcionário

### Dashboard

- **Arquivo:** `components/professor/professor-dashboard.tsx`
- **Componente:** `ProfessorDashboard`.
- **Responsabilidade:** saudação de Fernanda, estatísticas de turmas/alunos/aulas, acesso rápido, próximas aulas e saída.
- **Escopo:** específico de Professor/Funcionário.
- **Impacto:** usa `Header` e `SideNav` compartilhados; mudanças nesses componentes podem afetar Administrador.

### Menus do Professor

- **Arquivo:** `components/shared/platform-shell.tsx`
- **Componente:** `SideNav`, bloco `professorMenu` ativado pela prop `professor`.
- **Responsabilidade:** Turmas, Lançamento de Notas, Diário de Classe, Horários, Reforço/Extras, Ocorrências, Calendário, Rede Social, Perfil e Sair.
- **Escopo:** regra específica dentro de componente compartilhado.
- **Impacto:** alterações no `SideNav` podem afetar Professor e Administrador.

### Feed e publicações

- **Arquivo:** `components/shared/social-network.tsx`
- **Componentes:** `SocialNetwork`, `PostComposer`, `PostCard`.
- **Responsabilidade:** publicação como perfil Funcionário/Professora, interação e visualização do feed.
- **Dados:** `data/shared/social.ts` e estado local do componente.
- **Escopo:** compartilhado com Aluno e outros perfis.
- **Impacto:** alto.

### Turmas, diário de classe e chamada

- **Arquivo:** `components/professor/professor-dashboard.tsx` e `components/shared/platform-shell.tsx`.
- **Estado atual:** aparecem como cards/botões de navegação mockados; não existem telas ou funções próprias de lançamento de notas, diário ou chamada.
- **Escopo:** dashboard/menu do Professor.
- **Impacto:** alterações no menu do Professor não deveriam ser feitas no dashboard do Administrador, embora hoje compartilhem `SideNav`.

### Perfil do Professor

- **Arquivo:** `components/shared/platform-shell.tsx`
- **Trecho:** item `Perfil` dentro de `professorMenu`.
- **Estado atual:** botão visual; não existe editor de perfil separado.
- **Escopo:** Professor.
- **Impacto:** baixo enquanto permanecer apenas item de menu; alterações no shell podem afetar outros perfis.

## 4. Administrador

### Dashboard

- **Arquivo:** `components/administrador/admin-dashboard.tsx`
- **Componente:** `AdminDashboard`.
- **Responsabilidade:** estatísticas, aniversariantes, avisos de cadastro, acesso rápido e saída.
- **Escopo:** específico de Administrador.
- **Impacto:** usa `Header` e `SideNav` compartilhados.

### Cadastros, turmas, calendário e menus administrativos

- **Arquivo:** `components/shared/platform-shell.tsx`
- **Componente:** `SideNav`, bloco administrativo quando `professor={false}`.
- **Responsabilidade:** Cadastro, Acadêmico, Simulados e Provas e Portaria.
- **Estado atual:** itens de menu mockados; não existem componentes separados para as telas administrativas.
- **Escopo:** regras de Administrador dentro de componente compartilhado.
- **Impacto:** médio/alto; editar o `SideNav` pode afetar Professor.

### Acesso à Rede Social

- **Arquivo:** `components/administrador/admin-dashboard.tsx`
- **Trecho:** card de acesso rápido com link para `/funcionario/rede-social/feed`.
- **Escopo:** Administrador.
- **Impacto:** alteração do destino pode afetar a navegação administrativa.

## 5. Rede Social e componentes compartilhados

### Rota de entrada da Rede Social

- **Arquivo:** `app/(platform)/[role]/rede-social/[section]/page.tsx`
- **Componente:** `AreaPage`.
- **Responsabilidade:** lê `[role]` e `[section]`, renderiza `SocialNetwork` e repassa o perfil/seção.
- **Escopo:** integração compartilhada.
- **Impacto:** alto; alterações podem quebrar todas as URLs da Rede Social.

### Rede Social completa

- **Arquivo:** `components/shared/social-network.tsx`
- **Componente principal:** `SocialNetwork`.
- **Subcomponentes:** `Avatar`, `Badge`, `PostCard`, `PostComposer`, `VideoCard`, `VideoModal`, `GroupCard`, `Chat`, `MuralView`, `PageIntro`.
- **Responsabilidade:** Feed, Murais, Vídeo-aulas, Grupos, Hobbies, Chat, Perfil e campos de publicação.
- **Escopo:** compartilhado por perfil.
- **Impacto:** muito alto; é o maior ponto de conflito atual entre grupos.

### Tipos e dados demonstrativos

- **Arquivo:** `data/shared/social.ts`
- **Tipos:** `SocialRole`, `Post`, `Group`, `Video`, `Hobby`, `Contact`, `Message`, `SchoolClass`.
- **Mocks:** `mockPosts`, `mockGroups`, `mockVideos`, `mockHobbies`, `mockContacts`, `mockMessages`, `mockClasses`.
- **Responsabilidade:** dados iniciais e contratos usados pela Rede Social.
- **Escopo:** compartilhado.
- **Impacto:** alterações em tipos têm impacto amplo; alterações em mocks afetam a apresentação de várias seções.

### Shell visual compartilhado

- **Arquivo:** `components/shared/platform-shell.tsx`
- **Componentes:** `Brand`, `Header`, `SideNav`.
- **Responsabilidade:** logo, cabeçalho, pesquisa visual, ações superiores e menus laterais.
- **Escopo:** compartilhado entre Professor e Administrador; `SideNav` também contém regras específicas desses dois perfis.
- **Impacto:** alto em qualquer alteração visual ou de navegação.

### Área e proteção de sessão

- **Arquivo:** `components/shared/area-dashboard.tsx`
- **Componente:** `AreaDashboard`.
- **Responsabilidade:** lê a sessão DEMO, autoriza a área, escolhe o dashboard correto e executa logout.
- **Escopo:** integração compartilhada.
- **Impacto:** crítico; qualquer alteração pode afetar acesso e logout de todos os perfis.

### Componentes visuais reutilizáveis

- **Arquivo:** `components/ui/button.tsx`
- **Componente:** `Button`.
- **Responsabilidade:** botão baseado em Base UI/CVA.
- **Escopo:** compartilhado.
- **Impacto:** potencialmente global para consumidores desse componente.

### Utilitários

- **Arquivo:** `lib/utils.ts`
- **Função:** `cn`.
- **Responsabilidade:** combinação de classes CSS.
- **Escopo:** compartilhado.
- **Impacto:** global para componentes que importarem o utilitário.

## 6. Autenticação DEMO e navegação

### Login por perfil

- **Arquivo:** `app/(auth)/login/[role]/page.tsx`
- **Componente:** `LoginPage`.
- **Responsabilidade:** campos de e-mail e senha, validação DEMO, definição de `sessionStorage` e redirecionamento.
- **Escopo:** integração compartilhada.
- **Impacto:** crítico; alterações nas credenciais ou destinos afetam todos os perfis.

### Rotas de dashboards

- **Arquivo:** `app/(platform)/[role]/page.tsx`
- **Componente:** `AreaPage`.
- **Responsabilidade:** valida o segmento dinâmico e renderiza `AreaDashboard`.
- **Rotas:** `/aluno`, `/responsavel`, `/funcionario` e `/admin`.
- **Escopo:** integração compartilhada.
- **Impacto:** crítico para navegação e proteção de áreas.

### Página inicial

- **Arquivo:** `app/page.tsx`
- **Componentes:** `Page`, `Home`, `RoleCard`.
- **Responsabilidade:** seleção inicial de perfil e links para login.
- **Escopo:** compartilhado como ponto de entrada.
- **Impacto:** alto para navegação inicial; não contém mais `AreaDashboard`.

### Layout e metadados

- **Arquivo:** `app/layout.tsx`
- **Componente:** `RootLayout`.
- **Responsabilidade:** layout raiz, metadados e Analytics.
- **Escopo:** global.
- **Impacto:** qualquer alteração pode afetar todas as rotas.

## 7. Guia rápido de impacto

| Quero alterar | Arquivo principal | Risco |
|---|---|---|
| Dashboard do Aluno | `components/aluno/student-dashboard.tsx` | Pode afetar Responsável |
| Dashboard do Responsável | `components/aluno/student-dashboard.tsx` | Pode afetar Aluno |
| Dashboard do Professor | `components/professor/professor-dashboard.tsx` | Usa shell compartilhado |
| Dashboard do Administrador | `components/administrador/admin-dashboard.tsx` | Usa shell compartilhado |
| Menu do Professor | `components/shared/platform-shell.tsx` | Pode afetar Administrador |
| Menu do Administrador | `components/shared/platform-shell.tsx` | Pode afetar Professor |
| Feed | `components/shared/social-network.tsx` | Afeta perfis da Rede Social |
| Murais | `components/shared/social-network.tsx` | Afeta perfis da Rede Social |
| Vídeo-aulas | `components/shared/social-network.tsx` e `data/shared/social.ts` | Afeta dados e modal da seção |
| Grupos | `components/shared/social-network.tsx` e `data/shared/social.ts` | Afeta dados da seção |
| Perfil da Rede Social | `components/shared/social-network.tsx` | Afeta o componente compartilhado |
| Sessão e logout | `components/shared/area-dashboard.tsx` | Afeta todos os perfis |
| Credenciais e redirecionamento | `app/(auth)/login/[role]/page.tsx` | Afeta todos os logins |
| Rotas de área | `app/(platform)/[role]/page.tsx` | Afeta todos os dashboards |
| Estilos globais | `app/globals.css` | Pode afetar toda a plataforma |

## 8. Recomendações para a equipe

1. Evitar alterações simultâneas em `components/shared/social-network.tsx`; dividir tarefas por seções e revisar conflitos manualmente.
2. Separar futuramente Aluno e Responsável em dashboards distintos, extraindo primeiro um shell de portal comum.
3. Separar os menus de Professor e Administrador em componentes próprios, mantendo `Brand` e `Header` compartilhados.
4. Manter `data/shared/social.ts` somente para contratos e dados realmente compartilhados.
5. Tratar `components/shared/area-dashboard.tsx`, `app/(platform)/[role]/page.tsx` e o login como áreas de integração, alteradas somente com coordenação entre os grupos.
6. Não alterar `app/globals.css` para uma funcionalidade específica sem avaliar o impacto global.
7. Atualmente os estados do Feed, curtidas, comentários e publicações são locais; nenhuma dessas mudanças é persistida em banco de dados.
