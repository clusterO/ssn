import React, { Component, createRef } from "react";
import uuid from "react-uuid";
import CDGKaraokePlayer from "karaoke";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/storage";
import {
  withStyles,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { PlayCircleFilledWhite, MusicNote } from "@material-ui/icons";
import songs from "../songs";
import Header from "./Header";

const karaokeStyles = (theme) => ({
  title: {
    fontWeight: 400,
  },
  container: {
    marginTop: "50px",
  },
  main: {
    margin: "60px auto",
    padding: "theme.spacing(1)",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
    [theme.breakpoints.up("lg")]: {
      display: "flex",
    },
  },
  demo: {
    maxHeight: "100vh",
    overflow: "auto",
    [theme.breakpoints.down("sm")]: {
      maxHeight: "50vh",
    },
  },
});

const config = {
  apiKey: "AIzaSyBzU0B7PuDte4dFklkII3A7uYSYvg0YxMU",
  authDomain: "spotidate-bdd25.firebaseapp.com",
  projectId: "spotidate-bdd25",
  storageBucket: "spotidate-bdd25.appspot.com",
  messagingSenderId: "718088123621",
  appId: "1:718088123621:web:bc45245b8fd433f7e7500c",
  measurementId: "G-ZB7R629TG0",
};

firebase.initializeApp(config);

export class Karaoke extends Component {
  constructor(props) {
    super(props);
    this.karaoke = new CDGKaraokePlayer();
    this.container = createRef();
    this.firebase = firebase;
    this.storage = this.firebase.storage();
    this.song = null;
    this.cdg = null;

    this.state = {
      dense: true,
    };
  }

  componentDidMount() {
    this.container.current.appendChild(this.karaoke.canvas);
    this.container.current.appendChild(this.karaoke.audio);
  }

  loadAndPlay = (name) => {
    this.getUrl(name, "mp3");
    this.getUrl(name, "cdg");
  };

  getUrl = (name, type) => {
    this.storage
      .ref(`/${name}.${type}`)
      .getDownloadURL()
      .then((url) => {
        if (type === "mp3") this.song = url;
        if (type === "cdg") {
          this.cdg = url;
          this.karaoke.loadAndPlay(this.song, this.cdg);
        }
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <Header />
        <div className={classes.main}>
          <List className={classes.demo} dense={this.state.dense}>
            {songs.map((value, index) => (
              <ListItem key={uuid()}>
                <ListItemAvatar>
                  <MusicNote />
                </ListItemAvatar>
                <Typography variant="h5">{value}</Typography>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => this.loadAndPlay(value)}
                  >
                    <PlayCircleFilledWhite />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <div className={classes.container} ref={this.container}></div>
        </div>
      </>
    );
  }
}

export default withStyles(karaokeStyles)(Karaoke);
