const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'produtos.js');
let content = fs.readFileSync(filePath, 'utf8');

let count = 0;
content = content.replace(/priceCents:\s*(\d+),/g, (m, p1) => {
  const oldVal = Number(p1);
  const newVal = oldVal * 100;
  count++;
  return `priceCents: ${newVal},`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Updated ${count} priceCents entries by x100 in ${filePath}`);
