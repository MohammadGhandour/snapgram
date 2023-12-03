import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import { Loader } from ".";

type PostStatsProps = {
    post: Models.Document;
    userId: string;
};

function PostStats({ post, userId }: PostStatsProps) {
    const likesList = post.likes.map((user: Models.Document) => user.$id);

    const [likes, setLikes] = useState<string[]>(likesList);
    const [isSaved, setIsSaved] = useState(false);

    const { mutate: likePost, } = useLikePost();
    const { mutate: savePost, isPending: isSavingPost } = useSavePost();
    const { mutate: deleteSavedPost, isPending: isDeletingSavingPost } = useDeleteSavedPost();

    const { data: currentUser } = useGetCurrentUser();
    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

    useEffect(() => { setIsSaved(!!savedPostRecord) }, [currentUser]);

    function handleSavePost(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        e.stopPropagation();
        if (savedPostRecord) {
            deleteSavedPost(savedPostRecord.$id);
            setIsSaved(false);
        } else {
            savePost({ postId: post.$id, userId });
            setIsSaved(true);
        }
    };

    function handleLikePost(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.stopPropagation();
        let newLikes = [...likes];
        const hasLiked = newLikes.includes(userId)
        if (hasLiked) {
            newLikes = newLikes.filter(id => id !== userId);
        } else {
            newLikes.push(userId);
        };
        setLikes(newLikes);
        likePost({ postId: post.$id, likesArray: newLikes });
    };

    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5 cursor-pointer" onClick={(e) => handleLikePost(e)}>
                <img src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
                    alt="like this post"
                    width={20}
                    height={20}
                />
                <p className="small-medium lg:base-medium">{likes.length}</p>
            </div>
            <div className="flex gap-2">
                {isSavingPost || isDeletingSavingPost ? <Loader /> : <img
                    src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                    alt="like this post"
                    width={20}
                    height={20}
                    onClick={(e) => handleSavePost(e)}
                    className="cursor-pointer"
                />
                }
            </div>
        </div>
    );
};

export default PostStats;
