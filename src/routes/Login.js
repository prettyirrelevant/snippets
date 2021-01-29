import { useFormik } from "formik";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Link, navigate } from "@reach/router";
import { useState } from "react";
import { useToasts } from "react-toast-notifications";

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = "This field is required";
  }

  if (!values.password) {
    errors.password = "This field is required";
  }

  return errors;
};

const Login = () => {
  const { addToast } = useToasts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate,
    onSubmit: values => {
      setIsSubmitting(true);
      axios
        .post("https://snippets-backend-api.herokuapp.com/api/users/login", {
          ...values,
        })
        .then(response => {
          setIsSubmitting(false);
          localStorage.clear();
          localStorage.setItem("user", JSON.stringify(response.data));
          navigate("/", { replace: true }).then(
            addToast("Logged in successfully", { appearance: "success" })
          );
        })
        .catch(error => {
          setIsSubmitting(false);
          if (error.response.status === 400) {
            addToast("Username and/or password mismatch!", {
              appearance: "error",
            });
          } else {
            addToast(error.response.data, {
              appearance: "error",
            });
          }
        });
    },
  });
  return (
    <div className="mt-40 mx-auto lg:px-56 px-8 container">
      {isSubmitting ? <Spinner /> : null}
      <h1 className="uppercase text-center text-gray-50 font-extrabold text-2xl">
        log in
      </h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col my-6">
          <label
            className="text-gray-100 pb-1 font-medium tracking-wider"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className={
              "rounded-lg  bg-gray-800 border-2 border-gray-100 p-2 text-gray-100 " +
              (formik.touched.username && formik.errors.username
                ? "border-red-400"
                : "focus:border-blue-400")
            }
            type="text"
            id="username"
            name="username"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username ? (
            <small className="text-red-400 text-sm pt-2">
              {formik.errors.username}
            </small>
          ) : null}
        </div>
        <div className="flex flex-col my-6">
          <label
            className="text-gray-100 pb-1 font-medium tracking-wider"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className={
              "rounded-lg  bg-gray-800 border-2 border-gray-100 p-2 text-gray-100 " +
              (formik.touched.password && formik.errors.password
                ? "border-red-400"
                : "focus:border-blue-400")
            }
            type="password"
            id="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <small className="text-red-400 text-sm pt-2">
              {formik.errors.password}
            </small>
          ) : null}
        </div>
        <button
          type="submit"
          className="bg-green-300 text-black rounded-lg px-6 py-2 font-medium tracking-wide outline-none focus:outline-none"
        >
          Login
        </button>
      </form>
      <p className="text-gray-100 text-center mt-6">
        Don't have an account?&nbsp;
        <Link className="text-blue-500 hover:underline" to="/register">
          Sign Up
        </Link>
      </p>
    </div>
  );
};
export default Login;
