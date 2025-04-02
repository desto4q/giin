import { b2 } from "~/clients/backblaze";

export let loader = async ({ request }: { request: Request }) => {
	// Get the pathname from the request URL
	const url = new URL(request.url);
	const pathname = url.pathname;
	const fileName = decodeURIComponent(pathname.replace("/api/get/", ""));

	await b2.authorize();

	// Stream file from Backblaze B2
	let resp = await b2.downloadFileByName({
		bucketName: "giin-stash",
		fileName,
		responseType: "stream", // Stream the file
	});

	// Get content type (important for proper rendering)
	const contentType =
		resp.headers["content-type"] || "application/octet-stream";

	// Return the streamed response
	return new Response(resp.data, {
		headers: {
			"Content-Type": contentType,
			"Content-Disposition": `inline; filename="${fileName}"`,
			"Cache-Control": "public, max-age=31536000, immutable", // Optimized caching for static assets
			"Transfer-Encoding": "chunked", // Enables streaming
		},
	});
};
