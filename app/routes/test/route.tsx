import { Outlet } from "@remix-run/react";

function route() {
	return (
		<div>
			route <Outlet />
		</div>
	);
}

export default route;
