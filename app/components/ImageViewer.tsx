function ImageViewer({ src }: { src?: string }) {
	return (
		<div className="w-full h-full ">
			<img
				src={src}
				className="w-full h-full rounded-md"
			/>
		</div>
	);
}

export default ImageViewer;
