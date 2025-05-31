"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function TwoFactorSetup() {
	const [step, setStep] = useState<"initial" | "qr" | "verify">("initial");
	const [qrCode, setQrCode] = useState("");
	const [verificationCode, setVerificationCode] = useState("");
	const [error, setError] = useState("");
	const { enable2FA, verify2FA } = useAuth();

	const handleEnable2FA = async () => {
		try {
			const { data, error } = await supabase.auth.mfa.enroll();
			if (error) throw error;
			setQrCode(data.totp_uri);
			setStep("qr");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to enable 2FA");
		}
	};

	const handleVerify2FA = async () => {
		try {
			await verify2FA(verificationCode);
			setStep("verify");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to verify 2FA");
		}
	};

	if (step === "initial") {
		return (
			<div className="text-center">
				<h3 className="text-lg font-medium text-gray-900">
					Enable Two-Factor Authentication
				</h3>
				<p className="mt-2 text-sm text-gray-500">
					Add an extra layer of security to your account by enabling 2FA.
				</p>
				<button
					onClick={handleEnable2FA}
					className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					Enable 2FA
				</button>
			</div>
		);
	}

	if (step === "qr") {
		return (
			<div className="text-center">
				<h3 className="text-lg font-medium text-gray-900">Scan QR Code</h3>
				<p className="mt-2 text-sm text-gray-500">
					Scan this QR code with your authenticator app
				</p>
				<div className="mt-4">
					<img src={qrCode} alt="2FA QR Code" className="mx-auto" />
				</div>
				<div className="mt-4">
					<input
						type="text"
						value={verificationCode}
						onChange={(e) => setVerificationCode(e.target.value)}
						placeholder="Enter verification code"
						className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
					<button
						onClick={handleVerify2FA}
						className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Verify
					</button>
				</div>
				{error && <p className="mt-2 text-sm text-red-600">{error}</p>}
			</div>
		);
	}

	return (
		<div className="text-center">
			<h3 className="text-lg font-medium text-gray-900">2FA Enabled!</h3>
			<p className="mt-2 text-sm text-gray-500">
				Two-factor authentication has been successfully enabled for your
				account.
			</p>
		</div>
	);
}
