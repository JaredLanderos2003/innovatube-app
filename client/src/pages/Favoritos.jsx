import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clienteAxios from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { Trash2, PlayCircle, ArrowLeft } from 'lucide-react';

function Favoritos() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const cargarFavoritos = async () => {
    try {
      const respuesta = await clienteAxios.get('/favoritos');
      setVideos(respuesta.data);
    } catch (error) {
      toast.error('Error al cargar tus videos favoritos');
    }
  };

  const eliminarFavorito = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este video?')) return;

    try {
      await clienteAxios.delete(`/favoritos/${id}`);
      toast.success('Video eliminado');
      cargarFavoritos(); 
    } catch (error) {
      toast.error('Error al eliminar el video');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white">
      <Toaster position="top-center" />

      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          
          <Link to="/panel" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 font-medium">
            <ArrowLeft size={20} /> Volver al Buscador
          </Link>
          
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-500 to-red-300 drop-shadow-[0_0_12px_rgba(239,68,68,0.85)]">
            Mis Favoritos
          </h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        
        {videos.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-500 mb-4">Aún no tienes favoritos</h2>
            <Link to="/panel" className="text-red-400 hover:text-red-300 hover:underline transition-colors text-lg">
              Buscar videos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((fav) => (
              <div key={fav.id} className="bg-slate-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-slate-800 hover:border-red-500/30 transition-all hover:-translate-y-2 group flex flex-col h-full">
                
                <div className="relative aspect-video">
                  <img src={fav.imagenUrl} alt={fav.titulo} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle size={48} className="text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-100">{fav.titulo}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{fav.descripcion}</p>
                  
                  <button 
                    onClick={() => eliminarFavorito(fav.id)}
                    className="w-full flex items-center justify-center gap-2 border border-red-600/50 text-red-500 hover:bg-red-600 hover:text-white py-2 rounded-lg transition-all font-semibold shadow-sm hover:shadow-red-900/50"
                  >
                    <Trash2 size={18} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoritos;