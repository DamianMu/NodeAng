const Queue = require('bull');
const albumsQueue = new Queue('import albums');
const axios = require('axios');
const fs = require('fs');

albumsQueue.process(function(job, done){
  axios.get(job.data.url)
  .then(response => {
    console.log(response.data);
    fs.writeFile("import"+ job.id +".txt", JSON.stringify(response.data, null, 2), function(err) {
      if(err) {
        done(err)
      }
      console.log("The file was saved")
    });
  })
  .catch(error => {
    console.log(error);
  });
})

module.exports = albumsQueue;
