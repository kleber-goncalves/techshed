## 🔎 O que foi feito

- Integra pagina de produto completa (page, ProdutoClient e componentes associados).
- Adiciona slider de produtos com Swiper e estilos.
- Adiciona breadcrumb, variantes de cor (hover/selecionado) e melhorias de UX.
- Ajusta layout global (Header/Nav/Footers), espaçamentos e dark mode.
- Atualiza botoes com variantes `addCart`/`buy` e tamanhos `xl`/`xxl`.
- Atualiza dados de produtos (cores/hex/corName), scripts e docs.

## 💡 Por que foi feito

- Consolidar as melhorias da pagina de produto e do fluxo da loja na branch base.

## 🧪 Como testar / passos para QA

1. `npm install`
2. `npm run dev`
3. Abrir:
    - `http://localhost:3000/`
    - `http://localhost:3000/loja`
    - `http://localhost:3000/produto/light-phantom-jp-5g-16-gb`
4. Validar:
    - Header/Nav e Footer/CentralAjuda aparecem no layout.
    - Slider funciona com botoes e paginacao.
    - Breadcrumb e variantes exibem cor no hover/selecionado.
    - Botoes addCart/buy com estilos corretos.
    - Dark mode ok.

## 🚨 Impacto

- Componentes afetados: layout global, page loja, page produto e componentes de produto.
- Backwards compatibility? sim

## 🔒 Risco

- Medio — pacote grande de mudancas visuais e de layout.

## ✅ Checklist

- [x] Segui o padrão de commits (Conventional Commits)
- [x] Testes locais rodaram
- [x] Build passou (se aplicável)
- [x] Adicionei docs (se aplicável)
- [ ] Atualizei changelog (se aplicável)

## 📎 Issues relacionadas

- N/A

## 🖼️ Screenshots / GIFs (se aplicável)

- N/A
