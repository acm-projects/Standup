import 'package:firebase_auth/firebase_auth.dart';
import 'package:standup/models/standup_user.dart';
import 'package:google_sign_in/google_sign_in.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // create StandupUser object based on firebase_auth.User's uid
  StandupUser _userFromFirebaseUser(User user) {
    if (user != null) {
      return StandupUser(uid: user.uid, displayName: user.displayName);
    } else {
      return null;
    }
  }

  // Auth Change user stream
  Stream<StandupUser> get user {
    return _auth
        .authStateChanges()
        .map((User user) => _userFromFirebaseUser(user));
  }

  // sign in with email/password
  Future signInEmail(String email, String password) async {
    try {
      UserCredential userCred = await _auth.signInWithEmailAndPassword(
          email: email, password: password);
      StandupUser user = _userFromFirebaseUser(userCred.user);
      return user;
    } catch (e) {
      print(e.toString());
      return null;
    }
  }

  // sign in with Google OAuth
  Future signInWithGoogle() async {
    try {
      // Starts Authentication Flow
      final GoogleSignInAccount googleUser = await GoogleSignIn().signIn();
      // Obtains Authentication details from googleUser
      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;
      // Creates new credential
      final GoogleAuthCredential credential = GoogleAuthProvider.credential(
          accessToken: googleAuth.accessToken, idToken: googleAuth.idToken);
      UserCredential userCred = await _auth.signInWithCredential(credential);
      StandupUser user = _userFromFirebaseUser(userCred.user);
      return user;
    } catch (e) {
      print(e.toString());
      return null;
    }
  }

  // register with email/password
  Future registerWithEmail(String email, String password) async {
    try {
      UserCredential userCred = await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
      StandupUser user = _userFromFirebaseUser(userCred.user);
      return user;
    } catch (e) {
      print(e.toString());
      return null;
    }
  }

  // sign out
  Future signOut() async {
    try {
      return await _auth.signOut();
    } catch (e) {
      print(e.toString());
      return null;
    }
  }
}
