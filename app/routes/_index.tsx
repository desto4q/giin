import { useQuery } from "@tanstack/react-query";
import { getPosts } from "~/clients/supaFuncs";
import { useSearchParams } from "@remix-run/react";
import Pagination from "~/components/Pagination";
import Card from "~/components/Card";
import { gen } from "~/helpers/helpers";
import LoadingBody from "~/components/LoadingBody";
import ErrorBody from "~/components/ErrorBody";
function Index() {
	const [searchParams] = useSearchParams();
	let page = Number(searchParams.get("page"));

	let data = useQuery({
		queryKey: ["default_posts"],
		queryFn: async () => await getPosts(page == 0 ? 1 : page, 20),
	});
	if (data.isError) {
		return <ErrorBody refetch={data.refetch} />;
	}
	if (data.isFetching) {
		return <LoadingBody />;
	}
	if (!data.data?.data) {
		return <></>;
	}
	return (
		<div className="pb-20  px-4 p-2 ">
			<div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 p-2  rounded-md">
				{data.data?.data.map((e) => (
					<Card
						{...e}
						key={gen()}
					/>
				))}
			</div>
			<div className="fixed bottom-0 w-full grid place-items-center py-2 bg-base-300/25 left-0  rounded-b-lg">
				<Pagination totalPages={data.data?.totalPages as number} />
			</div>
		</div>
	);
}

export default Index;
