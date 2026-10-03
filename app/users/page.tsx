import pool from '@/lib/db';

async function getUsers() {
    try {
        const { rows } = await pool.query('SELECT id, name, email FROM users ORDER BY id DESC');
        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <main className="p-6">
            <h1 className="text-xl font-bold mb-4">รายชื่อผู้ใช้งาน</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id} className="border-b py-2">
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </main>
    );
}
