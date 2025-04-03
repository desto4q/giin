import { useQuery } from "@tanstack/react-query";
import { getPostsByUsername, USER } from "~/clients/supaFuncs";
import Card from "./Card";
import { gen } from "~/helpers/helpers";

function ProfilePostTab(props: USER) {
	let data = useQuery({
		queryKey: ["profile", props.id, "posts"],
		queryFn: async () => await getPostsByUsername(props.user_info.username),
	});

	if (data.isFetching) {
		return <>loading</>;
	}
	if (data.error) {
		return <>error</>;
	}
	return (
		<div className="columns-3  md:columns-5">
			{data.data?.map((e) => {
				return (
					<Card
						{...e}
						key={gen()}
					/>
				);
			})}
		</div>
	);
}

export default ProfilePostTab;
