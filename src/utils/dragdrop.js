import { groupsRef, tasksRef } from "../main";
import firebase from "firebase/app";

export const applyDrag = (arr, dragResult, targetObject) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (
    removedIndex !== null &&
    addedIndex !== null &&
    removedIndex !== addedIndex
  ) {
    tasksRef.doc(payload.id).update({
      group: ""
    });
    if (addedIndex > removedIndex) {
      tasksRef
        .where("group", "==", payload.group)
        .where("order", ">=", targetObject.order)
        .where("order", "<", payload.order)
        .get()
        .then(function(snapshot) {
          snapshot.forEach(task => {
            task.ref.update({
              order: firebase.firestore.FieldValue.increment(1)
            });
          });
          tasksRef.doc(payload.id).update({
            order: targetObject.order,
            group: payload.group
          });
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    } else {
      tasksRef
        .where("group", "==", payload.group)
        .where("order", "<=", targetObject.order)
        .where("order", ">", payload.order)
        .get()
        .then(function(snapshot) {
          snapshot.forEach(task => {
            task.ref.update({
              order: firebase.firestore.FieldValue.increment(-1)
            });
          });
          tasksRef.doc(payload.id).update({
            order: targetObject.order,
            group: payload.group
          });
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    }
  } else if (removedIndex !== null && addedIndex === null) {
    tasksRef.doc(payload.id).update({
      group: ""
    });
    tasksRef
      .where("group", "==", payload.group)
      .where("order", ">", payload.order)
      .get()
      .then(function(snapshot) {
        snapshot.forEach(task => {
          task.ref.update({
            order: firebase.firestore.FieldValue.increment(-1)
          });
        });
      })
      .catch(error => {
        this.$toasted.global.error({ message: error });
      });
  } else if (removedIndex === null && addedIndex !== null) {
    if (targetObject) {
      tasksRef
        .where("group", "==", arr.id)
        .where("order", ">", targetObject.order)
        .get()
        .then(function(snapshot) {
          snapshot.forEach(task => {
            task.ref.update({
              order: firebase.firestore.FieldValue.increment(1)
            });
          });
          tasksRef.doc(payload.id).update({
            group: arr.id,
            order: targetObject.order + 1
          });
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    } else if (!targetObject) {
      tasksRef
        .where("group", "==", arr.id)
        .where("order", ">=", 0)
        .get()
        .then(function(snapshot) {
          snapshot.forEach(task => {
            task.ref.update({
              order: firebase.firestore.FieldValue.increment(1),
              group: payload.group
            });
          });
          tasksRef.doc(payload.id).update({
            group: arr.id,
            order: 0
          });
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    }
  }
};

export const applyDragGroup = (arr, dragResult, targetObject) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (
    removedIndex !== null &&
    addedIndex !== null &&
    payload.order !== targetObject.order
  ) {
    if (targetObject.order > payload.order) {
      groupsRef
        .where("board", "==", payload.board)
        .where("order", ">=", payload.order)
        .where("order", "<=", targetObject.order)
        .get()
        .then(function(snapshot) {
          snapshot.forEach(group => {
            group.ref.update({
              order: firebase.firestore.FieldValue.increment(-1)
            });
          });
          groupsRef.doc(payload.id).update({
            order: targetObject.order
          });
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    } else {
      groupsRef
        .where("board", "==", payload.board)
        .where("order", "<=", payload.order)
        .where("order", ">=", targetObject.order)
        .get()
        .then(function(snapshot) {
          snapshot.forEach(group => {
            group.ref.update({
              order: firebase.firestore.FieldValue.increment(1)
            });
          });
          groupsRef.doc(payload.id).update({
            order: targetObject.order
          });
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    }
  }
};
