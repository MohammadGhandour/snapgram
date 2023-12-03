import { Bottombar, LeftSidebar, Topbar } from "@/components/ui/shared";
import { useUserContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function RouteLayout() {
    const { user } = useUserContext();
    return (
        <>
            {user ?
                <div className="w-full md:flex">
                    <Topbar />
                    <LeftSidebar />

                    <section className="flex flex-1 h-full">
                        <Outlet />
                    </section>

                    <Bottombar />
                </div>
                :
                <Navigate to="/sign-in" />
            }
        </>
    );
};

export default RouteLayout;
