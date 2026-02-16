# 📘 DOCUMENTAÇÃO — Supabase + Prisma (v7+) + Next.js + JavaScript

Essa documentação explica **como configurar e integrar Supabase, Prisma v7+, Next.js e JavaScript** para construir um backend funcional e acessível — com explicações claras e passo a passo para iniciantes.

---

## 🧰 Pré-requisitos

Antes de começar, você precisa ter:

✔ Node.js instalado  
✔ NPM (ou Yarn) instalado  
✔ Conta no Supabase  
✔ Projeto Next.js criado  
✔ Conexão com Supabase (DATABASE_URL)

---

---

## 🚀 1) Criando o projeto Next.js

No terminal, execute:

```bash
npx create-next-app@latest my-ecommerce
cd my-ecommerce

```
Escolha JavaScript quando perguntar.

---
## 🛠️ 2) Instalando dependências
No terminal, dentro do diretório do projeto, execute:

```bash
npm install @prisma/client prisma
npm install @supabase/supabase-js
npm install prisma --save-dev
```
Explicação:
- `@prisma/client`: Cliente Prisma para interagir com o banco de dados.
- `prisma`: Ferramenta de linha de comando para gerenciar o esquema do banco de dados, ORM (Object Relational Mapping).
- `@supabase/supabase-js`: Biblioteca oficial do Supabase para JavaScript, para comunicação com o Supabase (frontend/backend).

---
## 🗂️ 3) Inicializando o Prisma
No terminal, execute:

```bash
npx prisma init
```
Isso criará uma pasta `prisma` com um arquivo `schema.prisma` dentro do seu projeto.

```bash
prisma/
  schema.prisma
.env
```
O arquivo `.env` é onde você vai colocar a variável de ambiente `DATABASE_URL` com a string de conexão do seu banco de dados Supabase.

Sobre .env

O arquivo .env contém variáveis de ambiente.
Prisma usa ele para saber como conectar ao banco.

---
## 🔗 4) Configurando o Supabase


- Acesse https://app.supabase.com

- Crie um projeto

- Vá em connect > ORMs 

- e copie a string de conexão do banco de dados. Ela deve ser algo como:

  - Conecte-se ao Supabase por meio de um pool de conexões :
```bash
DATABASE_URL="postgresql://postgres.zhlufdabefuimqeptakn:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

```


  - Conexão direta com o banco de dados. Usada para migrações. :
  
  
```bash
DIRECT_URL="postgresql://postgres.zhlufdabefuimqeptakn:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"

```

Substitua `[YOUR-PASSWORD]` pela senha do seu banco de dados Supabase.

---
## 📝 5) Entendendo o arquivo schema.prisma
Abra o arquivo `prisma/schema.prisma` 

Ele será parecido com:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}
```
O que estas partes significam:

- generator client
Define que o Prisma vai gerar o cliente JavaScript que você vai usar no código.

- datasource db
Diz que o banco é PostgreSQL

---
## 🏗️ 6) Definindo o modelo de dados

No mesmo arquivo `schema.prisma`, adicione o seguinte modelo de dados para produtos:

```prisma
model User {
  id        String   @id @default(uuid())
  name      String?
  email     String   @unique
  createdAt DateTime @default(now())
}
```

Explicação:

- id: identificador único

- email: único

- createdAt: data de criação automática

---
## 💾 7) Criando a tabela no banco de dados
No terminal, execute:

```bash

npx prisma generate

```
Este comando vai gerar o cliente ↪ node_modules/.prisma/client

---

## 📂 8) Configurando prisma.js

Crie a pasta :

```bash
src/lib/

```
apos :

Instale o adapter PostgreSQL:

```bash
npm install @prisma/adapter-postgresql

```

Depois no seu lib/prisma.js faça assim:

```bash
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
    adapter
});

export default prisma;

```

Explicação:
- PrismaClient: é a classe principal do Prisma para interagir com o banco de dados.
- PrismaPg: é o adaptador específico para PostgreSQL, necessário para conectar ao Supabase.
- connectionString: é a string de conexão do banco de dados, que vem da variável de ambiente `DATABASE_URL`.
- prisma: é a instância do cliente Prisma configurada com o adaptador PostgreSQL.
- export default prisma: exporta a instância do Prisma para ser usada em outras partes do código.
- Com essa configuração, você pode usar o Prisma para realizar operações no banco de dados Supabase a partir do seu projeto Next.js.
- Lembre-se de que a variável de ambiente `DATABASE_URL` deve estar corretamente configurada no arquivo `.env` para que a conexão funcione.
- Agora, você pode importar o `prisma` em seus arquivos Next.js para realizar operações de banco de dados, como criar, ler, atualizar e excluir registros.



## Exemplo de uso em uma API route do Next.js Simplis:

```javascript
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;
    try {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
        },
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

```
## Exemplo de uso em uma API route do Next.js Avançado:

```javascript

import prisma from "@/lib/prisma";

export async function POST(request) {
    const body = await request.json();
    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
        },
    });
    return Response.json(user);
}

export async function GET() {
    const users = await prisma.user.findMany();
    return Response.json(users);
}

```
Explicação:
- O exemplo acima mostra como criar uma rota de API no Next.js que lida com requisições POST para criar um novo usuário e GET para listar todos os usuários.
- No método POST, os dados do usuário são extraídos do corpo da requisição e um novo registro é criado no banco de dados usando `prisma.user.create()`.
- No método GET, todos os usuários são recuperados do banco de dados usando `prisma.user.findMany()` e retornados como resposta JSON.
- Certifique-se de que a rota de API esteja corretamente configurada no diretório `pages/api` do seu projeto Next.js para que essas funções sejam acessíveis via HTTP.  
- Lembre-se de que a conexão com o banco de dados deve estar funcionando corretamente para que essas operações sejam bem-sucedidas.
- Com essa configuração, você pode facilmente criar e gerenciar usuários no seu banco de dados Supabase usando Prisma e Next.js!
- Agora, você tem uma configuração completa para usar Supabase, Prisma v7+ e Next.js com JavaScript para construir um backend funcional e acessível. Sinta-se à vontade para expandir o modelo de dados, criar mais rotas de API e desenvolver a lógica do seu aplicativo conforme necessário!
- Lembre-se de sempre testar suas rotas de API usando ferramentas como Postman ou Insomnia para garantir que tudo esteja funcionando corretamente. Boa sorte com seu projeto! 


isso criar rotas como :
- POST /api/users - para criar um novo usuário
- GET /api/users - para listar todos os usuários


---



## 🌐 10) Usando rotas dinâmicas
No Next.js, você pode criar rotas dinâmicas para acessar recursos específicos. Por exemplo, para acessar um usuário específico por ID, você pode criar um arquivo em `pages/api/users/[id].js` com o seguinte conteúdo:

```javascript
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

``` 

Explicação:
- Neste exemplo, a rota é dinâmica porque o arquivo é nomeado com `[id].js`, o que permite acessar diferentes usuários com base no ID fornecido na URL.
- A função `handler` verifica o método da requisição e, se for um GET, ela tenta encontrar um usuário com o ID especificado usando `prisma.user.findUnique()`.
- Se o usuário for encontrado, ele é retornado com um status 200. Caso contrário, um erro 404 é retornado indicando que o usuário não foi encontrado.
- Se a requisição usar um método diferente de GET, um erro 405 é retornado  indicando que o método não é permitido.
- Com essa configuração, você pode acessar usuários específicos usando URLs como `http://localhost:300  0/api/users/123`, onde `123` é o ID do usuário que você deseja acessar. Certifique-se de que os IDs dos usuários estejam corretamente configurados no banco de dados para que essa funcionalidade funcione corretamente!
- Lembre-se de testar essa rota usando ferramentas como Postman ou Insomnia para garantir que ela esteja funcionando conforme o esperado. Boa sorte com seu projeto!





exemplo de uso em uma rota dinâmica avançada:

```javascript
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
    const body = await request.json();
    const updatedUser = await prisma.user.update({
        where: { id: params.id },
        data: {
            name: body.name,
            email: body.email,
        },
    });
    return Response.json(updatedUser);
}


export async function DELETE(request, { params }) {
    await prisma.user.delete({
        where: { id: params.id },
    });
    return Response.json({ success: true });
}


```

Explicação:
- Neste exemplo, além do método GET para buscar um usuário por ID, também implementamos os métodos PUT e DELETE para atualizar e excluir um usuário, respectivamente.
- O método PUT recebe os dados atualizados do usuário no corpo da requisição e usa `prisma.user.update()` para atualizar o registro correspondente no banco de dados com base no ID fornecido na URL.
- O método DELETE usa `prisma.user.delete()` para remover o usuário do banco de dados com base no ID fornecido na URL.
- Com essa configuração, você pode realizar operações de leitura, atualização e exclusão em usuários específicos usando URLs como `http://localhost:3000/api/users/123`, onde `123` é o ID do usuário que você deseja acessar, atualizar ou excluir.
- Lembre-se de testar essas rotas usando ferramentas como Postman ou Insomnia para garantir que elas estejam funcionando conforme o esperado. Boa sorte com seu projeto!


isso criar rotas como :

- GET /api/users/<id> - para buscar um usuário específico por ID
- PUT /api/users/<id> - para atualizar um usuário específico por ID
- DELETE /api/users/<id> - para excluir um usuário específico por ID


---

## Conclusão

Com essa configuração, você tem:

- Backend funcional
- Prisma conectado ao Supabase
- Rotas CRUD funcionando
- Next.js pronto para crescer


## 14) Próximos passos

Você pode adicionar:

- Autenticação Supabase Auth
- Endereços e Orders
- Middlewares de autorização
- Tratamentos de erro