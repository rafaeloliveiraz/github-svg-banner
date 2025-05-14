const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Função para escapar caracteres especiais em XML/SVG
const escapeXml = (unsafe) => {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '<';
            case '>': return '>';
            case '&': return '&';
            case '\'': return '\'';
            case '"': return '"';
            default: return c;
        }
    });
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
    const { role = 'Profession-Not-Set#ffffff', bg = '1', anim = 'fade', color, hire = '0' } = req.query;

    // Valida e carrega o background SVG da pasta banners/
    const bgFile = `${bg}.svg`;
    const bgPath = path.join(__dirname, 'banners', bgFile);
    let svgContent;
    try {
        console.log(`Attempting to load SVG from: ${bgPath}`);
        if (!fs.existsSync(bgPath)) {
            throw new Error(`Background file ${bgFile} not found`);
        }
        svgContent = fs.readFileSync(bgPath, 'utf8');
    } catch (error) {
        console.error(`Error loading background: ${error.message}`);
        // Fallback para um SVG padrão
        svgContent = `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#1a1a1a"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="24">Error: Background ${escapeXml(bgFile)} not found</text>
        </svg>`;
    }

    // Processa o texto principal (ex.: I'm#000-Firstname#FFF-Lastname#000)
    const textParts = text.split('-');
    let displayText = '';
    let useGlobalColor = color !== undefined;

    if (textParts.length > 0) {
        textParts.forEach((part, index) => {
            const [word, hexColor] = part.split('#');
            const textColor = useGlobalColor ? escapeXml(color) : (hexColor || 'white');
            displayText += `<tspan fill="#${textColor}">${escapeXml(word.replace(/_/g, ' '))}</tspan>`;
            if (index < textParts.length - 1) displayText += ' ';
        });
    } else {
        displayText = `<tspan fill="${color || 'white'}">Nome - Função</tspan>`;
    }

    // Processa a profissão (ex.: Freelancer-and-Motion-Design#F6F6F6)
    const [roleText, roleColor] = role.split('#');
    const roleDisplay = escapeXml(roleText.replace(/-/g, ' '));
    const roleFinalColor = useGlobalColor ? escapeXml(color) : (roleColor || 'white');

    // Processa o "AVAILABLE FOR HIRE" (ex.: hire=1#000)
    const [hireValue, hireColor] = hire.split('#');
    const showHire = hireValue === '1';
    const hireFinalColor = useGlobalColor ? escapeXml(color) : (hireColor || 'white');

    const animCss = animations[anim] || animations.fade;

    const svg = svgContent.replace('</svg>', `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
            .banner-text {
                font-family: 'Roboto', sans-serif;
                font-size: 36px;
                font-weight: 700;
            }
            .role-text {
                font-family: 'Roboto', sans-serif;
                font-size: 24px;
                font-weight: 400;
            }
            .hire-text {
                font-family: 'Roboto', sans-serif;
                font-size: 18px;
                font-weight: 400;
                text-transform: uppercase;
            }
            ${animCss}
        </style>
        <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" class="banner-text">${displayText}</text>
        <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" class="role-text" fill="#${roleFinalColor}">${roleDisplay}</text>
        ${showHire ? `<text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle" class="hire-text" fill="#${hireFinalColor}">AVAILABLE FOR HIRE</text>` : ''}
    </svg>`);

    // Adiciona cache por 6 horas (21.600 segundos)
    res.setHeader('Cache-Control', 'public, max-age=21600');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
});

module.exports = app;
