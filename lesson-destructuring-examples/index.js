const { furnitureCatalogue, deviceOSMap } = require('./data.json');

/*

The Gist:

```
const x = { a: 1, b: 2 };
const { a, b } = x;
console.log(a + b);
```

Is equivalent to:

```
const x = { a: 1, b: 2 };
const a = x.a;
const b = x.b;
console.log(a + b)
```

*/

console.log("\n--- Device Operating Systems WITHOUT destructuring ---");

console.log(`Apple Macbook Pro: ${deviceOSMap.mac}`);
console.log(`Google Pixel 5: ${deviceOSMap.pixel}`);
console.log(`Samsung Galaxy S8: ${deviceOSMap.galaxy}`);
console.log(`Apple iPhone 12: ${deviceOSMap.iphone}`);
console.log(`MSI Raider Laptop: ${deviceOSMap.pc}`);

console.log("\n--- Device Operating Systems WITH destructuring ---");

const { mac, pixel, galaxy, iphone, pc } = deviceOSMap;

console.log(`Apple Macbook Pro: ${mac}`);
console.log(`Google Pixel 5: ${pixel}`);
console.log(`Samsung Galaxy S8: ${galaxy}`);
console.log(`Apple iPhone 12: ${iphone}`);
console.log(`MSI Raider Laptop: ${pc}`);

/*

Expected Output:

Apple Macbook Pro: osx
Google Pixel 5: android
Samsung Galaxy S8: android
Apple iPhone 12: ios
MSI Raider Laptop: windows

*/

console.log("\n--- Formatted furniture catalogue WITHOUT destructuring ---");

furnitureCatalogue.forEach((item) => {
  console.log(
    `${item.name} (${item.color}) - $${item.price} : ${item.dimensions[0]}x${item.dimensions[1]}`
  );
  item.pieces.forEach((piece) => {
    console.log(
      `  ${piece.name} - ${piece.quantity} : ${piece.dimensions[0]}x${piece.dimensions[0]}`
    );
  });
});

console.log("\n--- Formatted furniture catalogue WITH destructuring ---");

furnitureCatalogue.forEach(({ name, color, price, dimensions, pieces }) => {
  const [length, width] = dimensions;
  console.log(`${name} (${color}) - $${price} : ${length}x${width}`);
  pieces.forEach(
    ({ name: pieceName, quantity, dimensions: pieceDimensions }) => {
      const [pieceLength, pieceWidth] = pieceDimensions;
      console.log(
        `  ${pieceName} - ${quantity} : ${pieceLength}x${pieceWidth}`
      );
    }
  );
});

/*

Expected Output:

bedframe (black) - $599.99 : 100x100
  box frame - 1 : 90x90
  headboard - 1 : 10x90
office desk (grey) - $149.99 : 20x80
  desk - 1 : 20x80
  pegs - 5 : 2x2

*/