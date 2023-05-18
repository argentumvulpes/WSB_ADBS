import useAuthUser from "../data/use-auth";
import { Navigate } from "react-router-dom";
import SearchInput from "./search-input";

export default function Layout({ children }) {
  const { data: user, isLoading } = useAuthUser();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-2">
      <div className="flex">
        <a href={`/`}>Strona główna</a>
        <div className="ml-auto">
          <SearchInput />
        </div>
      </div>
      {children}
    </div>
  );
}
