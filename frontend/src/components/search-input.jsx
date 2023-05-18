import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function SearchInput() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      navigate(`/search?query=${data.query}`, );
      reset();
    } catch {}
  };

  return (
    <div className='flex'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder='Wyszukaj'
            {...register('query', { required: true })}
            className="block h-6 w-full py-1.5 ring-inset border-0 border-b ring-0 placeholder:text-gray-400 focus:ring-inset focus:border-cyan-600 focus:ring-0 sm:text-sm sm:leading-6"
          />
        </form>
    </div>
  );
}
