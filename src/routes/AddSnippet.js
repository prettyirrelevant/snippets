import { navigate, Redirect } from "@reach/router";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  NumberDictionary,
} from "unique-names-generator";
import CodeMirror from "@uiw/react-codemirror";
import cm from "../CM";
import "codemirror/mode/meta";
import "codemirror/theme/material-ocean.css";
import { useRef } from "react";
import { useToasts } from "react-toast-notifications";
import axios from "axios";

const AddSnippet = () => {
  const { addToast } = useToasts();
  const isSecret = useRef();
  const _description = useRef();
  const fileName = useRef();
  const codeEditor = useRef();
  const _fileName = uniqueNamesGenerator({
    dictionaries: [
      adjectives,
      animals,
      NumberDictionary.generate({ min: 1, max: 999 }),
    ],
    length: 3,
    separator: "-",
  });
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return <Redirect noThrow from="/add" to="/login" />;
  } else {
    const handleSubmit = e => {
      e.preventDefault();
      const content = codeEditor.current.editor.getValue();
      if (!content) {
        addToast("Snippet content cannot be empty", { appearance: "error" });
      } else {
        const name = fileName.current.value || _fileName + ".txt";
        const description = _description.current.value || "";
        const secret = isSecret.current.checked;
        console.log(secret);
        const content = codeEditor.current.editor.getValue();
        axios
          .post(
            "https://snippets-backend-api.herokuapp.com/api/snippets",
            {
              name,
              description,
              secret,
              content,
            },
            { headers: { Authorization: `Token ${user.token}` } }
          )
          .then(response => {
            navigate(
              `/${response.data.data.user.username}/${response.data.data.uid}`
            ).then(
              addToast(`${response.data.message}`, { appearance: "success" })
            );
          })
          .catch(error =>
            addToast("Sorry, something went wrong", { appearance: "error" })
          );
      }
    };

    const loadMode = (editor, _) => {
      let val = fileName.current.value,
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
      <div className="mt-12 mx-auto lg:px-56 px-8 container">
        <form onSubmit={handleSubmit}>
          <input
            ref={_description}
            placeholder="Snippet description"
            className="bg-gray-900 px-3 py-1 text-sm text-gray-200 rounded-md border border-gray-700 w-full"
            type="text"
          />
          <div className="mt-3 border-gray-500 border rounded-md">
            <input
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
          <div className="mt-2 flex justify-between">
            <div className="text-gray-100">
              <input
                ref={isSecret}
                className="form-checkbox rounded-sm mr-2"
                type="checkbox"
              />
              Make secret
            </div>
            <button className="bg-green-500 rounded-lg px-4 py-2 text-gray-100 font-bold tracking-wider text-sm outline-none focus:outline-none">
              Create snippet
            </button>
          </div>
        </form>
      </div>
    );
  }
};
export default AddSnippet;
