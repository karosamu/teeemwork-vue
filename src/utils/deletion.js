import {
  groupsRef,
  tasksRef,
  boardsRef,
  checkboxRef,
  labelsRef
} from "../main";

import { downTask, downGroup } from "./statCollection";

export function boardsList(project) {
  boardsRef
    .where("project", "==", project.id)
    .get()
    .then(function(boardSnapshot) {
      boardSnapshot.forEach(board => {
        groupsListNoStat(board);
        board.ref.delete();
      });
    });
}

export function groupsListNoStat(board) {
  groupsRef
    .where("board", "==", board.id)
    .get()
    .then(function(groupSnapshot) {
      groupSnapshot.forEach(group => {
        tasksListNoStat(group);
        group.ref.delete();
      });
    });
}

export function groupsList(board, project) {
  groupsRef
    .where("board", "==", board.id)
    .get()
    .then(function(groupSnapshot) {
      groupSnapshot.forEach(group => {
        tasksList(group, project);
        downGroup(project, group.ref);
      });
    });
}

export function tasksListNoStat(group) {
  tasksRef
    .where("group", "==", group.id)
    .get()
    .then(function(taskSnapshot) {
      taskSnapshot.forEach(task => {
        checkboxList(task);
        task.ref.delete();
      });
    });
}

export function tasksList(group, project) {
  tasksRef
    .where("group", "==", group.id)
    .get()
    .then(function(taskSnapshot) {
      taskSnapshot.forEach(task => {
        checkboxList(task);
        downTask(project, task.ref);
      });
    });
}

export function checkboxList(task) {
  checkboxRef
    .where("task", "==", task.id)
    .get()
    .then(function(checkboxSnapshot) {
      checkboxSnapshot.forEach(checkbox => {
        checkbox.ref.delete();
      });
    });
}

export function labelsList(project) {
  labelsRef
    .where("project", "==", project.id)
    .get()
    .then(function(labelSnapshot) {
      labelSnapshot.forEach(label => {
        label.ref.delete();
      });
    });
}
