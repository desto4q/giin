import { json } from "@remix-run/node"; // Correct import
import { nanoid } from "nanoid";
import { b2 } from "~/clients/backblaze";

interface UPLOADURL {
	uploadUrl: string;
	bucketId: string;
	authorizationToken: string;
}

// POST request (File Upload)
export let action = async ({ request }: { request: Request }) => {
	try {
		// Parse form data from the request
		const formData = await request.formData();
		// Get files from formData
		const file = formData.get("image") as File;
		const thumb = formData.get("thumb") as File;

		if (!file || !thumb) {
			return json(
				{ error: "Missing file or thumbnail" },
				{ status: 400 }
			);
		}

		// Convert File to Buffer
		let thumb_buffer = Buffer.from(await thumb.arrayBuffer());
		let file_buffer = Buffer.from(await file.arrayBuffer());

		// Authorize with Backblaze
		await b2.authorize();
		let resp = await b2.getUploadUrl({
			bucketId: "020c1b0b5272ec419f5d0719",
		});
		let upload_data = resp.data as UPLOADURL;
		let gen_id = nanoid(4);
		let thumb_path = "thumbs/" + gen_id + ".jpg";
		let video_path = "images/" + gen_id + file.name;
		// Upload video
		await b2.uploadFile({
			uploadUrl: upload_data.uploadUrl,
			uploadAuthToken: upload_data.authorizationToken,
			fileName: video_path,
			data: file_buffer,
			mime: file.type,
		});

		// Upload thumbnail

		await b2.uploadFile({
			uploadUrl: upload_data.uploadUrl,
			uploadAuthToken: upload_data.authorizationToken,
			fileName: thumb_path,
			data: thumb_buffer,
			mime: "image/jpeg",
		});

		return json({
			success: true,
			thumbPath: thumb_path,
			videoPath: video_path,
		});
	} catch (error: any) {
		console.log(error);
		return json({ error: error.message }, { status: 500 });
	}
};

// GET request (Fetch Upload URL)
export let loader = async () => {
	try {
		await b2.authorize();
		let resp = await b2.getUploadUrl({
			bucketId: "020c1b0b5272ec419f5d0719",
		});
		return json(resp.data);
	} catch (err) {
		console.log(err);
		return json({ error: "Failed to fetch upload URL" }, { status: 500 });
	}
};
