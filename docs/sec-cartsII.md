# Documentação do `sec-cartsII.jsx`

**Arquivo documentado:** `src/components/componemts-conta-users/layout/layout-cart/sec-cartsII.jsx`  
**Objetivo:** explicar cada import, função, input e componente de forma didática para estudo (iniciante em front e back-end).

## Visão geral

Este componente renderiza a seção "Minha Carteira". Ele:

- Lista cartões salvos.
- Permite adicionar um novo cartão via modal.
- Valida o número do cartão (Luhn).
- Formata o número enquanto o usuário digita.
- Detecta a bandeira automaticamente e bloqueia a edição do campo "Bandeira".
- Exibe apenas os 4 últimos dígitos na lista.

## Imports (o que cada um faz)

### React

- `useState`  
  Hook do React para criar e atualizar estado dentro do componente.

### Hooks da aplicação

- `useCards`  
  Fornece a lista de cartões e um setter para atualizar o estado local de cartões.

- `useAddCard`  
  Função que chama a API para adicionar um novo cartão.

- `useDeleteCard`  
  Função que chama a API para excluir um cartão existente.

### Componentes locais

- `Modal`  
  Componente que exibe conteúdo em uma janela modal quando `isOpen` é `true`.

### Ícones de bandeira

Importados de `react-svg-credit-card-payment-icons`. Cada um renderiza o SVG da bandeira correspondente.

- `VisaIcon`, `MastercardIcon`, `AmexIcon`, `EloIcon`, `DinersIcon`, `DiscoverIcon`, `JcbIcon`, `MaestroIcon`

### Utilitários de cartão

Importados de `react-svg-credit-card-payment-icons`:

- `getCardType`  
  Detecta a bandeira usando o número do cartão. Retorna nomes canônicos como `Visa`, `Mastercard`, `AmericanExpress`, etc.

- `detectCardType`  
  Função legada (deprecated). Não é usada no componente.

- `validateCardNumber`  
  Valida o número do cartão usando o algoritmo de Luhn e tamanho permitido.

- `formatCardNumber`  
  Formata o número do cartão com espaços apropriados.

- `maskCardNumber`  
  Mascara o número do cartão, mantendo apenas os 4 últimos dígitos visíveis.

- `isCardNumberPotentiallyValid`  
  Checagem leve de validade. Não é usada no componente.

### Utilitário da aplicação

- `detectCardBrand`  
  Função local para detectar bandeira por prefixo. É usada para escolher o ícone no render.

## Estado (useState)

- `isModalOpen`  
  Controla se o modal está aberto ou fechado.

- `numberTouched`  
  Marca se o usuário já saiu do input de número. Serve para mostrar erro só depois do blur.

- `form`  
  Objeto com os valores do formulário:
  - `holder`: titular do cartão
  - `number`: número do cartão (formatado com espaços)
  - `brand`: bandeira do cartão (auto-preenchida)
  - `expMonth`: mês de expiração
  - `expYear`: ano de expiração

## Valores derivados (calculados a cada render)

- `brand`  
  `detectCardBrand(form.number || "")`. Usa o número atual para detectar a bandeira do cartão e decidir qual ícone renderizar.

- `numberValid`  
  `validateCardNumber(form.number)`. Retorna `true` se o número for válido.

- `showNumberError`  
  `numberTouched && !numberValid`. Só mostra erro depois que o usuário sai do campo e o número é inválido.

- `canSubmit`  
  Verifica se todos os campos estão preenchidos e se o número do cartão é válido. Controla o botão "Salvar".

## Funções (o que fazem e por quê)

### `handleChange(e)`

Função que atualiza o estado do formulário para inputs controlados.

- Quando o campo é `number`:
  - Formata com `formatCardNumber`.
  - Detecta bandeira com `getCardType`.
  - Atualiza `form.number` e `form.brand`.
  - Se a bandeira não for reconhecida (`Generic`), limpa `brand`.

- Para outros campos:
  - Atualiza o valor normalmente.

Essa abordagem mantém a UI sincronizada com o estado (conceito de input controlado).

### `handleAdd(e)`

Função executada ao enviar o formulário.

- `e.preventDefault()` impede o reload padrão do form.
- Se o número é inválido, marca o campo como tocado e interrompe.
- Caso seja válido:
  - Chama `addCardAPI(form)` para salvar.
  - Atualiza a lista local de cartões.
  - Reseta o formulário e fecha o modal.

### `renderIcon(brand)`

Função que retorna o componente de ícone correspondente à bandeira detectada.

Usa um `switch` com valores como `"visa"`, `"mastercard"`, `"amex"` etc.

## Renderização (estrutura da UI)

### Lista de cartões

Para cada cartão, o componente:

- Detecta a bandeira com `detectCardBrand(card.number)`.
- Renderiza o ícone correspondente.
- Mostra o número **mascarado** com `maskCardNumber`.
- Mostra data de expiração.
- Exibe botão de excluir, que chama `deleteCardAPI`.

### Modal

O modal contém o formulário de cadastro de cartão.

## Inputs (detalhamento)

### Titular (`holder`)

- `placeholder="Titular"`
- `value={form.holder}`  
  Input controlado.
- `onChange={handleChange}`
- `autoComplete="cc-name"`  
  Ajuda navegadores a preencher dados.
- `required`

### Número (`number`)

- `placeholder="Número"`
- `value={form.number}`  
  Já vem formatado com espaços.
- `onChange={handleChange}`  
  Formata enquanto digita.
- `onBlur`  
  Marca como tocado e reaplica formatação.
- `aria-invalid` e `aria-describedby`  
  Melhoram acessibilidade informando erro.
- `className`  
  Adiciona borda vermelha se inválido.
- `inputMode="numeric"`  
  Abre teclado numérico em mobile.
- `autoComplete="cc-number"`
- `required`

### Mensagem de erro do número

Exibida somente quando `showNumberError` for `true`.

### Bandeira (`brand`)

- `placeholder="Bandeira (auto)"`
- `value={form.brand}`
- `readOnly`  
  Evita edição manual.
- `required`

### Mês (`expMonth`)

- `placeholder="Mês"`
- `value={form.expMonth}`
- `onChange={handleChange}`
- `autoComplete="cc-exp"`
- `required`

### Ano (`expYear`)

- `placeholder="Ano"`
- `value={form.expYear}`
- `onChange={handleChange}`
- `autoComplete="cc-exp"`
- `required`

### Botão "Salvar"

- `disabled={!canSubmit}`  
  Bloqueia quando inválido ou incompleto.
- Classe condicional para aparência desabilitada.

## Fluxo de validação (passo a passo)

1. Usuário digita o número do cartão.
2. O valor é formatado instantaneamente.
3. Ao sair do campo, o input é marcado como tocado.
4. Se o número for inválido, aparece a mensagem de erro.
5. O botão "Salvar" só habilita quando tudo está válido.

## Observações para estudantes

- **Inputs controlados:** o `value` vem do estado e só muda via `setForm`.  
  Isso facilita validação e sincronização com a UI.

- **Validação no blur:** evita mostrar erro enquanto o usuário ainda está digitando.

- **Mask no display:** `maskCardNumber` é aplicado apenas na lista, não no formulário.

- **Separação de responsabilidades:**  
  O componente lida com UI e interações, enquanto hooks (`useAddCard`, etc.) lidam com a API.

## Limitações atuais (para estudar)

- O número do cartão é salvo **com espaços** (formatação).  
  Em sistemas reais, normalmente salva-se sem espaços.

- `detectCardType` e `isCardNumberPotentiallyValid` estão importados, mas não são usados.

- A lista de cartões mostra o número mascarado no front, mas o backend ainda pode estar armazenando o número completo.

## Sugestões de exercícios para iniciantes

1. Ajustar para salvar o número sem espaços.
2. Separar mês e ano com validação de range (`1-12` e ano atual+).
3. Trocar o campo `brand` por um `select`.
4. Melhorar o layout com classes do Tailwind.
