const express = require('express');
const app = express();

const FONT_FAMILY = "'Roboto', Arial, sans-serif";

const animations = {
    neon: (color) => `
        .banner-text-main {
            fill: url(#neon-gradient);
            filter: drop-shadow(0 0 8px ${color}) drop-shadow(0 0 24px ${color});
            font-weight: 900;
            letter-spacing: 2px;
        }
    `,
    borders: (color) => `
        .banner-text-main {
            stroke: ${color};
            stroke-width: 2.5px;
            paint-order: stroke fill;
            filter: drop-shadow(0 0 8px ${color});
            stroke-dasharray: 12 6;
            stroke-dashoffset: 0;
            animation: border-dash 2s linear infinite;
        }
        @keyframes border-dash {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 36; }
        }
    `,
    fade: () => `
        .banner-text-main tspan {
            opacity: 0;
            animation: fade-in 2.5s infinite;
        }
        .banner-text-main tspan:nth-child(1) { animation-delay: 0s; }
        .banner-text-main tspan:nth-child(2) { animation-delay: 0.15s; }
        .banner-text-main tspan:nth-child(3) { animation-delay: 0.3s; }
        .banner-text-main tspan:nth-child(4) { animation-delay: 0.45s; }
        .banner-text-main tspan:nth-child(5) { animation-delay: 0.6s; }
        .banner-text-main tspan:nth-child(6) { animation-delay: 0.75s; }
        .banner-text-main tspan:nth-child(7) { animation-delay: 0.9s; }
        .banner-text-main tspan:nth-child(8) { animation-delay: 1.05s; }
        .banner-text-main tspan:nth-child(9) { animation-delay: 1.2s; }
        .banner-text-main tspan:nth-child(10) { animation-delay: 1.35s; }
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
            animation: blink 1.1s steps(1) infinite;
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

function parseTag(tag, mainTextX, mainTextWidth) {
    // tag=left-000-FFF
    if (!tag) return { align: 'middle', color: '#fff', bg: '#000', radius: 2, x: mainTextX };
    const [align, color, bgColor, radius] = tag.split('-');
    let x = mainTextX;
    if (align === 'left') x = mainTextX - mainTextWidth / 2 + 2;
    if (align === 'end' || align === 'right') x = mainTextX + mainTextWidth / 2 - 2;
    return {
        align: align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle',
        color: color ? `#${color}` : '#fff',
        bg: bgColor ? `#${bgColor}` : '#000',
        radius: radius ? Number(radius) : 2,
        x
    };
}

function getTextWidth(text, fontSize = 54, fontWeight = 900) {
    // Aproximação para SVG (Roboto, bold)
    return Math.max(60, text.length * (fontWeight > 500 ? 28 : 13));
}

app.get('/', (req, res) => {
    res.redirect('https://github.com/rafaeloliveiraz/github-svg-banner');
});

app.get('/:text', (req, res) => {
    const { text } = req.params;
    const { bg, anim = 'fade', color = '24292e', radius = 20, tag, techbg } = req.query;
    const [name, tagline] = text ? text.split('_') : ['Nome', 'Tagline'];
    const mainText = name ? name.replace(/-/g, ' ') : 'Nome';
    const taglineText = tagline ? tagline.replace(/-/g, ' ') : '';
    const bgData = parseBg(bg);
    const borderRadius = (radius !== undefined && radius !== null && radius !== '') ? Number(radius) : 20;
    const textColor = `#${color}`;
    const mainTextWidth = getTextWidth(mainText, 54, 900);
    const mainTextX = 400;

    // Animação customizada
    let animCss = '';
    let mainTextSvg = '';
    let extraDefs = '';
    if (anim.startsWith('neon-')) {
        const neonColor = `#${anim.split('-')[1] || 'fff'}`;
        animCss = animations.neon(neonColor);
        extraDefs = `<linearGradient id="neon-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="10%" stop-color="#fff"/><stop offset="100%" stop-color="${neonColor}"/></linearGradient>`;
        mainTextSvg = `<text x="${mainTextX}" y="96" dominant-baseline="middle" text-anchor="middle" class="banner-text-main" style="font-family:${FONT_FAMILY};font-size:54px;">${mainText}</text>`;
    } else if (anim === 'typing') {
        animCss = animations.typing();
        // Simula typing letra a letra, mais lento, pausa ao final
        const typingSpans = [...mainText].map((l, i) => `<tspan class="typing-span" style="animation-delay:${i * 0.25}s">${l === ' ' ? '\u00A0' : l}</tspan>`).join('');
        mainTextSvg = `<text x="${mainTextX}" y="96" dominant-baseline="middle" text-anchor="middle" class="banner-text-main" style="font-family:${FONT_FAMILY};">${typingSpans}<tspan class="typing-cursor">|</tspan></text>`;
        animCss += `
        .typing-span {
            opacity: 0;
            animation: typing-appear 0.22s forwards;
        }
        .typing-span:nth-child(1) { animation-delay: 0s; }
        .typing-span:nth-child(2) { animation-delay: 0.25s; }
        .typing-span:nth-child(3) { animation-delay: 0.5s; }
        .typing-span:nth-child(4) { animation-delay: 0.75s; }
        .typing-span:nth-child(5) { animation-delay: 1s; }
        .typing-span:nth-child(6) { animation-delay: 1.25s; }
        .typing-span:nth-child(7) { animation-delay: 1.5s; }
        .typing-span:nth-child(8) { animation-delay: 1.75s; }
        .typing-span:nth-child(9) { animation-delay: 2s; }
        .typing-span:nth-child(10) { animation-delay: 2.25s; }
        @keyframes typing-appear {
            to { opacity: 1; }
        }
        .typing-cursor {
            animation: blink 1.1s steps(1) infinite, typing-cursor-move 3.5s steps(1) infinite;
        }
        @keyframes typing-cursor-move {
            0%, 90% { opacity: 1; }
            91%, 100% { opacity: 0; }
        }
        `;
    } else if (anim.startsWith('borders-')) {
        const borderColor = `#${anim.split('-')[1] || 'fff'}`;
        animCss = animations.borders(borderColor);
        mainTextSvg = `<text x="${mainTextX}" y="96" dominant-baseline="middle" text-anchor="middle" class="banner-text-main" style="font-family:${FONT_FAMILY};font-size:54px;">${mainText}</text>`;
    } else {
        animCss = animations.fade();
        mainTextSvg = `<text x="${mainTextX}" y="96" dominant-baseline="middle" text-anchor="middle" class="banner-text-main" style="font-family:${FONT_FAMILY};font-size:54px;">${[...mainText].map((l, i) => `<tspan>${l === ' ' ? '\u00A0' : l}</tspan>`).join('')}</text>`;
    }

    // Gradiente ou sólido (de cima para baixo) + techbg
    let bgSvg = '';
    let techBgSvg = '';
    if (techbg === '1') {
        techBgSvg = `<g>
            <rect x="0" y="0" width="800" height="200" fill="none" />
            <g stroke="#5e60ce" stroke-width="1.5" opacity="0.18">
                <polyline points="0,30 800,60" />
                <polyline points="0,80 800,110" />
                <polyline points="0,130 800,160" />
                <polyline points="0,180 800,200" />
            </g>
            <g stroke="#58a6ff" stroke-width="1" opacity="0.10">
                <polyline points="0,10 800,40" />
                <polyline points="0,60 800,90" />
                <polyline points="0,110 800,140" />
                <polyline points="0,160 800,190" />
            </g>
        </g>`;
    }
    if (bgData.type === 'gradient') {
        bgSvg = `<defs>${extraDefs}<linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:${bgData.colors[0]};stop-opacity:1"/><stop offset="100%" style="stop-color:${bgData.colors[1]};stop-opacity:1"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)" rx="${borderRadius}" ry="${borderRadius}"/>`;
    } else {
        bgSvg = `<defs>${extraDefs}</defs><rect width="100%" height="100%" fill="${bgData.colors[0]}" rx="${borderRadius}" ry="${borderRadius}"/>`;
    }

    // Tagline alinhada ao nome, próxima, com retângulo dinâmico
    let taglineSvg = '';
    if (taglineText) {
        const tagWidth = Math.max(60, taglineText.length * 13);
        let tagX = mainTextX;
        if (tagData.align === 'start') tagX = mainTextX - mainTextWidth / 2 + tagWidth / 2;
        if (tagData.align === 'end') tagX = mainTextX + mainTextWidth / 2 - tagWidth / 2;
        taglineSvg = `
        <g>
            <rect x="${tagX - tagWidth / 2}" y="116" width="${tagWidth}" height="26" rx="${tagData.radius}" ry="${tagData.radius}" fill="${tagData.bg}" />
            <text x="${tagX}" y="130" dominant-baseline="middle" text-anchor="${tagData.align}" class="banner-tagline" style="fill:${tagData.color};font-size:17px;font-family:${FONT_FAMILY};font-weight:300;letter-spacing:1px;">
                ${taglineText}
            </text>
        </g>
        `;
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        ${bgSvg}
        ${techBgSvg}
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
