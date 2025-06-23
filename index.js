const express = require('express');
const app = express();

const FONT_FAMILY = "'Roboto', Arial, sans-serif";

const animations = {
    neon: (color) => `
        .banner-text-main {
            fill: url(#neon-gradient);
            filter: drop-shadow(0 0 4px ${color}) drop-shadow(0 0 10px ${color});
            font-weight: 900;
            letter-spacing: 2px;
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
            animation: blink 0.4s steps(1) infinite;
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `
};

function parseTag(tag, mainTextX, mainTextWidth) {
    // Alinha a tag conforme solicitado
    if (!tag) return { align: 'middle', color: '#fff', bg: '#000', radius: 2, x: mainTextX, anchor: 'middle' };
    const [align, color, bgColor, radius] = tag.split('-');
    let x = mainTextX;
    let anchor = 'middle';
    if (align === 'left') {
        x = mainTextX - mainTextWidth / 2;
        anchor = 'start';
    }
    if (align === 'end' || align === 'right') {
        x = mainTextX + mainTextWidth / 2;
        anchor = 'end';
    }
    return {
        align: align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle',
        color: color ? `#${color}` : '#fff',
        bg: bgColor ? `#${bgColor}` : '#000',
        radius: radius ? Number(radius) : 2,
        x,
        anchor
    };
}

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
    } else {
        animCss = animations.typing();
        // Typing: cursor acompanha a escrita
        const typingSpans = [...mainText].map((l, i) => `<tspan class="typing-span" style="animation-delay:${i * 0.12}s">${l === ' ' ? '\u00A0' : l}</tspan>`).join('');
        mainTextSvg = `<text x="${mainTextX}" y="96" dominant-baseline="middle" text-anchor="middle" class="banner-text-main" style="font-family:${FONT_FAMILY};">${typingSpans}<tspan class="typing-cursor" id="cursor">|</tspan></text>`;
        animCss += `
        .typing-span {
            opacity: 1;
        }
        .typing-span {
            animation: typing-appear 0.01s steps(1) forwards;
        }
        .typing-span { transition: none; }
        .typing-cursor {
            animation: blink 0.4s steps(1) infinite;
        }
        @keyframes typing-appear {
            to { opacity: 1; }
        }
        `;
    }

    // Gradiente ou sólido (de cima para baixo) + linhas tech + grainy
    let bgSvg = '';
    let techBgSvg = '';
    let grainyFilter = '';
    let grainyRect = '';
    if (req.query.grainy === '1' || req.query.grainy === 1) {
        grainyFilter = `<filter id="grainy-bg"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" result="turb"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.18"/></feComponentTransfer><feComposite operator="in" in2="SourceGraphic"/><feBlend in2="SourceGraphic" mode="multiply"/></filter>`;
    }
    if (bgData.type === 'gradient') {
        bgSvg = `<defs>${extraDefs}${grainyFilter}<linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:${bgData.colors[0]};stop-opacity:1"/><stop offset="100%" style="stop-color:${bgData.colors[1]};stop-opacity:1"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)" rx="${borderRadius}" ry="${borderRadius}"${grainyFilter ? ' filter="url(#grainy-bg)"' : ''}/>`;
    } else {
        bgSvg = `<defs>${extraDefs}${grainyFilter}</defs><rect width="100%" height="100%" fill="${bgData.colors[0]}" rx="${borderRadius}" ry="${borderRadius}"${grainyFilter ? ' filter="url(#grainy-bg)"' : ''}/>`;
    }
    if (techbg === '1' || techbg === 1) {
        const leftX = mainTextX - mainTextWidth / 2;
        const rightX = mainTextX + mainTextWidth / 2;
        techBgSvg = `<g>
            <line x1="0" y1="60" x2="800" y2="60" stroke="#e5e7eb" stroke-width="1" opacity="0.2" stroke-dasharray="4 2" />
            <line x1="0" y1="130" x2="800" y2="130" stroke="#e5e7eb" stroke-width="1" opacity="0.2" stroke-dasharray="4 2" />
            <line x1="${leftX}" y1="40" x2="${leftX}" y2="160" stroke="#e5e7eb" stroke-width="1" opacity="0.2" stroke-dasharray="4 2" />
            <line x1="${rightX}" y1="40" x2="${rightX}" y2="160" stroke="#e5e7eb" stroke-width="1" opacity="0.2" stroke-dasharray="4 2" />
        </g>`;
    }

    // Tagline centralizada com grupo para alinhamento perfeito
    let taglineSvg = '';
    if (taglineText) {
        const tagWidth = Math.max(60, taglineText.length * 13);
        let tagAnchor = tagData.anchor;
        let tagTextX = 0;
        if (tagAnchor === 'start') tagTextX = 0;
        else if (tagAnchor === 'end') tagTextX = tagWidth;
        else tagTextX = tagWidth / 2;
        taglineSvg = `
        <g transform="translate(${tagData.x - (tagAnchor === 'start' ? 0 : tagAnchor === 'end' ? tagWidth : tagWidth / 2)},0)">
            <rect x="0" y="140" width="${tagWidth}" height="26" rx="${tagData.radius}" ry="${tagData.radius}" fill="${tagData.bg}" />
            <text x="${tagTextX}" y="154" dominant-baseline="middle" text-anchor="${tagAnchor}" class="banner-tagline" style="fill:${tagData.color};font-size:17px;font-family:${FONT_FAMILY};font-weight:300;letter-spacing:1px;">
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
