# Phone Input Component para WeWeb

Um componente avançado de input telefônico para [WeWeb.io](https://www.weweb.io/) com seleção de país, formatação automática e diversas opções de personalização.

## Recursos

- 🌎 Seleção de país com bandeiras (emojis)
- 📱 Formatação automática baseada no país selecionado
- 🔍 Campo de busca para países
- 🎨 Totalmente personalizável (cores, bordas, espaçamentos)
- 📋 Validação de número de telefone
- 🔄 Integração com formulários do WeWeb
- 📊 Gerenciamento avançado de variáveis para integração perfeita com o WeWeb

## Instalação

Para instalar localmente, clone este repositório e execute:

```bash
npm install
```

## Desenvolvimento

Para executar localmente:

```bash
npm run serve --port=[PORT]
```

Depois, acesse o editor do WeWeb, abra o popup de desenvolvedor e adicione seu elemento personalizado.

## Variáveis Expostas

O componente expõe as seguintes variáveis para uso no WeWeb:

- `value`: O número de telefone completo formatado (com código do país)
- `rawValue`: Apenas os dígitos do número de telefone (sem código do país)

## Eventos

O componente emite os seguintes eventos:

- `change`: Quando o valor do telefone muda
- `focus`: Quando o campo recebe foco
- `blur`: Quando o campo perde foco
- `countryChange`: Quando o país é alterado
- `onEnterKey`: Quando a tecla Enter é pressionada

## Personalização

O componente oferece diversas opções de personalização:

- Cores, bordas e espaçamentos de todos os elementos
- Cor de fundo dos itens selecionados e hover
- Formatação do campo de busca
- Configuração do país padrão
- E muito mais!

## Atualizações Recentes

- **Junho 2024**: Melhoria na implementação de variáveis para integração perfeita com o WeWeb.
- **Maio 2024**: Adicionado suporte para imagens de bandeiras personalizadas.
- **Abril 2024**: Implementação inicial do componente.

## Licença

MIT
