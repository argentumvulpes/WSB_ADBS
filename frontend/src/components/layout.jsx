import useAuthUser from '../data/use-auth';
import { Navigate } from 'react-router-dom';

export default function Layout({ children }) {
  const { data: user, isLoading } = useAuthUser();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div>
        <a href={`/`}>Strona główna</a>
      </div>
      {children}
    </div>
  );
}
