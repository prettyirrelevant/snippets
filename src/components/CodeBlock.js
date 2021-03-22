import { Link } from "@reach/router";
import CodeMirror from "@uiw/react-codemirror";
import cm from "../CM";
import moment from "moment";
import "codemirror/theme/material-ocean.css";
import "codemirror/mode/meta";
import { useRef } from "react";
import Secret from "./Secret";

cm.modeURL =
  "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.59.2/mode/%N/%N.js";

const CodeBlock = ({
  user: { username, profile_picture },
  uid,
  stargazers_count,
  comment_set,
  created_on,
  name,
  secret,
  // description,
  content,
}) => {
  const editor = useRef(null);
  const loadMode = (editor, _) => {
    let val = name,
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

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="md:flex md:justify-between">
        <div className="mb-2">
          <span className="hidden md:inline-block">
            <img
              className="rounded-full w-10"
              src={profile_picture}
              alt="profile"
            />
          </span>
          <div className="md:px-2 inline-block">
            <span className="text-gray-200">
              <Link
                to={`/${username}`}
                className="text-blue-500 hover:underline"
              >
                {username}
              </Link>{" "}
              /{" "}
              <Link
                to={`${username}/${uid}`}
                className="text-blue-500 font-bold hover:underline"
              >
                {name}
              </Link>
              {secret && <Secret />}
            </span>
            <div className="text-gray-400 text-xs">
              Created {moment(created_on).fromNow()}
            </div>
          </div>
        </div>

        <ul className="text-gray-400 text-xs">
          <li className="inline-block mr-3">
            <svg
              className="w-4 inline mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            {comment_set.length} comments
          </li>
          <li className="inline-block">
            <svg
              className="w-4 inline mr-1"
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
            {stargazers_count} stars
          </li>
        </ul>
      </div>

      {/* add description in future */}
      {/* Code snippet */}
      <Link
        to={`${username}/${uid}`}
        style={{ height: "auto", maxHeight: "215px" }}
        className="block group relative mt-2 md:mt-1 border border-gray-600 rounded-md overflow-hidden hover:border-blue-500"
      >
        <CodeMirror
          ref={editor}
          width="100%"
          value={content}
          options={{
            theme: "material-ocean",
            readOnly: "nocursor",
            scrollbarStyle: null,
          }}
          onBeforeChange={loadMode}
        />
        <p className="opacity-0 absolute top-0 right-0 bg-blue-500 text-gray-100 px-2 py-1 text-xs group-hover:opacity-100">
          View <span className="font-bold">{name}</span>
        </p>
      </Link>
    </div>
  );
};
export default CodeBlock;
