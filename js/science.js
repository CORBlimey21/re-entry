/** Educational constants and assumptions; see references and README. All internals SI. */
export const SCIENCE = Object.freeze({
  leoSpeed: 7800,
  lunarSpeed: 11000,
  defaultMass: 5000,
  atmosphere: Object.freeze({ seaLevelDensity: 1.217, scaleHeight: 8500 }),
  sampler: Object.freeze({ dragCoefficient: 1.2, referenceArea: 10, referenceAltitude: 60000, referenceSpeed: 7800 }),
});
function nonnegative(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be finite and nonnegative`);
}
export function kineticEnergy(mass, speed) {
  nonnegative(mass, 'Mass'); nonnegative(speed, 'Speed');
  return 0.5 * mass * speed ** 2;
}
export function densityAt(altitude) {
  nonnegative(altitude, 'Altitude');
  return SCIENCE.atmosphere.seaLevelDensity * Math.exp(-altitude / SCIENCE.atmosphere.scaleHeight);
}
export function dragForce(density, speed, coefficient, area) {
  [density, speed, coefficient, area].forEach((v) => nonnegative(v, 'Drag input'));
  return 0.5 * density * speed ** 2 * coefficient * area;
}
/** Same nose radius and gas/correlation coefficient; relative convective heating only. */
export function relativeHeating(density, speed, referenceDensity, referenceSpeed) {
  [density, speed].forEach((v) => nonnegative(v, 'Heating input'));
  if (!(referenceDensity > 0) || !(referenceSpeed > 0) || !Number.isFinite(referenceDensity) || !Number.isFinite(referenceSpeed)) throw new RangeError('Reference conditions must be finite and positive');
  return Math.sqrt(density / referenceDensity) * (speed / referenceSpeed) ** 3;
}
