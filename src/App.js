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
import EditSnippet from "./routes/EditSnippet";

const App = () => {
  return (
    <ToastProvider
      autoDismiss={true}
      autoDismissTimeout={2000}
      placement="bottom-center"
    >
      <Navbar />
      <Router>
        <NotFound default />
        <Home path="/" />
        <Profile path=":username" />
        <Snippet path=":username/:snippetUid" />
        <EditSnippet path=":username/:snippetUid/edit" />
        <Register path="register" />
        <Login path="login" />
        <AddSnippet path="add" />
      </Router>
    </ToastProvider>
  );
};

export default App;
