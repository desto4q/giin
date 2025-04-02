import { FullscreenIcon } from "lucide-react";
import { Suspense, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css"; // You need to import the CSS only once
import { Fullscreen, Zoom, Download } from "yet-another-react-lightbox/plugins";
function ImageViewer({ src }: { src?: string }) {
	let [open, setOpen] = useState<boolean>(false);
	return (
		<div className="w-full h-full  relative isolate">
			<img
				src={src}
				className="w-full h-full rounded-md object-contain"
			/>
			<button
				className="absolute bottom-0 right-0 p-1 btn btn-circle  btn-primary mr-8 mb-8"
				onClick={() => {
					setOpen(true);
				}}
			>
				<FullscreenIcon />
			</button>
			<Suspense>
				<Lightbox
					plugins={[Fullscreen, Zoom, Download]}
					slides={[{ src: src as string, width: 1000, height: 700 }]}
					className="w-full h-full"
					open={open}
					close={() => setOpen(false)}
				/>
			</Suspense>
		</div>
	);
}

export default ImageViewer;
