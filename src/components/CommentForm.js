import axios from "axios";
import { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useToasts } from "react-toast-notifications";
import useUser from "../utils/useUser";
const CommentForm = ({ uid, mutate }) => {
  const { addToast } = useToasts();
  const user = useUser();
  const textarea = useRef();
  const addComment = e => {
    e.preventDefault();
    if (textarea.current.value.trim().length === 0) {
      addToast("Textarea cannot be empty");
    } else {
      axios
        .post(
          `https://snippets-backend-api.herokuapp.com/api/snippets/${uid}/comments`,
          { message: textarea.current.value.trim() },
          { headers: { Authorization: `Token ${user.token}` } }
        )
        .then(res => {
          mutate();
          textarea.current.value = "";
        })
        .catch(err =>
          addToast("Something went wrong", { appearance: "error" })
        );
    }
  };
  return (
    <form onSubmit={addComment}>
      <TextareaAutosize
        required
        ref={textarea}
        placeholder="Leave a comment"
        className="border rounded-md bg-gray-900 border-gray-600 text-gray-100 p-2 text-sm w-full focus:border-blue-500 resize-none"
        minRows={4}
      />
      <button
        className="text-sm mt-1 px-5 py-2 text-white bg-green-600 rounded-md outline-none focus:outline-none"
        type="submit"
      >
        Comment
      </button>
    </form>
  );
};
export default CommentForm;
