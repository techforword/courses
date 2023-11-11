import express from "express"

const app = express()
const PORT = 3000

const url = "https://developers.teachable.com/v1/courses"
const authorizationKey = "cXycM0ts1IRN7293bbH1M8F0NbhYRBsx"

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get("/", async (req, res) => {
  try {
    const fetchOptions = {
      headers: {
        apiKey: authorizationKey,
      },
    }

    const fetchResponse = await fetch(url, fetchOptions)
    const courses = await fetchResponse.json()

    res.json({ courses })
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
})
