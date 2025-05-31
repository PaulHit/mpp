"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
	user: User | null;
	session: Session | null;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	enable2FA: () => Promise<void>;
	verify2FA: (code: string) => Promise<void>;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			console.log("Initial session:", session);
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			console.log("Auth state changed:", _event, session);
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);

			// Handle redirection based on auth state
			if (_event === "SIGNED_IN") {
				console.log("User signed in, redirecting to movies...");
				// Use window.location for hard redirect
				window.location.href = "/movies";
			} else if (_event === "SIGNED_OUT") {
				console.log("User signed out, redirecting to login...");
				window.location.href = "/login";
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	const signIn = async (email: string, password: string) => {
		console.log("Attempting to sign in with email:", email);
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("Sign in error:", error);
			throw error;
		}

		console.log("Sign in successful:", data);
	};

	const signUp = async (email: string, password: string) => {
		console.log("Attempting to sign up with email:", email);
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback`,
			},
		});

		if (error) {
			console.error("Sign up error:", error);
			throw error;
		}

		console.log("Sign up successful:", data);
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
	};

	const enable2FA = async () => {
		const { error } = await supabase.auth.mfa.enroll({
			factorType: "totp",
		});
		if (error) throw error;
	};

	const verify2FA = async (code: string) => {
		const { error } = await supabase.auth.mfa.verify({
			factorId: "totp",
			challengeId: code,
			code,
		});
		if (error) throw error;
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				session,
				signIn,
				signUp,
				signOut,
				enable2FA,
				verify2FA,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
