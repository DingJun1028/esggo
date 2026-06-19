import type { Metadata } from "next";
import { HeroesClientWrapper } from "@/components/omni/heroes-client-wrapper";

export const metadata: Metadata = {
    title: "創元英雄 | ESG GO · 萬能之心",
    description: "五大 AI 英雄從萬能之心升起，各自承載專屬技能樹——報告聖典撰寫者、數據鍊金術士、合規神諭、戰略大師、稽核守衛",
};

export default function HeroesPage() {
    return <HeroesClientWrapper />;
}
