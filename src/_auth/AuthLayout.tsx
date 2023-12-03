import { Loader } from "@/components/ui/shared";
import { useUserContext } from "@/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

function AuthLayout() {
    const { isAuthenticated, isLoading } = useUserContext();

    if (isLoading) return <div className="w-full h-full flex items-center justify-center"><Loader /></div >
    return (
        <>
            {isAuthenticated ? (
                <Navigate to="/" />
            ) :
                <>
                    <section className="flex flex-col flex-1 justify-center items-center py-10">
                        <Outlet />
                    </section>

                    <img
                        src="/assets/images/side-img.svg"
                        alt="side image"
                        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat" />
                </>
            }
        </>
    );
};

export default AuthLayout;
