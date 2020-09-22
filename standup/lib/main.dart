import 'package:flutter/material.dart';
import 'package:standup/screens/authListener.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:standup/services/auth.dart';
import 'package:standup/models/standup_user.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.

  @override
  Widget build(BuildContext context) {
    return StreamProvider<StandupUser>.value(
      value: AuthService().user,
      child: MaterialApp(home: AuthListener()),
    );
  }
}
