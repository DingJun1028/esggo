import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Berkeley 認證學院 | ESG GO',
    description: '掌握 ESG 核心知識，獲獲 5T 協議認證，開啟您的永續成長之路。Master ESG knowledge and get 5T certified.',
};

export default function BerkeleyAcademyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}
