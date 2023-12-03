import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { SigninValidation } from "@/lib/validation";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSigninUserAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { Loader } from "@/components/ui/shared";

function SigninForm() {
    const { toast } = useToast();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    const navigate = useNavigate();

    const { mutateAsync: signInAccount, isPending: isSingingIn } = useSigninUserAccount();

    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: { email: "", password: "" },
    });

    async function onSubmit(values: z.infer<typeof SigninValidation>) {
        const { email, password } = values;

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
                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Welcome back !</h2>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full mt-4">
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
                    <Button type="submit" className="shad-button_primary" disabled={isUserLoading || isSingingIn}>
                        {isUserLoading || isSingingIn ?
                            <div className="flex-center gap-2"><Loader /> Loading...</div>
                            :
                            "Sign in"
                        }
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">Don't have an account ? <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign up</Link></p>

                </form>
            </div>
        </Form>
    );
};

export default SigninForm;
