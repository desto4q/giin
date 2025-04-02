import VideoPlayer from "~/components/VideoPlayer";

function route() {
	return (
		<div className="max-h-[500px]   h-[500px] mx-4 rounded-md overflow-hidden">
			<VideoPlayer src={"public/Vidify 2025-03-31 at 09.19.12 PM.mp4"} />
		</div>
	);
}

export default route;
