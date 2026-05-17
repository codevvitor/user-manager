# User Manager

Aplicação Angular para gerenciamento de usuários, desenvolvida como avaliação técnica.

## Tecnologias

- Angular 17+
- Angular Material
- RxJS
- Signals
- TypeScript
- SCSS

## Funcionalidades

- Listagem de usuários em cards
- Busca com debounce de 300ms
- Modal de cadastro de novo usuário
- Modal de edição com preenchimento automático
- Validações no formulário
- Loading e tratamento de erro
- Componentes standalone

## Requisitos

- Node.js 18+
- npm 9+

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/codevvitor/user-manager.git

# Entrar na pasta
cd user-manager

# Instalar dependências
npm install
```

## Execução

```bash
# Iniciar o servidor de desenvolvimento
ng serve
```

Acesse `http://localhost:4200` no navegador.

## Testes

```bash
ng test
```

## API

A aplicação consome a API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com/users) para simular dados reais.
