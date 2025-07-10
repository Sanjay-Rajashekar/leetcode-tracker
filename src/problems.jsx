import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth(); // ✅ get current user

  const fetchProblems = async () => {
    if (!currentUser) {
      setProblems([]);
      setLoading(false);
      return;
    }

    const snapshot = await getDocs(
      collection(db, 'problems', currentUser.uid, 'userProblems')
    );
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProblems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProblems();
  }, [currentUser]); // refetch when user changes

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'problems', currentUser.uid, 'userProblems', id));
    setProblems(problems.filter(p => p.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-purple-600">🧠 Solved Problems</h1>
        <Link to="/add" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          ➕ Add Problem
        </Link>
      </div>

      {loading ? (
        <p>Loading problems...</p>
      ) : problems.length === 0 ? (
        <p className="text-gray-500">No problems yet. Add some!</p>
      ) : (
        <div className="space-y-4">
          {problems.map((p) => (
            <div key={p.id} className="p-4 border border-gray-300 rounded-xl bg-white shadow">
              <div className="flex justify-between items-center">
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl font-semibold text-blue-600 hover:underline"
                >
                  {p.title}
                </a>
                <div className="flex gap-4">
                  <Link
                    to={`/edit/${p.id}`}
                    className="text-green-600 text-sm hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-4">
                <span>
                  <strong>Difficulty:</strong>{' '}
                  <span className={
                    p.difficulty === 'Easy' ? 'text-green-600' :
                    p.difficulty === 'Medium' ? 'text-yellow-600' :
                    p.difficulty === 'Hard' ? 'text-red-600' : ''
                  }>
                    {p.difficulty || '—'}
                  </span>
                </span>

                <span>
                  <strong>Tags:</strong> {p.tags?.join(', ') || '—'}
                </span>
              </div>

              <pre className="bg-gray-100 text-sm mt-2 p-2 overflow-x-auto">{p.code}</pre>
              <p className="text-gray-700 mt-2">{p.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Problems;
