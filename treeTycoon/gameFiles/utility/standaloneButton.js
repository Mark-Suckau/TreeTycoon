class StandaloneButton extends Button {
  constructor(
    x,
    y,
    width,
    height,
    isHidden,
    actionLMB = null,
    actionMMB = null,
    actionRMB = null,
    text = '',
    textColor = '',
    defaultColor = 'darkgreen',
    mouseOverColor = 'green',
    isOutlinedInside = false, // NOTE: only one or the other should be set as true, if both are true, outlineInside will be used
    isOutlinedOutside = false,
    outlineColor = '',
    outlineWidth = '5',
    textSize = 20,
    textSizeUnit = 'px',
    textFontFamily = 'sans-serif',
  ) {
    super(
      x,
      y,
      width,
      height,
      isHidden,
      actionLMB,
      actionMMB,
      actionRMB,
      text,
      textColor,
      defaultColor,
      mouseOverColor,
      isOutlinedInside, // NOTE: only one or the other should be set as true, if both are true, outlineInside will be used
      isOutlinedOutside,
      outlineColor,
      outlineWidth,
      textSize,
      textSizeUnit,
      textFontFamily,
    );
  }
}
