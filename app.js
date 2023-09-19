//Core module
const fs = require('fs')

//Third party module
const express = require('express')
const app = express()

const port = process.env.port || 3000

//Middleware Express
app.use(express.json())

//Membaca data dari file json
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

////////////////////////////
//Get data dari package.json
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours
    }
  })
})


//////////////////////
//Get data by Id
app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if(!tour) {
    return res.status(404).json ({
      status: "failed",
      message: `data with ${id} not found!`
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  })
})


////////////////////////
//Create data baru
app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newData = Object.assign({ id: newId }, req.body);

  tours.push(newData);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.send(201).json({
      status: "success",
      data: {
        tour: newData
      }
    })
  })
})


  ///////////////////////
  //edit data using patch
  app.patch('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    //findIndex = -1 (jika data tidak ada)
    const tourIndex = tours.findIndex(el => el.id === id);
  
    if(tourIndex === -1 ) {
      return res.status(404).json({
        status: "failed",
        message: `data with ${id} not found!`,
      })
    }

    tours[tourIndex] = {...tours[tourIndex], ...req.body}

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
      res.status(200).json ({
        status: "success",
        message: `tour with this ${id} edited!`,
        data: {
          tour: tours[tourIndex]
        }
      })
    })    
  })

  ////////////////////////
  //delete data tour by id
  app.delete('/api/v1/tours/:id', (req, res) => {
    //konversi tipe data string menjadi number
    const id = req.params.id * 1;
    const tourIndex = tours.findIndex(el => el.id === id);

    if (tourIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "data not found!"
      })
    }

    //Menghapus data sesuai index array dari params.id
    tours.splice(tourIndex, 1);
    
    //Proses update di file json
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
      res.status(200).json({
        status: "success",
        message: "berhasil delete data!",
        data: null
        })
      })
    })


app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});