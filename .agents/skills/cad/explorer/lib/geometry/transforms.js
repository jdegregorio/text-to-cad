const IDENTITY_TRANSFORM = Object.freeze([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
]);

function toTransformArray(value, fallback = IDENTITY_TRANSFORM) {
  if (!Array.isArray(value) || value.length !== 16) {
    return [...fallback];
  }
  return value.map((component, index) => Number.isFinite(Number(component)) ? Number(component) : fallback[index]);
}

function toVector3(value, fallback = [0, 0, 0]) {
  if (!Array.isArray(value) || value.length < 3) {
    return [...fallback];
  }
  return [
    Number.isFinite(Number(value[0])) ? Number(value[0]) : fallback[0],
    Number.isFinite(Number(value[1])) ? Number(value[1]) : fallback[1],
    Number.isFinite(Number(value[2])) ? Number(value[2]) : fallback[2]
  ];
}

export function transformPoint(transform, point) {
  const matrix = toTransformArray(transform);
  const [x, y, z] = toVector3(point);
  return [
    (matrix[0] * x) + (matrix[1] * y) + (matrix[2] * z) + matrix[3],
    (matrix[4] * x) + (matrix[5] * y) + (matrix[6] * z) + matrix[7],
    (matrix[8] * x) + (matrix[9] * y) + (matrix[10] * z) + matrix[11]
  ];
}

export function transformBounds(bounds, transform) {
  const min = Array.isArray(bounds?.min) ? bounds.min : [0, 0, 0];
  const max = Array.isArray(bounds?.max) ? bounds.max : [0, 0, 0];
  const corners = [
    [min[0], min[1], min[2]],
    [min[0], min[1], max[2]],
    [min[0], max[1], min[2]],
    [min[0], max[1], max[2]],
    [max[0], min[1], min[2]],
    [max[0], min[1], max[2]],
    [max[0], max[1], min[2]],
    [max[0], max[1], max[2]]
  ];
  const transformed = corners.map((corner) => transformPoint(transform, corner));
  const xs = transformed.map((point) => point[0]);
  const ys = transformed.map((point) => point[1]);
  const zs = transformed.map((point) => point[2]);
  return {
    min: [Math.min(...xs), Math.min(...ys), Math.min(...zs)],
    max: [Math.max(...xs), Math.max(...ys), Math.max(...zs)]
  };
}

export function mergeBounds(boundsList) {
  const normalized = (Array.isArray(boundsList) ? boundsList : []).filter(Boolean);
  if (!normalized.length) {
    return {
      min: [0, 0, 0],
      max: [0, 0, 0]
    };
  }
  const xs = normalized.flatMap((bounds) => [bounds.min[0], bounds.max[0]]);
  const ys = normalized.flatMap((bounds) => [bounds.min[1], bounds.max[1]]);
  const zs = normalized.flatMap((bounds) => [bounds.min[2], bounds.max[2]]);
  return {
    min: [Math.min(...xs), Math.min(...ys), Math.min(...zs)],
    max: [Math.max(...xs), Math.max(...ys), Math.max(...zs)]
  };
}
