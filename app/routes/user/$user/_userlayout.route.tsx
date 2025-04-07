import { useParams, useSearchParams } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { getPostsByUsername } from "~/clients/supaFuncs";
import Card from "~/components/Card";
import Pagination from "~/components/Pagination";
import { gen } from "~/helpers/helpers";

function route() {
	let { user } = useParams();
	const [searchParams] = useSearchParams();
	let page = Number(searchParams.get("page"));

	let data = useQuery({
		queryKey: ["posts", user],
		queryFn: async () => {
			return await getPostsByUsername(
				user as string,
				page == 0 ? 1 : page,
				20
			);
		},
	});
	if (data.isFetching ?? !data.data) {
		return (
			<div className="h-[calc(100dvh-80px)] grid place-items-center">
				<p>...loading</p>
			</div>
		);
	}
	return (
		<div className="min-h-[calc(100dvh-80px)] p-2 rounded-md">
			<p className="text-xl font-bold  py-4 capitalize">pins</p>
			<div className="columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4  bg-base-300/50  py-2 px-2 rounded-md">
				{data.isFetching ? (
					<>loading</>
				) : (
					data.data.data?.map((e) => (
						<Card
							key={gen()}
							{...e}
						/>
					))
				)}
			</div>
			<div className="fixed bottom-0 w-full grid place-items-center py-2 bg-base-300/25 left-0  rounded-b-lg">
				<Pagination totalPages={data.data?.totalPages as number} />
			</div>
		</div>
	);
}

export default route;
