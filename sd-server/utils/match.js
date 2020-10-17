"use strict";

let users = generateDataForMatch();

let currentUser = users[0];
let types = ["tracks", "albums", "top", "artists"];
let usersLibraries = [];

const getLibrary = (type, handle) => {
  return new Promise(resolve => {
    users.forEach(user => {
      if (user.handle === handle) resolve({ elements: user[type], handle });
    });
  });
};

const goThroughUsers = (someusers, type) => {
  const user = someusers.shift();

  if (user.handle !== currentUser.handle) {
    getLibrary(type, user.handle).then(library => {
      usersLibraries.push(library);
    });
  }

  if (someusers.length) goThroughUsers(someusers, type);
};

const getUsersLibraryByType = type => {
  let someusers = [];

  users.map(user => {
    someusers.push(user);
  });

  goThroughUsers(someusers, type);
};

const startScoringRoutine = () => {
  const type = types.shift();

  getUsersLibraryByType(type);

  getLibrary(type, currentUser.handle).then(library => {
    match(type, library, usersLibraries);
    usersLibraries = [];
  });

  if (types.length) startScoringRoutine(types);
};

const match = (type, library, users) => {
  library.elements.forEach(element => {
    users.forEach(user => {
      findMatch(type, element, user);
    });
  });
};

const findMatch = (type, elm, userElements) => {
  userElements.elements.forEach(element => {
    if (element === elm) scorePoints(type, userElements.handle);
  });
};

const scorePoints = (type, handle) => {
  switch (type) {
    case "tracks":
      currentUser.matchs[handle]
        ? (currentUser.matchs[handle] += 1)
        : (currentUser.matchs[handle] = 1);
      break;
    case "albums":
      currentUser.matchs[handle]
        ? (currentUser.matchs[handle] += 2)
        : (currentUser.matchs[handle] = 2);
      break;
    case "artists":
      currentUser.matchs[handle]
        ? (currentUser.matchs[handle] += 5)
        : (currentUser.matchs[handle] = 5);
      break;
    case "top":
      currentUser.matchs[handle]
        ? (currentUser.matchs[handle] += 5)
        : (currentUser.matchs[handle] = 5);
      break;
  }

  sort(currentUser.matchs);
};

const sort = matchs => {
  let sorted = Object.keys(matchs).sort((a, b) => matchs[b] - matchs[a]);
  console.log(sorted);
};

startScoringRoutine();

/**
  ## CPU intence process for array

  processArray = (items, process) {
    let todo = tiems.concat()
    setTimeout(() => {
      process(todo.shift())
      if(todo.length) setTimeout(arguments.callee, 25)
    }, 25)
  }

  processArray([...], func)

  ## async.forEachOf 
 */
