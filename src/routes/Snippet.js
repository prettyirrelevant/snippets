import CodeMirror from "@uiw/react-codemirror";
import "codemirror/theme/material-ocean.css";
import cm from "../CM";
import "codemirror/mode/meta";
import moment from "moment";
import CommentForm from "../components/CommentForm";
import NotFound from "../components/NotFound";
import Spinner from "../components/Spinner";
import { Link, navigate, useParams } from "@reach/router";
import { useEffect, useRef, useState } from "react";
import useSingleFetch from "../utils/useSingleFetch";
import useUser from "../utils/useUser";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import Comment from "../components/Comment";

const Snippet = () => {
  const user = useUser();
  const [starred, setStarred] = useState();
  const { addToast } = useToasts();
  const params = useParams();
  const snippet = useRef();
  const { data, mutate, isLoading, isError } = useSingleFetch(
    `https://snippets-backend-api.herokuapp.com/api/snippets/${params.snippetUid}`
  );

  const focusCode = () => {
    snippet.current.focus();
  };

  const deleteSnippet = e => {
    axios
      .delete(
        `https://snippets-backend-api.herokuapp.com/api/snippets/${params.snippetUid}`,
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      )
      .then(res => {
        navigate("/", { replace: true }).then(
          addToast("Snippet deleted successfully!", { appearance: "success" })
        );
      })
      .catch(err => addToast("Something went wrong", { appearance: "error" }));
  };

  useEffect(() => {
    if (data) {
      setStarred(data.is_starred);
    }
  }, [data]);

  const handleStar = () => {
    if (!user) {
      addToast("You must to be logged in to star a snippet", {
        appearance: "warning",
      });
    } else {
      axios
        .post(
          `https://snippets-backend-api.herokuapp.com/api/stargazers/${params.snippetUid}`,
          null,
          {
            headers: { Authorization: `Token ${user.token}` },
          }
        )
        .then(res => {
          setStarred(true);
          mutate();
        })
        .catch(err =>
          addToast("Something went wrong", { appearance: "error" })
        );
    }
  };

  const handleUnstar = () => {
    axios
      .delete(
        `https://snippets-backend-api.herokuapp.com/api/stargazers/${params.snippetUid}`,
        {
          headers: { Authorization: `Token ${user.token}` },
        },
        null
      )
      .then(res => {
        setStarred(false);
        mutate();
      })
      .catch(err => addToast("Something went wrong", { appearance: "error" }));
  };

  const loadMode = (editor, _) => {
    let val = data.name,
      m,
      mode,
      spec;
    if ((m = /.+\.([^.]+)$/.exec(val))) {
      const info = cm.findModeByExtension(m[1]);
      if (info) {
        mode = info.mode;
        spec = info.mime;
      }
    } else if (/\//.test(val)) {
      const info = cm.findModeByMIME(val);
      if (info) {
        mode = info.mode;
        spec = val;
      }
    } else {
      mode = spec = val;
    }
    if (mode) {
      editor.setOption("mode", spec);
      cm.autoLoadMode(editor, mode);
    }
  };

  if (isError) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="mt-4 mx-auto lg:px-56 px-8 container">
      <div className="md:flex md:justify-between">
        <div className="mb-2">
          <span className="hidden md:inline-block">
            <img
              className="rounded-full w-10"
              src={data.user.profile_picture}
              alt="profile"
            />
          </span>
          <div className="md:px-2 inline-block">
            <span className="text-gray-200">
              <Link
                to={`/${data.user.username}`}
                className="text-blue-500 hover:underline"
              >
                {data.user.username}
              </Link>{" "}
              /{" "}
              <Link
                to={`/${data.user.username}/${data.uid}`}
                className="text-blue-500 font-bold hover:underline"
              >
                {data.name}
              </Link>
            </span>
            <div className="text-gray-400 text-xs">
              Created {moment(data.created_on).fromNow()}
            </div>
          </div>
        </div>

        <ul className="text-gray-400 text-xs mb-2 flex items-center">
          {!user ? null : user.user.username === data.user.username ? (
            <Link
              to={`/${data.user.username}/${data.uid}/edit`}
              className="cursor-pointer text-gray-100 rounded-md px-3 py-1 bg-gray-700 border border-gray-600 mr-2 hidden md:block hover:border-gray-500 hover:bg-gray-600"
            >
              <svg
                className="w-5 inline-block mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <span className="inline-block">Edit</span>
            </Link>
          ) : null}
          {!user ? null : user.user.username === data.user.username ? (
            <li
              onClick={deleteSnippet}
              className="cursor-pointer text-red-500 rounded-md px-3 py-1 bg-gray-700 border border-gray-600 mr-2 hidden md:block hover:bg-red-500 hover:text-gray-100 hover:border-transparent"
            >
              <svg
                className="w-5 inline-block mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="inline-block">Delete</span>
            </li>
          ) : null}

          <li className="rounded-md flex text-gray-300 bg-gray-700 justify-center overflow-hidden w-full md:w-auto">
            {starred ? (
              <button
                onClick={handleUnstar}
                className="border w-full md:rounded-tl-md md:rounded-bl-md border-gray-600 block py-1 px-3 focus:outline-none outline-none hover:border-gray-400 hover:bg-gray-600"
              >
                <svg
                  className="w-5 mr-1 inline"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Unstar
              </button>
            ) : (
              <button
                onClick={handleStar}
                className="border w-full md:rounded-tl-md md:rounded-bl-md border-gray-600 block py-1 px-3 focus:outline-none outline-none hover:border-gray-400"
              >
                <svg
                  className="w-4 mr-1 inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Star
              </button>
            )}
            <span className="hidden md:block border-t border-b border-r rounded-tr-md rounded-br-md border-gray-600 py-1 px-3 hover:text-blue-500 cursor-pointer font-bold">
              {data.stargazers_count}
            </span>
          </li>
        </ul>
      </div>
      <hr />

      <p className="mt-6 text-gray-300 mb-2 text-sm">{data.description}</p>
      <div
        ref={snippet}
        tabIndex="0"
        className="border border-gray-600 rounded-md overflow-hidden flex flex-col ring ring-gray-800 focus:ring-blue-600"
      >
        <div className="bg-gray-900 border-b border-gray-600">
          <p className="text-blue-500 font-jetbrains text-xs tracking-wide font-bold px-3 py-2">
            <svg
              className="w-4 inline-block text-gray-400 mr-2"
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
            <span
              onClick={focusCode}
              className="cursor-pointer hover:underline"
            >
              {data.name}
            </span>
          </p>
        </div>
        <CodeMirror
          value={data.content}
          width="100%"
          onBeforeChange={loadMode}
          // height="100%"
          options={{
            theme: "material-ocean",
            readOnly: "nocursor",
            scrollbarStyle: null,
          }}
        />
      </div>

      {/* Comments */}
      <div className="my-8">
        {data.comment_set.map((el, i) => (
          <Comment {...el} key={i} uid={data.uid} mutate={mutate} />
        ))}
        <hr className="my-4" />

        {user ? (
          <CommentForm uid={data.uid} mutate={mutate} />
        ) : (
          <p className="bg-yellow-200 px-4 py-5 rounded-md border border-yellow-300 text-sm">
            <Link
              className="bg-green-600 text-gray-100 px-4 py-2 rounded-lg hover:bg-green-700"
              to="/register"
            >
              Sign up for free
            </Link>{" "}
            <span className="font-medium">to leave a comment</span>. Already
            have an account?
            <Link className="text-blue-500 hover:underline pl-1" to="/login">
              Sign in to comment
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Snippet;
