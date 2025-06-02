/**
 * Enable or disable all map controls
 */
export function enableAllMapControls(map: mapboxgl.Map, enabled: boolean) {
  if (enabled) {
    map.dragPan.enable();
    map.dragRotate.enable();
    map.boxZoom.enable();
    map.scrollZoom.enable();
    map.touchPitch.enable();
    map.touchZoomRotate.enable();
    map.doubleClickZoom.enable();
  } else {
    map.dragPan.disable();
    map.dragRotate.disable();
    map.boxZoom.disable();
    map.scrollZoom.disable();
    map.touchPitch.disable();
    map.touchZoomRotate.disable();
    map.doubleClickZoom.disable();
  }
}
