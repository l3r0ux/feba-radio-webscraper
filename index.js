const express = require('express')
const app = express()
const axios = require('axios')
const cheerio = require('cheerio');

const port = 3000

app.get('/get-daily-prayer', async (req, res) => {
    // pray_12-04
    // bid_12-04
    const prayerParam = req.query.currentDate

    try {
        const { data } = await axios.get(`https://febaradio.co.za/events/event/bid_12-04/`)
        const $ = cheerio.load(data);
        const prayerText = $('.page-content > p').text()
        const prayerStartTime = $('.page-content ul li:first-of-type time:first-of-type').attr('datetime')
        const prayerEndTime = $('.page-content ul li:first-of-type time:nth-of-type(2)').attr('datetime')

        res.send({
            prayerText,
            prayerStartTime: new Date(prayerStartTime).getHours(),
            prayerEndTime: new Date(prayerEndTime).getHours()
        })
    } catch (err) {
        console.error(err)
        res.status(500).send('Something went wrong!')
    }
})

app.listen(port, () => {
  console.log(`Llistening on port ${port}`)
})