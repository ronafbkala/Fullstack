const express = require('express');
const multer = require('multer');
const path = require('path');
////////////////
const { createCanvas, loadImage } = require('canvas');
const { fabric } = require('fabric');

const app = express();
const PORT = 4000;

app.use(express.json());

//storage engine
 const storage= multer.diskStorage({
     destination:'./uploads/',
     filename:(req, file, cb)=>{
         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
     }
 });

// Set up multer to handle file uploads
const upload = multer({
    storage: storage
});


app.use('/image', express.static('uploads'))
// Endpoint to handle image modification (drawing text)
app.post('/upload', upload.single('image'), async (req, res) => {

    res.json({
        success:1,
        image_url: `http://localhost:3000/image/${req.file.filename} `
    })
});


// Handle image modification (example: adding text)
app.post('/modify', async (req, res) => {
    const { imagePath, actions } = req.body; // Get image path and text from request body

    try {
        const image = await loadImage(imagePath);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0); // Draw the image onto the canvas

        //const fabricCanvas = new fabric.Canvas(null, { width: image.width, height: image.height });
        //fabricCanvas.contextContainer = canvas.getContext('2d');

        // Load the image onto the Fabric.js canvas as a background
        //fabric.Image.fromURL(imagePath, fabricImage => {
            //fabricCanvas.setBackgroundImage(fabricImage, fabricCanvas.renderAll.bind(fabricCanvas));
        //});

        if (actions && actions.length > 0) {
            actions.forEach(action => {
                if (action.type === 'text') {
                    ctx.font = '30px Arial';
                    ctx.fillStyle = 'black';
                    ctx.fillText(action.content, action.x, action.y);
                } else if (action.type === 'draw') {
                    ctx.beginPath();
                    ctx.moveTo(action.x1, action.y1);
                    ctx.lineTo(action.x2, action.y2);
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 5;
                    ctx.stroke();
                }
            });
        }

        /*// Example: Add text to the image
        ctx.font = '30px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(text, 50, 50);

        // You can perform various modifications (drawing, inserting text, etc.) on the canvas here
        if (draw) {
            ctx.beginPath();
            ctx.moveTo(100, 100); // Example starting point for drawing (adjust as needed)
            ctx.lineTo(200, 200); // Example line drawn (adjust as needed)
            ctx.strokeStyle = 'red'; // Set line color
            ctx.lineWidth = 5; // Set line width
            ctx.stroke(); // Draw the line
        }*/

        // Convert canvas content to a buffer (PNG format)
        const modifiedImageBuffer = canvas.toBuffer('image/png');

        //const modifiedImageBuffer = Buffer.from(fabricCanvas.toDataURL().split(',')[1], 'base64');

        // Send the modified image buffer as a response
        res.contentType('image/png');
        res.send(modifiedImageBuffer);

        //res.json({ message: 'Image modified successfully' });
    } catch (error) {
        console.error('Error modifying the image:', error);
        res.status(500).json({ error: 'An error occurred while modifying the image' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
