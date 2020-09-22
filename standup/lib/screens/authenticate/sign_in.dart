import 'package:flutter/material.dart';
import 'package:standup/services/auth.dart';

class SignIn extends StatefulWidget {
  @override
  _SignInState createState() => _SignInState();
}

class _SignInState extends State<SignIn> {
  final AuthService _auth = AuthService();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.purple[100],
      appBar: AppBar(
          backgroundColor: Colors.purple[300],
          elevation: 0.0,
          title: Text('Sign In Screen')),
      body: Container(
        padding: EdgeInsets.symmetric(vertical: 20.0, horizontal: 50.0),
        child: RaisedButton(
          child: Text('Sign In with Google'),
          onPressed: () async {
            dynamic result = await _auth.signInWithGoogle();
            if (result == null) {
              print('Error signing in');
            } else {
              print('signed in');
            }
          },
        ),
      ),
    );
  }
}
