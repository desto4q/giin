import { b2 } from "~/clients/backblaze";
export let loader = async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const fileName = decodeURIComponent(pathname.replace("/api/get/", ""));

    await b2.authorize();

    // Get signed URL for direct file access
    const { data } = await b2.getDownloadAuthorization({
        bucketId: "020c1b0b5272ec419f5d0719",
        fileNamePrefix: fileName,
        
        validDurationInSeconds: 60 * 60, // 1 hour
    });
    // Construct full file URL with token
    const fileUrl = `https://f003.backblazeb2.com/file/giin-stash/${data.fileNamePrefix}?Authorization=${data.authorizationToken}`;

    // Redirect client to the signed URL (browser will handle range requests)
    return new Response(null, {
        status: 302,
        headers: {
            Location: fileUrl,
        },
    });
};