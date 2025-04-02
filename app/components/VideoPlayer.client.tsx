import { Suspense } from "react";
import { ClientOnly } from "remix-utils/client-only";
import "react-tuby/css/main.css";
import { Replay } from "vimond-replay";
import 'vimond-replay/index.css';
export default function CustomPlayer({ src }: { src: string }) {
	return (
		<div className="w-full h-full relative max-h-[550px]">
			<Suspense fallback={<></>}>
				<ClientOnly fallback={<></>}>
					{() => <Replay source={src} />}
				</ClientOnly>
			</Suspense>
		</div>
	);
}
