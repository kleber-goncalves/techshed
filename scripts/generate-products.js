import fs from "fs";
import path from "path";

const baseDir = path.join(process.cwd(), "public", "imgProdutos");
const outputFile = path.join(process.cwd(), "produtos.js");

function slugToName(slug) {
    return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function generateProduct(file, category) {
    const ext = path.extname(file);
    const slug = path.basename(file, ext);

    return {
        id: slug,
        slug,
        name: slugToName(slug),
        img: `/imgProdutos/${category}/${file}`,
        alt: `${slugToName(slug)} imagem do produto`,
        priceCents: 0, // ⚠️ ajustar depois
        stock: 0, // ⚠️ ajustar depois
        category: category.slice(0, -1), // celulares → celular
        features: [],
    };
}

const produtos = {
    celulares: [],
    tablets: [],
    cameras: [],
    autofalantes: [],
    desktops: [],
    headset: [],
    laptops: [],
    monitores: [],
    oculosvr: [],
    projetores: [],
    quadcopters: [],
    smartstv: [],
    smartwatch: [],
};

for (const category of Object.keys(produtos)) {
    const dir = path.join(baseDir, category);

    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (!file.match(/\.(png|jpg|jpeg|webp|avif)$/i)) continue;

        produtos[category].push(generateProduct(file, category));
    }
}

// 📝 gera o arquivo JS
const content = `// ⚠️ Arquivo gerado automaticamente
export const produtos = ${JSON.stringify(produtos, null, 2)};
`;

fs.writeFileSync(outputFile, content);

console.log("✅ produtos.js gerado com sucesso!");
