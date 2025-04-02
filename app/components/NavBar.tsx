import { Link, useNavigate } from "@remix-run/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { ChevronDown, Search } from "lucide-react";
import { getSession, logOutSesssion } from "~/clients/supaFuncs";
import { sessionAtom } from "~/helpers/client_state";
function NavBar() {
	let data = useQuery({
		queryKey: ["user_info"],
		queryFn: getSession,
	});
	let navigate = useNavigate();
	let queryclient = useQueryClient();
	let [session, setSession] = useAtom(sessionAtom);
	let updateSession = () => {
		setSession(null);
	};
	return (
		<div className=" z-20 h-20  bg-base-100  w-full sticky top-0 flex items-center  px-4 gap-2">
			{/* <p>{JSON.stringify(data.data)}</p> */}
			<label className="input text-sm w-full">
				<Search className="size-6" />
				<input
					placeholder="search here"
					type="text"
					className="grow"
				></input>
			</label>
			{!data.isFetching ? (
				data.data ? (
					<>
						<Link
							to={"/user/" + data.data?.user_info.username}
							className="flex items-center gap-2"
						>
							<button className="size-8 grid place-items-center rounded-full bg-primary/25 capitalize btn ">
								{
									data.data.user_info.username.slice(
										0,
										1
									) as string
								}
							</button>
						</Link>
						<div className="dropdown dropdown-bottom dropdown-end">
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
									<button className="btn" onClick={()=>{
										console.log(localStorage.getItem("auth"))
									}}>Item 1</button>
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
				) : null
			) : null}

			{!data.data ? (
				<button
					onClick={() => {
						navigate("/auth/login");
					}}
					className="btn btn-primary"
				>
					Sigin
				</button>
			) : null}
		</div>
	);
}

export default NavBar;
