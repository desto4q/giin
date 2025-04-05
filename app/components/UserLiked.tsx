import { useSearchParams } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { getFavourites, USER } from "~/clients/supaFuncs";
import Card from "./Card";
import Pagination from "./Pagination";
import LoadingBody from "./LoadingBody";
import ErrorBody from "./ErrorBody";

let UserLiked = (props: { user_data: USER }) => {
	const [searchParams] = useSearchParams();
	let page = Number(searchParams.get("page"));
	let data = useQuery({
		queryKey: ["liked_posts"],
		queryFn: async () =>
			await getFavourites(page == 0 ? 1 : page, 10, props.user_data.id),
		refetchOnWindowFocus: false,
	});
	if (data.isFetching) {
		return <LoadingBody />;
	}

	if (data.isError) {
		return <ErrorBody refetch={data.refetch} />;
	}
	return (
		<div className="p-2 bg-base-200 rounded-lg">
			<div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 p-2  rounded-md pb-20">
				{data.data?.data?.map((e) => {
					return (
						<Card
							key={e.id}
							{...e.posts}
						/>
					);
				})}
				{/* <Pagination totalPages={data.data?.totalPages as number} /> */}
				<div className="fixed bottom-0 w-full grid place-items-center py-2 bg-base-300/25 left-0  rounded-b-lg">
					<Pagination totalPages={data.data?.totalPages as number} />
				</div>
			</div>
		</div>
	);
};

export default UserLiked;
