const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');


const serverDir = path.join(__dirname, '\Serveri'); 


console.log('Checking directory path:', serverDir);


function isServerFile(file) {
  return file.endsWith('.js'); 
}


fs.readdir(serverDir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  console.log('Files found in directory:', files); 
  
  
  const serverFiles = files.filter(isServerFile);

  if (serverFiles.length === 0) {
    console.log('No server files found!');
    return;
  }

  console.log('Starting servers:', serverFiles); 

  
  serverFiles.forEach((serverFile) => {
    const filePath = path.join(serverDir, serverFile);
    console.log(`Starting server: ${serverFile}`);

    // Execute the server using Node
    const serverProcess = exec(`node ${filePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting ${serverFile}: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr from ${serverFile}: ${stderr}`);
        return;
      }
      if (stdout) {
        console.log(`stdout from ${serverFile}: ${stdout}`);
      }
    });

    
    serverProcess.on('exit', (code) => {
      console.log(`${serverFile} process exited with code ${code}`);
    });
  });
});
