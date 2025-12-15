import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import clienteAxios from '../api/axios';
import toast, { Toaster } from 'react-hot-toast'; // Alertas chulas

function Registro() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
  
    const alEnviar = async (datos) => {
      try {
        const respuesta = await clienteAxios.post('/auth/registro', datos);
  
        toast.success('¡Cuenta creada con éxito!');
  
        setTimeout(() => {
          navigate('/login');
        }, 4000);
  
      } catch (error) {
        console.log(error);
        if (error.response && error.response.data) {
          toast.error(error.response.data.mensaje);
        } else {
          toast.error('Ocurrió un error inesperado.');
        }
      }
    };
  
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-black via-slate-900 to-black p-4">
        <Toaster position="top-center" reverseOrder={false} />
  
        <div className="w-full max-w-md bg-slate-900/90 rounded-2xl shadow-2xl p-8 border border-slate-700">
  
          <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text
            bg-gradient-to-r from-red-600 via-red-500 to-red-300
            drop-shadow-[0_0_12px_rgba(239,68,68,0.85)] mb-6">
            Crea tu cuenta
          </h2>
  
          <form onSubmit={handleSubmit(alEnviar)} className="space-y-4">
  
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-gray-400 mb-1 text-sm">Nombre</label>
                <input
                  type="text"
                  {...register("nombre", { required: true })}
                  className="w-full bg-slate-800 text-white rounded-lg p-2.5
                    border border-slate-700
                    focus:outline-none focus:ring-2 focus:ring-red-500/70"
                />
                {errors.nombre && <span className="text-red-400 text-xs">Requerido</span>}
              </div>
  
              <div className="w-1/2">
                <label className="block text-gray-400 mb-1 text-sm">Apellido</label>
                <input
                  type="text"
                  {...register("apellido", { required: true })}
                  className="w-full bg-slate-800 text-white rounded-lg p-2.5
                    border border-slate-700
                    focus:outline-none focus:ring-2 focus:ring-red-500/70"
                />
              </div>
            </div>
  
            <div>
              <label className="block text-gray-400 mb-1 text-sm">Nombre de usuario</label>
              <input
                type="text"
                {...register("nombreUsuario", { required: true })}
                className="w-full bg-slate-800 text-white rounded-lg p-2.5
                  border border-slate-700
                  focus:outline-none focus:ring-2 focus:ring-red-500/70"
              />
            </div>
  
            <div>
              <label className="block text-gray-400 mb-1 text-sm">Correo electrónico</label>
              <input
                type="email"
                {...register("correo", { required: true })}
                className="w-full bg-slate-800 text-white rounded-lg p-2.5
                  border border-slate-700
                  focus:outline-none focus:ring-2 focus:ring-red-500/70"
              />
            </div>
  
            <div>
              <label className="block text-gray-400 mb-1 text-sm">Contraseña</label>
              <input
                type="password"
                {...register("contrasena", { required: true, minLength: 6 })}
                className="w-full bg-slate-800 text-white rounded-lg p-2.5
                  border border-slate-700
                  focus:outline-none focus:ring-2 focus:ring-red-500/70"
              />
              {errors.contrasena && (
                <span className="text-red-400 text-xs">Mínimo 6 caracteres</span>
              )}
            </div>
  
            <div>
              <label className="block text-gray-400 mb-1 text-sm">Confirmar contraseña</label>
              <input
                type="password"
                {...register("confirmarContrasena", { required: true })}
                className="w-full bg-slate-800 text-white rounded-lg p-2.5
                  border border-slate-700
                  focus:outline-none focus:ring-2 focus:ring-red-500/70"
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3
                rounded-lg transition-all mt-4 shadow-lg shadow-red-600/40"
            >
              Registrarme
            </button>
          </form>
  
          <p className="text-gray-400 text-center mt-6 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-red-400 hover:text-red-300 hover:underline">
              Inicia sesión
            </Link>
          </p>
  
        </div>
      </div>
    );
  }
  

export default Registro;