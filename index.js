const express = require('express');
const app = express();

const FONT_FAMILY = "'Roboto', Arial, sans-serif";

const animations = {
    neon: (color) => `
        .banner-text-main {
            fill: url(#neon-gradient);
            filter: drop-shadow(0 0 6px ${color}) drop-shadow(0 0 16px ${color});
            font-weight: 900;
            letter-spacing: 2px;
        }
    `,
    borders: (color) => `
        .banner-text-main {
            position: relative;
            z-index: 1;
        }
        .banner-text-main::after {
            content: '';
            position: absolute;
            left: 0; top: 0; right: 0; bottom: 0;
            border: 3px solid ${color};
            border-radius: 8px;
            pointer-events: none;
            animation: border-move 2s linear infinite;
        }
        @keyframes border-move {
            0% { box-shadow: 0 0 0 ${color}; }
            50% { box-shadow: 0 0 20px ${color}; }
            100% { box-shadow: 0 0 0 ${color}; }
        }
    `,
    fade: () => `
        .banner-text-main tspan {
            opacity: 0;
            animation: fade-in 2s infinite;
        }
        .banner-text-main tspan:nth-child(1) { animation-delay: 0s; }
        .banner-text-main tspan:nth-child(2) { animation-delay: 0.1s; }
        .banner-text-main tspan:nth-child(3) { animation-delay: 0.2s; }
        .banner-text-main tspan:nth-child(4) { animation-delay: 0.3s; }
        .banner-text-main tspan:nth-child(5) { animation-delay: 0.4s; }
        .banner-text-main tspan:nth-child(6) { animation-delay: 0.5s; }
        .banner-text-main tspan:nth-child(7) { animation-delay: 0.6s; }
        .banner-text-main tspan:nth-child(8) { animation-delay: 0.7s; }
        .banner-text-main tspan:nth-child(9) { animation-delay: 0.8s; }
        .banner-text-main tspan:nth-child(10) { animation-delay: 0.9s; }
        @keyframes fade-in {
            0%, 80%, 100% { opacity: 0; }
            20%, 60% { opacity: 1; }
        }
    `,
    typing: () => `
        .banner-text-main {
            font-family: ${FONT_FAMILY};
            font-size: 54px;
            font-weight: 900;
            letter-spacing: 2px;
        }
        .typing-cursor {
            font-size: 54px;
            font-weight: 900;
            animation: blink 1s steps(1) infinite;
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `
};

function parseBg(bg) {
    if (!bg) return { type: 'gradient', colors: ['#2a1a5e', '#58a6ff'] };
    if (bg.startsWith('gradient-')) {
        const [, c1, c2] = bg.match(/gradient-([0-9a-fA-F]{3,6})-([0-9a-fA-F]{3,6})/) || [];
        return c1 && c2 ? { type: 'gradient', colors: [`#${c1}`, `#${c2}`] } : { type: 'gradient', colors: ['#2a1a5e', '#58a6ff'] };
    }
    if (bg.startsWith('solid-')) {
        const [, c1] = bg.match(/solid-([0-9a-fA-F]{3,6})/) || [];
        return c1 ? { type: 'solid', colors: [`#${c1}`] } : { type: 'solid', colors: ['#2a1a5e'] };
    }
    return { type: 'gradient', colors: ['#2a1a5e', '#58a6ff'] };
}

function parseTag(tag) {
    // tag=left-000-FFF
    if (!tag) return { align: 'middle', color: '#fff', bg: '#000', radius: 2 };
    const [align, color, bgColor, radius] = tag.split('-');
    return {
        align: align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle',
        color: color ? `#${color}` : '#fff',
        bg: bgColor ? `#${bgColor}` : '#000',
        radius: radius ? Number(radius) : 2
    };
}

app.get('/', (req, res) => {
    res.redirect('https://github.com/rafaeloliveiraz/github-svg-banner');
});

app.get('/:text', (req, res) => {
    const { text } = req.params;
    const { bg, anim = 'fade', color = '24292e', radius = 20, tag } = req.query;
    const [name, tagline] = text ? text.split('_') : ['Nome', 'Tagline'];
    const mainText = name ? name.replace(/-/g, ' ') : 'Nome';
    const tagData = parseTag(tag);
    const taglineText = tagline ? tagline.replace(/-/g, ' ') : '';
    const bgData = parseBg(bg);
    const borderRadius = (radius !== undefined && radius !== null && radius !== '') ? Number(radius) : 20;
    const textColor = `#${color}`;

    // Animação customizada
    let animCss = '';
    let mainTextSvg = '';
    let extraDefs = '';
    if (anim.startsWith('neon-')) {
        const neonColor = `#${anim.split('-')[1] || 'fff'}`;
        animCss = animations.neon(neonColor);
        extraDefs = `<linearGradient id="neon-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="10%" stop-color="#fff"/><stop offset="100%" stop-color="${neonColor}"/></linearGradient>`;
        mainTextSvg = `<text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" class="banner-text-main" style="font-family:${FONT_FAMILY};font-size:54px;">${mainText}</text>`;
    } else if (anim === 'typing') {
        animCss = animations.typing();
        mainTextSvg = `<text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" class="banner-text-main" style="font-family:${FONT_FAMILY};">${mainText}<tspan class="typing-cursor">|</tspan></text>`;
    } else if (anim.startsWith('borders-')) {
        const borderColor = `#${anim.split('-')[1] || 'fff'}`;
        animCss = animations.borders(borderColor);
        mainTextSvg = `<text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" class="banner-text-main" style="font-family:${FONT_FAMILY};font-size:54px;">${mainText}</text>`;
    } else {
        animCss = animations.fade();
        mainTextSvg = `<text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" class="banner-text-main" style="font-family:${FONT_FAMILY};font-size:54px;">${[...mainText].map((l, i) => `<tspan>${l === ' ' ? '\u00A0' : l}</tspan>`).join('')}</text>`;
    }

    // Gradiente ou sólido (de cima para baixo)
    let bgSvg = '';
    if (bgData.type === 'gradient') {
        bgSvg = `<defs>${extraDefs}<linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:${bgData.colors[0]};stop-opacity:1"/><stop offset="100%" style="stop-color:${bgData.colors[1]};stop-opacity:1"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)" rx="${borderRadius}" ry="${borderRadius}"/>`;
    } else {
        bgSvg = `<defs>${extraDefs}</defs><rect width="100%" height="100%" fill="${bgData.colors[0]}" rx="${borderRadius}" ry="${borderRadius}"/>`;
    }

    // Tagline com retângulo sólido atrás, fonte fina, menor, radius customizável
    let taglineSvg = '';
    if (taglineText) {
        // Medida aproximada do texto (SVG não tem auto width)
        const tagWidth = Math.max(60, taglineText.length * 13);
        let tagX = 400; // centro
        if (tagData.align === 'start') tagX = 40 + tagWidth / 2;
        if (tagData.align === 'end') tagX = 800 - 40 - tagWidth / 2;
        taglineSvg = `
        <g>
            <rect x="${tagX - tagWidth / 2}" y="154" width="${tagWidth}" height="28" rx="${tagData.radius}" ry="${tagData.radius}" fill="${tagData.bg}" />
            <text x="${tagX}" y="170" dominant-baseline="middle" text-anchor="${tagData.align}" class="banner-tagline" style="fill:${tagData.color};font-size:18px;font-family:${FONT_FAMILY};font-weight:300;letter-spacing:1px;">
                ${taglineText}
            </text>
        </g>
        `;
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        ${bgSvg}
        <style>
            .banner-text-main {
                font-family: ${FONT_FAMILY};
                font-size: 54px;
                font-weight: 900;
                fill: ${textColor};
                dominant-baseline: middle;
                text-anchor: middle;
            }
            .banner-tagline {
                font-weight: 300;
            }
            ${animCss}
        </style>
        ${mainTextSvg}
        ${taglineSvg}
    </svg>`;

    res.setHeader('Cache-Control', 'public, max-age=21600');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
});

module.exports = app;
