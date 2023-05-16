import { useForm } from 'react-hook-form';
import { apiClient } from '../lib/api-client';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuthUser from '../data/use-auth';

export default function LoginWrapper() {
  const { data: user, isLoading } = useAuthUser();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <Login />;
}

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await apiClient.post(
        '/auth/login',
        new URLSearchParams({
          username: data.username,
          password: data.password,
        })
      );
      navigate('/');
    } catch {
      window.alert('Błędny login lub hasło');
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mt-10">
              <div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nazwa użytkownika
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register('username', { required: true })}
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Hasło
                    </label>
                    <div className="mt-2">
                      <input
                        type="password"
                        {...register('password')}
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                    >
                      Zaloguj się
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://placekitten.com/g/1500/1000"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
