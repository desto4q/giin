import { Link, useLocation } from "@remix-run/react";
import { Heart, Home, LucideOctagon, Plus } from "lucide-react";
import UserBoxSidebar from "./UserBoxSidebar.client";
import { Suspense } from "react";
import { ClientOnly } from "remix-utils/client-only";
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
	
];

function Sidebar() {
	let pathname = useLocation();

	return (
		<div className="flex flex-col items-center sticky top-0   md:w-[230px] h-dvh px-4 py-4">
			<div className="h-20 w-full sticky top-0 flex  px-2 items-center bg-base-100 mb-2 rounded-lg drop-shadow-lg justify-center md:justify-start">
				<a
					href=""
					className="btn btn-circle btn-ghost"
				>
					<LucideOctagon />
				</a>
				<p className="text-md hidden md:inline font-black"> Giin</p>
			</div>
			<div className="md:block hidden mb-2  w-full">
				<Suspense>
					<ClientOnly>{() => <UserBoxSidebar />}</ClientOnly>
				</Suspense>
			</div>
			<nav className="w-20 flex flex-col py-4 items-center gap-4 md:items-start md:w-full px-2 bg-base-100 rounded-lg drop-shadow-lg h-full">
				{links.map((e) => {
					return (
						<Link
							className={`btn ${
								pathname.pathname == e.path
									? "bg-primary/25"
									: "btn-ghost"
							} w-full btn-sm flex justify-center md:justify-start h-fit py-2 gap-2 duration-150 `}
							to={e.path}
							key={e.name + pathname.pathname}
						>
							<e.Icon className="text-lg md:text-xl" />
							<p className="font-semibold hidden md:inline capitalize">
								{e.name}
							</p>
						</Link>
					);
				})}
			</nav>
		</div>
	);
}

export default Sidebar;
