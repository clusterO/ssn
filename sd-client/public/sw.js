self.addEventListener("push", e => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: "New Notification",
    icon:
      "https://i.pinimg.com/474x/68/e3/fb/68e3fbd44498306e7f0c3adb41e9e1f1.jpg",
  });
});
