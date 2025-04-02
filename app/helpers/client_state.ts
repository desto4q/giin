import { atom } from "jotai";
import { USER } from "~/clients/supaFuncs";

interface AUTHFORM {
	email: string;
	password: string;
	username: string;
	fullname?: string;
}
let userFormAtom = atom<AUTHFORM | null>(null);

type SESSIONTYPE = "loading" | USER | null;
let sessionAtom = atom<SESSIONTYPE>("loading");
let tabs = ["edit", "posts"] as const;

let tabAtom = atom<(typeof tabs)[number]>("edit");
export { userFormAtom, sessionAtom,tabAtom };

	
export type { AUTHFORM };
