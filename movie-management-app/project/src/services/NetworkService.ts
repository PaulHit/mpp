import { Movie } from "../domain/Movie";

type NetworkStatus = "online" | "offline" | "server-down";

export class NetworkService {
	private static instance: NetworkService;
	private status: NetworkStatus = "online";
	private pendingOperations: Array<{
		type: "create" | "update" | "delete";
		data: any;
		timestamp: number;
	}> = [];

	private constructor() {
		// Initialize network status listeners
		if (typeof window !== "undefined") {
			window.addEventListener("online", () => this.setStatus("online"));
			window.addEventListener("offline", () => this.setStatus("offline"));
		}
	}

	public static getInstance(): NetworkService {
		if (!NetworkService.instance) {
			NetworkService.instance = new NetworkService();
		}
		return NetworkService.instance;
	}

	public getStatus(): NetworkStatus {
		return this.status;
	}

	public setStatus(status: NetworkStatus): void {
		this.status = status;
		// Dispatch a custom event that components can listen to
		if (typeof window !== "undefined") {
			window.dispatchEvent(
				new CustomEvent("networkStatusChange", { detail: { status } })
			);
		}
	}

	public async checkServerStatus(): Promise<boolean> {
		try {
			const response = await fetch("/api/movies");
			if (!response.ok) {
				this.setStatus("server-down");
				return false;
			}
			this.setStatus("online");
			return true;
		} catch (error) {
			this.setStatus("offline");
			return false;
		}
	}

	public addPendingOperation(
		type: "create" | "update" | "delete",
		data: any
	): void {
		this.pendingOperations.push({
			type,
			data,
			timestamp: Date.now(),
		});
		this.savePendingOperations();
	}

	public getPendingOperations(): Array<{
		type: "create" | "update" | "delete";
		data: any;
		timestamp: number;
	}> {
		return this.pendingOperations;
	}

	public clearPendingOperations(): void {
		this.pendingOperations = [];
		this.savePendingOperations();
	}

	private savePendingOperations(): void {
		if (typeof window !== "undefined") {
			localStorage.setItem(
				"pendingOperations",
				JSON.stringify(this.pendingOperations)
			);
		}
	}

	public loadPendingOperations(): void {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("pendingOperations");
			if (stored) {
				this.pendingOperations = JSON.parse(stored);
			}
		}
	}
}
