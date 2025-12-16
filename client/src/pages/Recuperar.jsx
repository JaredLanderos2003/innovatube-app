import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import clienteAxios from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Mail } from 'lucide-react';
import { useEffect } from 'react';

function Recuperar() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  useEffect(() => {
    const escucharCambios = (evento) => {
      if (evento.key === 'recuperacion_completada') {
        toast.dismiss();
        toast.success('Redirigiendo...');
    
        setTimeout(() => {
             window.location.href = '/login';
        }, 1500);
      }
    };

    window.addEventListener('storage', escucharCambios);

    return () => window.removeEventListener('storage', escucharCambios);
  }, []);

  const alEnviar = async (datos) => {
    try {
      const loadingToast = toast.loading('Enviando correo...');
      
      await clienteAxios.post('/auth/recuperar', datos);
      
      toast.dismiss(loadingToast);
      toast.success('Correo enviado. Revisa tu bandeja de entrada.');
      
    } catch (error) {
      toast.dismiss();
      toast.error('Error al enviar. Intenta más tarde.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-slate-900 to-black p-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-md bg-slate-900/90 rounded-2xl shadow-2xl p-8 border border-slate-700 relative">
        
        <Link to="/login" className="absolute top-4 left-4 text-gray-500 hover:text-red-400 transition-colors">
            <ArrowLeft size={24} />
        </Link>

        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-300 drop-shadow-[0_0_12px_rgba(239,68,68,0.85)] mb-2 mt-4">
          Recuperar Cuenta
        </h2>
        
        <p className="text-gray-400 text-center mb-8 text-sm px-4">
          Ingresa tu correo electrónico y te enviaremos un enlace seguro para recuperar tu acceso.
        </p>

        <form onSubmit={handleSubmit(alEnviar)} className="space-y-6">
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="email" 
              {...register("correo", { required: true })} 
              className="w-full bg-slate-800 text-white rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-red-500/70 border border-slate-700 placeholder-gray-500" 
              placeholder="tu@correo.com" 
            />
            {errors.correo && <span className="text-red-400 text-xs mt-1 block">El correo es obligatorio</span>}
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-red-600/40">
            Enviar Enlace de Recuperación
          </button>
        </form>

      </div>
    </div>
  );
}

export default Recuperar;