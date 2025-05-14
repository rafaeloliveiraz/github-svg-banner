const express = require('express');
const app = express();

const backgrounds = {
    '1': `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1a1a1a"/>
        <path d="M0 100 Q200 50 400 100 T800 100 V200 H0 Z" fill="#ff6f61" opacity="0.5"/>
    </svg>`,
    '2': `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#2a2a72;stop-opacity:1"/>
                <stop offset="100%" style="stop-color:#009ffd;stop-opacity:1"/>
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad2)"/>
    </svg>`,
    '3': `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0d1b2a"/>
        <circle cx="100" cy="50" r="20" fill="#ffba08" opacity="0.3"/>
        <circle cx="200" cy="150" r="30" fill="#ffba08" opacity="0.3"/>
        <circle cx="600" cy="100" r="25" fill="#ffba08" opacity="0.3"/>
    </svg>`,
    '4': `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#2d3436"/>
        <path d="M0 0 L800 200 M800 0 L0 200" stroke="#00d4b6" stroke-width="10" opacity="0.5"/>
    </svg>`,
    '5': `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#ff9f43;stop-opacity:1"/>
                <stop offset="100%" style="stop-color:#feca57;stop-opacity:1"/>
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad5)"/>
        <circle cx="400" cy="100" r="50" fill="#fff" opacity="0.1"/>
    </svg>`,
    '6': `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1b263b"/>
        <path d="M0 50 H800 M0 150 H800" stroke="#778da9" stroke-width="10" opacity="0.4"/>
    </svg>`,
    '7': `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#3c2f2f"/>
        <path d="M0 200 Q400 0 800 200" fill="none" stroke="#ffcb69" stroke-width="20" opacity="0.5"/>
    </svg>`,
    '8': `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="grad8" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#6a0572;stop-opacity:1"/>
                <stop offset="100%" style="stop-color:#ab83a1;stop-opacity:1"/>
            </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad8)"/>
    </svg>`,
    '9': `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0b132b"/>
        <polygon points="400,50 350,150 450,150" fill="#5bc0eb" opacity="0.5"/>
        <polygon points="300,30 250,130 350,130" fill="#5bc0eb" opacity="0.3"/>
    </svg>`,
    '10': `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#14213d"/>
        <circle cx="400" cy="100" r="80" fill="none" stroke="#fca311" stroke-width="10" opacity="0.5"/>
        <circle cx="400" cy="100" r="60" fill="none" stroke="#fca311" stroke-width="5" opacity="0.3"/>
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
    const { bg = '1', anim = 'fade', color = 'white' } = req.query;
    const [name, role] = text.split('_');
    const displayText = name && role ? `${name.replace('-', ' ')} - ${role.replace('-', ' ')}` : 'Nome - Função';
    const svgContent = backgrounds[bg] || backgrounds['1'];
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
