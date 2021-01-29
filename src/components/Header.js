const Header = () => {
  return (
    <header className="text-gray-100">
      <svg
        className="inline-block w-8"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
      <span className="ml-2 tracking-widest font-extrabold inline-block">
        Discover
      </span>
    </header>
  );
};

export default Header;
