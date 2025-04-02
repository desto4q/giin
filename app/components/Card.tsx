import { Link } from "@remix-run/react";

let Card = (props: any) => {
	return (
		<Link
			to={`/post/${props.id}`}
			className="break-inside-avoid mb-4 drop-shadow-md rounded-lg overflow-hidden flex flex-col cursor-pointer bg-base-100 max-h-[500px]"
			
		>
			<img
				src={props.thumbnail_url}
				alt=""
				className="w-full h-auto rounded-lg min-h-[150px] object-cover"
			/>
			<div className="p-2  text-xs">{props.title}</div>
		</Link>
	);
};

export default Card;
