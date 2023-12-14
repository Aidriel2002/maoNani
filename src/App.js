import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import Auth from "./components/pages/auth/Auth";
import Navbar from "./components/navbar/Navbar";
import Dashboard from "./components/pages/todo/Dashboard";
import RecycleBin from "./components/pages/todo/RecycleBin";
import CompletedTasks from './components/pages/todo/CompletedTasks';

function App() {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
      }

      setUser(user);
    });
    return () => unsubscribe();
  }, []);


 

  return (
    <>
      {user ? (
        <Router>
          <Navbar user={user}/>
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/completed" element={< CompletedTasks />} />
            <Route path="/trash" element={<RecycleBin />} />
          </Routes>
        </Router>
        
      ) : (
        <Auth />
      )}
      
    </>
  );
}

export default App;