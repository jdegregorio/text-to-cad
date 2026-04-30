import assert from "node:assert/strict";
import test from "node:test";

import {
  clampSceneModelRadius,
  defaultSceneGridRadius,
  getLightingScopeRadius,
  getSceneScaleSettings,
  normalizeSceneScaleMode,
  EXPLORER_SCENE_SCALE
} from "./sceneScale.js";

test("CAD scenes keep the existing large minimum framing scale", () => {
  assert.equal(normalizeSceneScaleMode("anything-else"), EXPLORER_SCENE_SCALE.CAD);
  assert.equal(clampSceneModelRadius(0.14, EXPLORER_SCENE_SCALE.CAD), 1);
  assert.equal(defaultSceneGridRadius(EXPLORER_SCENE_SCALE.CAD), 140);
  assert.equal(getLightingScopeRadius(EXPLORER_SCENE_SCALE.CAD), 140);
  assert.deepEqual(getSceneScaleSettings(EXPLORER_SCENE_SCALE.CAD), {
    minModelRadius: 1,
    minGridSize: 280,
    lightingScopeRadius: 140
  });
});
