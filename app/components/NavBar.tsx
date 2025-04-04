import { Link, useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { ChevronDown, Menu, Search } from "lucide-react";
import { FormEvent } from "react";
import { toast } from "react-toastify/unstyled";
import { logOutSesssion, USER } from "~/clients/supaFuncs";
import { sessionAtom, sidebarAtom } from "~/helpers/client_state";
function NavBar() {
	let navigate = useNavigate();
	let queryclient = useQueryClient();
	let [session, setSession] = useAtom(sessionAtom);
	let updateSession = () => {
		setSession(null);
	};
	let [sideBarState, SetSideBar] = useAtom(sidebarAtom);
	let user_data = session as USER;

	let onSubmit = (e: FormEvent) => {
		e.preventDefault();
		let form_data = new FormData(e.target as HTMLFormElement);
		let query = form_data.get("query") as string;
		if (query.length < 1) {
			toast.error("search is empty");
			return;
		}
		// if (query) {
		// 	toast.error("search is empty");
		// }
		navigate(`/search/${query}`);
	};
	return (
		<div className="z-20 h-20  bg-base-100  w-full sticky top-0 left-0 flex  items-center  px-4 gap-2 ">
			{/* <p>{JSON.stringify(data.data)}</p> */}
			<button
				className="btn btn-ghost sm:hidden p-2"
				onClick={() => {
					SetSideBar(true);
				}}
			>
				<Menu />
			</button>
			<form
				onSubmit={onSubmit}
				className="input text-sm w-full"
			>
				<Search className="size-6" />
				<input
					placeholder="search here"
					name="query"
					id="query"
					type="text"
					className="grow"
				></input>
			</form>
			{session == "loading" ? null : user_data ? (
				<>
					<Link
						to={"/profile/"}
						className="flex items-center gap-2"
					>
						<button className="size-8 grid place-items-center rounded-full bg-primary/25 capitalize btn ">
							{user_data.user_info.username.slice(0, 1) as string}
						</button>
					</Link>
					<div className="dropdown hidden md:flex dropdown-bottom dropdown-end">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-circle"
						>
							<ChevronDown />
						</div>
						<ul
							tabIndex={0}
							className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm flex flex-col gap-2"
						>
							<li>
								<button
									className="btn"
									onClick={() => {
										console.log(
											localStorage.getItem("auth")
										);
									}}
								>
									Item 1
								</button>
							</li>
							<li>
								<button
									className="btn btn-error btn-sm"
									onClick={() => {
										logOutSesssion(updateSession);
										queryclient.invalidateQueries();
									}}
								>
									Logout
								</button>
							</li>
						</ul>
					</div>
				</>
			) : null}

			{!user_data ? (
				<button
					onClick={() => {
						navigate("/auth/login");
					}}
					className="btn btn-primary"
				>
					Login
				</button>
			) : null}
		</div>
	);
}

export default NavBar;
