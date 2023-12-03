import { GridPostList, Loader } from ".";

type SearchResultsProps = {
    isFetching: boolean;
    posts: any;
};

function SearchResults({ isFetching, posts }: SearchResultsProps) {
    console.log(posts);

    if (isFetching) return <Loader />;
    if (posts && posts.documents.length > 0) return <GridPostList posts={posts.documents} />;
    return <p className="text-light-4 text-center w-full">No results found.</p>;
};

export default SearchResults;
