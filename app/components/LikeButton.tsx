import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify/unstyled";
import {
	checkIfUserLikedPost,
	likePost,
	POSTDATATYPE,
	unLikePost,
} from "~/clients/supaFuncs";

interface LIKEDTYPE extends POSTDATATYPE {
	session_id: string;
}
function LikeButton(props: LIKEDTYPE) {
	let data = useQuery({
		queryKey: ["saved_post", props.id],
		queryFn: async () =>
			await checkIfUserLikedPost(props.id, props.session_id),
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});
	useEffect(() => {
		console.log(Infinity);
	}, []);
	if (data.isFetching) {
		return (
			<button
				disabled
				className="btn btn-circle p-2"
				onClick={() => {}}
			>
				<Heart />
			</button>
		);
	}

	return (
		<button
			className="btn btn-circle btn-ghost "
			onClick={async () => {
				if (data.data) {
					let resp = await toast.promise(
						async () => {
							return await unLikePost(props.id, props.session_id);
						},
						{
							pending: "unliking",
							error: "error",
							success: "unliked",
						}
					);
					data.refetch();
					return resp;
				}
				let resp = await toast.promise(
					async () => {
						return await likePost(props.id, props.session_id);
					},
					{
						pending: "liking",
						error: "error",
						success: "liked",
					}
				);
				console.log(resp);
				data.refetch();
			}}
		>
			{!data.data ? (
				<Heart />
			) : (
				<Heart
					fill="red"
					stroke="red"
				/>
			)}
		</button>
	);
}

export default LikeButton;
