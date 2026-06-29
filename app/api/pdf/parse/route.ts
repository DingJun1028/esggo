// ============================================================
// PDF Upload & Parse API
// src/app/api/pdf/parse/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { parsePDFReport } from '../../../../src/core/pdf/pdf-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;  // 60s timeout for large PDFs

/**
 * POST /api/pdf/parse
 * Accepts multipart/form-data with a PDF file
 * Returns structured ESG data
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided. Use multipart/form-data with field "file".' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum 50MB.' },
        { status: 413 }
      );
    }

    // Parse PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await parsePDFReport(buffer);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Parse failed' },
        { status: 422 }
      );
    }

    // Store parse result in database
    try {
      const dbResult = await prisma.pDFParseResult.create({
        data: {
          fileName: file.name,
          fileSize: file.size,
          title: result.title,
          pageCount: result.pageCount,
          totalWords: result.stats.totalWords,
          esgKeywordDensity: result.stats.esgKeywordDensity,
          companies: JSON.stringify(result.esg.companies),
          metrics: JSON.stringify(result.esg.metrics),
          years: JSON.stringify(result.esg.years),
          sections: JSON.stringify(result.sections.map(s => ({ title: s.title, pageStart: s.pageStart, pageEnd: s.pageEnd, category: s.category }))),
          esgCategories: JSON.stringify(result.esg.categories),
          textPreview: result.text.slice(0, 2000),
          rawText: result.text.slice(0, 100000),  // Cap at 100KB
        },
      });
      console.log(`[PDF Parse] Stored result: ${dbResult.id}`);
    } catch (dbError: any) {
      console.error('[PDF Parse] DB store failed:', dbError.message);
      // Non-blocking: return result even if DB store fails
    }

    return NextResponse.json({
      success: true,
      data: {
        title: result.title,
        pageCount: result.pageCount,
        stats: result.stats,
        esg: result.esg,
        sections: result.sections.map(s => ({
          title: s.title,
          pageStart: s.pageStart,
          pageEnd: s.pageEnd,
          category: s.category,
          textPreview: s.text.slice(0, 500),
        })),
        textPreview: result.text.slice(0, 2000),
      },
    });
  } catch (error: any) {
    console.error('[PDF Parse API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pdf/parse
 * Returns usage info
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      usage: 'POST multipart/form-data with field "file" containing a PDF',
      maxFileSize: '50MB',
      supportedFormats: ['application/pdf'],
      returns: {
        title: 'Report title',
        pageCount: 'Number of pages',
        stats: 'Word count, ESG keyword density, etc.',
        esg: 'ESG categories, companies, metrics, years',
        sections: 'Detected report sections',
      },
    },
  });
}
