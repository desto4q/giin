import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./tailwind.css";
import NavBar from "~/components/NavBar";
import Sidebar from "~/components/Sidebar";
import { ToastContainer } from "react-toastify/unstyled";
import { Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
	QueryClient,
	QueryClientConfig,
	QueryClientProvider,
} from "@tanstack/react-query";
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

// export const loader = () => {
// 	return json({
// 		ENV: {
// 			SUPA_KEY: process.env.SUPA_KEY,
// 		},
// 	});
// };
const themes = {
	light: "light",
	dark: "dark",
	cupcake: "cupcake",
	bumblebee: "bumblebee",
	emerald: "emerald",
	corporate: "corporate",
	synthwave: "synthwave",
	retro: "retro",
	cyberpunk: "cyberpunk",
	valentine: "valentine",
	halloween: "halloween",
	garden: "garden",
	forest: "forest",
	aqua: "aqua",
	lofi: "lofi",
	pastel: "pastel",
	fantasy: "fantasy",
	wireframe: "wireframe",
	black: "black",
	luxury: "luxury",
	dracula: "dracula",
	cmyk: "cmyk",
	autumn: "autumn",
	business: "business",
	acid: "acid",
	lemonade: "lemonade",
	night: "night",
	coffee: "coffee",
	winter: "winter",
	dim: "dim",
	nord: "nord",
	sunset: "sunset",
	caramellatte: "caramellatte",
	abyss: "abyss",
	silk: "silk",
};

export function Layout({ children }: { children: React.ReactNode }) {
	// const { ENV } = useLoaderData<typeof loader>();

	return (
		<html
			lang="en"
			data-theme={themes.dark}
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
					<div className="w-full rounded-xl drop-shadow-xl overflow-hidden bg-base-100">
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
