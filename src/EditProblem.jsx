import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

function EditProblem() {
  const [form, setForm] = useState({
    title: '',
    link: '',
    code: '',
    explanation: '',
    difficulty: '',
    tags: '',
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProblem = async () => {
      if (!currentUser) return;

      const problemRef = doc(db, 'problems', currentUser.uid, 'userProblems', id);
      const docSnap = await getDoc(problemRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm({
          title: data.title || '',
          link: data.link || '',
          code: data.code || '',
          explanation: data.explanation || '',
          difficulty: data.difficulty || '',
          tags: data.tags ? data.tags.join(', ') : '',
        });
      } else {
        console.log('No such problem!');
      }
    };

    fetchProblem();
  }, [id, currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const problemRef = doc(db, 'problems', currentUser.uid, 'userProblems', id);

    await updateDoc(problemRef, {
      title: form.title,
      link: form.link,
      code: form.code,
      explanation: form.explanation,
      difficulty: form.difficulty,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    });

    navigate('/problems');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-teal-600 mb-4">✏️ Edit Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          name="title"
          placeholder="Problem Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="url"
          name="link"
          placeholder="LeetCode Link"
          value={form.link}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="code"
          placeholder="Code (Java)"
          value={form.code}
          onChange={handleChange}
          required
          rows={5}
          className="w-full p-2 border rounded font-mono"
        />
        <textarea
          name="explanation"
          placeholder="Explanation"
          value={form.explanation}
          onChange={handleChange}
          required
          rows={3}
          className="w-full p-2 border rounded"
        />

        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Difficulty</option>
          <option value="Easy">🟢 Easy</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Hard">🔴 Hard</option>
        </select>

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated, e.g., Array, Greedy)"
          value={form.tags}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Update Problem
        </button>
      </form>
    </div>
  );
}

export default EditProblem;
