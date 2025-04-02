import { useNavigate } from "@remix-run/react";
import { useAtom } from "jotai";
import { Mail } from "lucide-react";
import { FormEvent, useEffect } from "react";
import { toast } from "react-toastify/unstyled";
import { signUp, SIGNUPTYPE } from "~/clients/supaFuncs";
import { userFormAtom } from "~/helpers/client_state";

function route() {
	let [authState, setAuthState] = useAtom(userFormAtom);
	let nav = useNavigate();
	useEffect(() => {
		if (!authState) {
			nav("/auth/signup");
		}
	}, []);
	let onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		let form = e.target as HTMLFormElement;

		let form_data = new FormData(form);
		let fullname = form_data.get("fullname") as string;
		// console.log(fullname);
		if (!authState) {
			return;
		}
		let authObject: SIGNUPTYPE = {
			...authState,
			fullname: fullname,
		};
		let sign_up_response = await toast.promise(
			async () => {
				return await signUp(authObject);
			},
			{
				pending: "signing Up",
				error: "failed to sign Up",
				success: "signed up",
			}
		);

		if (sign_up_response) {
			nav("/auth/login"); // ✅ Only navigate after successful login
		}
	};

	return (
		<div className="w-full min-h-[calc(100dvh-80px)] grid place-items-center bg-base-200 px-2 md:px-0">
			<form
				className="bg-base-100 p-4 w-full max-w-lg rounded-md outline outline-base-content/25"
				onSubmit={onSubmit}
			>
				<h2 className="text-xl font-bold mb-4">Details</h2>

				<div className="flex flex-col gap-2 w-full mt-4">
					<label
						htmlFor="email"
						className="text-md font-bold text-base-content/50"
					>
						Full Name
					</label>
					<label className="input w-full">
						<Mail className="text-base-content/50" />
						<input
							placeholder="Full Name"
							name="fullname"
							id="fullname"
							type="text"
							className="grow"
						/>
					</label>
				</div>

				<button className="btn bg-primary/25 w-full mt-4">
					Sign Up
				</button>
			</form>
		</div>
	);
}

export default route;
