const backgrounds = {
    wave: `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#24292e"/>
        <path d="M0 100 Q200 50 400 100 T800 100 V200 H0 Z" fill="#58a6ff" opacity="0.5"/>
    </svg>`,
    gradient: `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
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

// Extrai o caminho da URL
const pathParts = window.location.pathname.split('/').filter(part => part);
const repoName = 'github-svg-banner';
const textParam = pathParts.length > 1 && pathParts[0] === repoName ? pathParts[1] : 'Nome_Funcao';
const [name, role] = textParam.split('_');
const urlParams = new URLSearchParams(window.location.search);
const bg = urlParams.get('bg') || 'wave';
const anim = urlParams.get('anim') || 'fade';
const color = urlParams.get('color') || 'white';

const text = name && role ? `${name.replace('-', ' ')} - ${role}` : 'Nome - Função';
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
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="banner-text">${text}</text>
</svg>`);

document.write(svg);
