import Post from '../components/post';
import useAuthUser from '../data/use-auth';
import useMainPosts from '../data/use-main-posts';

export default function Root() {
  const { data: user } = useAuthUser();
  const { data: posts, isLoading: isLoading } = useMainPosts();

  return (
    <>
      <div>
        <div className="mt-8 text-2xl font-semibold">
          Strona główna, hej <a className='text-cyan-500 hover:text-cyan-600' href={`/user/${user}`}>{user}</a> :)
        </div>
        {isLoading === false && (
          <div className="flex flex-col space-y-8 divide-y mt-8">
            {posts.map((p) => (
              <Post
                id={p.post.identity.low}
                content={p.post.properties.content}
                key={p.post.elementId}
                username={p.user.properties.username}
                dateHour={p.post.properties.date.hour.low}
                dateMinutes={p.post.properties.date.minute.low}
                dateSeconds={p.post.properties.date.second.low}
                dateYear={p.post.properties.date.year.low}
                dateMonth={p.post.properties.date.month.low}
                dateDay={p.post.properties.date.day.low}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
