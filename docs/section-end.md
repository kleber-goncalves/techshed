# Documentação do arquivo `section-end.jsx`

Este documento explica **cada import**, **cada estado**, **cada função**, **cada input/prop** e **cada componente** do arquivo `src/components/componemts-conta-users/layout/layout-end/section-end.jsx`.

O objetivo é **ajudar iniciantes** (front-end e back-end) a entenderem o fluxo completo da tela de endereços.

---

## 1) O que este arquivo faz (visão geral)

O componente `EnderecosPage`:
- Carrega a lista de endereços do usuário.
- Permite **criar**, **editar** e **excluir** endereços.
- Abre modais para **formulário** de endereço e para **confirmação de exclusão**.

Em resumo, ele gerencia a UI e chama os hooks que fazem as operações de CRUD.

---

## 2) Imports (o que cada um faz)

```jsx
import AddressFormModal from "@/components/componemts-conta-users/layout/layout-end/modal/AddressFormModal";
```
- Importa o **modal de formulário**. Esse componente mostra os inputs para criar ou editar um endereço.

```jsx
import {
    useAddresses,
    useCreateAddress,
    useUpdateAddress,
    useDeleteAddress,
} from "@/hooks/addressHooks";
```
- Importa **hooks personalizados** para lidar com endereços:
  - `useAddresses`: busca a lista e permite atualizar o estado local.
  - `useCreateAddress`: cria um novo endereço.
  - `useUpdateAddress`: atualiza um endereço existente.
  - `useDeleteAddress`: remove um endereço.

```jsx
import { useState } from "react";
```
- Hook padrão do React para **estado local**.

```jsx
import DeletAvis from "./modal/DeletAvis";
```
- Importa o modal de **confirmação de exclusão**. Ele pergunta se o usuário realmente deseja deletar.

---

## 3) Componente principal

```jsx
export default function EnderecosPage() { ... }
```
Esse é o componente React que renderiza a tela de “Meus Endereços”.

---

## 4) Estados e dados

```jsx
const { addresses, setAddresses } = useAddresses();
```
- `addresses`: lista de endereços.
- `setAddresses`: função para atualizar essa lista localmente.

```jsx
const createAddr = useCreateAddress();
const updateAddr = useUpdateAddress();
const deleteAddr = useDeleteAddress();
```
Essas funções são “ponte” para o backend:
- `createAddr(data)` cria um endereço.
- `updateAddr(id, data)` atualiza um endereço existente.
- `deleteAddr(id)` remove um endereço.

```jsx
const [editingAddress, setEditingAddress] = useState(null);
```
Guarda o endereço que está sendo editado ou deletado.
- Quando é `null`, significa “nenhum endereço selecionado”.

```jsx
const [isFormOpen, setIsFormOpen] = useState(false);
const [isDeleteOpen, setIsDeleteOpen] = useState(false);
```
Estados de abertura dos modais:
- `isFormOpen`: controla o modal do formulário.
- `isDeleteOpen`: controla o modal de confirmação de exclusão.

---

## 5) Funções (o que cada uma faz)

### 5.1) `openNew`
```jsx
const openNew = () => {
  setEditingAddress(null);
  setIsDeleteOpen(false);
  setIsFormOpen(true);
};
```
**Objetivo:** abrir o formulário para **criar** um endereço novo.
- Limpa `editingAddress` (não está editando nada).
- Garante que o modal de delete está fechado.
- Abre o modal de formulário.

---

### 5.2) `openEdit`
```jsx
const openEdit = (addr) => {
  setEditingAddress(addr);
  setIsDeleteOpen(false);
  setIsFormOpen(true);
};
```
**Objetivo:** abrir o formulário para **editar** um endereço existente.
- Salva o endereço em `editingAddress`.
- Fecha modal de delete (se estiver aberto).
- Abre o modal de formulário.

---

### 5.3) `openDelete`
```jsx
const openDelete = (addr) => {
  setEditingAddress(addr);
  setIsFormOpen(false);
  setIsDeleteOpen(true);
};
```
**Objetivo:** abrir o modal para **confirmar exclusão**.
- Guarda o endereço selecionado.
- Fecha o modal de formulário (se estiver aberto).
- Abre o modal de delete.

---

### 5.4) `handleSubmit`
```jsx
const handleSubmit = async (formData) => {
  if (editingAddress) {
    const updated = await updateAddr(editingAddress.id, formData);
    setAddresses((prev) =>
      prev.map((a) => (a.id === editingAddress.id ? updated : a))
    );
  } else {
    const newAddr = await createAddr(formData);
    setAddresses((prev) => [newAddr, ...prev]);
  }
  setIsFormOpen(false);
  setEditingAddress(null);
};
```
**Objetivo:** salvar um endereço (novo ou editado).

Fluxo:
1. **Se `editingAddress` existir** → está editando:
   - Chama `updateAddr(id, formData)`.
   - Substitui o endereço atualizado na lista.
2. **Se `editingAddress` for `null`** → está criando:
   - Chama `createAddr(formData)`.
   - Adiciona o novo endereço no começo da lista.
3. Fecha o modal.
4. Limpa `editingAddress`.

---

### 5.5) `handleDelete`
```jsx
const handleDelete = async (id) => {
  await deleteAddr(id);
  setAddresses((prev) => prev.filter((a) => a.id !== id));
  setIsDeleteOpen(false);
  setEditingAddress(null);
};
```
**Objetivo:** remover um endereço.

Fluxo:
1. Chama `deleteAddr(id)` para remover no backend.
2. Remove localmente da lista (`filter`).
3. Fecha o modal.
4. Limpa `editingAddress`.

---

## 6) Renderização (JSX)

### 6.1) Título e botão
```jsx
<h2>Meus Endereços</h2>
<button onClick={openNew}>Adicionar Endereço</button>
```
Mostra o título e o botão para criar um endereço.

---

### 6.2) Lista de endereços
```jsx
<ul>
  {addresses.map((addr) => (
    <li key={addr.id}>
      <span>
        {addr.label} - {addr.street}, {addr.city}, {addr.state} ({addr.zipCode})
      </span>
      <button onClick={() => openEdit(addr)}>Editar</button>
      <button onClick={() => openDelete(addr)}>Excluir</button>
    </li>
  ))}
</ul>
```
Para cada endereço:
- Mostra os dados principais.
- Botões para **editar** ou **excluir**.

**Importante:**  
`key={addr.id}` ajuda o React a identificar cada item da lista.

---

### 6.3) Modal de formulário
```jsx
<AddressFormModal
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  onSubmit={handleSubmit}
  initialData={editingAddress || {}}
/>
```
**Props importantes:**
- `isOpen`: controla abertura.
- `onClose`: fecha o modal.
- `onSubmit`: função chamada quando o formulário é enviado.
- `initialData`: dados iniciais do formulário (usado em edição).

---

### 6.4) Modal de confirmação de exclusão
```jsx
<DeletAvis
  isOpen={isDeleteOpen}
  onClose={() => setIsDeleteOpen(false)}
  onSubmit={() => handleDelete(editingAddress?.id)}
/>
```
**Props importantes:**
- `isOpen`: controla abertura.
- `onClose`: fecha o modal.
- `onSubmit`: executa a remoção do endereço selecionado.

---

## 7) Resumo do fluxo (passo a passo)

1. Usuário abre a página → vê lista de endereços.
2. Clica em **Adicionar Endereço**:
   - Abre modal com formulário vazio.
3. Clica em **Editar**:
   - Abre modal com formulário preenchido.
4. Clica em **Excluir**:
   - Abre modal de confirmação.
5. Ao salvar:
   - Atualiza backend e lista local.
6. Ao deletar:
   - Remove no backend e da lista local.

---

## 8) Dicas para iniciantes

- **Hooks personalizados** (`useCreateAddress`, etc.) encapsulam chamadas ao backend.  
  Isso deixa o componente mais limpo e focado em UI.

- **Estado local** (`useState`) controla modais e item selecionado.

- **Modais separados** evitam que duas janelas abram ao mesmo tempo.

- **Sempre atualize o estado local** após criar/editar/excluir para a UI refletir a mudança imediatamente.

---

## 9) Pontos de atenção (erros comuns)

- Passar apenas `addr.id` quando a função espera o objeto inteiro.  
  Aqui é necessário o endereço completo para edição/exclusão.

- Usar um único estado para dois modais.  
  Isso pode abrir os dois juntos.

- Chamar `handleDelete` sem `id` válido.  
  O correto é garantir `editingAddress?.id`.

---

## 10) Glossário rápido

- **CRUD**: Create, Read, Update, Delete (criar, ler, editar, apagar).
- **Modal**: janela que aparece por cima da tela.
- **Hook**: função do React que controla estado ou lógica.

