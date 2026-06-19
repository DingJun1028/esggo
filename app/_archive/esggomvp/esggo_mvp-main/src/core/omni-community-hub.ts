import { OmniNcbService } from './omni-ncb-service';

export interface CommunityPost {
    id: string;
    author: string;
    title: string;
    content: string;
    category: "discussion" | "success-story" | "question" | "announcement";
    likes: number;
    comments: number;
    createdAt: string;
    tags: string[];
}

export interface CaseStudy {
    id: string;
    title: string;
    organization: string;
    description: string;
    impact: string;
    category: string;
    imageUrl: string;
    date: string;
}

export interface Partner {
    id: string;
    name: string;
    type: "corporate" | "npo" | "government" | "academic";
    description: string;
    logoUrl: string;
    website: string;
}

export interface CommunityStats {
    totalMembers: number;
    activePosts: number;
    caseStudies: number;
    partners: number;
}

class OmniCommunityHubService {
    private caseStudies: CaseStudy[] = [
        { id: "case-001", title: "Circular Economy Demonstration Park", organization: "Green Sustainability Inc", description: "Establish complete waste resource circulation system", impact: "Annual waste reduction 5,000 tons", category: "Circular Economy", imageUrl: "", date: "2025-11-01" },
        { id: "case-002", title: "Rural Digital Education Program", organization: "Digital Inclusion Association", description: "Provide digital learning equipment for rural schools", impact: "Serve 50 rural schools, benefit 3,000 students", category: "Social Good", imageUrl: "", date: "2025-10-15" },
        { id: "case-003", title: "Sustainable Agriculture Counseling Program", organization: "Council of Agriculture", description: "Counsel farmers to transition to organic agriculture", impact: "Counsel 200 farmers, 500 hectares", category: "Environmental Protection", imageUrl: "", date: "2025-09-20" }
    ];

    private partners: Partner[] = [
        { id: "partner-001", name: "Taiwan Sustainable Energy Research Foundation", type: "npo", description: "Promote sustainable energy development", logoUrl: "", website: "https://tsea.org.tw" },
        { id: "partner-002", name: "Industrial Development Bureau, MOEA", type: "government", description: "Counsel industrial green transformation", logoUrl: "", website: "https://www.moea.gov.tw" },
        { id: "partner-003", name: "National Taiwan University", type: "academic", description: "Sustainable development research", logoUrl: "", website: "https://www.ntu.edu.tw" }
    ];

    async getPosts(): Promise<CommunityPost[]> {
        const posts = await OmniNcbService.fetchCommunityPosts();
        return posts.map((p: any) => ({
            id: p.id || `post-${Date.now()}-${Math.random()}`,
            author: p.author || 'Anonymous',
            title: p.title || 'Untitled',
            content: p.content || '',
            category: p.category || 'discussion',
            likes: p.likes || 0,
            comments: p.comments || 0,
            createdAt: p.created_at || new Date().toISOString(),
            tags: p.tags ? (typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags) : []
        }));
    }

    async getCommunityStats(): Promise<CommunityStats> {
        const posts = await this.getPosts();
        return {
            totalMembers: 12500,
            activePosts: posts.length,
            caseStudies: this.caseStudies.length,
            partners: this.partners.length
        };
    }

    getCaseStudies(): CaseStudy[] {
        return this.caseStudies;
    }

    getPartners(): Partner[] {
        return this.partners;
    }

    async addPost(post: Omit<CommunityPost, "id" | "createdAt" | "likes" | "comments">): Promise<any> {
        // In a real implementation this should use an OmniNcbService.saveCommunityPost,
        // but the NCB integration service only has a saveComment for now.
        // If needed it can be attached. For now, following the spirit of NCB connection.
        return { ...post, id: "post-" + Date.now() };
    }
}

export const omniCommunityHub = new OmniCommunityHubService();
export default OmniCommunityHubService;