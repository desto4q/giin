import { generateVideoThumbnail } from "generate-video-dumbnail";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify/unstyled";
interface UPLOAD {
	file: File;
	thumbnail: Blob;
}
let upload = async (props: UPLOAD) => {
	let form_data = new FormData();
	form_data.append("video", props.file);
	form_data.append("thumb", props.thumbnail);
	let resp = await fetch("/api/upload", {
		method: "POST",
		body: form_data,
	});

	let response = resp.json();
	return response;
};

let generate_thumb = async (url: string) => {
	try {
		let blob: Blob | undefined;
		let resp = await generateVideoThumbnail(url, 1, {
			onBlobCreated: (e) => {
				blob = e.blob;
			},
		});

		return blob;
	} catch (err) {
		throw new Error(err as any);
	}
};
let generate_image_thumb = async (blob: File) => {
	try {
		let resp = await imageCompression(blob, {
			maxSizeMB: 0.5,
		});
		return resp;
	} catch (err) {
		throw new Error(err as any);
	}
};

interface UPLOADBACKBLAZE {
	success: Boolean;
	thumbPath: string;
	videoPath: string;
}
export type { UPLOADBACKBLAZE };
const uploadMedia = async (url: string, uploadForm: FormData) => {
	try {
		const response = await toast.promise(
			async () => {
				const res = await fetch(url, {
					method: "POST",
					body: uploadForm,
				});
				if (!res.ok) throw new Error("Upload failed");
				return res;
			},
			{
				pending: "Uploading media...",
				success: "Uploaded successfully!",
				error: "Upload failed.",
			}
		);
		return response;
	} catch (error) {
		toast.error("upload_failed");
		throw new Error(error as any);
	}
};


export { upload, generate_thumb, generate_image_thumb ,uploadMedia};
