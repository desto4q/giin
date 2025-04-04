import { useParams, useSearchParams } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { getByQuery } from "~/clients/supaFuncs";
import Card from "~/components/Card";
import Pagination from "~/components/Pagination";

function route() {
	let { query } = useParams();
	const [searchParams] = useSearchParams();
	let page = Number(searchParams.get("page"));
	let data = useQuery({
		queryKey: ["search", query],
		queryFn: async () =>
			await getByQuery(String(query), page == 0 ? 1 : page, 20),
	});
	if (data.isFetching) {
		return (
			<div className="min-h-[calc(100dvh-80px)] px-4">
				<h2 className="py-2 text-lh font-bold">
					<span className="opacity-50">Search:</span>{" "}
					<span className="opacity-75">{query}</span>
				</h2>
				<div className="grid  place-items-center">loading</div>
			</div>
		);
	}
	return (
		<div className="min-h-[calc(100dvh-80px)] px-4">
			<h2 className="py-2 text-lh font-bold">
				<span className="opacity-50">Search:</span>{" "}
				<span className="opacity-75">{query}</span>
			</h2>
			<div className="columns-2 md:columns-4 lg:col-end-5 pb-20">
				{data.data?.data?.map((e) => (
					<Card
						{...e}
						key={e.id}
					/>
				))}
			</div>
			<div className="fixed bottom-0 w-full grid place-items-center py-2 bg-base-300/25 left-0  rounded-b-lg">
				<Pagination totalPages={data.data?.totalPages as number} />
			</div>
		</div>
	);
}

export default route;
