import { projectsRef } from "../main";
import firebase from "firebase/app";

export function upBoard(id) {
  projectsRef.doc(id).update({
    boards: firebase.firestore.FieldValue.increment(1)
  });
}

export function downBoard(id) {
  projectsRef.doc(id).update({
    boards: firebase.firestore.FieldValue.increment(-1)
  });
}

export function upGroup(id) {
  projectsRef.doc(id).update({
    groups: firebase.firestore.FieldValue.increment(1)
  });
}

export function downGroup(id) {
  projectsRef.doc(id).update({
    groups: firebase.firestore.FieldValue.increment(-1)
  });
}

export function upTask(id) {
  projectsRef.doc(id).update({
    tasks: firebase.firestore.FieldValue.increment(1)
  });
}

export function downTask(id) {
  projectsRef.doc(id).update({
    tasks: firebase.firestore.FieldValue.increment(-1)
  });
}

export function updateBoardHistory(id) {
  let data = [];
  projectsRef
    .doc(id)
    .get()
    .then(doc => {
      if (doc.data().boardHistory) data = doc.data().boardHistory;
      if (data.length > 50) data.shift();
      data.push(doc.data().boards);
      projectsRef.doc(id).update({
        boardHistory: data
      });
    });
}

export function updateGroupHistory(id) {
  let data = [];
  projectsRef
    .doc(id)
    .get()
    .then(doc => {
      if (doc.data() && doc.data().groupHistory) data = doc.data().groupHistory;
      if (data.length > 50) data.shift();
      data.push(doc.data().groups);
      projectsRef.doc(id).update({
        groupHistory: data
      });
    });
}

export function updateTaskHistory(id) {
  let data = [];
  projectsRef
    .doc(id)
    .get()
    .then(doc => {
      if (doc.data() && doc.data().taskHistory) data = doc.data().taskHistory;
      if (data.length > 50) data.shift();
      data.push(doc.data().tasks);
      projectsRef.doc(id).update({
        taskHistory: data
      });
    });
}
