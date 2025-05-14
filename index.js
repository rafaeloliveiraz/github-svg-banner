const express = require('express');
const app = express();

const backgrounds = {
    'tech-gradient': `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="mainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#2a1a5e;stop-opacity:1"/>
                <stop offset="50%" style="stop-color:#2a1a5e;stop-opacity:0.8"/>
                <stop offset="100%" style="stop-color:#2a1a5e;stop-opacity:0"/>
            </linearGradient>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#5e60ce;stop-opacity:0.3"/>
                <stop offset="100%" style="stop-color:#4d4dff;stop-opacity:0"/>
            </linearGradient>
        </defs>
        <rect width="800" height="200" fill="url(#mainGrad)" rx="20" ry="20"/>
        <circle cx="150" cy="50" r="70" fill="url(#glowGrad)" opacity="0.4"/>
        <circle cx="650" cy="150" r="50" fill="url(#glowGrad)" opacity="0.3"/>
        <path d="M0 150 Q200 100 400 150 T800 150" fill="none" stroke="#5e60ce" stroke-width="5" opacity="0.2"/>
    </svg>`,
    'gradient': `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#24292e;stop-opacity:1"/>
                <stop offset="100%" style="stop-color:#58a6ff;stop-opacity:1"/>
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>`
};

const animations = {
    fade: `.banner-text { animation: fade 2s infinite alternate; }
           @keyframes fade { 0% { opacity: 0; } 100% { opacity: 1; } }`,
    slide: `.banner-text { animation: slide 2s infinite alternate; }
            @keyframes slide { 0% { transform: translateX(-20px); } 100% { transform: translateX(20px); } }`
};

// Redireciona para o repositório se a URL for acessada sem parâmetros
app.get('/', (req, res) => {
    res.redirect('https://github.com/rafaeloliveiraz/github-svg-banner');
});

// Gera o SVG para URLs com parâmetros
app.get('/:text', (req, res) => {
    const { text } = req.params;
    const { bg = 'wave', anim = 'fade', color = 'white' } = req.query;
    const [name, role] = text.split('_');
    const displayText = name && role ? `${name.replace('-', ' ')} '<br>' ${role.replace('-', ' ')}` : 'Nome - Função';
    const svgContent = backgrounds[bg] || backgrounds.wave;
    const animCss = animations[anim] || animations.fade;

    const svg = svgContent.replace('</svg>', `
        <style>
            .banner-text {
                font-family: Arial, sans-serif;
                font-size: 36px;
                fill: ${color};
            }
            ${animCss}
        </style>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="banner-text">${displayText}</text>
    </svg>`);

    // Adiciona cache por 6 horas (21.600 segundos)
    res.setHeader('Cache-Control', 'public, max-age=21600');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
});

module.exports = app;
