const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs/promises');
const { transparentBackground } = require('transparent-background');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle image upload and background removal
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Read the input image from buffer
    const inputBuffer = req.file.buffer;

    // Perform background removal
    const outputBuffer = await transparentBackground(inputBuffer, 'png', {
      fast: false, // Use the default 1024x1024 model
    });

    // Send the resulting image as response
    res.set('Content-Type', 'image/png');
    res.send(outputBuffer);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
