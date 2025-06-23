# GitHub SVG Banner

Gere banners SVG dinâmicos e personalizáveis para seu perfil ou projetos no GitHub!

## Como usar

Monte a URL no formato:

```
https://SEU-DEPLOY-OU-LOCALHOST:PORTA/NOME_TAGLINE?bg=gradient-HEX1-HEX2|solid-HEX&color=HEX&anim=efeito-COR&radius=NUMERO&tag=alinhamento-CORTEXTO-CORBG
```

### Exemplos

| Exemplo | URL |
|---------|-----|
| Gradiente azul para preto, texto branco, neon azul, tagline à esquerda | `/Joao-Oliveira_FullStack?bg=gradient-58a6ff-24292e&color=fff&anim=neon-58a6ff&tag=left-fff-24292e` |
| Fundo sólido preto, texto amarelo, borda animada vermelha, tagline centralizada | `/Maria-Silva_DevOps?bg=solid-000&color=ffd700&anim=borders-ff0000&tag=middle-fff-000` |
| Gradiente customizado, fade letra a letra, tagline à direita | `/Lucas-Designer_UX-UI?bg=gradient-ff7f50-1e90ff&color=fff&anim=fade&tag=right-fff-1e90ff` |

## Parâmetros

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `bg`      | Fundo do banner. Use `gradient-HEX1-HEX2` para gradiente ou `solid-HEX` para cor sólida. | `bg=gradient-fff-000`<br>`bg=solid-24292e` |
| `color`   | Cor do texto principal (HEX, sem #). | `color=fff` |
| `anim`    | Efeito de animação:<br>- `fade` (letra a letra, suave)<br>- `neon-HEX` (neon moderno, cor customizável)<br>- `borders-HEX` (bordas animadas, cor customizável) | `anim=neon-00ffea` |
| `radius`  | Raio da borda (arredondamento). | `radius=10` |
| `tag`     | Tagline (linha de baixo):<br>`alinhamento-corTexto-corBG`<br>Alinhamento: `left`, `middle`, `right`<br>Cor do texto e do fundo em HEX | `tag=left-fff-000` |

## Estrutura do texto

- O texto antes do `_` é o nome principal (ex: `Joao-Oliveira` → "Joao Oliveira").
- O texto depois do `_` é a tagline (ex: `FullStack`).
- Use `-` para espaços.

## Visual dos efeitos

| Efeito      | Descrição |
|-------------|-----------|
| fade        | Fade suave letra a letra, looping infinito. |
| neon-HEX    | Neon moderno, cor customizável, rotação de cor. |
| borders-HEX | Bordas animadas ao redor do texto, cor customizável. |

## Exemplo visual

```
/Joao-Oliveira_FullStack?bg=gradient-58a6ff-24292e&color=fff&anim=neon-58a6ff&tag=left-fff-24292e&radius=20
```

## Deploy

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode localmente:
   ```bash
   node index.js
   ```
3. Acesse:
   ```
   http://localhost:3000/Joao-Oliveira_FullStack?bg=gradient-58a6ff-24292e&color=fff&anim=neon-58a6ff&tag=left-fff-24292e&radius=20
   ```

---

Feito com ❤️ para a comunidade!
