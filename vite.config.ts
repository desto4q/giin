import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { flatRoutes } from "remix-flat-routes";
import { cjsInterop } from "vite-plugin-cjs-interop";
export default defineConfig({
	plugins: [
		cjsInterop({
			dependencies: ["react-loader-spinner", "vimond-replay","react-video-master"],
		}),
		remix({
			routes(defineRoutes) {
				return flatRoutes("routes", defineRoutes, {
					ignoredRouteFiles: ["**/.*"], // Ignore dot files (like .DS_Store)
					//appDir: 'app',
					//routeDir: 'routes',
					//basePath: '/',
					//paramPrefixChar: '$',
					//nestedDirectoryChar: '+',
					//routeRegex: /((\${nestedDirectoryChar}[\/\\][^\/\\:?*]+)|[\/\\]((index|route|layout|page)|(_[^\/\\:?*]+)|([^\/\\:?*]+\.route)))\.(ts|tsx|js|jsx|md|mdx)$$/,
				});
			},
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				v3_singleFetch: true,
				v3_lazyRouteDiscovery: true,
			},ignoredRouteFiles:["**/.*"]
		}),
		
		tsconfigPaths(),
	],
	resolve: {},
});
