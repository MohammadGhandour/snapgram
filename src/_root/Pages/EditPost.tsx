import { PostForm } from "@/components/forms";
import { Loader } from "@/components/ui/shared";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

function EditPost() {
    const { id } = useParams();

    const { data: post, isPending } = useGetPostById(id || "");

    if (isPending) return <div className="w-full h-full flex items-center justify-center"><Loader /></div>;
    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                    <img src="/assets/icons/add-post.svg" alt="create-post" width={36} height={36} />
                    <h2 className="h3-bold md:h2-bold text-left w-full">Edit</h2>
                </div>

                <PostForm action="update" post={post} />
            </div>
        </div>
    );
};

export default EditPost;
