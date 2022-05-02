class Controller {
  constructor() {
    this.mouseX = 0; // needs to be updated via eventlistener mousemove
    this.mouseY = 0;

    //this.gameMouseX = 0; // translated position of mouse to match ingame world instead of normal canvas
    //this.gameMouseY = 0; // needs to be updated at same time as normal mouseX, mouseY

    this.gameInput = {
      up: new Controller.ButtonInput('w'),
      left: new Controller.ButtonInput('a'),
      down: new Controller.ButtonInput('s'),
      right: new Controller.ButtonInput('d'),
    };

    this.camControls = {
      up: new Controller.ButtonInput('ArrowUp'),
      left: new Controller.ButtonInput('ArrowLeft'),
      down: new Controller.ButtonInput('ArrowDown'),
      right: new Controller.ButtonInput('ArrowRight'),
      zoomIn: new Controller.ButtonInput('='),
      zoomOut: new Controller.ButtonInput('-'),
    };
  }

  keyChange(key, type, controller, cam) {
    // camera = bolean if the controls are for the camera or not
    let pressed = type == 'keydown' ? true : false;

    switch (key) {
      case controller.up.activationKey:
        controller.up.updateInput(pressed);
        break;
      case controller.left.activationKey:
        controller.left.updateInput(pressed);
        break;
      case controller.right.activationKey:
        controller.right.updateInput(pressed);
        break;
      case controller.down.activationKey:
        controller.down.updateInput(pressed);
        break;
    }
    if (cam) {
      switch (key) {
        case controller.zoomIn.activationKey:
          controller.zoomIn.updateInput(pressed);
          break;
        case controller.zoomOut.activationKey:
          controller.zoomOut.updateInput(pressed);
          break;
      }
    }
  }
}

Controller.ButtonInput = class {
  constructor(activationKey) {
    this.activationKey = activationKey;

    this.active = false;
    this.pressed = false;
  }

  updateInput(pressed) {
    if (this.pressed != pressed) {
      this.active = pressed;
    }
    this.pressed = pressed;
  }
};
