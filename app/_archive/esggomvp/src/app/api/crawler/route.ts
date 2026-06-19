import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: "Invalid URL provided." }, { status: 400 });
        }

        // Fetch HTML content
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            timeout: 10000 // 10 seconds timeout
        });

        const html = response.data;

        // Use JSDOM to parse HTML for Readability
        const doc = new JSDOM(html, {
            url: url
        });

        // Clean the DOM with Readability
        const reader = new Readability(doc.window.document);
        const article = reader.parse();

        if (!article) {
            return NextResponse.json({ error: "Failed to extract content from the URL." }, { status: 422 });
        }

        // Additional cleanup with Cheerio if necessary
        const $ = cheerio.load(article.content as string);

        // Remove tracking pixels, ad banners, etc (Basic example)
        $('script, style, nav, footer, iframe, .ads, .advertisement').remove();

        const cleanHtmlStr = $.html();
        const textContent = article.textContent?.replace(/\s+/g, ' ').trim() || "";

        return NextResponse.json({
            title: article.title,
            excerpt: article.excerpt,
            byline: article.byline,
            siteName: article.siteName,
            content: cleanHtmlStr,
            textContent: textContent,
            sourceUrl: url,
            length: article.length
        });

    } catch (error: any) {
        console.error("Crawler Error:", error);
        return NextResponse.json({
            error: "Failed to fetch and process URL.",
            details: error.message
        }, { status: 500 });
    }
}
