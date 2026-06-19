const cheerio = require('cheerio');

async function test() {
  const r = await fetch('https://e-info.org.tw/taxonomy/term/39');
  const html = await r.text();
  const $ = cheerio.load(html);
  const items = $('.view-content .views-row').slice(0, 2);
  console.log('Found:', items.length);
  items.each((_, el) => {
    console.log('Title:', $(el).find('h2 a').text().trim());
    console.log('Link:', $(el).find('h2 a').attr('href'));
  });
}
test();
