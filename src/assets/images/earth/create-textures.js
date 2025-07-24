const fs = require('fs');
const path = require('path');

// Simple 1x1 pixel PNG in base64
const simplePng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

// Simple blue/green earth texture
const earthJpg = '/9j/4AAQSkZJRgABAQEAAAEAAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAALCAAQABABAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

const textures = [
  'gradient.png',
  'redCircle.png', 
  'label.png',
  'aperture.png',
  'glow.png',
  'light_column.png',
  'aircraft.png'
];

// Create PNG files
textures.forEach(filename => {
  fs.writeFileSync(filename, Buffer.from(simplePng, 'base64'));
  console.log(`Created ${filename}`);
});

// Create earth.jpg
fs.writeFileSync('earth.jpg', Buffer.from(earthJpg, 'base64'));
console.log('Created earth.jpg');

console.log('All texture files created!');
