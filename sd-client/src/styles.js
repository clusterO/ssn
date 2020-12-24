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
    swipe: {
      position: "absolute",
    },
    tracks: {
      justifyContent: "center",
    },
  },
  chatStyles: {
    head: {
      display: "block",
    },
    chatScreen: {
      paddingTop: "8vh",
      paddingBottom: "10vh",
      display: "block",
    },
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
    loadMore: {
      textAlign: "center",
      color: "blue",
    },
    chatScreenTextUser: {
      marginLeft: 0,
      backgroundColor: "#321450",
      padding: "15px",
      borderRadius: "20px",
      color: "white",
      width: "fit-content",
    },
    chatScreenTextUserContainer: {
      marginLeft: "auto",
      display: "flex",
    },
    chatScreenInput: {
      display: "flex",
      position: "fixed",
      bottom: 0,
      marginBottom: "10px",
      backgroundColor: "white",
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
    popover: {
      height: "30px",
    },
  },
  headerStyles: {
    header: {
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "1px solid #f9f9f9",
      alignItems: "center",
      position: "fixed",
      top: 0,
      background: "white",
      zIndex: 9999,
    },
    headerLogo: {
      height: "40px",
      objectFit: "contain",
    },
    notificationIcon: {
      marginRight: 5,
    },
    notificationTypography: {
      color: "#000",
    },
    icons: {},
  },
  loginStyles: {
    form: {
      margin: "20px",
    },
    paper: {
      padding: "10px",
      marginTop: "1px",
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
    rootProfile: {
      width: "80%",
      margin: "60px auto",
    },
    details: {
      display: "flex",
    },
    profileInfos: {
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
  },
  swipeStyles: {
    mic: {
      visibility: "hidden",
      display: "none",
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
    trackContainer: {
      display: "flex",
      marginTop: "10px",
    },
    infos: {
      marginLeft: "10px",
      maxWidth: "250px",
    },
  },
};
