export interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number; // hours
    modules: string[];
    prerequisites: string[];
    tags: string[];
    rating: number;
    enrollmentCount: number;
    activeEnrollments?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Certificate {
    id: string;
    courseId: string;
    name: string;
    issuedAt: Date;
    url: string;
}

export interface BerkeleyTSISDAProps {
    theme?: 'light' | 'dark';
}
