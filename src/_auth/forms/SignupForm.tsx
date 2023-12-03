import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { SignupValidation } from "@/lib/validation";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useCreateUserAccount, useSigninUserAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { Loader } from "@/components/ui/shared";

function SignupForm() {
    const { toast } = useToast();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    const navigate = useNavigate();

    const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
    const { mutateAsync: signInAccount, isPending: isSingingIn } = useSigninUserAccount();

    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: { name: "", username: "", email: "", password: "" },
    });

    async function onSubmit(values: z.infer<typeof SignupValidation>) {
        const { email, password } = values;
        const newUser = await createUserAccount(values);
        if (!newUser) return toast({ title: "Sign up failed. Please try again.", });

        const session = await signInAccount({ email, password });
        if (!session) return toast({ title: "Sign in failed. Please try again.", });

        const isLoggedIn = await checkAuthUser();
        if (isLoggedIn) {
            form.reset();
            navigate("/");
        } else {
            return toast({ title: "Sign up failed. Please try again." });
        }
    };

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <img src="/assets/images/logo.svg" alt="logo" />
                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage className="text-red" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" placeholder="JohnDoe" {...field} />
                                </FormControl>
                                <FormMessage className="text-red" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" placeholder="Johndoe@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage className="text-red" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" placeholder="*********" {...field} />
                                </FormControl>
                                <FormMessage className="text-red" />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary" disabled={isCreatingAccount || isSingingIn || isUserLoading}>
                        {isCreatingAccount || isSingingIn || isUserLoading ?
                            <div className="flex-center gap-2"><Loader /> Loading...</div>
                            :
                            "Sign up"
                        }
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">Already have an account ? <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Sign in</Link></p>

                </form>
            </div>
        </Form>
    );
};

export default SignupForm;
