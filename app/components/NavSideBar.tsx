import { Link, useLocation, useNavigate } from "@remix-run/react";
import { useAtom } from "jotai";
import { Heart, Home, LucideOctagon, MessageCircle, Plus } from "lucide-react";
import { useEffect } from "react";
import { sessionAtom, sidebarAtom } from "~/helpers/client_state";
import { motion } from "motion/react";
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

	let nav = useNavigate();
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
			className={`h-full fixed w-full top-0 left-0 bottom-0 z-20 pointer-events-${
				sidebarState ? "auto" : "none"
			}`}
		>
			<div className="h-full w-full relative isolate">
				<button
					key={`siderbar_${sidebarState}`}
					className={`  w-full absolute left-0 top-0 h-full -z-10 duration-150 ${
						sidebarState ? "backdrop-blur-sm bg-neutral-900/50" : ""
					}`}
					onClick={() => setSidebar(false)}
				></button>
				<motion.div
					initial={{ x: "-100%" }}
					animate={{ x: sidebarState ? 0 : "-100%" }}
					transition={{ type: "ease", stiffness: 200, damping: 20 }}
					className="h-full bg-base-100 w-xs px-2 flex flex-col gap-2"
				>
					<div className="h-20 flex items-center  gap-2 px-2 border-b border-b-primary/25">
						<a
							href=""
							className="btn btn-circle btn-ghost"
						>
							<LucideOctagon />
						</a>
						<p className="text-md  font-black">Giin</p>
					</div>
					<nav className=" w-full grow flex flex-col gap-2 mt-4">
						{links.map((e) => (
							<Link
								onClick={() => {
									setTimeout(() => {
										setSidebar(false);
									}, 200);
								}}
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
					<div className="mt-auto h-20">
						{session ? (
							session == "loading" ? (
								<div className="btn btn-wide btn-info">
									loading
								</div>
							) : (
								<div className="h-20 flex items-center gap-2 px-2">
									<div className="size-12 bg-primary/25 rounded-full text-xl font-bold grid place-items-center  capitalize btn">
										{session.user_info.username[0]}
									</div>
									<div>
										<p className="font-bold capitalize">{session.user_info.username}</p>
										<p className="text-sm opacity-45 font-bold">{session.user_info.fullname}</p>
									</div>
								</div>
							)
						) : (
							<div
								className="btn btn-primary w-full "
								onClick={() => {
									nav("/auth/login");
									setTimeout(() => {
										setSidebar(false);
									}, 200);
								}}
							>
								Login
							</div>
						)}
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default NavSidebar;
