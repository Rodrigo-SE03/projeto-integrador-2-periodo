import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Dispositivo from './pages/Dispositivo/Dispositivo';

function AppRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/dispositivo" element={<Dispositivo/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;