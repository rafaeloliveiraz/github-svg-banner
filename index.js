const express = require('express');
const app = express();

const animations = {
    neon: (color) => `
        .banner-text-main {
            color: #fff;
            text-shadow:
                0 0 5px ${color},
                0 0 10px ${color},
                0 0 20px ${color},
                0 0 40px ${color};
            animation: neon-rotate 6s linear infinite;
        }
        @keyframes neon-rotate {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
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
    if (!tag) return { align: 'middle', color: '#fff', bg: '#000' };
    const [align, color, bgColor] = tag.split('-');
    return {
        align: align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle',
        color: color ? `#${color}` : '#fff',
        bg: bgColor ? `#${bgColor}` : '#000'
    };
}

app.get('/', (req, res) => {
    res.redirect('https://github.com/rafaeloliveiraz/github-svg-banner');
});

app.get('/:text', (req, res) => {
    const { text } = req.params;
    const { bg, anim = 'fade', color = 'ffffff', gradient, radius = 20, tag } = req.query;
    const [name, tagline] = text.split('_');
    const mainText = name ? name.replace(/-/g, ' ') : 'Nome';
    const tagData = parseTag(tag);
    const taglineText = tagline ? tagline.replace(/-/g, ' ') : '';
    const bgData = parseBg(bg);
    const borderRadius = parseInt(radius, 10) || 20;
    const textColor = `#${color}`;

    // Animação customizada
    let animCss = '';
    if (anim.startsWith('neon-')) {
        const neonColor = `#${anim.split('-')[1] || 'fff'}`;
        animCss = animations.neon(neonColor);
    } else if (anim.startsWith('borders-')) {
        const borderColor = `#${anim.split('-')[1] || 'fff'}`;
        animCss = animations.borders(borderColor);
    } else {
        animCss = animations.fade();
    }

    // Gradiente ou sólido
    let bgSvg = '';
    if (bgData.type === 'gradient') {
        bgSvg = `<defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${bgData.colors[0]};stop-opacity:1"/><stop offset="100%" style="stop-color:${bgData.colors[1]};stop-opacity:1"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)" rx="${borderRadius}" ry="${borderRadius}"/>`;
    } else {
        bgSvg = `<rect width="100%" height="100%" fill="${bgData.colors[0]}" rx="${borderRadius}" ry="${borderRadius}"/>`;
    }

    // Texto principal com fade letra a letra
    let mainTextSvg = '';
    if (anim === 'fade') {
        mainTextSvg = `<text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" class="banner-text-main">${[...mainText].map((l, i) => `<tspan>${l === ' ' ? '\u00A0' : l}</tspan>`).join('')}</text>`;
    } else {
        mainTextSvg = `<text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" class="banner-text-main">${mainText}</text>`;
    }

    // Tagline
    let taglineSvg = '';
    if (taglineText) {
        taglineSvg = `<text x="50%" y="70%" dominant-baseline="middle" text-anchor="${tagData.align}" class="banner-tagline" style="fill:${tagData.color};font-size:22px;font-family:Arial,sans-serif;">
            <tspan style="paint-order:stroke fill;stroke:${tagData.bg};stroke-width:14;stroke-linejoin:round;fill:${tagData.color};">${taglineText}</tspan>
        </text>`;
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        ${bgSvg}
        <style>
            .banner-text-main {
                font-family: Arial, sans-serif;
                font-size: 38px;
                fill: ${textColor};
                dominant-baseline: middle;
                text-anchor: middle;
            }
            .banner-tagline {
                font-weight: bold;
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
