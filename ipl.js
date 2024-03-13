const puppeteer = require('puppeteer');
const cron = require('node-cron');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

// Initialize the WhatsApp Web client
const client = new Client();
client.on('qr', (qr) => qrcode.generate(qr, { small: true }));
client.on('ready', () => {
  console.log('Client is ready!');
});
client.initialize();

async function checkWebsite() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://shop.royalchallengers.com/ticket', {
    waitUntil: 'networkidle2',
  }); // Adjust with the actual URL

  await new Promise((r) => setTimeout(r, 3000));

  const pageText = await page.evaluate(() => document.body.innerText);
  const searchWords = ['Kolkata Knight Riders', 'Mar 29, 2024 07:30 PM'];
  const allWordsFound = searchWords.some((word) =>
    pageText.toLowerCase().includes(word.toLowerCase())
  );

  await browser.close();
  return allWordsFound;
}

async function sendWhatsAppMessage(message) {
  await client.sendMessage('REceiver_Number@c.us', message);
}

// Schedules the task to run every 2 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Checking the website...');
  const dataFound = await checkWebsite();

  if (dataFound) {
    console.log('Data found! Sending WhatsApp message...');
    await sendWhatsAppMessage('Match Tickets Available Now, Buy Karo Bhai');
    await sendWhatsAppMessage('Thik Hai Bhai Check Kar Lete Hai');
    await sendWhatsAppMessage('Ya Please Buy');
    await sendWhatsAppMessage('Bhai Buy Bhai Buy');
  } else {
    console.log('Match Tickets Not Available Yet !');
  }
});
