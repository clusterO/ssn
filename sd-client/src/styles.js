export default {
  cardStyles: {
    card: {
      position: "relative",
      width: "600px",
      height: "50vh",
      padding: "20px",
      maxWidth: "85vw",
      borderRadius: "20px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      boxShadow: "0px 18px 53px 0px rgba(0, 0, 0, 0.3)",
    },
    h3: {
      position: "absolute",
      bottom: "10px",
      color: "white",
    },
    cardContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "10vh",
    },
    swipe: {
      position: "absolute",
    },
  },
  chatStyles: {
    chatScreenMessage: {
      display: "flex",
      alignItems: "center",
      padding: "20px",
    },
    chatScreenText: {
      marginLeft: "10px",
      backgroundColor: "#f887ff",
      padding: "15px",
      borderRadius: "20px",
    },
    chatScreenTimestamp: {
      textAlign: "center",
      color: "grey",
      padding: "20px",
    },
    chatScreenTextUser: {
      marginLeft: "auto",
      backgroundColor: "#321450",
      padding: "15px",
      borderRadius: "20px",
      color: "white",
    },
    chatScreenInput: {
      display: "flex",
      padding: "5px",
      position: "fixed",
      bottom: 0,
      width: "80%",
      marginBottom: "10px",
    },
    chatScreenInputField: {
      flex: 1,
      padding: "10px",
      border: "none",
    },
    chatScreenInputButton: {
      border: "none",
      marginRight: "5px",
      backgroundColor: "white",
      fontWeight: "bolder",
      color: "#fe3d71",
    },
    chatScreenShare: {
      border: "none",
      marginRight: "5px",
      backgroundColor: "white",
      fontWeight: "bolder",
      color: "#1afe49",
    },
    chatScreenListen: {
      border: "none",
      marginRight: "5px",
      backgroundColor: "white",
      fontWeight: "bolder",
      color: "#ff6e27",
    },
    popover: {
      pointerEvents: "none",
    },
    paper: {
      padding: "10px",
      borderRadius: "20px",
    },
  },
  reactionStyles: {
    reaction: {
      padding: "0 0.25rem 0 0.25rem",
      fontSize: "1.3rem",
      transition: "O.25s",
      "&:hover": {
        textDecoration: "none",
        fontSize: "2rem",
      },
    },
  },
  headerStyles: {
    header: {
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "1px solid #f9f9f9",
      alignItems: "center",
    },
    headerLogo: {
      height: "40px",
      objectFit: "contain",
    },
    headerIcon: {},
  },
  loginStyles: {
    form: {
      margin: "20px",
    },
    paper: {
      padding: "10px",
      marginTop: "1px",
    },
    container: {
      margin: "10% auto 0 auto",
      width: "70%",
    },
    spotifyButton: {
      margin: "auto auto",
      backgroundColor: "#1EDE62",
      color: "#000000",
    },
  },
  messageStyles: {
    chat: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "70px",
      borderBottom: "1px solid #fafafa",
    },
    link: {
      textDecoration: "none",
      color: "blue",
      "&:hover": {
        textDecoration: "none",
        color: "purple",
      },
    },
    chatDetails: {
      flex: 1,
    },
    message: {
      color: "black",
      fontWeight: "bold",
    },
    chatTimestamp: {
      color: "lightgray",
    },
    chatImage: {
      marginRight: "20px",
    },
  },
  profileStyles: {
    root: {
      margin: "auto auto",
      marginTop: "5%",
      width: "80%",
    },
    details: {
      display: "flex",
    },
    infos: {
      display: "flex",
      width: "15%",
      justifyContent: "space-evenly",
      marginTop: "10px",
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
      color: "blue",
    },
    media: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
    },
  },
  swipeStyles: {
    mic: {
      visibility: "hidden",
    },
    swipeRoot: {
      width: "100%",
      display: "flex",
      justifyContent: "space-evenly",
      marginTop: "20px",
    },
    swipeButtons: {
      position: "fixed",
      bottom: "10vh",
      display: "flex",
      justifyContent: "space-evenly",
    },
    MuiIconButtonRoot: {
      backgroundColor: "white",
      boxShadow: "0px 10px 53px 0px rgba(0, 0, 0, 0.3) !important",
    },
    swipeButtonsRepeat: {
      padding: "3vw !important",
      color: "#f5b748 !important",
    },
    swipeButtonsLeft: {
      padding: "3vw !important",
      color: "#ec5e6f !important",
    },
    swipeButtonsStar: {
      padding: "3vw !important",
      color: "#62b4f9 !important",
    },
    swipeButtonsRight: {
      padding: "3vw !important",
      color: "#76e2b3 !important",
    },
    messages: {
      padding: "3vw !important",
      color: "#915dd1 !important",
    },
  },
  tracksStyles: {
    media: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
    },
    container: {
      display: "flex",
      marginTop: "10px",
    },
    infos: {
      marginLeft: "10px",
      maxWidth: "250px",
    },
  },
};
