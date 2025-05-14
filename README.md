# GitHub SVG Banner Generator

Generate animated SVG banners for your GitHub profile with a simple URL! Now with customizable text colors, multiple lines, and a variety of background models.

## How to Use
Access a URL like:
```
https://github-svg-banner.vercel.app/I'm#000-Joao#FFF-Oliveira#000?role=Freelancer-and-Motion-Design#F6F6F6&bg=1&anim=fade&hire=1#00FF00
```
- `text`: Main text in the format `I'm#HEX-Firstname#HEX-Lastname#HEX` (e.g., `I'm#000-Joao#FFF-Oliveira#000`). Use `-` to separate words and `#HEX` to specify colors for each word.
- `role`: Role or profession (e.g., `Freelancer-and-Motion-Design#F6F6F6`). Use `-` to separate words, and optionally add `#HEX` for the color.
- `bg`: Background model (`1` to `10`).
- `anim`: Animation (`fade`, `slide`).
- `color`: Global text color (e.g., `white`, `blue`, `#ffffff`). **Note**: If `color` is used, it overrides all individual colors defined in `text`, `role`, and `hire`.
- `hire`: Show "AVAILABLE FOR HIRE" (`hire=1#HEX` to show with a color, `hire=0` to hide).

Add to your README:
```markdown
![Banner](https://github-svg-banner.vercel.app/I'm#000-Joao#FFF-Oliveira#000?role=Freelancer-and-Motion-Design#F6F6F6&bg=1&anim=fade&hire=1#00FF00)
```

## Example Banner
Here’s an example using the `I'm#000-Joao#FFF-Oliveira#000` text, `Freelancer-and-Motion-Design#F6F6F6` role, `bg=1`, `fade` animation, and `hire=1#00FF00`:

![Example Banner](https://github-svg-banner.vercel.app/I'm#000-Joao#FFF-Oliveira#000?role=Freelancer-and-Motion-Design#F6F6F6&bg=1&anim=fade&hire=1#00FF00)

## Variables Explained
- **`text`**: Defines the main text of the banner. Format: `Word1#HEX-Word2#HEX-Word3#HEX` (e.g., `I'm#000-Joao#FFF-Oliveira#000` becomes "I'm Joao Oliveira" with individual colors). Use `-` to separate words within each segment, and `#HEX` to specify colors.
- **`role`**: Defines the role or profession, displayed below the main text. Format: `Role-Text#HEX` (e.g., `Freelancer-and-Motion-Design#F6F6F6` becomes "Freelancer and Motion Design" in color `#F6F6F6`).
- **`bg`**: Selects the background model. Available options: `1` to `10` (see table below).
- **`anim`**: Selects the animation for the text. Available options: `fade`, `slide`.
- **`color`**: Sets a global text color for all text (e.g., `white`, `blue`, `#ffffff`). **Warning**: If `color` is used, it overrides all individual colors defined in `text`, `role`, and `hire`.
- **`hire`**: Displays "AVAILABLE FOR HIRE" in uppercase below the role. Format: `hire=1#HEX` to show with a color (e.g., `hire=1#00FF00`), or `hire=0` to hide.

## Available Models
| ID  | Preview |
|-----|---------|
| `1`  | ![BG 1](https://github-svg-banner.vercel.app/I'm#FFF-Preview#FFF-Text#FFF?role=Background-1#FFF&bg=1&anim=fade&hire=0) |
| `2`  | ![BG 2](https://github-svg-banner.vercel.app/I'm#FFF-Preview#FFF-Text#FFF?role=Background-2#FFF&bg=2&anim=fade&hire=0) |
| `3`  | ![BG 3](https://github-svg-banner.vercel.app/I'm#FFF-Preview#FFF-Text#FFF?role=Background-3#FFF&bg=3&anim=fade&hire=0) |
| `4`  | ![BG 4](https://github-svg-banner.vercel.app/I'm#FFF-Preview#FFF-Text#FFF?role=Background-4#FFF&bg=4&anim=fade&hire=0) |
| `5`  | ![BG 5](https://github-svg-banner.vercel.app/I'm#FFF-Preview#FFF-Text#FFF?role=Background-5#FFF&bg=5&anim=fade&hire=0) |
| `6`  | ![BG 6](https://github-svg-banner.vercel.app/I'm#FFF-Preview#FFF-Text#FFF?role=Background-6#FFF&bg=6&anim=fade&hire=0) |
| `7`  | ![BG 7](https://github-svg-banner.vercel.app/I'm#FFF-Preview#FFF-Text#FFF?role=Background-7#FFF&bg=7&anim=fade&hire=0) |
| `8`  | ![BG 8](https://github-svg-banner.vercel.app/I'm#FFF-Preview#FFF-Text#FFF?role=Background-8#FFF&bg=8&anim=fade&hire=0) |
| `9`  | ![BG 9](https://github-svg-banner.vercel.app/I'm#FFF-Preview#FFF-Text#FFF?role=Background-9#FFF&bg=9&anim=fade&hire=0) |
| `10` | ![BG 10](https://github-svg-banner.vercel.app/I'm#FFF-Preview#FFF-Text#FFF?role=Background-10#FFF&bg=10&anim=fade&hire=0) |

## Available Animations
Coming soon... (Table with animations)

## Contributing
Feel free to open issues or pull requests for new models, animations, or improvements!

## License
MIT License
