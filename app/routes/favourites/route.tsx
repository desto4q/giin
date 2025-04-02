import { useAtom } from "jotai";
import { useEffect } from "react";
import { getSession, USER } from "~/clients/supaFuncs";
import UserLiked from "~/components/UserLiked";
import { sessionAtom } from "~/helpers/client_state";

function route() {
	let [session, setSession] = useAtom(sessionAtom);
	let updateSession = async () => {
		setSession(await getSession());
	};
	useEffect(() => {
		updateSession();
	}, []);

	if (!session) {
		console.log("not");
		return <div>no user</div>;
	}
	if (session == "loading") {
		return <>loading data</>;
	}
	let user_data = session as USER;
	return (
		<div className="p-2">
			<div className="flex items-center gap-2">
				<div className="size-16 rounded-full font-black capitalize grid place-items-center bg-primary/25 text-xl">
					{user_data.user_info.username[0]}
				</div>
				<div>
					<div className="text-lg font-bold ">
						{user_data.user_info.username}
					</div>
				</div>
			</div>
			<h2 className="py-2 text-lg font-bold">Favourites</h2>
			<UserLiked user_data={user_data} />
		</div>
	);
}
export default route;
