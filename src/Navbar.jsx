import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <Link to="/" className="text-white text-xl font-bold">LeetCode Tracker</Link>

      <div className="space-x-4">
        <Link to="/problems" className="text-white">Problems</Link>
        <Link to="/about" className="text-white">About</Link>

        {currentUser ? (
          <>
            <button onClick={handleLogout} className="text-white">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white">Login</Link>
            <Link to="/signup" className="text-white">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
