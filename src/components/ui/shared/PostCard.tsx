import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
    post: Models.Document;
};

function PostCard({ post }: PostCardProps) {

    const { user } = useUserContext();
    const isOwnPost = user && post.creator && user.id === post.creator.$id;
    return (
        <div className="post-card">
            <div className="flex-between">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.creator.$id}`}>
                        <img src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"} alt={`${post.creator.username}'s post`} className="rounded-full w-12 aspect-square" />
                    </Link>
                    <div className="flex flex-col">
                        <p className="base-medium lg:body-bold text-light-1">{post.creator.username}</p>
                        <div className="flex-center gap-2 text-light-3 subtle-semibold lg:small-regular">
                            <span>{multiFormatDateString(post.$createdAt)}</span>
                            {!!post.location && <> <span>-</span> <span>{post.location}</span></>}
                        </div>
                    </div>
                </div>

                {isOwnPost && <Link to={`/edit-post/${post.$id}`}><img src="/assets/icons/edit.svg" alt="edit post" width={20} height={20} /></Link>}
            </div>

            <Link to={`/posts/${post.$id}`}>
                <div className="small-medium lg:base-medium py-5">
                    <p>{post.caption}</p>
                    {post.tags ?
                        <ul className="flex items-center gap-1">
                            {post.tags.map((tag: string) => (
                                <li key={tag} className="text-light-3">#{tag}</li>
                            ))}
                        </ul>
                        :
                        null
                    }
                </div>
                {!!post.imageUrl && <img src={post.imageUrl} className="post-card_img" alt="post image" />}
            </Link>

            <PostStats post={post} userId={user.id} />
        </div>
    );
};

export default PostCard;
