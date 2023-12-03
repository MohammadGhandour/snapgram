import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
    try {
        const { name, email, password } = user;
        const newAccount = await account.create(ID.unique(), email, password, name);

        // if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );
        return newUser;
    } catch (error) {
        console.error(error);
    }
};

export async function signInAccount(user: { email: string; password: string }) {
    try {
        const { email, password } = user;
        const session = await account.createEmailSession(email, password);
        return session;
    } catch (error) {
        console.error(error);
    }
};

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.error(error);
    }
};

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.error(error);
    }
};

export async function createPost(post: INewPost) {
    try {
        // Convert tags to array
        const tags = post.tags ? (post.tags?.replace(/ /g, "").split(",") || []) : [];

        let fileUrl = null;
        let uploadedFile = null;

        if (post.file && post.file.length) {
            uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw Error;
            // Get file URL
            fileUrl = await getFilePreview(uploadedFile.$id);

            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            };
        }

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile ? uploadedFile.$id : null,
                location: post.location ? post.location : null,
                tags
            }
        );

        if (!newPost) {
            if (uploadedFile) await deleteFile(uploadedFile.$id);
            throw Error;
        };

        return newPost;
    } catch (error) {
        console.error(error);
    }
};

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch (error) {
        console.error(error);
    }
};

export async function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, "top", 100);
        return fileUrl;
    } catch (error) {
        console.error(error);
    }
};

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
        return { status: "ok" };
    } catch (error) {
        console.error(error);
    }
};

export async function getRecentPosts() {

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(20)]
        );

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.error(error);
    }
};

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            { likes: likesArray }
        );

        if (!updatedPost) throw Error;
        return updatedPost;
    } catch (error) {
        console.error(error);
    }
};

export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionId,
            ID.unique(),
            { user: userId, post: postId }
        );

        if (!updatedPost) throw Error;
        return updatedPost;
    } catch (error) {
        console.error(error);
    }
};

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionId,
            savedRecordId
        );

        if (!statusCode) throw Error;
        return "ok";
    } catch (error) {
        console.error(error);
    }
};

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );
        return post;
    } catch (error) {
        console.error(error);
    }
};

export async function updatePost(post: IUpdatePost) {
    try {
        const tags = post.tags ? (post.tags?.replace(/ /g, "").split(",") || []) : [];

        let image = { imageUrl: post.imageUrl, imageId: post.imageId };

        let fileUrl = null;
        let uploadedFile = null;

        if (post.file && post.file.length) {
            uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw Error;
            fileUrl = await getFilePreview(uploadedFile.$id);

            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            };
            image = { imageUrl: fileUrl, imageId: uploadedFile.$id };
        }

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location ? post.location : null,
                tags
            }
        );

        if (!updatedPost) {
            if (uploadedFile) await deleteFile(uploadedFile.$id);
            throw Error;
        };

        if (post.file && post.file.length && post.imageId) {
            await deleteFile(post.imageId);
        };

        return updatedPost;
    } catch (error) {
        console.error(error);
    }
};

export async function deletePost(postId: string, imageId: string) {
    if (!postId) throw Error;
    try {
        const statusCode = await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.postCollectionId, postId);
        if (!statusCode) throw Error;

        if (imageId) await deleteFile(imageId);
        return { status: "ok" };
    } catch (error) {
        console.error(error);
    }
};

export async function getInfinitePosts({ pageParam }: { pageParam: string }) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)];

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam));
    };

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        );
        if (!posts) throw Error;
        return posts;
    } catch (error) {
        console.error(error);
    }
};

export async function searchPosts(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        );
        if (!posts) throw Error;
        return posts;
    } catch (error) {
        console.error(error);
    }
};

export async function getUsers(limit?: number) {
    const queries: any[] = [Query.orderDesc("$createdAt")];

    if (limit) queries.push(Query.limit(limit));

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        );

        if (!users) throw Error;

        return users;
    } catch (error) {
        console.log(error);
    }
};

export async function getUserById(id: string) {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            id
        );
        return user;
    } catch (error) {
        console.error(error);
    }
};

export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;
    try {
        let image = { imageUrl: user.imageUrl, imageId: user.imageId, };

        if (hasFileToUpdate) {
            // Upload new file to appwrite storage
            const uploadedFile = await uploadFile(user.file[0]);
            if (!uploadedFile) throw Error;

            // Get new file url
            const fileUrl = await getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }

        //  Update user
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                bio: user.bio,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
            }
        );

        if (!updatedUser) {
            if (hasFileToUpdate) {
                await deleteFile(image.imageId);
            }
            throw Error;
        }

        if (user.imageId && hasFileToUpdate) {
            await deleteFile(user.imageId);
        };

        return updatedUser;
    } catch (error) {
        console.log(error);
    }
}