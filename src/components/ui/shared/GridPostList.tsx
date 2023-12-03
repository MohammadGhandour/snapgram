import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostListProps = {
    posts: Models.Document[];
    showUser?: boolean;
    showStats?: boolean;
};

function GridPostList({ posts, showUser = true, showStats = true }: GridPostListProps) {
    const { user } = useUserContext();
    return (
        <ul className="grid-container">
            {posts.map(post => (
                <li key={post.$id} className="relative min-w-[20rem] h-80">
                    <Link to={`/posts/${post.$id}`} className="grid-post_link">
                        {post.imageUrl ?
                            <img src={post.imageUrl} alt="post image" className="h-full w-full object-cover" />
                            :
                            <p className="p-4 w-full h-full">{post.caption}</p>
                        }
                    </Link>

                    <div className="grid-post_user">
                        {showUser &&
                            <div className="flex items-center justify-start gap-2 flex-1">
                                <img src={post.creator.imageUrl} alt="creator" className="w-8 aspect-square rounded-full object-cover bg-white" />
                                <p className="line-clamp-1">{post.creator.name}</p>
                            </div>
                        }
                        {showStats && <PostStats post={post} userId={user.id} />}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default GridPostList;
