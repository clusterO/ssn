const db = require("../models");
const config = require("../utils/config");

const User = db.user;

class Match {
  constructor(users, currentUser, res) {
    this.users = users;
    this.currentUser = currentUser;
    this.types = config.types;
    this.usersLibraries = [];
    this.counter = 0;
    this.res = res;

    this.currentUser.matchs = [];
  }

  getLibrary = (type, handle) => {
    return new Promise((resolve) => {
      this.users.forEach((user) => {
        if (user.handle === handle) {
          resolve({ elements: user[type], handle });
        }
      });
    });
  };

  goThroughUsers = (someusers, type) => {
    const user = someusers.shift();

    if (user && user.handle && user.handle !== this.currentUser.handle) {
      this.getLibrary(type, user.handle).then((library) => {
        this.usersLibraries.push(library);
      });
    }

    if (someusers.length) this.goThroughUsers(someusers, type);
  };

  getUsersLibraryByType = (type) => {
    let someusers = [];

    this.users.map((user) => {
      someusers.push(user);
    });

    this.goThroughUsers(someusers, type);
  };

  startScoringRoutine = () => {
    const type = this.types.shift();

    this.getUsersLibraryByType(type);

    this.getLibrary(type, this.currentUser.handle).then((library) => {
      this.match(type, library, this.usersLibraries);
      this.usersLibraries = [];
    });

    if (this.types.length) this.startScoringRoutine(this.types);
  };

  match = (type, library, users) => {
    if (library && library.elements)
      library.elements.forEach((element) => {
        users.forEach((user) => {
          this.findMatch(type, element, user);
        });
      });
  };

  findMatch = (type, elm, userElements) => {
    if (userElements && userElements.elements)
      userElements.elements.forEach((element) => {
        if (element === elm) {
          this.counter++;
          setTimeout(() => {
            --this.counter;
            this.scorePoints(type, userElements.handle, userElements.image);
          }, 0);
        }
      });
  };

  // DRY
  scorePoints = (type, handle, image) => {
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

    if (this.counter === 0)
      User.findOne({ handle: this.currentUser.handle }).exec((err, user) => {
        if (err) return console.error({ message: err });
        if (!user) return console.error({ message: "User not found" });

        let matchs = [];
        for (const property in this.currentUser.matchs) {
          matchs.push({
            display_name: property,
            score: this.currentUser.matchs[property],
            images: [{ url: "" }],
          });
        }

        user.updateOne({ "match.matchs": matchs }, (err) => {
          if (err) return console.error({ message: err });
          user.save();
          return this.res.status(200).send({ matchs });
        });
      });
  };
}

module.exports.Match = Match;
