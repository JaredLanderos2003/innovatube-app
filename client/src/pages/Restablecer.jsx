import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import clienteAxios from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { Lock, CheckCircle } from 'lucide-react';

function Restablecer() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { token } = useParams();

  const alEnviar = async (datos) => {
    try {
      await clienteAxios.post(`/auth/restablecer/${token}`, { nuevaContrasena: datos.contrasena });
      localStorage.setItem('recuperacion_completada', Date.now());
      toast.success('Contraseña actualizada con éxito');
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'El enlace no es válido o ya expiró.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-slate-900 to-black p-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-md bg-slate-900/90 rounded-2xl shadow-2xl p-8 border border-slate-700">
        
        <div className="flex justify-center mb-4">
            <div className="bg-red-600/20 p-3 rounded-full">
                <CheckCircle size={40} className="text-red-500" />
            </div>
        </div>

        <h2 className="text-2xl font-extrabold text-center text-white mb-2">
          Nueva Contraseña
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
            Crea una contraseña segura.
        </p>

        <form onSubmit={handleSubmit(alEnviar)} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="password" 
              {...register("contrasena", { required: true, minLength: 6 })} 
              className="w-full bg-slate-800 text-white rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-red-500/70 border border-slate-700 placeholder-gray-500" 
              placeholder="Nueva contraseña (mínimo 6 caracteres)" 
            />
            {errors.contrasena && <span className="text-red-400 text-xs mt-1 block">Mínimo 6 caracteres</span>}
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-red-600/40">
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}

export default Restablecer;