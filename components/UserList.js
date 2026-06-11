"use client";

import { useState } from 'react';

export default function UserList({ initialUsers }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter the users based on the search input
    const filteredUsers = initialUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6 w-full p-2 border rounded-md text-gray-800"
            />

            <div className="grid gap-4 md:grid-cols-2">
                {filteredUsers.map(user => (
                    <div key={user._id} className="p-5 border rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold">{user.name}</h2>
                        <p className="text-gray-500 mb-3">{user.email}</p>
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {user.role}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}