import { useQuery } from "@tanstack/react-query";
import { getPostsByUsername, USER } from "~/clients/supaFuncs";
import Card from "./Card";
import { gen } from "~/helpers/helpers";
import { useSearchParams } from "@remix-run/react";
import Pagination from "./Pagination";

function ProfilePostTab(props: USER) {
	const [searchParams] = useSearchParams();
	let page = Number(searchParams.get("page"));
	let data = useQuery({
		queryKey: ["profile", props.id, "posts"],
		queryFn: async () =>
			await getPostsByUsername(
				props.user_info.username,
				page == 0 ? 1 : page,
				20
			),
	});

	if (data.isFetching) {
		return <>loading</>;
	}
	if (data.error) {
		return <>error</>;
	}
	return (
		<div className="columns-3  md:columns-5 pb-20">
			{data.data?.data.map((e) => {
				return (
					<Card
						{...e}
						key={gen()}
					/>
				);
			})}
			<div className="fixed bottom-0 w-full grid place-items-center py-2 bg-base-300/25 left-0  rounded-b-lg">
				<Pagination totalPages={data.data?.totalPages as number} />
			</div>
		</div>
	);
}

export default ProfilePostTab;
