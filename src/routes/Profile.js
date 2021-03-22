import { useParams } from "@reach/router";
import CodeBlock from "../components/CodeBlock";
import NotFound from "../components/NotFound";
import Spinner from "../components/Spinner";
import useSingleFetch from "../utils/useSingleFetch";

const Profile = () => {
  const params = useParams();
  const { data, isLoading, isError } = useSingleFetch(
    `https://snippets-backend-api.herokuapp.com/api/users/${params.username}`
  );

  if (isError) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="mx-auto lg:px-56 px-8 container mt-4">
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
          All Gists ({data.length})
        </span>
      </header>
      <hr className="mt-2 border-t-2 border-gray-500" />
      <div className="mt-6">
        {data.map((el, i) => (
          <CodeBlock key={i} {...el} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
