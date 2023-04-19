const express = require('express')
const app = express()
const axios = require('axios')
const cheerio = require('cheerio');
const cors = require('cors');

const port = process.env.PORT || 3000

app.use(cors());

app.get('/get-daily-prayer', async (req, res) => {
    const prayerParam = req.query.currentDate

    try {
        const { data } = await axios.get(`https://febaradio.co.za/events/event/${prayerParam}`)
        const $ = cheerio.load(data);
        const prayerText = $('.page-content > p').text()
        const prayerStartTime = $('.page-content ul li:first-of-type time:first-of-type').attr('datetime')
        const prayerEndTime = $('.page-content ul li:first-of-type time:nth-of-type(2)').attr('datetime')

        res.json({
            prayerText,
            prayerStartTime: new Date(prayerStartTime).getHours(),
            prayerEndTime: new Date(prayerEndTime).getHours()
        })
    } catch (err) {
        console.error(err)
        res.status(err.response.status).json({ message: err.message })
    }
})

app.listen(port, () => {
  console.log(`Llistening on port ${port}`)
})