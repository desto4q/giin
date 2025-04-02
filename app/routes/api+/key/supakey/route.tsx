import { json } from "@remix-run/react";

export let action = async () => {
	const secret = process.env.SUPA_KEY;

	if (!secret) {
		return json({ error: "Secret key is missing!" }, { status: 500 });
	}
	return json({ secret: secret }, { status: 200 });
};
