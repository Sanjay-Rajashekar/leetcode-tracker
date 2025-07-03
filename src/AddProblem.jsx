import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Link } from 'react-router-dom';


function AddProblem() {
  const [form, setForm] = useState({
    title: '',
    link: '',
    code: '',
    explanation: '',
    difficulty: '',
    tags: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'problems'), {
        title: form.title,
        link: form.link,
        code: form.code,
        explanation: form.explanation,
        difficulty: form.difficulty,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: serverTimestamp(),
      });

      setForm({
        title: '',
        link: '',
        code: '',
        explanation: '',
        difficulty: '',
        tags: '',
      });

      navigate('/problems');
    } catch (error) {
      console.error('Error adding problem:', error);
      alert('Error saving problem to Firestore.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-teal-600 mb-4">➕ Add New Problem</h1>
      <Link
        to="/problems"
        className="inline-block mb-4 text-blue-600 hover:underline"
      >
        ← Back to Problems
      </Link>

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
        
        {/* Difficulty Dropdown */}
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

        {/* Tags Input */}
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
          Add Problem
        </button>
      </form>
    </div>
  );
}

export default AddProblem;
