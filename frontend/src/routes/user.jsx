import { useMatches } from 'react-router-dom';
import useUser from '../data/use-user';
import Post from '../components/post';
import useUserFollowersCount from '../data/use-user-followers-count';
import useUserFollowedCount from '../data/use-user-followed-count';

export default function User() {
  const matches = useMatches();
  const { data, isLoading } = useUser(matches[0].params.userName);
  const { data: followers, isLoading: loadingFollowers } =
    useUserFollowersCount(matches[0].params.userName);
    const { data: followed, isLoading: loadingFollowed } =
    useUserFollowedCount(matches[0].params.userName);

  if (isLoading || !data) {
    return null;
  }

  return (
    <>
      <div>
        <div className="mt-12 text-3xl font-bold">
          {data.user.properties.username}
        </div>
        <div className='text-sm mt-3 flex space-x-4 text-gray-500'>
          <div className='font-semibold'>Obserwujący: {loadingFollowers === false && followers}</div>
          <div className='font-semibold'>Obserwowani: {loadingFollowed === false && followed}</div>
        </div>
      </div>
      <div className="flex flex-col space-y-8 divide-y mt-8">
        {data.posts.map((p) => (
          <Post
            id={p.identity.low}
            content={p.properties.content}
            key={p.elementId}
            username={data.user.properties.username}
            dateHour={p.properties.date.hour.low}
            dateMinutes={p.properties.date.minute.low}
            dateSeconds={p.properties.date.second.low}
            dateYear={p.properties.date.year.low}
            dateMonth={p.properties.date.month.low}
            dateDay={p.properties.date.day.low}
          />
        ))}
      </div>
    </>
  );
}
