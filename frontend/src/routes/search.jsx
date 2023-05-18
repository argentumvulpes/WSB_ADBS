import {  useSearchParams } from "react-router-dom";
import useSearch from "../data/use-search";
import Post from "../components/post";

export default function Search() {
  const [searchParams] = useSearchParams();
  const {data: posts, isLoading} = useSearch(searchParams.get('query') || null);

  if (isLoading) {
    return null
  }

  if (!posts.length) {
    return <div className="mt-8">Brak wyników</div>
  }

  return (
    <>
      <div className="flex flex-col space-y-8 divide-y mt-8">
        {posts.map((p) => (
          <Post
            id={p.post.identity.low}
            content={p.post.properties.content}
            key={p.post.elementId}
            username={p.author.properties.username}
            dateHour={p.post.properties.date.hour.low}
            dateMinutes={p.post.properties.date.minute.low}
            dateSeconds={p.post.properties.date.second.low}
            dateYear={p.post.properties.date.year.low}
            dateMonth={p.post.properties.date.month.low}
            dateDay={p.post.properties.date.day.low}
          />
        ))}
      </div>
    </>
  );
}
