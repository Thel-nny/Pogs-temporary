import LoginForm from './pages/login';
import SignUpForm from './pages/signup';
import UserPogsPurchased from './pages/showUserPogs';
import UserPogs from './pages/userPogs';
import AdminSide from './pages/adminSide';
import ChangePogsForm from './pages/updatepogs'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import PogsForm from './pages/pogsform';


function App() {
 return (
    <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/signup' element={<SignUpForm />} />
          <Route path='/pogsform' element={<PogsForm/>}/>
          <Route path='/userPogs' element={<UserPogs/>}/>
          <Route path='/adminSide' element={<AdminSide/>}/>
          <Route path='/showUserPogs' element={<UserPogsPurchased/>} />
          <Route path='/updatepogs' element={<ChangePogsForm/>} />
        </Routes>
      </BrowserRouter>
 );
}

export default App;
