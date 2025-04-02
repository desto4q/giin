// import "react-tuby/css/main.css";
// import "vimond-replay/index.css";
import { Suspense } from "react";
import { Player } from "react-tuby";
import "react-tuby/css/main.css";
export default function CustomPlayer({ src }: { src: string }) {
	return (
		<div className="w-full h-full relative ">
			<Suspense fallback={<></>}>
				<Player
					src={src}
					dimensions={{
						height: "100%",
						width: "100%",
					}}
					pictureInPicture
				/>
			</Suspense>
		</div>
	);
}
