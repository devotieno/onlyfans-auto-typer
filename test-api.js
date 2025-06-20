const { getFanEvents } = require('./src/api');

async function test() {
  const events = await getFanEvents('creator123');
  console.log('Fan Events:', JSON.stringify(events, null, 2));
}

test();