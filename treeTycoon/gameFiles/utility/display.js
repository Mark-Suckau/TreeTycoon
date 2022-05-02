class Display {
  constructor(
    canvasWidth,
    canvasHeight,
    gameWorldWidth,
    gameWorldHeight,
    backgroundColor = 'black',
    zoomX = 0,
    zoomY = 0,
    viewX = 0,
    viewY = 0,
  ) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d'); // display canvas
    this.backgroundColor = backgroundColor; // background for display canvas
    this.aspectRatioWidth = this.canvas.height / this.canvas.width;
    this.aspectRatioHeight = this.canvas.width / this.canvas.height;

    this.buffer = document.createElement('canvas').getContext('2d'); // game canvas
    this.buffer.canvas.width = gameWorldWidth;
    this.buffer.canvas.height = gameWorldHeight;

    this.matchAspectRatio(this.buffer.canvas, this.canvas.width, this.canvas.height);

    this.camera = new Display.Camera(
      this.buffer.canvas.width,
      this.buffer.canvas.height,
      5,
      5,
      viewX,
      viewY,
      zoomX,
      zoomY,
    );
  }

  reCalcBuffer(gameWorldWidth, gameWorldHeight) {
    this.buffer.canvas.width = gameWorldWidth;
    this.buffer.canvas.height = gameWorldHeight;
    this.matchAspectRatio(this.buffer.canvas, this.canvas.width, this.canvas.height);
    this.camera.bufferCanvas = this.buffer.canvas;
  }

  strokeRect(x, y, w, h, color, lineWidth) {
    // add lineJoin for rounded edges
    this.buffer.lineWidth = lineWidth;
    this.buffer.strokeStyle = color;
    this.buffer.strokeRect(x, y, w, h);
  }

  fillRect(x, y, w, h, color) {
    // NOTE: if color is left as undefined, the color used from last function call will be reused
    this.buffer.fillStyle = color;
    this.buffer.fillRect(x, y, w, h);
  }

  drawRectWithOutlineOutside(x, y, w, h, color, outlineColor, outlineWidth) {
    // NOTE: if color is left as undefined, the color used from last function call will be reused
    this.fillRect(x, y, w, h, color);
    this.strokeRect(
      x - outlineWidth + outlineWidth / 2,
      y - outlineWidth + outlineWidth / 2,
      w + outlineWidth,
      h + outlineWidth,
      outlineColor,
      outlineWidth,
    );
  }

  drawRectWithOutlineInside(x, y, w, h, color, outlineColor, outlineWidth) {
    // NOTE: if color is left as undefined, the color used from last function call will be reused
    this.fillRect(x, y, w, h, color);
    this.strokeRect(
      x + outlineWidth / 2,
      y + outlineWidth / 2,
      w - outlineWidth,
      h - outlineWidth,
      outlineColor,
      outlineWidth,
    );
  }

  drawRectTrail(history) {
    // Draws every object in the history array as rectangles
    for (let i = 0; i < history.length; i++) {
      this.fillRect(history[i].x, history[i].y, history[i].w, history[i].h, history[i].color.rgba);
    }
  }

  fillText(
    text,
    x,
    y,
    maxWidth,
    color,
    fontSize,
    fontSizeUnit,
    fontFamily,
    textAlign,
    textBaseline,
  ) {
    this.buffer.fillStyle = color;
    this.buffer.font = fontSize + fontSizeUnit + ' ' + fontFamily; // ex. 10px sans-serif
    this.buffer.textAlign = textAlign;
    this.buffer.textBaseline = textBaseline;
    this.buffer.fillText(text, x, y, maxWidth);
  }

  strokeText(
    text,
    x,
    y,
    maxWidth,
    color,
    fontSize,
    fontSizeUnit,
    fontFamily,
    textAlign,
    textBaseline,
  ) {
    this.buffer.strokeStyle = color;
    this.buffer.font(fontSize + fontSizeUnit + ' ' + fontFamily); // ex. 10px sans-serif
    this.buffer.textAlign(textAlign);
    this.buffer.textBaseline(textBaseline);
    this.buffer.strokeText(text, x, y, maxWidth);
  }

  background(gameBackgroundColor, canvasBackgroundColor) {
    //ADD BACKGROUND TO ANYTHING OUTSIDE OF GAME WORLD // WARNING TEST

    /*required to fill directly to canvas aswell as buffer to avoid glitching with objects on edge
    of buffer canvas since the canvas wouldnt receive any updates the color stays on the main canvas*/
    this.buffer.fillStyle = gameBackgroundColor;
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

    this.ctx.fillStyle = canvasBackgroundColor;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  render() {
    // WARNING TESTING
    this.ctx.drawImage(
      this.buffer.canvas,
      this.camera.view.x + this.camera.offset.x + this.camera.zoom.x / 2, //this.aspectRatioWidth, // to zoom towards top left corner remove this + zoom
      this.camera.view.y + this.camera.offset.y + this.camera.zoom.y / 2, //this.aspectRatioHeight, // to zoom towards top left corner remove this + zoom
      //0,
      //0,
      this.buffer.canvas.width - this.camera.zoom.x,
      this.buffer.canvas.height - this.camera.zoom.y,
      //this.buffer.canvas.width,
      //this.buffer.canvas.height,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );
  }

  matchAspectRatio(canvas, aspectWidth, aspectHeight) {
    // target aspect ratio
    let targetAspectRatio = aspectWidth / aspectHeight;
    let targetAspectRatioHeight = aspectHeight / aspectWidth;

    if (canvas.width > canvas.height) {
      if (aspectWidth > aspectHeight) {
        canvas.width = canvas.height * targetAspectRatio;
        canvas.height = canvas.width * targetAspectRatioHeight;
      } else if (aspectWidth < aspectHeight) {
        canvas.height = canvas.width * targetAspectRatioHeight;
        canvas.width = canvas.height * targetAspectRatio;
      } else {
        canvas.height = canvas.width * targetAspectRatioHeight;
        canvas.width = canvas.height * targetAspectRatio;
      }
    } else if (canvas.height > canvas.width) {
      if (aspectWidth > aspectHeight) {
        canvas.width = canvas.height * targetAspectRatio;
        canvas.height = canvas.width * targetAspectRatioHeight;
      } else if (aspectWidth < aspectHeight) {
        canvas.height = canvas.width * targetAspectRatioHeight;
        canvas.width = canvas.height * targetAspectRatio;
      } else {
        canvas.width = canvas.height * targetAspectRatio;
        canvas.height = canvas.width * targetAspectRatioHeight;
      }
    } else if (canvas.width == canvas.height) {
      if (aspectWidth > aspectHeight) {
        canvas.width = canvas.height * targetAspectRatio;
        canvas.height = canvas.width * targetAspectRatioHeight;
      } else if (aspectWidth < aspectHeight) {
        canvas.height = canvas.width * targetAspectRatioHeight;
        canvas.width = canvas.height * targetAspectRatio;
      } else {
        canvas.width = canvas.height * targetAspectRatio;
        canvas.height = canvas.width * targetAspectRatioHeight;
      }
    } else {
      console.log('Error in Aspect Ratio matching, couldnt fullfill any if conditions');
    }
  }
}

Display.Camera = class {
  constructor(
    bufferWidth,
    bufferHeight,
    moveSpeed,
    zoomSpeed,
    viewX = 0,
    viewY = 0,
    zoomX = 0,
    zoomY = 0,
  ) {
    // for matching aspect ratio when zooming
    this.bufferCanvas = {
      width: bufferWidth,
      height: bufferHeight,
    };
    // viewY positive -> view moves down, positive -> view moves up
    // viewX positive -> view moves right, negative -> view moves left
    this.view = new Vector(viewX, viewY);
    this.offset = new Vector(viewX, viewY); /* used to offset follow cam */
    this.offsetSet = false;
    this.moveSpeed = moveSpeed;

    this.zoom = new Vector(0, 0); /* zoom in px (zooms in that amount on all sides) */
    this.zoomChange(zoomX, zoomY);
    this.zoomSpeed = zoomSpeed;
  }

  getRectVisualDimensions(originalX, originalY, originalWidth, originalHeight) {
    // returns the size and location that a rect appears to be based on camera zoom and offset
    // used for accurate checking if mouse is hovering over clickables
    let visualX = originalX - this.view.x - this.offset.x - this.zoom.x / 2;
    let visualY = originalY - this.view.y - this.offset.y - this.zoom.y / 2;
    let visualWidth = originalWidth - this.zoom.x / 2;
    let visualHeight = originalHeight - this.zoom.y / 2;

    return { visualX, visualY, visualWidth, visualHeight };
  }

  followObj(objPosX, objPosY, objWidth, objHeight, gameWorldWidth, gameWorldHeight) {
    /*if (!this.offsetSet) {
      this.offset.x = -this.bufferCanvas.width / 4;
      this.offset.y = -this.bufferCanvas.height / 4;
      this.offsetSet = true;
    }*/
    this.view.x = objPosX - gameWorldWidth / 2 + objWidth / 2 + this.offset.x;
    this.view.y = objPosY - gameWorldHeight / 2 + objHeight / 2 + this.offset.y;
  }

  moveCam(dirX, dirY) {
    this.offset.x += dirX * this.moveSpeed;
    this.offset.y += dirY * this.moveSpeed;
  }

  zoomChange(zoomDirX, zoomDirY) {
    if (this.zoom.x + zoomDirX * this.zoomSpeed < this.bufferCanvas.width) {
      this.zoom.x += zoomDirX * this.zoomSpeed;
    }
    if (this.zoom.y + zoomDirY * this.zoomSpeed < this.bufferCanvas.height) {
      this.zoom.y += zoomDirY * this.zoomSpeed;
    }

    this.matchAspectRatio(this.zoom, this.bufferCanvas.width, this.bufferCanvas.height);
  }

  matchAspectRatio(canvas, aspectWidth, aspectHeight) {
    // target aspect ratio
    let targetAspectRatio = aspectWidth / aspectHeight;
    let targetAspectRatioHeight = aspectHeight / aspectWidth;

    if (canvas.x > canvas.y) {
      if (aspectWidth > aspectHeight) {
        canvas.x = canvas.y * targetAspectRatio;
        canvas.y = canvas.x * targetAspectRatioHeight;
      } else if (aspectWidth < aspectHeight) {
        canvas.y = canvas.x * targetAspectRatioHeight;
        canvas.x = canvas.y * targetAspectRatio;
      } else {
        canvas.y = canvas.x * targetAspectRatioHeight;
        canvas.x = canvas.y * targetAspectRatio;
      }
    } else if (canvas.y > canvas.x) {
      if (aspectWidth > aspectHeight) {
        canvas.x = canvas.y * targetAspectRatio;
        canvas.y = canvas.x * targetAspectRatioHeight;
      } else if (aspectWidth < aspectHeight) {
        canvas.y = canvas.x * targetAspectRatioHeight;
        canvas.x = canvas.y * targetAspectRatio;
      } else {
        canvas.x = canvas.y * targetAspectRatio;
        canvas.y = canvas.x * targetAspectRatioHeight;
      }
    } else if (canvas.x == canvas.y) {
      if (aspectWidth > aspectHeight) {
        canvas.x = canvas.y * targetAspectRatio;
        canvas.y = canvas.x * targetAspectRatioHeight;
      } else if (aspectWidth < aspectHeight) {
        canvas.y = canvas.x * targetAspectRatioHeight;
        canvas.x = canvas.y * targetAspectRatio;
      } else {
        canvas.x = canvas.y * targetAspectRatio;
        canvas.y = canvas.x * targetAspectRatioHeight;
      }
    } else {
      console.log('Error in Aspect Ratio matching, couldnt fullfill any if conditions');
    }
  }
};
