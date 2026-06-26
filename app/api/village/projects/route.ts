import { NextResponse } from 'next/server';
import { ncbVillageService } from '@/lib/ncb-utils';

export async function GET() {
  try {
    const projects = await ncbVillageService.getImpactProjects();
    // Fallback data if NCBDB returns empty or fails (for preview purposes)
    const fallbackProjects = [
      { id: 'proj_01', title: '淨灘守護計畫', description: '招募志工進行北海岸淨灘', current_points: 1500, goal_points: 5000, status: 'active', tags: ['環境','海洋'] },
      { id: 'proj_02', title: '偏鄉綠能照明', description: '為偏鄉小學建置太陽能板', current_points: 8200, goal_points: 10000, status: 'active', tags: ['綠能','社會'] },
      { id: 'proj_03', title: '循環包裝設計', description: '研發可重複使用的網購物包裝', current_points: 300, goal_points: 2000, status: 'active', tags: ['循環經濟'] }
    ];

    const data = Array.isArray(projects) && projects.length > 0 ? projects : fallbackProjects;

    return NextResponse.json({ success: true, projects: data });
  } catch (error: any) {
    console.error('Village Projects GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, userId, amount } = body;
    
    if (!projectId || !userId || !amount) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const voteResult = await ncbVillageService.submitVote(projectId, userId, amount);
    
    return NextResponse.json({ success: true, voteResult });
  } catch (error: any) {
    console.error('Village Vote POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
