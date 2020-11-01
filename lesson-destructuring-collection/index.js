const items = [
  {
    "name": "bedframe",
    "price": 599.99,
    "color": "black",
    "dimensions": [100, 100],
    "pieces": [
      {
        "name": "box frame",
        "dimensions": [90, 90],
        "quantity": 1
      },
      {
        "name": "headboard",
        "dimensions": [10, 90],
        "quantity": 1
      },
    ]
  },
  {
    "name": "office desk",
    "price": 149.99,
    "color": "grey",
    "dimensions": [20, 80],
    "pieces": [
      {
        "name": "desk",
        "dimensions": [20, 80],
        "quantity": 1
      },
      {
        "name": "pegs",
        "dimensions": [2, 2],
        "quantity": 5
      },
    ]
  },
];

console.log("\n--- Formatted item list WITHOUT destructuring ---");

items.forEach(item => {
  console.log(
    `${item.name} (${item.color}) - $${item.price} : ${item.dimensions[0]}x${item.dimensions[1]}`
  );
  item.pieces.forEach(piece => {
    console.log(
      `  ${piece.name} - ${piece.quantity} : ${piece.dimensions[0]}x${piece.dimensions[0]}`
    );
  });
});

console.log("\n--- Formatted item list WITH destructuring ---");

items.forEach(({ name, color, price, dimensions, pieces }) => {
  const [length, width] = dimensions;
  console.log(`${name} (${color}) - $${price} : ${length}x${width}`);
  pieces.forEach(({ name: pieceName, quantity, dimensions: pieceDimensions }) => {
    const [pieceLength, pieceWidth] = pieceDimensions;
    console.log(`  ${pieceName} - ${quantity} : ${pieceLength}x${pieceWidth}`);
  });
});

/*

Expected Output In Both Cases:

bedframe (black) - $599.99 : 100x100
  box frame - 1 : 90x90
  headboard - 1 : 10x90
office desk (grey) - $149.99 : 20x80
  desk - 1 : 20x80
  pegs - 5 : 2x2

*/