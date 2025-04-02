import { json } from "@remix-run/react";

export let loader = async function name() {
	return json({ hello: "world" });
};
