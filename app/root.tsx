import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLocation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./tailwind.css";
import NavBar from "~/components/NavBar";
import Sidebar from "~/components/Sidebar";
import { ToastContainer } from "react-toastify/unstyled";
import { Suspense, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
	QueryClient,
	QueryClientConfig,
	QueryClientProvider,
} from "@tanstack/react-query";
import { themes } from "./helpers/helpers";
import { useAtom } from "jotai";
import { sessionAtom } from "./helpers/client_state";
import { getSession } from "./clients/supaFuncs";
import NavSidebar from "./components/NavSideBar";
export const links: LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

let options: QueryClientConfig = {};

let client = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
	// const { ENV } = useLoaderData<typeof loader>();
	const location = useLocation();
	let [sessionState, setSession] = useAtom(sessionAtom);
	let updateSession = async () => {
		setSession(await getSession());
	};

	useEffect(() => {
		if (sessionState == "loading" || sessionState == null) {
			updateSession();
		}
	}, [location.pathname]);

	return (
		<html
			lang="en"
			data-theme={themes.abyss}
		>
			<head>
				{/* <script
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(ENV)}`,
					}}
				/> */}
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Meta />
				<Links />
				<style />
			</head>
			<QueryClientProvider client={client}>
				<body className="flex bg-base-200">
					<Suspense fallback={null}>
						<ToastContainer theme="dark" />
					</Suspense>
					<aside className="hidden sm:block">
						<Sidebar />
					</aside>
					<NavSidebar />

					<div className="w-full rounded-xl drop-shadow-xl overflow-hidden bg-base-100 relative">
						<NavBar />
						<main className="">
							{children}
							<ScrollRestoration />
							<Scripts />
						</main>
					</div>
				</body>
			</QueryClientProvider>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
