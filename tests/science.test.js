import test from 'node:test';
import assert from 'node:assert/strict';
import { SCIENCE, kineticEnergy, densityAt, dragForce, relativeHeating } from '../js/science.js';
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) <= Math.max(1e-12, Math.abs(expected) * 1e-12), `${actual} ≠ ${expected}`);
test('energy calculator converts a representative orbital speed into correct SI energy', () => {
  assert.equal(kineticEnergy(5000, 7800), 152100000000);
  assert.equal(kineticEnergy(5000, 0), 0);
  assert.equal(kineticEnergy(0, 7800), 0);
});
test('doubling speed quadruples energy; mass scales linearly', () => {
  assert.equal(kineticEnergy(5000, 15600), 4 * kineticEnergy(5000, 7800));
  assert.equal(kineticEnergy(10000, 7800), 2 * kineticEnergy(5000, 7800));
  close(kineticEnergy(1, 11000) / kineticEnergy(1, 7800), 1.9888231426692966);
});
test('exponential atmosphere obeys its specified scale height', () => {
  close(densityAt(0), 1.217);
  close(densityAt(8500), 1.217 / Math.E);
  assert.ok(densityAt(100000) < densityAt(60000));
});
test('drag follows independent density, area and squared speed scalings', () => {
  assert.equal(dragForce(1, 100, 1.2, 10), 60000);
  assert.equal(dragForce(1, 200, 1.2, 10), 240000);
  assert.equal(dragForce(2, 100, 1.2, 10), 120000);
});
test('relative heating compares against a fixed reference, and density can outweigh falling speed', () => {
  const density = densityAt(SCIENCE.sampler.referenceAltitude);
  close(relativeHeating(density, 7800, density, 7800), 1);
  close(relativeHeating(density, 15600, density, 7800), 8);
  close(relativeHeating(4 * density, 7800, density, 7800), 2);
  assert.ok(relativeHeating(16 * density, 6000, density, 7800) > 1);
});
test('invalid physical inputs fail explicitly', () => {
  for (const value of [-1, NaN, Infinity]) {
    assert.throws(() => kineticEnergy(value, 7800), RangeError);
    assert.throws(() => kineticEnergy(5000, value), RangeError);
    assert.throws(() => densityAt(value), RangeError);
    assert.throws(() => dragForce(value, 7800, 1.2, 10), RangeError);
    assert.throws(() => relativeHeating(value, 7800, 1, 7800), RangeError);
  }
  assert.throws(() => relativeHeating(1, 7800, 0, 7800), RangeError);
});
