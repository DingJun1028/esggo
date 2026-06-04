import { jsx as _jsx } from "react/jsx-runtime";
import WikiClientPage from './WikiClientPage';
export const metadata = {
    title: 'ESGGO Wiki | OmniCore',
    description: 'ESGGO System Architecture and 5T Governance Protocol',
};
export default async function WikiPage() {
    const url = `https://app.nocodebackend.com/api/public-data/wiki_pages?Instance=${process.env.NCB_INSTANCE}wiki`;
    let pages = [];
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            pages = data.data || [];
        }
        else {
            console.error('Failed to fetch wiki pages', await res.text());
        }
    }
    catch (err) {
        console.error('Error fetching wiki pages:', err);
    }
    return (_jsx(WikiClientPage, { pages: pages }));
}
//# sourceMappingURL=page.js.map