const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");
const bodyParser=require('body-parser');

const app = express();


app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log("mongodb server running");
}).catch((err) => console.log(err));

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));

  const path =require('path');
  app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname, './client', 'build', 'index.html'));
  })

}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
