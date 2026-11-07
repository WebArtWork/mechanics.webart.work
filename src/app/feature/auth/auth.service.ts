import { inject, Service, signal } from '@angular/core';
import type { User } from 'firebase/auth';
import { AccountService } from '../account/account.service';
import { FirebaseService } from '../firebase/firebase.service';

/** Progress kept in the browser (theory self-checks); removed with the account. */
const LOCAL_PROGRESS_KEYS = ['mechanics_theory'];

/** Google and Apple sign-in through Firebase Auth. */
@Service()
export class AuthService {
	private readonly _firebase = inject(FirebaseService);
	private readonly _account = inject(AccountService);

	/** `undefined` until Firebase restores the session; `null` when signed out. */
	readonly user = signal<User | null | undefined>(undefined);

	private _ready: Promise<void> | null = null;

	/**
	 * Resolves with the current user once Firebase has checked the persisted session.
	 * Only the first check is awaited; later calls read the live `user` signal.
	 */
	async whenReady(): Promise<User | null> {
		this._ready ??= this._restore();
		await this._ready;
		return this.user() ?? null;
	}

	async signInWithGoogle(): Promise<User> {
		const auth = await this._firebase.auth();
		if (!auth) throw new Error('Sign-in is only available in the browser.');

		const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
		const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
		this.user.set(user);
		await this._account.saveIdentity(user);
		return user;
	}

	async signInWithApple(): Promise<User> {
		const auth = await this._firebase.auth();
		if (!auth) throw new Error('Sign-in is only available in the browser.');

		const { signInWithPopup } = await import('firebase/auth');
		const { user } = await signInWithPopup(auth, await this._appleProvider());
		this.user.set(user);
		await this._account.saveIdentity(user);
		return user;
	}

	async signOut(): Promise<void> {
		const auth = await this._firebase.auth();
		if (auth) {
			const { signOut } = await import('firebase/auth');
			await signOut(auth);
		}
		this.user.set(null);
	}

	/**
	 * Deletes the account and everything stored for it, then the progress kept on this device.
	 * Firebase only deletes a user who signed in recently, so this asks for Google sign-in again first;
	 * that also confirms it is really the owner. Apple accounts also get their Apple token revoked.
	 */
	async deleteAccount(): Promise<void> {
		const auth = await this._firebase.auth();
		const user = auth?.currentUser;
		if (!user) throw new Error('Not signed in.');

		const { deleteUser, GoogleAuthProvider, OAuthProvider, reauthenticateWithPopup, revokeAccessToken } = await import('firebase/auth');
		const isApple = user.providerData.some((info) => info.providerId === 'apple.com');
		if (isApple) {
			const result = await reauthenticateWithPopup(user, await this._appleProvider());
			const token = OAuthProvider.credentialFromResult(result)?.accessToken;
			await this._account.deleteData(user.uid);
			if (token) await revokeAccessToken(auth, token).catch((error) => console.error(error));
		} else {
			await reauthenticateWithPopup(user, new GoogleAuthProvider());
			await this._account.deleteData(user.uid);
		}
		await deleteUser(user);
		for (const key of LOCAL_PROGRESS_KEYS) localStorage.removeItem(key);
		this.user.set(null);
	}

	private async _appleProvider() {
		const { OAuthProvider } = await import('firebase/auth');
		const provider = new OAuthProvider('apple.com');
		provider.addScope('email');
		provider.addScope('name');
		return provider;
	}

	private async _restore(): Promise<void> {
		const auth = await this._firebase.auth();
		if (!auth) {
			this.user.set(null);
			return;
		}

		const { onAuthStateChanged } = await import('firebase/auth');
		await new Promise<void>((resolve) => {
			let resolved = false;
			onAuthStateChanged(auth, (user) => {
				this.user.set(user);
				if (!resolved) {
					resolved = true;
					resolve();
				}
			});
		});
	}
}
