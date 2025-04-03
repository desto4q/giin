import { Link, useLocation } from "@remix-run/react";
import { useAtom } from "jotai";
import { Heart, Home, LucideOctagon, MessageCircle, Plus } from "lucide-react";
import { motion } from "motion/react";
import { Suspense, useEffect } from "react";
import { sessionAtom, sidebarAtom } from "~/helpers/client_state";

let links = [
	{
		name: "home",
		path: "/",
		Icon: Home,
	},
	{
		name: "create",
		path: "/create",
		Icon: Plus,
	},
	{
		name: "favourites",
		path: "/favourites",
		Icon: Heart,
	},
	{
		name: "messages",
		path: "/messages",
		Icon: MessageCircle,
	},
];

function NavSidebar() {
	let pathname = useLocation();
	let [session, setSession] = useAtom(sessionAtom);
	let [sidebarState, setSidebar] = useAtom(sidebarAtom);
	useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 650) {
                // console.log(window.innerWidth);
                if (!sidebarState) {
                    return;
                }
                setSidebar(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [sidebarState, setSidebar]); // Add sidebarState here
    
	return (
		<div
			className={`fixed  left-0 w-dvw z-20 md:hidden pointer-events-${
				sidebarState ? "auto" : "none"
			} *:pointer-events-${sidebarState ? "auto" : "none"}`}
		>
			<div className="h-full w-full relative isolate">
				<button
					disabled={!sidebarState}
					key={`sidebar_${sidebarState}`}
					className={` ${
						sidebarState
							? "backdrop-blur-sm bg-neutral-900/50"
							: null
					} w-full absolute left-0 top-0 h-full -z-10 `}
					onClick={() => {
						setSidebar(!sidebarState);
					}}
				></button>
				<Suspense>
					<motion.div
						initial={{ x: "-100%" }}
						animate={{ x: sidebarState ? 0 : "-100%" }}
						transition={{
							type: "linear",
							stiffness: 200,
							damping: 20,
						}}
						className="h-dvh bg-base-100 w-xs"
					>
						<div className="flex items-center py-4 px-2">
							<a
								href=""
								className="btn btn-circle btn-ghost"
							>
								<LucideOctagon />
							</a>
							<p className="text-md font-black">Giin</p>
						</div>

						<nav className="w-full py-4 gap-4 flex flex-col h-full bg-base-200">
							{links.map((e) => (
								<Link
									className={`btn ${
										pathname.pathname == e.path
											? "bg-primary/25"
											: "btn-ghost"
									} w-full btn-sm flex justify-start h-fit py-2 gap-2 duration-150 hover:bg-neutral-500/25`}
									to={e.path}
									key={e.name + pathname.pathname}
								>
									<e.Icon className="text-lg" />
									<p className="font-semibold capitalize">
										{e.name}
									</p>
								</Link>
							))}
						</nav>
					</motion.div>
				</Suspense>
			</div>
		</div>
	);
}

export default NavSidebar;
