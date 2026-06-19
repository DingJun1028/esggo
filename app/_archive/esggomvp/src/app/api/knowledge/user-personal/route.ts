import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { resolveInstance, ncbFetch } from '@/lib/ncb-utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * API 路由：用戶個人知識庫
 * 用戶的專屬知識庫，使用 UUID 區分知識條目
 */

interface UserPersonalKnowledgeRecord {
    id: string;
    uuid: string;
    title: string;
    content: string;
    domain: string;
    tags: string[];
    user_email: string;
    source: string | null;
    created_at: number;
    updated_at: number;
    access_count: number;
    is_favorite: boolean;
    is_crystallized: boolean;
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const domain = searchParams.get('domain');
        const tag = searchParams.get('tag');
        const search = searchParams.get('search');
        const favorite = searchParams.get('favorite');
        const crystallized = searchParams.get('crystallized');

        // Build query parameters
        const queryParams: Record<string, string> = {};
        queryParams['user_email'] = session.user.email;
        if (domain) queryParams['domain'] = domain;
        if (tag) queryParams['tags'] = `*${tag}*`;
        if (search) queryParams['title'] = `*${search}*`;
        if (favorite === 'true') queryParams['is_favorite'] = 'eq.true';
        if (crystallized === 'true') queryParams['is_crystallized'] = 'eq.true';

        // Query NCB for user personal knowledge
        const result = await ncbFetch<UserPersonalKnowledgeRecord[]>(
            `user_personal_knowledge?${new URLSearchParams(queryParams).toString()}`
        );

        if (result.error) {
            console.error('NCB fetch error:', result.error);
            return NextResponse.json({ error: 'Failed to fetch knowledge' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: result.data || [],
            message: 'User personal knowledge retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching user personal knowledge:', error);
        return NextResponse.json({ error: 'Failed to fetch knowledge' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, domain, tags, source } = body;

        if (!title || !content || !domain) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate UUID
        const uuid = `upk-${uuidv4()}`;

        const record = {
            uuid,
            title,
            content,
            domain,
            tags: tags || [],
            user_email: session.user.email,
            source: source || null,
            created_at: Date.now(),
            updated_at: Date.now(),
            access_count: 0,
            is_favorite: false,
            is_crystallized: false
        };

        // Create in NCB
        const result = await ncbFetch('user_personal_knowledge', {
            method: 'POST',
            body: JSON.stringify(record)
        });

        if (result.error) {
            console.error('NCB create error:', result.error);
            return NextResponse.json({ error: 'Failed to create knowledge' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: { id: uuid, ...record },
            message: 'Personal knowledge entry created successfully'
        });
    } catch (error) {
        console.error('Error creating user personal knowledge:', error);
        return NextResponse.json({ error: 'Failed to create knowledge' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, uuid, title, content, domain, tags, isFavorite, isCrystallized } = body;

        if (!id && !uuid) {
            return NextResponse.json({ error: 'Knowledge ID or UUID required' }, { status: 400 });
        }

        const entryId = id || uuid;

        // Update in NCB
        const updateData = {
            title,
            content,
            domain,
            tags,
            is_favorite: isFavorite,
            is_crystallized: isCrystallized,
            updated_at: Date.now()
        };

        const result = await ncbFetch(`user_personal_knowledge?uuid=eq.${entryId}&user_email=eq.${encodeURIComponent(session.user.email)}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData)
        });

        if (result.error) {
            console.error('NCB update error:', result.error);
            return NextResponse.json({ error: 'Failed to update knowledge' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: { id: entryId, ...updateData },
            message: 'Personal knowledge entry updated successfully'
        });
    } catch (error) {
        console.error('Error updating user personal knowledge:', error);
        return NextResponse.json({ error: 'Failed to update knowledge' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        const uuid = searchParams.get('uuid');

        if (!id && !uuid) {
            return NextResponse.json({ error: 'Knowledge ID or UUID required' }, { status: 400 });
        }

        const entryId = id || uuid;

        // Delete from NCB
        const result = await ncbFetch(`user_personal_knowledge?uuid=eq.${entryId}&user_email=eq.${encodeURIComponent(session.user.email)}`, {
            method: 'DELETE'
        });

        if (result.error) {
            console.error('NCB delete error:', result.error);
            return NextResponse.json({ error: 'Failed to delete knowledge' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Personal knowledge entry deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user personal knowledge:', error);
        return NextResponse.json({ error: 'Failed to delete knowledge' }, { status: 500 });
    }
}
