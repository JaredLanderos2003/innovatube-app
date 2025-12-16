import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import clienteAxios from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
  
    const alEnviar = async (datos) => {
      try {
        const respuesta = await clienteAxios.post('/auth/login', datos);
        
  
        localStorage.setItem('token', respuesta.data.token);
        localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario));
        toast.success('Bienvenido!!!');
  
        setTimeout(() => {
          navigate('/panel');
        }, 1500);
  
      } catch (error) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.mensaje);
        } else {
          toast.error('Error al iniciar sesión.');
        }
      }
    };
  
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-black via-slate-900 to-black p-4">
        <Toaster position="top-center" />
  
        <div className="w-full max-w-md bg-slate-900/90 rounded-2xl shadow-2xl p-8 border border-slate-700">
  
          <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text
            bg-gradient-to-r from-red-600 via-red-500 to-red-300
            drop-shadow-[0_0_12px_rgba(239,68,68,0.85)] mb-2">
            Iniciar sesión
          </h2>
  
          <p className="text-gray-400 text-center mb-6">
            Ingresa a tu cuenta de InnovaTube
          </p>
  
          <form onSubmit={handleSubmit(alEnviar)} className="space-y-5">
  
            <div>
              <label className="block text-gray-400 mb-1 text-sm">
                Usuario o correo
              </label>
              <input
                type="text"
                {...register("identificador", { required: true })}
                className="w-full bg-slate-800 text-white rounded-lg p-3
                  focus:outline-none focus:ring-2 focus:ring-red-500/70
                  border border-slate-700"
                placeholder="ej. juanperez"
              />
              {errors.identificador && (
                <span className="text-red-400 text-xs">Este campo es obligatorio</span>
              )}
            </div>
  
            <div>
              <label className="block text-gray-400 mb-1 text-sm">
                Contraseña
              </label>
              <input
                type="password"
                {...register("contrasena", { required: true })}
                className="w-full bg-slate-800 text-white rounded-lg p-3
                  focus:outline-none focus:ring-2 focus:ring-red-500/70
                  border border-slate-700"
                placeholder="••••••"
              />
              {errors.contrasena && (
                <span className="text-red-400 text-xs">Ingresa tu contraseña</span>
              )}
            </div>
            <div className="flex justify-center mb-6 mt-2">
                <Link 
                  to="/recuperar" 
                  className="text-sm text-gray-400 hover:text-red-400 hover:underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3
                rounded-lg transition-all shadow-lg shadow-red-600/40"
            >
              Entrar
            </button>
          </form>
  
          <p className="text-gray-400 text-center mt-8 text-sm">
            ¿No tienes cuenta?{" "}
            <Link
              to="/registro"
              className="text-red-400 hover:text-red-300 hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
  
        </div>
      </div>
    );
  }
  
export default Login;