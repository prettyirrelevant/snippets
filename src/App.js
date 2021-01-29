import { ToastProvider } from "react-toast-notifications";
import { Router } from "@reach/router";
import Navbar from "./components/Navbar";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import Snippet from "./routes/Snippet";
import AddSnippet from "./routes/AddSnippet";
import NotFound from "./components/NotFound";

const App = () => {
  return (
    <ToastProvider
      autoDismiss={true}
      autoDismissTimeout={2000}
      placement="bottom-center"
    >
      <Navbar />
      <Router>
        <Home path="/" />
        <Profile path=":username" />
        <Snippet path=":username/:snippetUid" />
        <Register path="register" />
        <Login path="login" />
        <AddSnippet path="add" />
        <NotFound default />
      </Router>
    </ToastProvider>
  );
};

export default App;
