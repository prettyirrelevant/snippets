import { Link, navigate, useParams } from "@reach/router";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/theme/material-ocean.css";
import cm from "../CM";
import "codemirror/mode/meta";
import { useRef } from "react";
import { useToasts } from "react-toast-notifications";
import {
  adjectives,
  animals,
  NumberDictionary,
  uniqueNamesGenerator,
} from "unique-names-generator";
import useUser from "../utils/useUser";
import axios from "axios";
import useSingleFetch from "../utils/useSingleFetch";
import NotFound from "../components/NotFound";
import Spinner from "../components/Spinner";

const EditSnippet = () => {
  const params = useParams();
  const { addToast } = useToasts();
  const fileName = useRef();
  const codeEditor = useRef();
  const _description = useRef();
  const { data, isLoading, isError } = useSingleFetch(
    `https://snippets-backend-api.herokuapp.com/api/snippets/${params.snippetUid}`
  );
  const _fileName = uniqueNamesGenerator({
    dictionaries: [
      adjectives,
      animals,
      NumberDictionary.generate({ min: 1, max: 999 }),
    ],
    length: 3,
    separator: "-",
  });
  const user = useUser();

  const loadMode = (editor, _) => {
    let val = data.name,
      m,
      mode,
      spec;
    console.log(data.name);
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

  const handleEdit = e => {
    e.preventDefault();
    const content = codeEditor.current.editor.getValue();
    if (!content) {
      addToast("Snippet content cannot be empty", { appearance: "error" });
    } else {
      const name = fileName.current.value || _fileName + ".txt";
      const description = _description.current.value || "";
      const content = codeEditor.current.editor.getValue();
      axios
        .put(
          `https://snippets-backend-api.herokuapp.com/api/snippets/${params.snippetUid}`,
          {
            name,
            description,
            content,
          },
          { headers: { Authorization: `Token ${user.token}` } }
        )
        .then(response => {
          navigate(`/${params.username}/${params.snippetUid}`).then(
            addToast(`Snippet updated successfully`, { appearance: "success" })
          );
        })
        .catch(error => {
          navigate(`/${params.username}/${params.snippetUid}`).then(
            addToast(`Snippet updated successfully`, { appearance: "success" })
          );
        });
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
      <div className="flex justify-between py-3">
        <p className="text-gray-100 font-medium md:text-xl break-all">
          Editing{" "}
          <Link
            className="text-blue-500 hover:underline"
            to={`/${params.username}/${params.snippetUid}`}
          >
            {data.name}
          </Link>
        </p>
        <button
          onClick={deleteSnippet}
          className="cursor-pointer text-red-500 rounded-md px-3 py-1 bg-gray-700 border border-gray-600 mr-2 hover:bg-red-500 hover:text-gray-100 hover:border-transparent"
        >
          <svg
            className="w-4 inline-block md:mr-1"
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
          <span className="hidden md:inline text-sm">Delete</span>
        </button>
      </div>
      <hr />

      {/* edit */}
      <div className="mt-4">
        <form onSubmit={handleEdit}>
          <input
            defaultValue={data.description}
            ref={_description}
            placeholder="Snippet description"
            className="bg-gray-900 px-3 py-1 text-sm text-gray-200 rounded-md border border-gray-700 w-full"
            type="text"
          />
          <div className="mt-3 border-gray-500 border rounded-md">
            <input
              defaultValue={data.name}
              ref={fileName}
              placeholder="Filename including extension..."
              className="bg-gray-800 my-2 mx-2 px-3 py-1 text-sm text-gray-200 rounded-md border border-gray-700"
              type="text"
            />
            <div
              className="border-t border-gray-700 h-full"
              style={{ overflow: "none" }}
            >
              <CodeMirror
                value={data.content}
                ref={codeEditor}
                width="100%"
                height="400px"
                options={{
                  theme: "material-ocean",
                }}
                onChange={loadMode}
              />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <Link
              to={`/${params.username}/${params.snippetUid}`}
              className="bg-red-500 rounded-lg px-4 py-2 text-gray-100 font-bold tracking-wider text-sm outline-none focus:outline-none mr-2"
            >
              Cancel
            </Link>
            <button className="bg-green-500 rounded-lg px-4 py-2 text-gray-100 font-bold tracking-wider text-sm outline-none focus:outline-none">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSnippet;
