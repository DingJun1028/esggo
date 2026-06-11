import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../User'; // Adjust to '../../../models/User' if your model is inside a models folder

export async function GET() {
    try {
        // Ensure the database is connected (and automatically seeded if empty)
        await connectToDatabase();

        // Fetch all users from the database
        const users = await User.find({});

        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
    }
}