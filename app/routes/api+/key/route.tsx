import { json } from "@remix-run/react";

export let loader = async () => {
	return json({ message: "You are not allowed to see the secret!" });
};

export const action = async () => {
	const secret = process.env.SECRET_KEY;
	if (!secret) {
		return json({ error: "Secret key is missing!" }, { status: 500 });
	}

	return json({ secret }); // The key never reaches the client directly
};
