import * as z from "zod";

export const SignupValidation = z.object({
    name: z.string().min(2, { message: "Too short." }),
    username: z.string().min(2, { message: "Too short." }),
    email: z.string().email(),
    password: z.string().min(8, { message: "At least 8 characters." }),
});

export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "At least 8 characters." }),
});

export const PostValidation = z.object({
    caption: z.string().min(5, "Too short.").max(2200, "Too long."),
    file: z.custom<File[]>().optional(),
    location: z.string().optional(),
    tags: z.string().optional()
});

export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email(),
    bio: z.string(),
});
