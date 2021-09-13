//express setup
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
let cache = {};
let myfile = {};
let cacheLength = 0;
let sizeArr = [];
let DateArr=[]
console.log(cache);
let cloud=path.join(__dirname, "cloud")
console.log(Object.keys(cache).length);
console.log(cacheLength);
//middleware setup
app.use(fileUpload());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/data", (req, res) => {

      readDir(cloud).then((files)=>{
        console.log(files)
        let filesList=files
        console.log(sizeArr)
        sizeArr=filesList.map(item=>bytesToKB(getFileSize(cloud+"/"+item)))
        console.log(sizeArr)
        DateArr=filesList.map(item=>getReadableDate(getModiefiedTime(cloud+"/"+item)))
        myfile = { fileList: filesList,fileSize:sizeArr,lastModified:DateArr };
        res.send(JSON.stringify(myfile));
        
      }).catch((error)=>{throw error})
     
        
      
});

app.post("/upload", (req, res) => {
  console.log(req.files);
  let userFile = req.files.file;
  cache[userFile.name] = {
    data: userFile.data,
  };
  console.log(cache);
  storeFile(path.join(__dirname, "cloud", userFile.name), userFile.data).catch((error)=>{throw error});
  res.redirect("/success");
});
app.get("/success", (req, res) => {
  res.type("html");
  res.send(
    "<p>Your file have been uploaded</p><a href='/'>Go back to home</a>"
  );
});
app.get("/upload/:filename", (req, res) => {
  if (cache[req.params.filename] === undefined) {
    getFile(path.join(__dirname, "cloud", req.params.filename)).then((data) => {
      cache[req.params.filename] = {
        data: data,
      };
      res.attachment(req.params.filename)
      res.send(cache[req.params.filename].data);
    });
  } else {
    console.log("Your file is downloading from cache");
    res.send(cache[req.params.filename].data);
  }
});

app.get("/delete/:filename", (req, res) => {
  fs.rm(path.join(cloud,req.params.filename),(error)=>{
if(error) console.log(error)
console.log("File successfully deleted permanently")
  })
  res.redirect("/");
});

app.post("/rename",(req,res)=>{
  fs.rename(cloud+"/"+req.body.original,cloud+"/"+req.body.rename,(err)=>{
    res.redirect("/")

  })
})

app.listen(3000, () => {
  console.log("App listening to port 3000");
});
function getFile(path) {
  return new Promise((resolve, reject) => {
  fs.readFile(path, (err,data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function getFileSize(path) {
   return fs.statSync(path).size
}
function readDir(path){
  return new Promise((resolve,reject)=>{
    fs.readdir(path,(error,files)=>{
      if (error) {
        reject(err);
      } else {
        resolve(files);
      }
    })
  })
}
  function storeFile(path, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
          console.log("File have been uploaded");
        }
      });
    });
  }

function bytesToKB (number)
{
  let size=number
  if(size/1024<1024){
    size=size/1024
    return size.toFixed(1)+" KB"
  }else if(size/1048576<1024)
  {
    size=size/1048576
    return size.toFixed(1)+" MB"

  }else
  {
    size=size/1073741824
    return size.toFixed(1)+" GB"

  }
}
function getModiefiedTime(path){
  return fs.statSync(path).ctimeMs
}
function getReadableDate(ms){
  let date=new Date(ms)
  let today=new Date()
  let timeOption={ hour: '2-digit', minute: '2-digit' }
  if(today.toDateString()===date.toDateString())
  {
    return "Today "+date.toLocaleTimeString("en-us",timeOption)
  }else if(today.getDate()-date.getDate()<7&&today.getMonth()===date.getMonth()&&today.getFullYear()===date.getFullYear()){
    return date.toLocaleDateString("en-us",{weekday:"long"})+" "+date.toLocaleTimeString("en-us",timeOption)
  }else{
    return date.toLocaleDateString("en-us",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })+" "+date.toLocaleTimeString("en-us",timeOption)
  }
}