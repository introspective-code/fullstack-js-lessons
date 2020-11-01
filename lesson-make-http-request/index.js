const axios = require('axios');

const API_URL = process.env.API_URL || "https://dog.ceo/api/breeds/image/random";

async function main() {
  try {
    const { data } = await axios.get(API_URL);
    console.log(data);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
