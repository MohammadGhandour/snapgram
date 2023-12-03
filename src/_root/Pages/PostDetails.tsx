import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/shared";
import PostStats from "@/components/ui/shared/PostStats";
import { useUserContext } from "@/context/AuthContext";
import { deletePost } from "@/lib/appwrite/api";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";

function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: post, isLoading } = useGetPostById(id || "");
    const { user } = useUserContext();
    const isOwnPost = user && post?.creator && user.id === post.creator.$id;

    async function handleDeletePost() {
        await deletePost(id || "", post?.imageId);
        navigate(-1);
    };

    return (
        <div className="post_details-container">
            {isLoading ? <Loader /> :
                <div className="post_details-card">
                    {!!post?.imageUrl && <img src={post?.imageUrl} alt="post" className="post_details-img" />}

                    <div className="post_details-info">
                        <div className="flex-between w-full">
                            <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                                <img src={post?.creator.imageUrl || "/assets/icons/profile-placeholder.svg"} alt={`${post?.creator.username}'s post`} className="rounded-full w-8 lg:w-12 aspect-square" />
                                <div className="flex flex-col">
                                    <p className="base-medium lg:body-bold text-light-1">{post?.creator.username}</p>
                                    <div className="flex-center gap-2 text-light-3 subtle-semibold lg:small-regular">
                                        <span>{multiFormatDateString(post?.$createdAt)}</span>
                                        {!!post?.location && <> <span>-</span> <span>{post?.location}</span></>}
                                    </div>
                                </div>
                            </Link>

                            {isOwnPost &&
                                <div className="flex-center">
                                    <Link to={`/edit-post/${post?.$id}`}>
                                        <img src="/assets/icons/edit.svg" alt="edit post" width={24} height={24} />
                                    </Link>

                                    <Button onClick={handleDeletePost} variant="ghost" className="ghost_details-delete_btn">
                                        <img src="/assets/icons/delete.svg" alt="delete post" width={24} height={24} />
                                    </Button>
                                </div>
                            }
                        </div>

                        <hr className="border w-full border-dark-4/80" />

                        <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                            <p>{post?.caption}</p>
                            {post?.tags ?
                                <ul className="flex items-center gap-1">
                                    {post?.tags.map((tag: string) => (
                                        <li key={tag} className="text-light-3">#{tag}</li>
                                    ))}
                                </ul>
                                :
                                null
                            }
                        </div>

                        <div className="w-full">
                            {!!post && <PostStats post={post} userId={user.id} />}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default PostDetails;
