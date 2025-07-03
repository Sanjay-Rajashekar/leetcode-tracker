import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Link } from 'react-router-dom';


function EditProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: '',
    link: '',
    code: '',
    explanation: '',
    difficulty: '',
    tags: '',
  });

  useEffect(() => {
    const fetchProblem = async () => {
      const ref = doc(db, 'problems', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          ...data,
          tags: data.tags?.join(', ') || '',
        });
      } else {
        alert('Problem not found.');
        navigate('/problems');
      }
    };
    fetchProblem();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'problems', id), {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()),
      });
      setSuccess(true);
      setTimeout(() => {
      navigate('/problems');
      }, 1500);
    } catch (err) {
      console.error('Error updating:', err);
      alert('Failed to update the problem.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-indigo-600 mb-4">✏️ Edit Problem</h1>
      <Link
        to="/problems"
        className="inline-block mb-4 text-blue-600 hover:underline"
      >
        ← Back to Problems
      </Link>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          Problem updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          placeholder="Problem Title"
        />
        <input
          type="url"
          name="link"
          value={form.link}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          placeholder="LeetCode Link"
        />
        <textarea
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          rows={5}
          className="w-full p-2 border rounded font-mono"
          placeholder="Code"
        />
        <textarea
          name="explanation"
          value={form.explanation}
          onChange={handleChange}
          required
          rows={3}
          className="w-full p-2 border rounded"
          placeholder="Explanation"
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
          value={form.tags}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Tags (comma-separated)"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProblem;
