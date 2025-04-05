import { useAtom } from "jotai";
import { useEffect } from "react";
import { getSession, logOutSesssion, USER } from "~/clients/supaFuncs";
import LoadingBody from "~/components/LoadingBody";
import NoUser from "~/components/NoUser";
import ProfileEditTab from "~/components/ProfileEditTab";
import ProfilePostTab from "~/components/ProfilePostTab";
import { sessionAtom, tabAtom } from "~/helpers/client_state";
import { gen } from "~/helpers/helpers";

function route() {
	let [sessionState, setSession] = useAtom<USER | "loading" | null>(
		sessionAtom
	);
	let tabs = ["edit", "posts"] as const;

	let [tab, setTab] = useAtom<(typeof tabs)[number]>(tabAtom);
	let updateSession = async () => {
		setSession(await getSession());
	};
	useEffect(() => {
		updateSession();
	}, []);
	if (!sessionState) {
		return <NoUser />;
	}
	if (sessionState == "loading") {
		return <LoadingBody />;
	}

	return (
		<div className="p-2 flex flex-col">
			<div className="flex items-center gap-2">
				<div className="size-16 grid place-items-center bg-primary/25 rounded-full uppercase">
					{sessionState.user_info.username[0]}
				</div>
				<div>
					<h2 className="capitalize font-bold text-lg">
						{" "}
						{sessionState.user_info.username}
					</h2>
					<p className="opacity-70">
						{" "}
						{sessionState.user_info.fullname}
					</p>
				</div>
				<div
					className="btn btn-error ml-auto btn-soft"
					onClick={() => {
						logOutSesssion();
						setSession(null);
					}}
				>
					logout
				</div>
			</div>
			<div
				role="tablist"
				className="p-2 flex gap-2 tab tabs-border w-fit *:capitalize *:font-bold"
			>
				{tabs.map((e) => {
					if (tab == e) {
						return (
							<button
								role="tab"
								key={gen()}
								onClick={() => {
									setTab(e);
								}}
								className="tab tab-active  text-primary/70"
							>
								{e}
							</button>
						);
					}
					return (
						<button
							role="tab"
							key={gen()}
							className="tab  "
							onClick={() => {
								setTab(e);
							}}
						>
							{e}
						</button>
					);
				})}
			</div>
			<div className="p-2 mt-2">
				{tab == "edit" ? (
					<ProfileEditTab {...(sessionState as USER)} />
				) : (
					<ProfilePostTab {...(sessionState as USER)} />
				)}
			</div>
		</div>
	);
}

export default route;
