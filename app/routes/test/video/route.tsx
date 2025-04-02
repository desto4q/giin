import { createReadStream } from "fs";
import { resolve } from "path";

export let loader = async () => {
    const videoPath = resolve("public", "Vidify 2025-03-31 at 09.19.12 PM.mp4");

    const stream = createReadStream(videoPath);
    
    return new Response(stream, {
        headers: {
            "Content-Type": "video/mp4",
            "Accept-Ranges": "bytes", // Enables seeking
            "Cache-Control": "no-store", // Optional: Prevents caching
        },
    });
};
