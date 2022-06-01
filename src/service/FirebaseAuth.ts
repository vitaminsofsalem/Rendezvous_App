import firebaseAuth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export class FirebaseAuth {
  private auth = firebaseAuth();

  subscribeToAuthChangesAndReturnUnsubscribe(
    onAuthStateChange: (isLoggedIn: boolean) => void
  ): () => void {
    const unsubscribe = this.auth.onAuthStateChanged((user) =>
      onAuthStateChange(!!user)
    );
    return unsubscribe;
  }

  getCurrentUser(): FirebaseAuthTypes.User | null {
    return this.auth.currentUser;
  }

  async registerWithEmailAndPassword(
    email: string,
    password: string,
    name: string
  ): Promise<FirebaseAuthTypes.User> {
    const result = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    await result.user.updateProfile({ displayName: name });
    return result.user;
  }

  async updateUserPhoto(photoUrl: string) {
    const user = this.getCurrentUser();
    if (!user) {
      throw Error("Can't update photo when not signed in");
    }
    await user.updateProfile({ photoURL: photoUrl });
  }

  async loginWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<FirebaseAuthTypes.User> {
    const result = await this.auth.signInWithEmailAndPassword(email, password);
    return result.user;
  }

  async logOut() {
    await this.auth.signOut();
  }
}
