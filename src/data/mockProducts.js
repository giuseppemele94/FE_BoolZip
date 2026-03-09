// Passaggio 1: questo array e un modello temporaneo frontend.
// Quando il backend sara pronto, sostituire questi dati con la risposta API.
const buildPlaceholder = (sku, view) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1100"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f6f7f9"/><stop offset="100%" stop-color="#e9ecf2"/></linearGradient></defs><rect width="900" height="1100" fill="url(#g)"/><rect x="120" y="200" width="660" height="700" rx="28" fill="none" stroke="#1f2430" stroke-width="8" stroke-dasharray="14 14"/><text x="450" y="520" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="42" font-weight="700" fill="#1f2430">Modello ${sku}</text><text x="450" y="585" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="30" fill="#4b5160">${view}</text><text x="450" y="645" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="22" fill="#6d7480">Immagine demo</text></svg>`)}`;

export const mockProducts = [
    {
        id: '1935-25',
        name: '1935.25 Replica Senza Tacche',
        sku: '1935.25',
        price: 64,
        stock: 0,
        shortDescription: 'Replica brushed chrome con look classico.',
        description:
            'Accendino antivento brushed chrome con cassa 1935 Replica, cerniera esterna e fondo piatto inciso.',
        features: [
            'Click Zippo originale',
            'Corpo interamente in metallo',
            'Ricaricabile e riutilizzabile nel tempo',
            'Garanzia del produttore',
            'Liquido venduto separatamente',
        ],
        images: [
            buildPlaceholder('1935.25', 'Vista frontale'),
            buildPlaceholder('1935.25', 'Vista laterale'),
            buildPlaceholder('1935.25', 'Vista aperto'),
            buildPlaceholder('1935.25', 'Vista confezione'),
        ],
        relatedIds: ['armor-steel', 'slim-chrome', 'vintage-black'],
    },
    {
        id: 'armor-steel',
        name: 'Armor Brushed Steel',
        sku: 'A-4812',
        price: 72,
        stock: 10,
        shortDescription: 'Scocca piu spessa e finitura satinata.',
        description: 'Versione Armor con pareti maggiorate e texture satin per un feeling premium.',
        features: ['Corpo Armor', 'Finitura satin', 'Insert antivento', 'Ricaricabile'],
        images: [
            buildPlaceholder('A-4812', 'Vista frontale'),
            buildPlaceholder('A-4812', 'Vista aperto'),
            buildPlaceholder('A-4812', 'Vista laterale'),
            buildPlaceholder('A-4812', 'Vista confezione'),
        ],
        relatedIds: ['1935-25', 'street-brass', 'slim-chrome'],
    },
    {
        id: 'slim-chrome',
        name: 'Slim Satin Chrome',
        sku: 'SL-2280',
        price: 54,
        stock: 12,
        shortDescription: 'Formato slim elegante e leggero.',
        description: 'Profilo sottile con finitura satin chrome e meccanica classica antivento.',
        features: ['Corpo slim', 'Finitura satin chrome', 'Uso quotidiano', 'Confezione regalo'],
        images: [
            buildPlaceholder('SL-2280', 'Vista frontale'),
            buildPlaceholder('SL-2280', 'Vista aperto'),
            buildPlaceholder('SL-2280', 'Vista laterale'),
            buildPlaceholder('SL-2280', 'Vista confezione'),
        ],
        relatedIds: ['1935-25', 'vintage-black', 'armor-steel'],
    },
    {
        id: 'street-brass',
        name: 'Street Brass Edition',
        sku: 'S-9011',
        price: 59,
        stock: 8,
        shortDescription: 'Ottone con effetto vissuto street.',
        description: 'Finitura brass stonewash per un look usurato ma elegante.',
        features: ['Ottone massiccio', 'Effetto stonewash', 'Apertura precisa', 'Ricaricabile'],
        images: [
            buildPlaceholder('S-9011', 'Vista frontale'),
            buildPlaceholder('S-9011', 'Vista aperto'),
            buildPlaceholder('S-9011', 'Vista laterale'),
            buildPlaceholder('S-9011', 'Vista confezione'),
        ],
        relatedIds: ['armor-steel', 'vintage-black', '1935-25'],
    },
    {
        id: 'vintage-black',
        name: 'Vintage Black Crackle',
        sku: 'V-1941',
        price: 67,
        stock: 6,
        shortDescription: 'Texture nera ruvida in stile storico.',
        description: 'Finitura black crackle ispirata ai modelli vintage del brand.',
        features: ['Grip elevato', 'Look retro', 'Corpo robusto', 'Garanzia produttore'],
        images: [
            buildPlaceholder('V-1941', 'Vista frontale'),
            buildPlaceholder('V-1941', 'Vista aperto'),
            buildPlaceholder('V-1941', 'Vista laterale'),
            buildPlaceholder('V-1941', 'Vista confezione'),
        ],
        relatedIds: ['1935-25', 'slim-chrome', 'street-brass'],
    },
];
