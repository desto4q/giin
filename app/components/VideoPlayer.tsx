import { Suspense } from "react";
import "react-tuby/css/main.css";
import "vimond-replay/index.css";
import { Player } from "react-tuby";
import "react-tuby/css/main.css";
import { ClientOnly } from "remix-utils/client-only";

export default function CustomPlayer({ src }: { src: string }) {
	return (
		<div className="w-full h-full relative max-h-[550px]">
			<Suspense fallback={<></>}>
				<ClientOnly fallback={<></>}>
					{() => <Player src={src} />}
				</ClientOnly>
			</Suspense>
		</div>
	);
}
