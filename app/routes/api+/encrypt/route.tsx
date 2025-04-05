import { json } from "@remix-run/node"; // not from react
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
	const encrypted = CryptoJS.AES.encrypt(rawData, secretKey).toString();

	return json({ encrypted }); // ✅ Send proper JSON response
};
