import { useQuery } from "@tanstack/react-query";
import { getPosts } from "~/clients/supaFuncs";
import Card from "~/components/Card";
import { gen } from "~/helpers/helpers";

function Index() {
	let data = useQuery({
		queryKey: ["default_posts"],
		queryFn: async () => await getPosts(),
	});

	if (data.isError) {
		return <div>error</div>;
	}
	if (data.isFetching) {
		return <>loading</>;
	}
	return (
		<div className="px-2">
			{/* <h2 className="text-lg font-bold py-2">Recent Post</h2> */}
			<div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 p-2  rounded-md">
				{data.data?.map((e) => (
					<Card
						{...e}
						key={gen()}
					/>
				))}
			</div>
			
		</div>
	);
}

export default Index;
