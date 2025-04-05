import { json } from "@remix-run/node";
import CryptoJS from "crypto-js";

export let loader = () => {
    return json("not allowed", { status: 406 });
};

export let action = async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    const rawData = formData.get("data") as string;
    

    if (!rawData) {
        return json({ error: "Missing data" }, { status: 400 });
    }

    const secretKey = process.env.SECRET_KEY || "fallback-secret";

    try {
        const bytes = CryptoJS.AES.decrypt(rawData, secretKey);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        return json({ decrypted }); // ✅ valid Remix response
    } catch (err) {
        return json({ error: "Invalid encrypted data" }, { status: 400 });
    }
};
