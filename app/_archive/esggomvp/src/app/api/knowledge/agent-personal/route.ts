import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { resolveInstance, ncbFetch } from '@/lib/ncb-utils';
import { v4 as uuidv4 } from 'uuid';

interface AgentKnowledgeRecord {
    id: string;
    uuid: string;
    title: string;
    content: string;
    domain: string;
    tags: string[];
    user_email: string;
    agent_id: string | null;
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

        // Build query parameters
        const queryParams: Record<string, string> = {};
        queryParams['user_email'] = session.user.email;
        if (domain) queryParams['domain'] = domain;
        if (tag) queryParams['tags'] = `*${tag}*`;
        if (search) queryParams['title'] = `*${search}*`;

        // Query NCB for agent personal knowledge
        const result = await ncbFetch<AgentKnowledgeRecord[]>(
            `agent_knowledge?${new URLSearchParams(queryParams).toString()}`
        );

        if (result.error) {
            console.error('NCB fetch error:', result.error);
            return NextResponse.json({ error: 'Failed to fetch knowledge' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: result.data || [],
            message: 'Agent personal knowledge retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching agent personal knowledge:', error);
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
        const { title, content, domain, tags, agentId } = body;

        if (!title || !content || !domain) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate UUID
        const uuid = `akb-${uuidv4()}`;

        const record = {
            uuid,
            title,
            content,
            domain,
            tags: tags || [],
            user_email: session.user.email,
            agent_id: agentId || null,
            created_at: Date.now(),
            updated_at: Date.now(),
            access_count: 0,
            is_favorite: false,
            is_crystallized: false
        };

        // Create in NCB
        const result = await ncbFetch('agent_knowledge', {
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
            message: 'Knowledge entry created successfully'
        });
    } catch (error) {
        console.error('Error creating agent personal knowledge:', error);
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
        const { id, title, content, domain, tags, isFavorite, isCrystallized } = body;

        if (!id) {
            return NextResponse.json({ error: 'Knowledge ID required' }, { status: 400 });
        }

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

        const result = await ncbFetch(`agent_knowledge?uuid=eq.${id}`, {
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
            message: 'Knowledge entry updated successfully'
        });
    } catch (error) {
        console.error('Error updating agent personal knowledge:', error);
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
        const result = await ncbFetch(`agent_knowledge?uuid=eq.${id}&user_email=eq.${encodeURIComponent(session.user.email)}`, {
            method: 'DELETE'
        });

        if (result.error) {
            console.error('NCB delete error:', result.error);
            return NextResponse.json({ error: 'Failed to delete knowledge' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Knowledge entry deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting agent personal knowledge:', error);
        return NextResponse.json({ error: 'Failed to delete knowledge' }, { status: 500 });
    }
}
