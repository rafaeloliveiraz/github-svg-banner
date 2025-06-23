# GitHub SVG Banner

Gere banners SVG dinâmicos, modernos e personalizáveis para seu perfil ou projetos no GitHub!

## Como usar

Monte a URL no formato:

```
https://github-svg-banner.vercel.app/NOME_TAGLINE?bg=gradient-HEX1-HEX2|solid-HEX&color=HEX&anim=efeito-HEX&radius=NUMERO&tag=alinhamento-HEX-HEX
```

### Parâmetros

| Parâmetro | Obrigatório | Descrição | Exemplo |
|-----------|-------------|-----------|---------|
| `NOME_TAGLINE` | Sim | Nome e tagline separados por `_`. Use `-` para espaços. | `Joao-Oliveira_FullStack` |
| `bg`      | Não | Fundo do banner. `gradient-HEX1-HEX2` (gradiente vertical) ou `solid-HEX` (cor sólida). | `bg=gradient-24292e-58a6ff`<br>`bg=solid-000` |
| `color`   | Não | Cor do texto principal (HEX, sem #). Padrão: `24292e` | `color=fff` |
| `anim`    | Não | Efeito de animação:<br>- `fade` (letra a letra, suave)<br>- `neon-HEX` (neon moderno, cor customizável)<br>- `borders-HEX` (bordas animadas, cor customizável) | `anim=neon-00ffea` |
| `radius`  | Não | Raio da borda (arredondamento). Padrão: `20`. Use `0` para quadrado. | `radius=0` |
| `tag`     | Não | Tagline (linha de baixo):<br>`alinhamento-corTexto-corBG`<br>Alinhamento: `left`, `middle`, `right`<br>Cores em HEX | `tag=left-fff-24292e` |

## Valores padrão

- `bg`: gradiente vertical de `#2a1a5e` para `#58a6ff`
- `color`: `#24292e`
- `anim`: `fade`
- `radius`: `20`
- `tag`: centralizado, texto branco, fundo preto

## Exemplo embutido

```
https://github-svg-banner.vercel.app/Joao-Oliveira_FullStack?bg=gradient-24292e-58a6ff&color=fff&anim=neon-58a6ff&tag=left-fff-24292e&radius=20
```

## Visual dos efeitos

| Efeito      | Descrição |
|-------------|-----------|
| fade        | Fade suave letra a letra, looping infinito. |
| neon-HEX    | Neon moderno, cor fixa customizável, brilho animado. |
| borders-HEX | Bordas animadas ao redor do texto, cor customizável. |

## Estrutura do texto

- O texto antes do `_` é o nome principal (ex: `Joao-Oliveira` → "Joao Oliveira").
- O texto depois do `_` é a tagline (ex: `FullStack`).
- Use `-` para espaços.

## Deploy local

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
   http://localhost:3000/Joao-Oliveira_FullStack?bg=gradient-24292e-58a6ff&color=fff&anim=neon-58a6ff&tag=left-fff-24292e&radius=20
   ```

---

Feito com ❤️ para a comunidade!
