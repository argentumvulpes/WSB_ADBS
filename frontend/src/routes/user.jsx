import { useMatches } from "react-router-dom";
import useUser, { USER_QUERY_KEY } from "../data/use-user";
import Post from "../components/post";
import useUserFollowersCount, {
  USER_FOLLOWERS_COUNT_QUERY_KEY,
} from "../data/use-user-followers-count";
import useUserFollowedCount from "../data/use-user-followed-count";
import { followUser, unfollowUser } from "../data/follow";
import { useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../data/use-auth";

export default function User() {
  const matches = useMatches();
  const { data, isLoading } = useUser(matches[0].params.userName);
  const { data: followers, isLoading: loadingFollowers } =
    useUserFollowersCount(matches[0].params.userName);
  const { data: followed, isLoading: loadingFollowed } = useUserFollowedCount(
    matches[0].params.userName
  );

  if (isLoading || !data) {
    return null;
  }

  data.user.posts = data.user.posts.filter((p) => p !== null);

  return (
    <>
      <div>
        <div className="mt-12 flex items-end">
          <div className="text-3xl font-bold mr-4">
            {data.user.user.properties.username}
          </div>
          <Follow
            userName={data.user.user.properties.username}
            isFollowing={data.isUserFollowing.low === 1}
          />
        </div>
        <div className="text-sm mt-4 flex space-x-4 text-gray-500">
          <div className="font-semibold">
            Obserwujący: {loadingFollowers === false && followers}
          </div>
          <div className="font-semibold">
            Obserwowani: {loadingFollowed === false && followed}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-8 divide-y mt-8">
        {data.user.posts.map((p) => (
          <Post
            id={p.identity.low}
            content={p.properties.content}
            key={p.elementId}
            username={data.user.user.properties.username}
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

function Follow({ userName, isFollowing }) {
  const { data: user } = useAuthUser();
  const queryClient = useQueryClient();

  if (user === userName) {
    return null;
  }

  const onClick = async () => {
    if (isFollowing) {
      await unfollowUser(userName);
    } else {
      await followUser(userName);
    }
    await queryClient.invalidateQueries([USER_QUERY_KEY]);
    await queryClient.invalidateQueries([
      USER_FOLLOWERS_COUNT_QUERY_KEY,
      userName,
    ]);
  };

  return (
    <div
      className={`border rounded py-1 px-2 cursor-pointer font-semibold select-none text-sm ${
        !isFollowing ? "bg-cyan-500 hover:bg-cyan-600 text-white" : ""
      }`}
      onClick={onClick}
    >
      {isFollowing === true && "Przestań obserwować"}
      {isFollowing === false && "Obserwuj"}
    </div>
  );
}
