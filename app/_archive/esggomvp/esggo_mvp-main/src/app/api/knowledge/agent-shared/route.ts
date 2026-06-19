import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { resolveInstance, ncbFetch } from '@/lib/ncb-utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * API 路由：代理共享知識庫
 * 支持團隊/組織內的知識共享
 */

interface AgentSharedKnowledgeRecord {
    id: string;
    uuid: string;
    title: string;
    content: string;
    domain: string;
    tags: string[];
    team_id: string | null;
    visibility: 'team' | 'public';
    author_email: string;
    created_at: number;
    updated_at: number;
    access_count: number;
    likes: number;
    is_featured: boolean;
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const teamId = searchParams.get('teamId');
        const domain = searchParams.get('domain');
        const tag = searchParams.get('tag');
        const search = searchParams.get('search');
        const authorId = searchParams.get('authorId');

        // Build query parameters
        const queryParams: Record<string, string> = {};
        if (teamId) queryParams['team_id'] = teamId;
        if (domain) queryParams['domain'] = domain;
        if (tag) queryParams['tags'] = `*${tag}*`;
        if (search) queryParams['title'] = `*${search}*`;
        if (authorId) queryParams['author_email'] = authorId;

        // Query NCB for agent shared knowledge
        const result = await ncbFetch<AgentSharedKnowledgeRecord[]>(
            `agent_shared_knowledge?${new URLSearchParams(queryParams).toString()}`
        );

        if (result.error) {
            console.error('NCB fetch error:', result.error);
            return NextResponse.json({ error: 'Failed to fetch knowledge' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: result.data || [],
            message: 'Agent shared knowledge retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching agent shared knowledge:', error);
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
        const { title, content, domain, tags, teamId, visibility } = body;

        if (!title || !content || !domain) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate UUID
        const uuid = `ask-${uuidv4()}`;

        const record = {
            uuid,
            title,
            content,
            domain,
            tags: tags || [],
            team_id: teamId || null,
            visibility: visibility || 'team',
            author_email: session.user.email,
            created_at: Date.now(),
            updated_at: Date.now(),
            access_count: 0,
            likes: 0,
            is_featured: false
        };

        // Create in NCB
        const result = await ncbFetch('agent_shared_knowledge', {
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
            message: 'Shared knowledge entry created successfully'
        });
    } catch (error) {
        console.error('Error creating agent shared knowledge:', error);
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
        const { id, title, content, domain, tags, visibility, isFeatured } = body;

        if (!id) {
            return NextResponse.json({ error: 'Knowledge ID required' }, { status: 400 });
        }

        // Update in NCB
        const updateData = {
            title,
            content,
            domain,
            tags,
            visibility,
            is_featured: isFeatured,
            updated_at: Date.now()
        };

        const result = await ncbFetch(`agent_shared_knowledge?uuid=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData)
        });

        if (result.error) {
            console.error('NCB update error:', result.error);
            return NextResponse.json({ error: 'Failed to update knowledge' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: { id, ...updateData },
            message: 'Shared knowledge entry updated successfully'
        });
    } catch (error) {
        console.error('Error updating agent shared knowledge:', error);
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

        if (!id) {
            return NextResponse.json({ error: 'Knowledge ID required' }, { status: 400 });
        }

        // Delete from NCB
        const result = await ncbFetch(`agent_shared_knowledge?uuid=eq.${id}&author_email=eq.${encodeURIComponent(session.user.email)}`, {
            method: 'DELETE'
        });

        if (result.error) {
            console.error('NCB delete error:', result.error);
            return NextResponse.json({ error: 'Failed to delete knowledge' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Shared knowledge entry deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting agent shared knowledge:', error);
        return NextResponse.json({ error: 'Failed to delete knowledge' }, { status: 500 });
    }
}
