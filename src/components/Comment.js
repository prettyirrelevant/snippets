import axios from "axios";
import moment from "moment";
import { useToasts } from "react-toast-notifications";
import useUser from "../utils/useUser";
const Comment = ({ message, timestamp, user, id, uid, mutate }) => {
  const { addToast } = useToasts();
  const loggedInUser = useUser();
  const deleteComment = e => {
    axios
      .delete(
        `https://snippets-backend-api.herokuapp.com/api/snippets/${uid}/comments/${e.currentTarget.dataset.id}`,
        { headers: { Authorization: `Token ${loggedInUser.token}` } }
      )
      .then(res => mutate())
      .catch(err => {
        addToast("Something went wrong", { appearance: "error" });
      });
  };
  return (
    <div className="flex my-4">
      {/* Image */}
      <img
        className="hidden md:block w-8 rounded-full -mt-10"
        src={user.profile_picture}
        alt=""
      />

      {/* Comment */}
      <div className="w-full border border-gray-600 rounded-md md:ml-2 break-words">
        <header className="flex justify-between px-3 py-2 text-gray-200 text-sm border-b border-gray-600 bg-gray-700 font-medium">
          <p>
            <img
              className="md:hidden inline mr-1 w-5 rounded-full"
              src={user.profile_picture}
              alt=""
            />
            {user.username}{" "}
            <span className="text-gray-400 font-normal">
              commented {moment(timestamp).fromNow()}
            </span>
          </p>
          {!loggedInUser ? null : loggedInUser.user.username ===
            user.username ? (
            <button
              data-id={id}
              onClick={deleteComment}
              className="cursor-pointer outline-none focus:outline-none"
            >
              <svg
                className="w-5 text-red-500"
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
            </button>
          ) : null}
        </header>
        <p className="px-4 py-2 text-sm text-gray-200">{message}</p>
      </div>
    </div>
  );
};

export default Comment;
