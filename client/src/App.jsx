import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registro from './pages/Registro';
import Login from './pages/Login'; 
import Panel from './pages/Panel';
import Favoritos from './pages/Favoritos';
import Recuperar from './pages/Recuperar';
import Restablecer from './pages/Restablecer';


function Inicio() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white flex flex-col items-center justify-center p-4">
      
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-10 text-center">

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text 
          bg-gradient-to-r from-red-600 via-red-500 to-red-300 
          mb-4 drop-shadow-[0_0_16px_rgba(239,68,68,0.85)]">
          InnovaTube
        </h1>

        <p className="text-xl font-medium text-gray-300 mb-8">
          Busca los mejores videos de Youtube
        </p>

        <div className="space-x-4">
          <a
            href="/login"
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-slate-700"
          >
            Iniciar Sesión
          </a>

          <a
            href="/registro"
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md shadow-red-600/30"
          >
            Crear Cuenta
          </a>
        </div>

      </div>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/restablecer/:token" element={<Restablecer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;