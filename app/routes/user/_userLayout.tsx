import { Outlet, useLocation, useNavigate, useParams } from "@remix-run/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getSession, getUser, logOutSesssion, USER } from "~/clients/supaFuncs";

function user() {
	const navigate = useNavigate();
	const location = useLocation();
	const queryClient = useQueryClient();

	let [logged, setLogged] = useState<USER | null>(null);
	let { user } = useParams();
	let user_name = user as string;
	let updateSession = async () => {
		setLogged(await getSession());
	};
	useEffect(() => {
		updateSession();
	}, []);
	useEffect(() => {
		if (location.pathname === "/user" || location.pathname === "/user/") {
			navigate("/");
		}
	}, [location.pathname, navigate]);

	let data = useQuery({
		queryKey: ["user_name", user_name],
		queryFn: async () => {
			return await getUser(user_name);
		},
	});

	if (data.isFetching) {
		return (
			<div className="h-[calc(100dvh-80px)] grid place-items-center">
				<p>...loading</p>
			</div>
		);
	}
	if (data.isError) {
		return (
			<div className="w-full h-[calc(100dvh-80px)] grid place-items-center">
				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-bold">Error occured</h2>
					<button
						className="btn btn-secondary"
						onClick={() => {
							data.refetch();
						}}
					>
						Reload
					</button>
				</div>
			</div>
		);
	}
	if (data.data == null) {
		return (
			<div className="h-[calc(100dvh-80px)] grid place-items-center">
				<p>user doesn't exist</p>
			</div>
		);
	}
	return (
		<div className="px-4">
			<div className="flex"></div>
			<div className="flex items-center gap-2 w-full ">
				<div className="size-16 rounded-full grid place-items-center bg-primary/25 text-xl">
					{data.data.username[0]}
				</div>
				<div>
					<div className="text-lg">{data.data.username}</div>
				</div>
				{logged ? (
					data.data.username == logged?.user_info.username ? (
						<button
							className=" ml-auto btn btn-error"
							onClick={async () => {
								await logOutSesssion();
								queryClient.invalidateQueries();

								navigate("/");
							}}
						>
							Logout
						</button>
					) : null
				) : null}
			</div>
			<div className="mt-4">
				<Outlet />
			</div>
		</div>
	);
}

export default user;
