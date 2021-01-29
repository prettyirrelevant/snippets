import { Link, navigate } from "@reach/router";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import useUser from "../utils/useUser";

const Navbar = () => {
  const { addToast } = useToasts();
  const user = useUser();
  const logout = e => {
    axios
      .get(
        "https://snippets-backend-api.herokuapp.com/api/users/logout_all",
        null,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then(response => {
        localStorage.clear();
        addToast("Logged out successfully!", { appearance: "success" });
        navigate("/", { replace: true });
      })
      .catch(error => {
        addToast("Something went wrong!", { appearance: "error" });
      });
  };
  return (
    <nav className="mt-4 mx-auto lg:px-56 px-8 container flex justify-between items-center">
      <Link
        to="/"
        className="text-gray-100 font-extrabold text-xl tracking-wider"
      >
        Snippets
      </Link>
      {user ? (
        <div className="flex">
          <Link to="/add" className="flex items-center">
            <svg
              className="text-gray-50 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </Link>
          <img
            className="inline-block w-6 mr-2"
            src={user.user.profile_picture}
            alt=""
          />
          <button
            onClick={logout}
            className="bg-red-500 rounded-lg px-4 py-2 text-gray-100 font-bold tracking-wider inline-block outline-none focus:outline-none"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          className="bg-blue-500 rounded-lg px-4 py-2 text-gray-100 font-bold tracking-wider"
          to="login"
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
