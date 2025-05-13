"use client";

import { useEffect, useState } from "react";
import { NetworkService } from "../services/NetworkService";
import { MovieService } from "../services/MovieService";

export default function NetworkStatus() {
	const [status, setStatus] = useState<"online" | "offline" | "server-down">(
		"online"
	);
	const [pendingOps, setPendingOps] = useState(0);
	const networkService = NetworkService.getInstance();
	const movieService = new MovieService();

	useEffect(() => {
		const handleStatusChange = (event: CustomEvent) => {
			setStatus(event.detail.status);
		};

		const checkStatus = async () => {
			await networkService.checkServerStatus();
			setStatus(networkService.getStatus());
			setPendingOps(networkService.getPendingOperations().length);
		};

		// Initial check
		checkStatus();

		// Set up event listeners
		window.addEventListener(
			"networkStatusChange",
			handleStatusChange as EventListener
		);
		window.addEventListener("online", checkStatus);
		window.addEventListener("offline", checkStatus);

		// Set up periodic status check
		const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

		return () => {
			window.removeEventListener(
				"networkStatusChange",
				handleStatusChange as EventListener
			);
			window.removeEventListener("online", checkStatus);
			window.removeEventListener("offline", checkStatus);
			clearInterval(interval);
		};
	}, []);

	const handleSync = async () => {
		await movieService.syncPendingOperations();
		setPendingOps(0);
	};

	return (
		<div className="network-status">
			<div className={`status-indicator ${status}`}>
				{status === "online" && "🟢 Online"}
				{status === "offline" && "🔴 Offline"}
				{status === "server-down" && "🟡 Server Down"}
			</div>
			{pendingOps > 0 && (
				<div className="pending-ops">
					<span>{pendingOps} pending operations</span>
					{status === "online" && (
						<button onClick={handleSync}>Sync Now</button>
					)}
				</div>
			)}
			<style jsx>{`
				.network-status {
					position: fixed;
					top: 20px;
					right: 20px;
					padding: 10px;
					border-radius: 8px;
					background: white;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
					z-index: 1000;
				}
				.status-indicator {
					font-weight: bold;
					margin-bottom: 5px;
				}
				.status-indicator.online {
					color: #22c55e;
				}
				.status-indicator.offline {
					color: #ef4444;
				}
				.status-indicator.server-down {
					color: #eab308;
				}
				.pending-ops {
					display: flex;
					align-items: center;
					gap: 10px;
					font-size: 0.9em;
				}
				button {
					padding: 4px 8px;
					border-radius: 4px;
					background: #0070f3;
					color: white;
					border: none;
					cursor: pointer;
				}
				button:hover {
					background: #005bb5;
				}
			`}</style>
		</div>
	);
}
