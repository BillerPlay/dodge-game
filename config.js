// config.js — field dimensions and game constants

export function getFieldDimensions() {
  if (window.innerWidth <= 520) {
    const controlsH = 80;
    return {
      width:  window.innerWidth,
      height: window.innerHeight - controlsH,
    };
  }
  return { width: 480, height: 640 };
}

const dims = getFieldDimensions();

export let FIELD_WIDTH  = dims.width;
export let FIELD_HEIGHT = dims.height;

export function updateFieldDimensions() {
  const d = getFieldDimensions();
  FIELD_WIDTH  = d.width;
  FIELD_HEIGHT = d.height;
}

export const PLAYER_SPEED  = 360;
export const MAX_ENEMIES   = 6;
export const MAX_DT        = 0.1;
