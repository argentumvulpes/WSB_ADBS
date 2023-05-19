import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { HeartIcon as FullHeartIcon } from "@heroicons/react/24/solid";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import usePostLikesCount, {
  POST_LIKES_COUNT_QUERY_KEY,
} from "../data/use-post-likes-count";
import usePostCommentsCount from "../data/use-post-comments-count";
import { useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "../data/likes";
import { deletePost } from "../data/post";
import useAuthUser from "../data/use-auth";
import { MAIN_POSTS } from "../data/use-main-posts";
import { USER_QUERY_KEY } from "../data/use-user";
import { useState } from "react";
import usePostComments from "../data/use-post-comments";
import Comment from "./comment";

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
  const [showComments, setShowComments] = useState(false);
  const { data: user } = useAuthUser();
  const { data: likes, isLoading: loadingLikes } = usePostLikesCount(id);
  const { data: comments, isLoading: loadingComments } =
    usePostCommentsCount(id);
  const queryClient = useQueryClient();

  return (
    <div>
      <div className="flex items-center">
        <div className="mb-2 font-semibold text-lg py-2 text-cyan-500 hover:text-cyan-600">
          <a href={`/user/${username}`}>{username}</a>
        </div>
        <div className="ml-auto flex">
          {user === username && (
            <div
            className="mr-4"
              onClick={async () => {
                await deletePost(id);
                await queryClient.invalidateQueries([MAIN_POSTS])
                await queryClient.invalidateQueries([USER_QUERY_KEY, username])
              }}
            ><TrashIcon className="w-5 h-5 text-red-600 hover:text-red-700 cursor-pointer" /></div>
          )}
          <div className=" text-gray-500">
            {dateYear}-{dateMonth}-{dateDay} {dateHour}:{dateMinutes}:
            {dateSeconds}
          </div>
        </div>
      </div>
      <div>{content}</div>
      <div className="flex mt-3 space-x-8">
        {loadingLikes === false && <PostLikes likes={likes} postId={id} />}
        {loadingComments === false && (
          <PostCommentsCount onClick={() => setShowComments(prev => !prev)} commentsCount={comments} />
        )}
      </div>
      {showComments && <PostComments id={id} />}
    </div>
  );
}

function PostLikes({ likes, postId }) {
  const queryClient = useQueryClient();

  const onClick = async () => {
    if (likes.userLike) {
      await unlikePost(postId);
    } else {
      await likePost(postId);
    }
    await queryClient.invalidateQueries([POST_LIKES_COUNT_QUERY_KEY, postId]);
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

function PostCommentsCount({ commentsCount, onClick }) {
  return (
    <div onClick={onClick} className="flex cursor-pointer text-cyan-500 hover:text-cyan-600 select-none">
      <ChatBubbleLeftIcon className="h-6 w-6" />
      <div className="font-semibold ml-1 text-lg mt-1">{commentsCount}</div>
    </div>
  );
}

function PostComments({ id }) {
  const {data: comments, isLoading} = usePostComments(id)

  if (isLoading) {
    return null;
  }

  const mappedComments = {};

  comments.sort((a,b) => a.r.length - b.r.length);

  comments.forEach(c => {
    const id = c.comment.identity.low
    const comm = {
      comment: c.comment,
      author: c.u,
      children: {}
    }

    if (c.r.length === 1) {
      mappedComments[id] = comm;
    } else {
      let i = 0;
      let latest = mappedComments[c.r[0].start.low];
      for (const rel of c.r) {
        if (i === 0) {
          i += 1;
          continue;
        }
        if (i === c.r.length - 1) {
          break;
        }

        latest = latest.children[rel.start.low]

        i += 1;
      }

      latest.children[id] = comm
    }

  })

  return (
    <div>
      {Object.values(mappedComments).map(c => <Comment key={c.comment.identity.low} comment={c} />)}
    </div>
  );
}

