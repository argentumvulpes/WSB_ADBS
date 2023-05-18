import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { MAIN_POSTS } from '../data/use-main-posts';
import { createPost } from '../data/post';

export default function PostInput() {
  const { register, handleSubmit, reset } = useForm();

  const queryClient = useQueryClient();

  const onSubmit = async (data) => {
    try {
      await createPost(data.content);
      await queryClient.invalidateQueries([MAIN_POSTS]);
      reset();
    } catch {
      window.alert('Wystąpił błąd');
    }
  };

  return (
    <>
      <div className="italic text-lg font-semibold text-gray-500">
        Napisz coś:
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            {...register('content', { required: true })}
            className="block w-full py-1.5 ring-inset border-0 border-b ring-0 placeholder:text-gray-400 focus:ring-inset focus:border-cyan-600 focus:ring-0 sm:text-sm sm:leading-6"
          />
        </form>
      </div>
    </>
  );
}
