const express = require("express")
const cors = require("cors")

const app = express()
const PORT = 3000

app.use(cors())

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT}...`)
})

const fetchData = async (url, res) => {
  try {
    const fetchOptions = {
      headers: {
        apiKey: process.env.API_KEY,
      },
    }

    const fetchResponse = await fetch(url, fetchOptions)
    const data = await fetchResponse.json()

    res.json({ data })
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
}

app.get("/courses", (req, res) => {
  fetchData(process.env.COURSES_URL, res)
})

app.get("/enrollments", (req, res) => {
  fetchData(process.env.COURSES_ENROLLMENTS_URL, res)
})

app.get("/course", (req, res) => {
  fetchData(process.env.COURSE_URL, res)
})

app.get("/users", (req, res) => {
  fetchData(process.env.USERS_URL, res)
})

module.exports = app
