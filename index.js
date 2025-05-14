const pathParts = window.location.pathname.split('/').filter(part => part);
const textParam = pathParts.length > 1 ? pathParts[pathParts.length - 1] : 'Nome_Funcao';
const urlParams = new URLSearchParams(window.location.search);

// Redireciona para render.html com os parâmetros
window.location = `/github-svg-banner/render.html?text=${textParam}&${urlParams.toString()}`;
