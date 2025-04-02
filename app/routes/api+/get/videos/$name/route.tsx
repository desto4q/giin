import { b2 } from "~/clients/backblaze";

export let loader = async ({ request }: { request: Request }) => {
	// Get the pathname from the request URL
	const url = new URL(request.url);
	const pathname = url.pathname;
	const fileName = decodeURIComponent(pathname.replace("/api/get/", ""));

	await b2.authorize();

	// Stream file from B2
	let resp = await b2.downloadFileByName({
		bucketName: "giin-stash",
		fileName,
		responseType: "stream",
	});

	// Get file content type (default to binary if unknown)
	const contentType =
		resp.headers["content-type"] || "application/octet-stream";

	// Return the stream response
	return new Response(resp.data, {
		headers: {
			"Content-Type": contentType,
			"Content-Disposition": `inline; filename="${fileName}"`,
			"Transfer-Encoding": "chunked",
		},
	});
};
