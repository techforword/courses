const express = require("express")

const app = express()
const PORT = 3000

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT}...`)
})

app.get("/", async (req, res) => {
  try {
    const fetchOptions = {
      headers: {
        apiKey: process.env.API_KEY,
      },
    }

    const fetchResponse = await fetch(process.env.URL, fetchOptions)
    const courses = await fetchResponse.json()

    res.json({ courses })
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
})

module.exports = app
