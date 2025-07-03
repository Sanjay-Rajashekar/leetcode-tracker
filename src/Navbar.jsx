function Navbar() {
  return (
    <nav className="bg-black text-white p-4 shadow-md flex justify-between">
      <div className="text-xl font-bold">Sanjay's LeetCode Tracker</div>
      <div className="space-x-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/problems" className="hover:underline">Problems</a>
        <a href="/about" className="hover:underline">About</a>
      </div>
    </nav>
  );
}

export default Navbar;
