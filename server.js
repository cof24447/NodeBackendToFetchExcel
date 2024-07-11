// Import required modules
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors')
const xlsx = require('xlsx');
// Create an Express application
const app = express();


const port = 3000; // Set the port for your server
app.use(cors({
    origin: 'https://localhost:5241'
  }));
// Define routes
app.get('/download', (req, res) => {


    const url = 'https://storage.cloud.google.com/test-add-on-data/team-data-1.xlsx';
    const outputFile = 'Sample-Spreadsheet-100-rows.xls';
  
    axios.get(url, { responseType: 'arraybuffer' })
      .then(response => {
        fs.writeFileSync(outputFile, response.data);
        console.log('File downloaded successfully');
  
        // Send the downloaded file as a response
        res.download(outputFile, 'Sample-Spreadsheet-100-rows.xls', (err) => {
          if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file');
          } else {
            console.log('File sent successfully');
            // Optionally, you can delete the downloaded file after sending
            fs.unlinkSync(outputFile);
          }
        });
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        res.status(500).send('Error downloading file');
      });
  //res.send('Hello, World!'); // Send a simple response for the root URL
});

app.get('/data', (req, res) => {
    const workbook = xlsx.readFile('./imagestoadd.xlsx');
    const sheetName = workbook.SheetNames[0]; // Assuming only one sheet
    const sheet = workbook.Sheets[sheetName];
  
    // Convert the sheet data to JSON
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    console.log(jsonData)
    // Send the JSON data as a response to the frontend
    res.json(jsonData);// Send a simple response for the /about route
});

app.get('/teamdata', (req, res) => {
  const workbook = xlsx.readFile('./team-details.xlsx');
  const sheetName = workbook.SheetNames[0]; // Assuming only one sheet
  const sheet = workbook.Sheets[sheetName];

  // Convert the sheet data to JSON
  const jsonData = xlsx.utils.sheet_to_json(sheet);
  console.log(jsonData)
  // Send the JSON data as a response to the frontend
  res.json(jsonData);// Send a simple response for the /about route
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
