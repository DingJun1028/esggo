const fs = require('fs');
let p1 = 'app/environmental/page.tsx';
let c1 = fs.readFileSync(p1, 'utf8');
c1 = c1.replace(/unit: 'm[^']*, hash_lock/g, "unit: 'm3', hash_lock");
fs.writeFileSync(p1, c1);

let p2 = 'app/editor/page.tsx';
let c2 = fs.readFileSync(p2, 'utf8');
c2 = c2.replace(/\/\/ \?[^\n]*await fetch/g, "// 同步建立 Blue.cc 紀錄\n      await fetch");
c2 = c2.replace(/\?[^\n\(]*\(Metric Name\)/g, "指標名稱 (Metric Name)");
c2 = c2.replace(/\?[^\n\(]*\(Value\)/g, "數值 (Value)");
c2 = c2.replace(/\?[^\n\(]*\(Actions\)/g, "操作 (Actions)");
fs.writeFileSync(p2, c2);
