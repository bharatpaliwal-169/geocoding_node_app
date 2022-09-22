import axios from 'axios';
import fs from 'fs';

// ok for command line program
const apikey = '9b87458bc731fc48ac8f3d9695817850';


try {
  // hard caching or in memory cache
  var cache = new Map();
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

      // check in cache
      if(cache.get(loc) != undefined || cache.get(loc) != null) {
        console.log('cache hit');
        // write to output file
        fs.appendFileSync(outputFile, cache.get(loc), (err) => {
          if(err) console.log(err);
        });
      }else{
          // NOTE : Provinding valid input is assumed.
          axios.get(`http://api.positionstack.com/v1/forward?access_key=${apikey}&query=${loc}&limit=1`) //limit is put to 1 for our use case
          .then (response => {
          // console.log(response.data);

          // api response  = !NULL
          if(response.data.data[0]){
            var content = response.data.data[0].latitude + "," + response.data.data[0].longitude+"\r\n";
            console.log(content);

            //set it in cache
            cache.set(loc.toString(), content.toString());
          }else{
            console.log("No such location found!");
          }

          //write into output file
          fs.appendFile(outputFile, content,err => {
            if(err) console.log(err);
          });
        
        }).catch (error => {
          console.log(error);
        });
      }

    }); 
  }else{
    console.log("File is empty");
  }
  // cache.set("bang","00,00")
  console.log(cache);
} catch (error) {
  console.log("ERROR : File name not given in console command");
  console.log("Use command : node start input.txt");
  console.log(error);
}
