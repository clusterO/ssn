"use strict";

let users = [
  {
    handle: "user1",
    tracks: ["x1", "x2", "i5", "x4", "x5"],
    albums: ["m4", "t2", "t3", "t4", "t5"],
    top: ["ta1", "ta2", "ta3", "ta4", "ta5"],
    artists: ["a1", "a2", "a3", "a4", "a5"],
    matchs: {},
  },
  {
    handle: "user2",
    tracks: ["x3", "i2", "i3", "x1", "i5"],
    albums: ["o1", "m3", "o3", "o4", "o5"],
    top: ["ia1", "ta2", "ia3", "ia4", "ia5"],
    artists: ["p1", "p2", "p3", "p4", "p5"],
    matchs: {},
  },
  {
    handle: "user3",
    tracks: ["n1", "n2", "n3", "n4", "n5"],
    albums: ["m1", "m2", "m3", "m4", "m5"],
    top: ["ta2", "na2", "ta5", "na4", "na5"],
    artists: ["l1", "l2", "l3", "l4", "l5"],
    matchs: {},
  },
];

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
