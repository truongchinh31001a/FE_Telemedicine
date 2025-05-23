'use client';

export default function JoinForm({ room, name, setRoom, setName, setToken }) {
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!room || !name) return;

        try {
            const res = await fetch(`/api/token?room=${room}&username=${name}`);
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to fetch token');
            }
            const data = await res.json();
            setToken(data.token);
        } catch (err) {
            console.error('Join room failed:', err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center min-h-screen"
        >
            <input
                type="text"
                placeholder="Room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="mb-4 ring-1 ring-gray-300 p-2 rounded"
            />
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4 ring-1 ring-gray-300 p-2 rounded"
            />
            <button
                type="submit"
                className="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
                Join
            </button>
        </form>
    );
}