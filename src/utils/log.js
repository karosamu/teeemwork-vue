import { logsRef } from "../main";
import firebase from "firebase/app";

export function log(message, project, context) {
  logsRef.add({
    date: new Date(),
    message: message,
    user: firebase.auth().currentUser.uid,
    project: project,
    context: context
  });
}
