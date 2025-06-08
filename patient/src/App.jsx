import './App.css';
import '../src/styles.css';
import { useAuthContext } from "./hooks/useAuthContext";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Centers from './pages/Centers';
import Doctors from './pages/Doctors';
import DoctorDetails from './pages/DoctorDetails';
import CenterDocs from './pages/CenterDocs';
import AppointmentsPage from './pages/AppointmentsPage';
import ExamPage from './pages/ExamPage';
import RadiologyPage from './pages/RdiologyPage';

function App() {
  const { dispatch, auth } = useAuthContext();
  
  useEffect(() => {
    if(localStorage.length > 0){
      dispatch({type: "LOGIN", payload: JSON.parse(localStorage.getItem("auth"))})
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={!auth ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!auth ? <Signup /> : <Navigate to="/" />} />
          
          {/* Protected routes using layout with sidebar */}
          <Route path="/" element={auth ? <Home /> : <Navigate to="/login" />}>
            <Route index element={<AppointmentsPage />} />
            <Route path="centers" element={<Centers />} />
            <Route path="centers/:id" element={<CenterDocs />} />
            <Route path="doctors/:id" element={<DoctorDetails />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="exams" element={<ExamPage />} />
            <Route path="radiology" element={<RadiologyPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;