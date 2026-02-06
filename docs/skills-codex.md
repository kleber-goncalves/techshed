# Esse SKILL.md está planejado pra ser acionado automaticamente quando o Codex fizer revisão ou quando você pedir algo relacionado à revisão/sugestões no projeto.

- ✔ verificar performance, imports, rotas
- ✔ sugerir melhorias de UI/UX e SEO
- ✔ adicionar comentários explicativos de funções
- ✔ gerar documentação clara e detalhada
- ✔ criar branches novas + testes + implementação de novas funcionalidades

--- 

## 🧠 O que o description faz

👉 O campo description é o gatilho principal — é como o Codex decide quando usar esse skill automaticamente.

- Ele procura pelo que você pedir (no prompt ou em revisão) que tenha a ver com review, performance, UX, SEO, docs etc., e isso faz o skill “entrar” sem você ter que escrever uma instrução longa toda vez.

---

🛠 Como ativar esse skill

Certifique-se de que skills estão habilitados no Codex CLI ou IDE.

Reinicie o Codex após adicionar a pasta.

Use no seu fluxo de revisão:

🔹 Com prompts diretos: 
 

``
@codex review project quality
``

🔹 Com GitHub Codex Connector:
O bot vai detectar automaticamente e usar o skill porque a descrição diz que ele deve rodar em revisões gerais

---

📊 O que você vai obter

✅ Relatório detalhado de performance
✅ Sugestões claras de UI/UX e SEO
✅ Import fixes + route checks
✅ Documentação segmentada por funcionalidade
✅ ASCII/diagramas embutidos nos docs
✅ Automação completa:

branch criada

testes gerados

commits/PRs preparados

---

💡 Dica de uso avançado

Depois de testar, você pode evoluir esse Skill para incluir scripts automatizados (por exemplo, gerar testes ou diagramas via ferramentas gráficas) e assets/templates Markdown para deixar a documentação ainda mais profissional.