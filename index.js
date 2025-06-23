const express = require('express');
const app = express();

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
    const { bg = '#2a1a5e', anim = 'fade', color = 'white', gradient = '#58a6ff' } = req.query;
    const [name, role] = text.split('_');
    const displayText = name && role ? `${name.replace('-', ' ')} - ${role.replace('-', ' ')}` : 'Nome - Função';
    const animCss = animations[anim] || animations.fade;

    // SVG dinâmico com gradiente simples e animação
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${bg};stop-opacity:1"/>
                <stop offset="100%" style="stop-color:${gradient};stop-opacity:1"/>
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" rx="20" ry="20"/>
        <style>
            .banner-text {
                font-family: Arial, sans-serif;
                font-size: 36px;
                fill: ${color};
            }
            ${animCss}
        </style>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="banner-text">${displayText}</text>
    </svg>`;

    // Adiciona cache por 6 horas (21.600 segundos)
    res.setHeader('Cache-Control', 'public, max-age=21600');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
});

module.exports = app;
