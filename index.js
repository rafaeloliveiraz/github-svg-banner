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
    borders: () => `
        .banner-text-main {
            font-weight: 900;
            fill: url(#border-gradient);
            filter: drop-shadow(0 0 12px #fb0094) drop-shadow(0 0 24px #00ff00);
        }
        @keyframes border-gradient-move {
            0% { stop-color: #fb0094; }
            20% { stop-color: #0000ff; }
            40% { stop-color: #00ff00; }
            60% { stop-color: #ffff00; }
            80% { stop-color: #ff0000; }
            100% { stop-color: #fb0094; }
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
    const tagData = parseTag(tag, mainTextX, mainTextWidth);

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
    } else if (anim === 'borders') {
        animCss = animations.borders();
        extraDefs = `<linearGradient id="border-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#fb0094">
                <animate attributeName="stop-color" values="#fb0094;#0000ff;#00ff00;#ffff00;#ff0000;#fb0094" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="20%" stop-color="#0000ff">
                <animate attributeName="stop-color" values="#0000ff;#00ff00;#ffff00;#ff0000;#fb0094;#0000ff" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="40%" stop-color="#00ff00">
                <animate attributeName="stop-color" values="#00ff00;#ffff00;#ff0000;#fb0094;#0000ff;#00ff00" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="60%" stop-color="#ffff00">
                <animate attributeName="stop-color" values="#ffff00;#ff0000;#fb0094;#0000ff;#00ff00;#ffff00" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="80%" stop-color="#ff0000">
                <animate attributeName="stop-color" values="#ff0000;#fb0094;#0000ff;#00ff00;#ffff00;#ff0000" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stop-color="#fb0094">
                <animate attributeName="stop-color" values="#fb0094;#0000ff;#00ff00;#ffff00;#ff0000;#fb0094" dur="8s" repeatCount="indefinite" />
            </stop>
        </linearGradient>`;
        mainTextSvg = `<text x="${mainTextX}" y="96" dominant-baseline="middle" text-anchor="middle" class="banner-text-main" style="font-family:${FONT_FAMILY};font-size:54px;">${mainText}</text>`;
    } else {
        animCss = animations.fade();
        mainTextSvg = `<text x="${mainTextX}" y="96" dominant-baseline="middle" text-anchor="middle" class="banner-text-main" style="font-family:${FONT_FAMILY};font-size:54px;">${[...mainText].map((l, i) => `<tspan>${l === ' ' ? '\u00A0' : l}</tspan>`).join('')}</text>`;
    }

    // Gradiente ou sólido (de cima para baixo) + linhas tech
    let bgSvg = '';
    let techBgSvg = '';
    if (techbg === '1') {
        // Linhas horizontais e verticais tech
        const leftX = mainTextX - mainTextWidth / 2;
        const rightX = mainTextX + mainTextWidth / 2;
        techBgSvg = `<g>
            <line x1="0" y1="60" x2="800" y2="60" stroke="#e5e7eb" stroke-width="2" opacity="0.5" />
            <line x1="0" y1="110" x2="800" y2="110" stroke="#e5e7eb" stroke-width="2" opacity="0.5" />
            <line x1="${leftX}" y1="40" x2="${leftX}" y2="160" stroke="#e5e7eb" stroke-width="2" opacity="0.5" />
            <line x1="${rightX}" y1="40" x2="${rightX}" y2="160" stroke="#e5e7eb" stroke-width="2" opacity="0.5" />
        </g>`;
    }
    if (bgData.type === 'gradient') {
        bgSvg = `<defs>${extraDefs}<linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:${bgData.colors[0]};stop-opacity:1"/><stop offset="100%" style="stop-color:${bgData.colors[1]};stop-opacity:1"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)" rx="${borderRadius}" ry="${borderRadius}"/>`;
    } else {
        bgSvg = `<defs>${extraDefs}</defs><rect width="100%" height="100%" fill="${bgData.colors[0]}" rx="${borderRadius}" ry="${borderRadius}"/>`;
    }

    // Tagline centralizada com grupo para alinhamento perfeito
    let taglineSvg = '';
    if (taglineText) {
        const tagWidth = Math.max(60, taglineText.length * 13);
        taglineSvg = `
        <g transform="translate(${tagData.x - tagWidth / 2},0)">
            <rect x="0" y="116" width="${tagWidth}" height="26" rx="${tagData.radius}" ry="${tagData.radius}" fill="${tagData.bg}" />
            <text x="${tagWidth / 2}" y="130" dominant-baseline="middle" text-anchor="middle" class="banner-tagline" style="fill:${tagData.color};font-size:17px;font-family:${FONT_FAMILY};font-weight:300;letter-spacing:1px;">
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
