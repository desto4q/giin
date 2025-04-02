import { useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { checkUserExists, checkUserName } from "~/clients/supaFuncs";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify/unstyled";
import { useAtom } from "jotai";
import { userFormAtom } from "~/helpers/client_state";
function index() {
	let queryClient = useQueryClient();
	let nav = useNavigate();
	let [authState, setAuthState] = useAtom(userFormAtom);
	let onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		let form = e.target as HTMLFormElement;
		let form_data = new FormData(form);
		let email = form_data.get("email") as string;
		let password = form_data.get("password") as string;
		let username = form_data.get("username") as string;
		let resp = await toast.promise(
			async () => await checkUserExists(email),
			{
				pending: "checking user",
			}
		);
		if (resp) {
			console.log(resp);
			return toast.error("email exists");
		}
		let authObject = {
			email,
			password,
			username,
		};
		setAuthState(authObject);
		nav("/auth/signup/details");
		return;
		
		// queryClient.invalidateQueries(); // ✅ Called after success
	};
	let [taken, setTaken] = useState<boolean | null>(null);
	const [value, setValue] = useState("");
	// Debounce callback
	const debounced = useDebouncedCallback(
		// function
		async (value) => {
			let resp = await checkUserName(value);
			setTaken(resp);
			setValue(value);
		},
		// delay in ms
		750
	);

	return (
		<div className="w-full min-h-[calc(100dvh-80px)] grid place-items-center bg-base-200 px-2 md:px-0">
			<form
				autoComplete={"off"}
				autoFocus={false}
				className="bg-base-100 p-4 w-full max-w-lg rounded-md outline outline-base-content/25"
				onSubmit={onSubmit}
			>
				<h2 className="text-xl font-bold mb-4">Sign Up</h2>

				<div className="flex flex-col gap-2 w-full mt-4">
					<label
						htmlFor="email"
						className="text-md font-bold text-base-content/50"
					>
						Email
					</label>
					<label className="input w-full">
						<Mail className="text-base-content/50" />
						<input
							placeholder="email"
							name="email"
							id="email"
							type="email"
							className="grow"
						/>
					</label>
				</div>
				<div className="flex flex-col gap-2 w-full mt-4">
					<label
						htmlFor="password"
						className="text-md font-bold text-base-content/50"
					>
						Password
					</label>
					<label className="input w-full">
						<Mail className="text-base-content/50" />
						<input
							placeholder="password"
							name="password"
							id="password"
							type="password"
							className="grow"
						/>
					</label>
				</div>
				<div className="flex flex-col gap-2 w-full mt-4">
					<label
						htmlFor="email"
						className="text-md font-bold text-base-content/50"
					>
						Username
					</label>
					<label className="input w-full">
						<Mail className="text-base-content/50" />
						<input
							defaultValue={value}
							onChange={(e) => debounced(e.target.value)}
							placeholder="username"
							name="username"
							id="username"
							type="text"
							required
							className="grow"
						/>
					</label>
					{taken == null ? null : taken ? (
						<p className="badge-error badge-sm badge">
							{" "}
							username taken`
						</p>
					) : (
						<p className="badge-success badge-sm badge font-bold">
							username free
						</p>
					)}
				</div>

				<button className="btn bg-primary/25 w-full mt-4">
					Sign Up
				</button>
			</form>
		</div>
	);
}

export default index;
