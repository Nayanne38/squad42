# Zenix Education · Colégio CEPI Expansão

Plataforma escolar de demonstração (front-end) do **Squad 42**: portal para alunos, responsáveis, docência, direção e administração (TI), com uma **rede social escolar** integrada.

> Projeto em modo demonstração: todos os dados são fictícios (mock), não há banco de dados e não há funcionalidade de IA. A sessão de login fica apenas no navegador.

## Perfis e logins de demonstração

Os campos de login já vêm preenchidos; basta clicar em **Entrar**.

| Entrada | Pessoa e função | E-mail | Senha |
|---|---|---|---|
| Aluno | Rafael da Silva Moura | `rafael@cepi.com` | `rafael123` |
| Responsável | Fabricya Nayanne Santos (mãe de Rafael) | `fabricya@cepi.com` | `fabricya123` |
| Docência | Luan Santana Souza · Matemática | `luan@cepi.com` | `luan123` |
| Docência | João Vitor Braz Mourão · Geografia | `joao@cepi.com` | `joao123` |
| Docência | Atabisio Henry · Língua Portuguesa | `atabisio@cepi.com` | `atabisio123` |
| Docência (Direção / Coordenação) | Fabricya Nayanne Santos · Diretora | `fabricya.direcao@cepi.com` | `fabricya123` |
| Administração (TI) | Igor Gabriel · Segurança e acessos | `igor@cepi.com` | `igor123` |
| Administração (TI) | Yan Francisco Jesus de Oliveira · Infraestrutura e backup | `yan@cepi.com` | `yan123` |
| Administração (TI) | Rafael da Silva Moura · Sistemas e cadastros | `rafael.ti@cepi.com` | `rafael123` |

As contas ficam em `data/shared/accounts.ts`.

## O que existe na plataforma

- **Aluno** (`/aluno`): notas, horários, comunicados, calendário e rede social.
- **Responsável** (`/responsavel`): acompanhamento do filho, comunicados e rede social.
- **Docência** (`/funcionario`): turmas, lançamento de notas, diário de classe, ocorrências, reforço, banco de questões, simulados e rede social.
- **Direção / Coordenação** (`/direcao`): turmas, comunicados, moderação e relatórios da comunidade, provas, portaria e rede social.
- **Administração / TI** (`/admin`): cadastros, vínculos, permissões de acesso, logs, backup e segurança.
- **Rede social escolar** (`/<perfil>/rede-social/...`): feed, murais, vídeo-aulas (YouTube), grupos de estudo, hobbies, mensagens e perfil, com tema de cor por perfil.

Layout responsivo para **computador, tablet e celular**.

## Tecnologias

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 + CSS próprio · lucide-react · fontes Inter e Poppins (`next/font`).

## Como rodar localmente

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. No Windows, também dá para usar o `iniciar-localhost.bat`.

Para testar em outro aparelho da mesma rede Wi-Fi, abra `http://IP-DO-SEU-PC:3000` no celular ou tablet.

Build de produção:

```bash
npm run build
npm start
```

## Publicar (deploy) na Vercel

1. Envie o código para o GitHub (já está em `main`).
2. Entre em [vercel.com](https://vercel.com) com a conta do GitHub e clique em **Add New → Project**.
3. Escolha o repositório `squad42`. A Vercel detecta o Next.js sozinha; não precisa mudar nenhuma configuração nem criar variáveis de ambiente.
4. Clique em **Deploy**. Em cerca de 1 a 2 minutos o site fica no ar em um endereço `https://nome-do-projeto.vercel.app`.
5. A cada `git push` na `main`, a Vercel publica uma nova versão automaticamente.

### Usar um domínio próprio

1. No projeto da Vercel, abra **Settings → Domains** e adicione o domínio (por exemplo `cepi.com.br`).
2. A Vercel mostra os registros DNS para criar no site onde o domínio foi registrado (Registro.br, GoDaddy etc.): normalmente um registro **A** `76.76.21.21` para o domínio raiz e um **CNAME** `cname.vercel-dns.com` para o `www`. Use sempre os valores exibidos no painel.
3. Aguarde a propagação do DNS (de minutos a algumas horas). O certificado HTTPS é emitido automaticamente.

Alternativas: Netlify, Cloudflare Pages ou qualquer servidor Node com `npm run build && npm start`.

## Estrutura do projeto

```
app/            rotas (páginas) e estilos globais
components/     telas e componentes por perfil (aluno, professor, administrador, ti, social, rede-social, shared)
data/shared/    dados fictícios e contas de demonstração
lib/            utilitários, incluindo a sessão de demonstração
public/         logo do CEPI, ícones e imagens
```

Mais detalhes em [`MAPA_DO_PROJETO.md`](MAPA_DO_PROJETO.md).

## Limitações conhecidas

- Sem back-end: os dados voltam ao padrão ao limpar o navegador e nada é salvo em servidor.
- O login é apenas demonstrativo e não oferece segurança real.
- Logs, backup e recuperação de senha são simulados.
