import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import User from './components/User/User';
import Auth from './components/Auth/Auth';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/users/:userId' element={<User />} />
          <Route path='/auth' element={
            localStorage.getItem("currentUser") ? <Navigate to="/" /> : <Auth />
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
