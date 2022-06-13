class MessageDisplayer {
  constructor() {
    this.currentlyDisplayedMessages = [];
  }

  showMessage(text, displayTimeSeconds, r, g, b) {
    // displays a message above player head which will slowly fade away
    let message = {
      text: text,
      color: {
        r: r,
        g: g,
        b: b,
        a: 1,
      },
      displayStartTimeStamp: Date.now(),
      totalDisplayTimeSeconds: displayTimeSeconds,
    };
    this.currentlyDisplayedMessages.push(message);
  }

  update() {
    // messages
    for (let i = 0; i < this.currentlyDisplayedMessages.length; i++) {
      // removing messages that have been displayed long enough
      let timeSinceStartedDisplaying =
        Date.now() - this.currentlyDisplayedMessages[i].displayStartTimeStamp;
      // totalDisplayTimeSeconds * 1000 to convert to miliseconds
      if (
        timeSinceStartedDisplaying >=
        this.currentlyDisplayedMessages[i].totalDisplayTimeSeconds * 1000
      ) {
        this.currentlyDisplayedMessages.splice(i, 1);
      } else {
        // adjusting color alpha
        // calculates new alpha value based on how much remaining time until message disappears to allow it to fade away
        let percentTimeGone =
          timeSinceStartedDisplaying /
          (this.currentlyDisplayedMessages[i].totalDisplayTimeSeconds * 1000);
        this.currentlyDisplayedMessages[i].color.a = 1 - percentTimeGone;
      }
    }
  }
}
