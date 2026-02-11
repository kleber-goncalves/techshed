# EPERM e Lock do Next.js no Windows

Esta documentacao registra o problema de `EPERM: rename` e o erro de lock do Next.js no Windows durante `next dev`, incluindo causa raiz e solucoes aplicadas.

---

## Contexto

No Windows, o Next.js usa a pasta `.next` para gerar artefatos de build e o arquivo `.next/dev/lock` para garantir que apenas uma instancia do dev server esteja ativa. Se um processo Node/Next ficar travado em segundo plano, ele pode manter arquivos abertos e impedir o `rename`/lock.

---

## Sintomas observados

**Erro de rename (EPERM):**
```
Error: EPERM: operation not permitted, rename 'C:\...\ .next\dev\server\server-reference-manifest.js.tmp.xxx' -> 'C:\...\ .next\dev\server\server-reference-manifest.js'
```

**Erro de lock do dev server:**
```
Unable to acquire lock at C:\projetos\front\techshed\.next\dev\lock, is another instance of next dev running?
```

---

## Causa raiz

- Ja existia uma instancia do Next.js rodando (provavelmente travada em segundo plano).
- O processo Node manteve a pasta `.next` aberta.
- O lock `.next/dev/lock` impediu a nova instancia.
- No caso observado, o PID ativo era **24464**.

Em Windows, arquivos abertos por um processo podem bloquear `rename` e `delete`, gerando `EPERM`.

---

## Solucoes aplicadas (da mais simples para a mais agressiva)

### 1) Matar todos os processos Node

**Comando:**
```powershell
taskkill /F /IM node.exe
```

**Quando usar:**
- Quando ha varios processos Node abertos e voce quer garantir que todos foram encerrados.

**Risco/impacto:**
- Encerra qualquer aplicativo Node ativo (incluindo outros servidores e scripts em execucao).

---

### 2) Matar apenas o PID especifico

**Comando:**
```powershell
taskkill /F /PID 24464
```

**Quando usar:**
- Quando voce ja sabe o PID do processo travado.

**Risco/impacto:**
- Encerra apenas a instancia problematica.
- Preferivel quando possivel.

---

## Passo a passo recomendado

1. Identifique se ha instancia ativa do Node/Next.
2. Encerre o processo (preferencialmente pelo PID).
3. Se o erro persistir, remova a pasta `.next`.
4. Rode novamente:
```powershell
npm run dev
```

---

## Prevencao

- Evite iniciar mais de uma instancia de `next dev` ao mesmo tempo.
- Se houver bloqueios recorrentes, adicione `.next` na lista de exclusoes do antivirus/Windows Defender.

---

## Checklist rapido (menos de 1 minuto)

1. `taskkill /F /PID 24464` (ou `taskkill /F /IM node.exe`)
2. `Remove-Item -Recurse -Force .next` (se necessario)
3. `npm run dev`
4. Confirmar que o servidor iniciou sem erro de lock.

---

## Validacao manual

- O comando `npm run dev` deve subir sem erros de lock.
- Nao devem aparecer erros `EPERM` ao recompilar.
