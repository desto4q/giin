import { useNavigate } from "@remix-run/react";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { getSession, USER } from "~/clients/supaFuncs";
import { sessionAtom } from "~/helpers/client_state";

function UserBoxSidebar() {
	let navigate = useNavigate(); //
	let [session, setSession] = useAtom<"loading" | USER | null>(sessionAtom);

	let updateSession = async () => {
		setSession(await getSession());
	};
	let auth = localStorage.getItem("auth");
	useEffect(() => {
		updateSession();
	}, [auth]);
	let user_info = session as USER;
	if (session == "loading") {
		return (
			<div className="w-full h-[200px] grid place-items-center">
				loading
			</div>
		);
	}
	if (!session) {
		return (
			<div className="w-full h-[150px] bg-base-100 rounded-md grid place-items-center drop-shadow-lg">
				<button
					className="btn  btn-primary"
					onClick={() => {
						navigate("/auth/login");
					}}
				>
					{" "}
					Login
				</button>
			</div>
		);
	}
	return (
		<div className="w-full flex flex-col items-center text-center rounded-lg bg-base-100 p-2 drop-shadow-lg">
			<button className="mx-auto btn btn-circle  bg-primary/25 btn-xl ">
				{user_info.user_info.username[0]}
			</button>
			<h2 className="font-bold text-md mt-2">
				{user_info.user_info.username}
			</h2>
			<p className="text  font-bold text-xs opacity-50">
				{user_info.user_info.fullname}
				{/* {JSON.stringify(user_info.user_info)} */}
			</p>
			<button
				className="btn   btn-sm h-full w-full py-2 text-sm mt-2"
				onClick={() => {
					navigate("/profile");
				}}
			>
				My Profile
			</button>
		</div>
	);
}

export default UserBoxSidebar;
