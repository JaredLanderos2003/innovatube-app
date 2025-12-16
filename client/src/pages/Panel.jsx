import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/axios'; 
import toast, { Toaster } from 'react-hot-toast'; 
import { LogOut, Search, PlayCircle, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';

function Panel() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [videos, setVideos] = useState([]); 
  const [cargando, setCargando] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Usuario' };
  
  const salir = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const buscarVideos = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) return;

    try {
      setCargando(true);
      const respuesta = await clienteAxios.get(`/videos/buscar?busqueda=${busqueda}`);
      setVideos(respuesta.data);
      setCargando(false);

    } catch (error) {
      console.error(error);
      toast.error('Error al buscar videos.');
      setCargando(false);
    }
  };

  const handleFavorito = async (video) => {
    try {
        const datosVideo = {
            videoId: video.id.videoId,
            titulo: video.snippet.title,
            descripcion: video.snippet.description,
            imagenUrl: video.snippet.thumbnails.high.url
        };

        await clienteAxios.post('/favoritos', datosVideo);
        toast.success('Agregado a tus favoritos');

    } catch (error) {
        if (error.response && error.response.data) {
            toast.error(error.response.data.mensaje);
        } else {
            toast.error('Error al guardar.');
        }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white">
      <Toaster position="top-center" />
      
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-500 to-red-300 drop-shadow-[0_0_12px_rgba(239,68,68,0.85)]">
            InnovaTube
          </h1>
          
          <div className="flex items-center gap-4 md:gap-6">
            
          
            <Link 
            to="/favoritos" 
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors font-semibold"
            >
            <Star size={20} /> 
            <span className="hidden sm:block text-sm">Mis Favoritos</span>
            </Link>

            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full shadow-sm">
                <div className="bg-red-600 p-1 rounded-full">
                    <User size={18} className="text-white" />
                </div>
                <span className="font-medium text-gray-200 text-sm">
                    Hola, {usuario.nombre}
                </span>
            </div>

            <button 
              onClick={salir}
              className="text-red-500 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-full transition-all"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        
        <div className="flex justify-center mb-10 mt-4">
          <form onSubmit={buscarVideos} className="w-full max-w-2xl relative flex gap-2">
            <input 
              type="text"
              placeholder="Buscar videos (ej. Messi, Programación)..."
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-full py-4 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-red-500/70 text-lg shadow-xl placeholder-gray-500"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search className="absolute left-4 top-5 text-gray-400" size={24} />
            
            <button 
              type="submit" 
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-red-600/40"
            >
              Buscar
            </button>
          </form>
        </div>

        {cargando && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Buscando...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id.videoId} className="bg-slate-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-slate-800 hover:border-red-500/30 transition-all hover:-translate-y-2 group flex flex-col h-full">
              
              <div className="relative aspect-video">
                <img 
                  src={video.snippet.thumbnails.high.url} 
                  alt={video.snippet.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle size={48} className="text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-100">
                  {video.snippet.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                  {video.snippet.description}
                </p>
                
                <button 
                onClick={() => handleFavorito(video)} 
                className="w-full mt-2 border border-red-600/50 text-red-400 hover:bg-red-600 hover:text-white py-2 rounded-lg transition-all text-sm font-semibold shadow-sm hover:shadow-red-900/50 flex items-center justify-center gap-2">
                    <Star size={16} /> Agregar a Favoritos
                </button>
              </div>
            </div>
          ))}
        </div>

        {!cargando && videos.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl">¿Qué quieres buscar hoy?</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Panel;