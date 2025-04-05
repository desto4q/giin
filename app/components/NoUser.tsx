import { useNavigate } from "@remix-run/react";

function NoUser() {
	let navigate = useNavigate();
	return (
		<div className="w-full h-[calc(100dvh-80px)] grid place-items-center">
			<div className="flex flex-col gap-2">
				Not Logged in
				<button
					className="btn btn-soft btn-primary"
					onClick={() => {
						navigate("/auth/login");
					}}
				>
					Login
				</button>
			</div>
		</div>
	);
}

export default NoUser;
