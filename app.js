//Core module
const fs = require("fs")

//Third party module
const express = require("express")
const morgan = require("morgan")
const app = express()

//Middleware Moran
app.use(morgan("dev"))

//Middleware Express
app.use(express.json())

//Our own middleware
app.use((res, req, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

const port = process.env.port || 3000

//Membaca data dari file json
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`
  )
)
const users = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/users.json`
  )
)

///////////////////////////////////
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    data: {
      tours,
    },
  })
}

/////////////////////////////////////
const getTourById = (req, res) => {
  const id = req.params.id * 1
  const tour = tours.find((el) => el.id === id)

  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} not found!`,
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  })
}

/////////////////////////////////
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1
  const newData = Object.assign(
    { id: newId },
    req.body
  )

  tours.push(newData)
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.send(201).json({
        status: "success",
        data: {
          tour: newData,
        },
      })
    }
  )
}

/////////////////////////////////
const editTour = (req, res) => {
  const id = req.params.id * 1
  //findIndex = -1 (jika data tidak ada)
  const tourIndex = tours.findIndex(
    (el) => el.id === id
  )

  if (tourIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} not found!`,
    })
  }

  tours[tourIndex] = {
    ...tours[tourIndex],
    ...req.body,
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `tour with this ${id} edited!`,
        data: {
          tour: tours[tourIndex],
        },
      })
    }
  )
}

/////////////////////////////////
const removeTour = (req, res) => {
  //konversi tipe data string menjadi number
  const id = req.params.id * 1
  const tourIndex = tours.findIndex(
    (el) => el.id === id
  )

  if (tourIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "data not found!",
    })
  }

  //Menghapus data sesuai index array dari params.id
  tours.splice(tourIndex, 1)

  //Proses update di file json
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "berhasil delete data!",
        data: null,
      })
    }
  )
}

///// USERS ///////
///////////////////////////////////
const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    data: {
      users,
    },
  })
}

/////////////////////////////////////
const getUserById = (req, res) => {
  const id = req.params.id
  const user = users.find((el) => el.id === id)

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} not found!`,
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
}

/////////////////////////////////
const createUser = (req, res) => {
  const newId = users[users.length - 1]
  const newData = Object.assign(
    { id: newId },
    req.body
  )

  users.push(newData)
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.send(201).json({
        status: "success",
        data: {
          userr: newData,
        },
      })
    }
  )
}

/////////////////////////////////
const editUser = (req, res) => {
  const id = req.params.id
  //findIndex = -1 (jika data tidak ada)
  const userIndex = users.findIndex(
    (el) => el.id === id
  )

  if (userIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} not found!`,
    })
  }

  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `user with this ${id} edited!`,
        data: {
          user: users[userIndex],
        },
      })
    }
  )
}

/////////////////////////////////
const removeUser = (req, res) => {
  //konversi tipe data string menjadi number
  const id = req.params.id
  const userIndex = users.findIndex(
    (el) => el.id === id
  )

  if (userIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "data not found!",
    })
  }

  //Menghapus data sesuai index array dari params.id
  users.splice(userIndex, 1)

  //Proses update di file json
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "berhasil delete data!",
        data: null,
      })
    }
  )
}

const tourRouter = express.Router()
const userRouter = express.Router()

//Route untuk tours
app
  .route("/api/v1/tours")
  .get(getAllTours)
  .post(createTour)

app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .patch(editTour)
  .delete(removeTour)

//Route untuk users
app
  .route("/api/v1/users")
  .get(getAllUsers)
  .post(createUser)

app
  .route("/api/v1/users/:_id")
  .get(getUserById)
  .patch(editUser)
  .delete(removeUser)

app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

// // ROUTING //
// ////////////////////////////
// //Get data dari package.json
// app.get("/api/v1/tours", getAllTours)

// //////////////////////
// //Get data by Id
// app.get("/api/v1/tours/:id", getTourById)

// ////////////////////////
// //Create data baru
// app.post("/api/v1/tours", createTour)

// ///////////////////////
// //edit data using patch
// app.patch("/api/v1/tours/:id", editTour)

// ////////////////////////
// //delete data tour by id
// app.delete("/api/v1/tours/:id", removeTour)

app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
