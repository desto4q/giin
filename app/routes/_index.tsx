import { useQuery } from "@tanstack/react-query";
import { getPosts } from "~/clients/supaFuncs";
import { useSearchParams } from "@remix-run/react";
import Pagination from "~/components/Pagination";
import Card from "~/components/Card";
import { gen } from "~/helpers/helpers";
function Index() {
	const [searchParams] = useSearchParams();
	let page = Number(searchParams.get("page"));

	let data = useQuery({
		queryKey: ["default_posts"],
		queryFn: async () => await getPosts(page == 0 ? 1 : page, 20),
	});
	// return (<>{import.meta.env.VITE_SUPA_KEY}</>)

	if (data.isError) {
		return <div>error</div>;
	}
	if (data.isFetching) {
		return <>loading</>;
	}
	if (!data.data?.data) {
		return <></>;
	}
	return (
		<div className="px-2  ">
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
