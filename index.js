import axios from 'axios';
import fs from 'fs';


const apikey = '9b87458bc731fc48ac8f3d9695817850';
const baseURL = 'http://api.positionstack.com/v1/forward';

//main
try {
  const filename = process.argv[2];
  const outputFile = 'output.txt';

  // reading input file
  var res = fs.readFileSync(filename, 'utf8', (err) => {
    if(err) throw err;
    console.log("File: " + filename);
  });
  
  const lines = res.split(/\r\n/);
  console.log(lines); //file data
  
  // if files is not empty then
  if(lines.length > 0 && lines[0] != '') {

    lines.map(loc => {
        // NOTE : Provinding valid input is assumed. || Data filter
        if(loc !== undefined && loc !== null && loc !== '' && loc !== isNaN(loc)) {
          
          axios.get(`${baseURL}?access_key=${apikey}&query=${loc}&limit=1`) //limit is put to 1 for our use case
            .then (response => {
            // console.log(response.data);
            
            if(response.data.data[0] && response.data.data[0] != null && response.data.data[0] != undefined) {
              var content = loc + " -> " +response.data.data[0].latitude + "," + response.data.data[0].longitude+"\r\n";
              console.log(content);
              

            }else{
              console.log("No such location found!");
            }

            
            //write into output file
            fs.appendFile(outputFile, content,err => {
              if(err) console.log(err);
            });
            
          }).catch (error => {
          console.log('Error : API calling error ; invalid input ' + loc);
          const err = error;
        });
      }
    });
    
  }else{
    console.log("File is empty");
  }
  
} catch (error) {
  console.log("ERROR : File name not given in console command");
  console.log("Use command : node start input.txt");
  console.log(error);
}
