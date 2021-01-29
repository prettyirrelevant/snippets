import CodeBlock from "../components/CodeBlock";
import Header from "../components/Header";
import NotFound from "../components/NotFound";
import Spinner from "../components/Spinner";
import useMultipleFetch from "../utils/useMultipleFetch";

const Home = () => {
  const { data, isLoading, isError } = useMultipleFetch(
    `https://snippets-backend-api.herokuapp.com/api/snippets`
  );

  if (isError) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main className="mt-4 mx-auto lg:px-56 px-8 container">
      <Header />
      <hr className="mt-2 border-t-2 border-gray-500" />
      <div className="mt-6">
        {data.map((el, i) => (
          <CodeBlock key={i} {...el} />
        ))}
      </div>
    </main>
  );
};

export default Home;
