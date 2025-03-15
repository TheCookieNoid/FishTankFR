
import Preorder from './components/LandingPage/LandingPage.jsx';
import Homepage from './components/LandingPage/HomePage.jsx';
import MainPage from './components/LandingPage/LoginPage.jsx';
import { Routes,Route } from 'react-router-dom';
import Login from './components/LandingPage/Login.jsx';

function App() {

    return(
        <>
        <MainPage/>
        <Routes>
            <Route path='/login'
            element = {<Login/>}/>
        </Routes>
        </>
    );
}

export default App
