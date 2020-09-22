import 'package:flutter/material.dart';
import 'package:standup/services/auth.dart';

class Home extends StatelessWidget {
  final AuthService _auth = AuthService();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.purple[50],
      appBar: AppBar(
        title: Text('Home'),
        backgroundColor: Colors.purple[300],
        elevation: 0.0,
        actions: <Widget>[
          FlatButton.icon(
              icon: Icon(Icons.exit_to_app),
              label: Text('Sign Out'),
              onPressed: () async {
                await _auth.signOut();
              })
        ],
      ),
    );
  }
}
