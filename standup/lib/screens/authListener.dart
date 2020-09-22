import 'package:flutter/material.dart';
import 'package:standup/models/standup_user.dart';
import 'package:standup/screens/authenticate/authenticate.dart';
import 'package:standup/screens/home/home.dart';
import 'package:provider/provider.dart';

class AuthListener extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    //return either home widget or authenticate widget
    final user = Provider.of<StandupUser>(context);
    if (user == null) {
      return Authenticate();
    } else {
      return Home();
    }
  }
}
