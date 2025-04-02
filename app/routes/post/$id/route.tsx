import { useNavigate, useParams } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { deletePost, getSinglePost, USER } from "~/clients/supaFuncs";
import { PropsWithChildren } from "react";
import { Audio } from "react-loader-spinner";
import VideoPlayer from "~/components/VideoPlayer.client";
import { useAtom } from "jotai";
import { sessionAtom } from "~/helpers/client_state";
import { toast } from "react-toastify/unstyled";
function route() {
	let { id } = useParams();
	let nav = useNavigate();
	let [sessionState, setSession] = useAtom<USER | null | "loading">(
		sessionAtom
	);
	let data = useQuery({
		queryKey: ["post", id],
		queryFn: async () => await getSinglePost(id),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		staleTime: 100000,
	});

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

	let user_info = sessionState as USER;
	return (
		<div className="p-2">
			<section className="flex flex-col">
				<div className="w-full px-2">
					{data.isFetching ? (
						<div className="h-[400px] grid place-items-center bg-base-200">
							<Audio />
						</div>
					) : (
						<VideoPlayer src={data.data?.content_url ?? ""} />
					)}
					<div className="mt-2 p-4 px-2 bg-base-200 rounded-md">
						{data.isFetching ? (
							<div>...loadin</div>
						) : (
							<div className="flex flex-col gap-2  ">
								<div className=" flex gap-2 flex-col md:flex-row  ">
									<div className="w-full py-2  bg-base-100 rounded-md px-2">
										<h2 className="text-lg font-bold px-1">
											{data.data?.title}
										</h2>
										<h2 className="text-md opacity-50 font-bold bg-base-200  p-2 mt-2 rounded-md">
											{data.data?.subtitle
												? data.data.subtitle
												: "no content"}
										</h2>
									</div>
									{(sessionState as USER) ? (
										user_info.id == data.data?.user_id ? (
											<button
												className="btn btn-error md:ml-auto"
												onClick={async () => {
													let user_info =
														sessionState as USER;
													let resp =
														await toast.promise(
															async () =>
																await deletePost(
																	data.data
																		?.id as number,
																	user_info.id
																),
															{
																pending:
																	"deleting",
																error: "failed",
																success:
																	"deleted " +
																	data.data?.title.slice(
																		0,
																		10
																	),
															}
														);
													nav("/");
													console.log(resp);
												}}
											>
												Delete
											</button>
										) : null
									) : null}
								</div>
								<button
									className="flex items-center gap-2 btn w-fit h-auto py-2 btn-ghost"
									onClick={() => {
										nav(`/user/${data.data?.username}`);
									}}
								>
									<div className="size-10 grid place-items-center rounded-full bg-primary/25 capitalize">
										<p>
											{data.data?.user_info.username[0]}
										</p>
									</div>
									<div className="flex flex-col tracking-tight">
										<h2 className="text-lg font-bold">
											{data.data?.username}
										</h2>
									</div>
								</button>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}

let OverLay = (props: PropsWithChildren) => {
	return (
		<div className="flex w-full  bg-base-200 h-[300px] md:h-[500px]">
			{props.children}
		</div>
	);
};

export default route;
