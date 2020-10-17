const config = require("../utils/config");

class match {
  constructor(users, currentUser) {
    users = users;
    currentUser = currentUser;
    types = config.types;
    usersLibraries = [];
  }

  getLibrary = (type, handle) => {
    return new Promise(resolve => {
      this.users.forEach(user => {
        if (user.handle === handle) resolve({ elements: user[type], handle });
      });
    });
  };

  goThroughUsers = (someusers, type) => {
    const user = someusers.shift();

    if (user.handle !== this.currentUser.handle) {
      getLibrary(type, user.handle).then(library => {
        this.usersLibraries.push(library);
      });
    }

    if (someusers.length) goThroughUsers(someusers, type);
  };

  getUsersLibraryByType = type => {
    let someusers = [];

    this.users.map(user => {
      someusers.push(user);
    });

    goThroughUsers(someusers, type);
  };

  startScoringRoutine = () => {
    const type = this.types.shift();

    getUsersLibraryByType(type);

    getLibrary(type, this.currentUser.handle).then(library => {
      match(type, library, this.usersLibraries);
      this.usersLibraries = [];
    });

    if (this.types.length) startScoringRoutine(this.types);
  };

  match = (type, library, users) => {
    library.elements.forEach(element => {
      users.forEach(user => {
        findMatch(type, element, user);
      });
    });
  };

  findMatch = (type, elm, userElements) => {
    userElements.elements.forEach(element => {
      if (element === elm) scorePoints(type, userElements.handle);
    });
  };

  scorePoints = (type, handle) => {
    switch (type) {
      case "tracks":
        this.currentUser.matchs[handle]
          ? (this.currentUser.matchs[handle] += 5)
          : (this.currentUser.matchs[handle] = 5);
        break;
      case "albums":
        this.currentUser.matchs[handle]
          ? (this.currentUser.matchs[handle] += 2)
          : (this.currentUser.matchs[handle] = 2);
        break;
      case "artists":
        this.currentUser.matchs[handle]
          ? (this.currentUser.matchs[handle] += 2)
          : (this.currentUser.matchs[handle] = 2);
        break;
      case "recent":
        this.currentUser.matchs[handle]
          ? (this.currentUser.matchs[handle] += 3)
          : (this.currentUser.matchs[handle] = 3);
      case "genres":
        this.currentUser.matchs[handle]
          ? (this.currentUser.matchs[handle] += 3)
          : (this.currentUser.matchs[handle] = 3);
        break;
    }

    sort(this.currentUser.matchs);
  };

  sort = matchs => {
    let sorted = Object.keys(matchs).sort((a, b) => matchs[b] - matchs[a]);
    console.log(sorted);
  };
}

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
