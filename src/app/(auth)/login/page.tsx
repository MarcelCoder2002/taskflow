"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "../../../lib/auth-client";

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const registered = searchParams.get("registered");

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			const {error} = await authClient.signIn.email({
				email,
				password,
			});


			if (error) {
				throw new Error(error.message || "Email ou mot de passe incorrect");
			}

			// Redirect to dashboard
			router.push("/dashboard");
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Une erreur est survenue");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Connexion à TaskFlow
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Ou{" "}
						<Link
							href="/register"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							créez un compte gratuitement
						</Link>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={onSubmit}>
					{registered && (
						<div className="rounded-md bg-green-50 p-4">
							<p className="text-sm text-green-800">
								Compte créé avec succès ! Vous pouvez maintenant vous connecter.
							</p>
						</div>
					)}

					{error && (
						<div className="rounded-md bg-red-50 p-4">
							<p className="text-sm text-red-800">{error}</p>
						</div>
					)}

					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="email" className="sr-only">
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Adresse email"
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Mot de passe
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Mot de passe"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Connexion..." : "Se connecter"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}