import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/axios'; 
import toast, { Toaster } from 'react-hot-toast'; 
import { LogOut, Search, PlayCircle } from 'lucide-react';

function Panel() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [videos, setVideos] = useState([]); 
  const [cargando, setCargando] = useState(false); 
  
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
      toast.error('Error al buscar videos. Intenta de nuevo.');
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Toaster position="top-center" />
      <nav className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            InnovaTube
          </h1>
          <button 
            onClick={salir}
            className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-red-600/20 px-4 py-2 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span>Salir</span>
          </button>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto p-6">
        
        <div className="flex justify-center mb-10 mt-4">
          <form onSubmit={buscarVideos} className="w-full max-w-2xl relative flex gap-2">
            <input 
              type="text"
              placeholder="Buscar videos (ej. Messi, Programación, Música)..."
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-full py-4 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-lg"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search className="absolute left-4 top-5 text-gray-400" size={24} />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg"
            >
              Buscar
            </button>
          </form>
        </div>

        {cargando && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Buscando en YouTube...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id.videoId} className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-700 group">
              
              <div className="relative aspect-video">
                <img 
                  src={video.snippet.thumbnails.high.url} 
                  alt={video.snippet.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle size={48} className="text-white" />
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white">
                  {video.snippet.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {video.snippet.description}
                </p>
                
                <button className="w-full mt-2 border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white py-2 rounded-lg transition-colors text-sm font-semibold">
                   Agregar a Favoritos
                </button>
              </div>
            </div>
          ))}
        </div>

        {!cargando && videos.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl">Que quieres ver hoy?</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Panel;