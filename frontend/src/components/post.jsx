import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as FullHeartIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import usePostLikesCount from '../data/use-post-likes-count';
import usePostCommentsCount from '../data/use-post-comments-count';

export default function Post({
  id,
  content,
  username,
  dateHour,
  dateMinutes,
  dateSeconds,
  dateYear,
  dateMonth,
  dateDay,
}) {
  const { data: likes, isLoading: loadingLikes } = usePostLikesCount(id);
  const { data: comments, isLoading: loadingComments } =
    usePostCommentsCount(id);

  return (
    <div>
      <div className="flex items-center">
        <div className="mb-2 font-semibold text-lg py-2 text-cyan-500 hover:text-cyan-600">
          <a href={`/user/${username}`}>{username}</a>
        </div>
        <div className="ml-auto text-gray-500">
          {dateYear}-{dateMonth}-{dateDay} {dateHour}:{dateMinutes}:
          {dateSeconds}
        </div>
      </div>
      <div>{content}</div>
      <div className="flex mt-3 space-x-8">
        {loadingLikes === false && <PostLikes likes={likes} />}
        {loadingComments === false && (
          <PostCommentsCount commentsCount={comments} />
        )}
      </div>
    </div>
  );
}

function PostLikes({ likes }) {
  return (
    <div className="flex cursor-pointer text-cyan-500 hover:text-cyan-600">
      {likes.userLike === 1 && (
        <FullHeartIcon className="h-6 w-6" />
      )}
      {likes.userLike === 0 && <HeartIcon className="h-6 w-6" />}
      <div className="font-semibold ml-1 text-lg mt-1">
        {likes.total}
      </div>
    </div>
  );
}

function PostCommentsCount({ commentsCount }) {
  return (
    <div className="flex cursor-pointer text-cyan-500 hover:text-cyan-600">
      <ChatBubbleLeftIcon className="h-6 w-6" />
      <div className="font-semibold ml-1 text-lg mt-1">
        {commentsCount}
      </div>
    </div>
  );
}
