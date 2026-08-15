const fs = require('fs');

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the problematic timingSafeEqual lines with a length check wrapper
    const replacement = `
  const sigBuf = Buffer.from(signatureHeader);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) {
    // Prevent timingSafeEqual from throwing RangeError on length mismatch.
    // Ensure we do a constant time check anyway (though length leak is minor here compared to crash).
    // Or simply return false immediately.
    return false;
  }
  return crypto.timingSafeEqual(sigBuf, expBuf);
`;

    if (filePath.includes('webhook-auth.ts')) {
       content = content.replace(
         /return crypto\.timingSafeEqual\(Buffer\.from\(signatureHeader\), Buffer\.from\(expected\)\);/g,
         `const sigBuf = Buffer.from(signatureHeader);\n  const expBuf = Buffer.from(expected);\n  if (sigBuf.length !== expBuf.length) return false;\n  return crypto.timingSafeEqual(sigBuf, expBuf);`
       );
    } else if (filePath.includes('zenrows-client.ts')) {
       content = content.replace(
         /return crypto\.timingSafeEqual\(Buffer\.from\(signatureHeader\), Buffer\.from\(expected\)\);/g,
         `const sigBuf = Buffer.from(signatureHeader);\n  const expBuf = Buffer.from(expected);\n  if (sigBuf.length !== expBuf.length) return false;\n  return crypto.timingSafeEqual(sigBuf, expBuf);`
       );
    }

    fs.writeFileSync(filePath, content);
    console.log("Fixed", filePath);
  } catch(e) {
    console.error("Error fixing", filePath, e);
  }
}

fixFile('./src/lib/webhook-auth.ts');
fixFile('./src/lib/zenrows-client.ts');
