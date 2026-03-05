import { Route, Routes } from "react-router-dom";
import PollList from "./pages/Dashboard/Dashboard";
import PollPage from "./pages/PollPage/PollPage";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ProtectedRoute from "./components/atoms/ProtectedRoute";
import CreatePoll from "./pages/CreatePoll/CreatePoll";
import SharePoll from "./pages/SharePoll/SharePoll";
import NavBar from "./components/organisms/NavBar";
import EditPoll from "./pages/EditPoll/EditPoll";
import Home from "./pages/Home/Home";

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute onlyGuest>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute onlyGuest>
                <Signup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute onlyGuest>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PollList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePoll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/polls/:id/share"
            element={
              <ProtectedRoute>
                <SharePoll />
              </ProtectedRoute>
            }
          />
          <Route path="/poll/:id" element={<PollPage />} />
          <Route path="/poll/:id/edit" element={<EditPoll />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
