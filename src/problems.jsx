import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const fetchProblems = async () => {
    const snapshot = await getDocs(collection(db, 'problems'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProblems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'problems', id));
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

      

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Difficulty:</label>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Easy">🟢 Easy</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Hard">🔴 Hard</option>
        </select>
      </div>


      {loading ? (
        <p>Loading problems...</p>
      ) : problems.length === 0 ? (
        <p className="text-gray-500">No problems yet. Add some!</p>
      ) : (
        <div className="space-y-4">
          {problems
          .filter(p => difficultyFilter === 'All' || p.difficulty === difficultyFilter)
          .map((p) => (
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
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
              <Link
                to={`/edit/${p.id}`}
                className="text-blue-500 text-sm hover:underline ml-4"
              >
                Edit
              </Link>
            </div>

            {/* Difficulty & Tags */}
            <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-4">
              <span>
                <strong>Difficulty:</strong>{' '}
                <span className={
                  p.difficulty === 'Easy' ? 'text-green-600' :
                  p.difficulty === 'Medium' ? 'text-yellow-600' :
                  p.difficulty === 'Hard' ? 'text-red-600' :
                  ''
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
