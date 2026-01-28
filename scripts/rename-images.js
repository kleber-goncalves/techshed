import fs from "fs";
import path from "path";

// 📂 pasta das imagens
const imagesDir = path.join(process.cwd(), "public", "imgProdutos");

// 🔁 função kebab-case
function toKebabCase(filename) {
    return filename
        .normalize("NFD") // remove acentos
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, "-") // troca espaços e símbolos por "-"
        .replace(/-+/g, "-") // remove "--"
        .replace(/^-|-$/g, ""); // remove "-" do início/fim
}

fs.readdirSync(imagesDir).forEach((file) => {
    const oldPath = path.join(imagesDir, file);

    if (!fs.statSync(oldPath).isFile()) return;

    const newName = toKebabCase(file);
    const newPath = path.join(imagesDir, newName);

    if (oldPath !== newPath) {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ ${file} → ${newName}`);
    }
});

console.log("Renomeação finalizada.");
