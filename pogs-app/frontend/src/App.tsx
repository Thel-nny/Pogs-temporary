import LoginForm from './pages/login';
import SignUpForm from './pages/signup';
import Form from './pages/showpogs';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import PogsForm from './pages/pogsform';


function App() {
 return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/signup' element={<SignUpForm />} />
          <Route path='/showpogs' element={<Form />} />
          <Route path='/pogsform' element={<PogsForm/>}/>
        </Routes>
      </BrowserRouter>
    </>
 );
}

export default App;
