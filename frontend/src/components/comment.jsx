import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as FullHeartIcon } from "@heroicons/react/24/solid";
import {
  POST_LIKES_COUNT_QUERY_KEY,
} from "../data/use-post-likes-count";
import { useQueryClient } from "@tanstack/react-query";
import { likeComment, likePost, unlikeComment, unlikePost } from "../data/likes";
import useCommentLikesCount, { COMMENT_LIKES_COUNT_QUERY_KEY } from "../data/use-comment-likes-count";
import { POST_COMMENTS_QUERY_KEY } from "../data/use-post-comments";

export default function Comment({
  comment
}) {

  const id = comment.comment.identity.low;
  const content = comment.comment.properties.content
  const childrenComments = comment.children
  const username = comment.author.properties.username
  const dateHour=comment.comment.properties.date.hour.low
  const dateMinutes=comment.comment.properties.date.minute.low
  const dateSeconds=comment.comment.properties.date.second.low
  const dateYear=comment.comment.properties.date.year.low
  const dateMonth=comment.comment.properties.date.month.low
  const dateDay=comment.comment.properties.date.day.low

  const { data: likes, isLoading: loadingLikes } = useCommentLikesCount(id);

  return (
    <div className="border-l">
      <div className="flex items-center">
        <div className="mb-2 font-semibold text-lg py-2 text-cyan-500 hover:text-cyan-600 pl-5">
          <a href={`/user/${username}`}>{username}</a>
        </div>
        <div className="ml-auto flex">
          <div className=" text-gray-500">
            {dateYear}-{dateMonth}-{dateDay} {dateHour}:{dateMinutes}:
            {dateSeconds}
          </div>
        </div>
      </div>
      <div className="pl-5">{content}</div>
      <div className="flex mt-3 space-x-8 pl-5 border-b pb-4">
        {loadingLikes === false && <CommentLikes likes={likes} postId={id} />}
      </div>
      {Object.values(childrenComments).length > 0 && <div className="ml-5">{Object.values(childrenComments).map(c => <Comment key={c.comment.identity.low} comment={c}/>)}</div>}
    </div>
  );
}

function CommentLikes({ likes, postId }) {
  const queryClient = useQueryClient();

  const onClick = async () => {
    if (likes.userLike) {
      await unlikeComment(postId);
    } else {
      await likeComment(postId);
    }
    await queryClient.invalidateQueries([COMMENT_LIKES_COUNT_QUERY_KEY, postId]);
  };

  return (
    <div
      className="flex cursor-pointer text-cyan-500 hover:text-cyan-600 select-none"
      onClick={onClick}
    >
      {likes.userLike === 1 && <FullHeartIcon className="h-6 w-6" />}
      {likes.userLike === 0 && <HeartIcon className="h-6 w-6" />}
      <div className="font-semibold ml-1 text-lg mt-1">{likes.total}</div>
    </div>
  );
}
