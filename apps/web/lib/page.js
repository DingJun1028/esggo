import { connectToDatabase } from './mongodb';
import User from '../User';
import UserList from '../components/UserList';

export default async function UsersPage() {
    // Connect to the database directly on the server
    await connectToDatabase();
    // Fetch users directly using the Mongoose model.
    // .lean() converts the MongoDB documents into plain JavaScript objects.
    const users = await User.find({}).lean();

    // Convert MongoDB ObjectIds to strings so they can be serialized and passed to a Client Component
    const serializedUsers = users.map(user => ({
        ...user,
        _id: user._id.toString(),
    }));

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Users Directory</h1>
            <UserList initialUsers={serializedUsers} />
        </div>
    );
}