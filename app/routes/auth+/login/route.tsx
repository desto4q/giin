import { useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { FormEvent, useEffect } from "react";
import { toast } from "react-toastify/unstyled";
import { checkUserExists, getSession, login } from "~/clients/supaFuncs";

function LoginRoute() {
	let updateSession = async () => {
		let session = await getSession();
		if (session) {
			nav("/");
		}
	};
	useEffect(() => {}, []);
	let queryClient = useQueryClient(); // ✅ Hook is always at the top
	let nav = useNavigate(); // ✅ Hook is always at the top

	let onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		let form = e.target as HTMLFormElement;
		let form_data = new FormData(form);
		let password = form_data.get("password") as string;
		let email = form_data.get("email") as string;

		let resp = await toast.promise(
			async () => await checkUserExists(email),
			{
				pending: "checking user",
			}
		);
		if (!resp) {
			toast.error("user_doesnt_exist");
			return;
		}

		let login_response = await login({ email: email, password: password });
		console.log("response");
		// console.log(resp);
		queryClient.invalidateQueries(); // ✅ Called after success
		nav("/"); // ✅ Only navigate after successful login
	};

	return (
		<div className="w-full min-h-[calc(100dvh-80px)] grid place-items-center bg-base-200 px-2 md:px-0">
			<form
				className="bg-base-100 p-4 w-full max-w-lg rounded-md outline outline-base-content/25"
				onSubmit={onSubmit}
			>
				<h2 className="text-xl font-bold mb-4">Login</h2>
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
				<button className="btn bg-primary/25 w-full mt-4">Login</button>
				<p className="opacity-50 text-sm py-2">New User?</p>
				<button
					onClick={(e) => {
						e.preventDefault();
						nav("/auth/signUp");
					}}
					className="btn bg-secondary/10 w-full "
				>
					signUp
				</button>
			</form>
		</div>
	);
}

export default LoginRoute;
