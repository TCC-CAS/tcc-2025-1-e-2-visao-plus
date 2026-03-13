// apiMapa.js

function cepValido(cep) {
    const limpo = cep.replace(/\D/g, '');
    return limpo.length === 8;
}

async function buscarCoordenadasPorCep(cep){

    const cepLimpo = cep.replace(/\D/g, '');

    const url = `https://brasilapi.com.br/api/cep/v2/${cepLimpo}`;

    const res = await fetch(url);

    if(!res.ok){
        throw new Error("CEP não encontrado");
    }

    const dados = await res.json();

    const coords = dados.location?.coordinates;

    if(!coords || !coords.latitude || !coords.longitude){
        throw new Error("CEP sem coordenadas");
    }

    const lat = parseFloat(coords.latitude);
    const lng = parseFloat(coords.longitude);

    if(isNaN(lat) || isNaN(lng)){
        throw new Error("Latitude/Longitude inválida");
    }

    return { lat, lng };
}


export async function inicializarMapa(oticas) {

    const map = L.map('mapa-oticas').setView([-23.5505, -46.6333], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
    }).addTo(map);

    for (const otica of oticas) {

        try {

            if (!otica.cep || !cepValido(otica.cep)) {
                console.warn("CEP inválido:", otica.nome, otica.cep);
                continue;
            }

            const coords = await buscarCoordenadasPorCep(otica.cep);

            const marker = L.marker([
                coords.lat,
                coords.lng
            ]).addTo(map);

            marker.bindPopup(`
            <b>${otica.nome}</b><br>
            ${otica.endereco}<br>
            ${otica.email || ''}
        `);

        } catch (e) {
            console.warn("Erro ao buscar CEP da loja:", otica.nome, otica.cep, e.message);
        }

    }

}