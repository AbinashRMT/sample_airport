const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const fuzz = require('fuzzball');
let count = 2;


function matchIntent(input, intents) {
    let bestMatch = { intent: null, score: 0 };

    Object.entries(intents).forEach(([intent, phrases]) => {
        const scores = phrases
            .filter((phrase) => typeof phrase === 'string') // Ensure all phrases are strings
            .map((phrase) => fuzz.ratio(input, phrase)); // Calculate similarity scores

        if (scores.length > 0) {
            const maxScore = Math.max(...scores); // Find the highest similarity score

            if (maxScore > bestMatch.score) {
                bestMatch = { intent, score: maxScore }; // Update the best match if the score is higher
            }
        }
    });

    return bestMatch;
}

// Sample API endpoint
app.get("/flight-details", (req, res) => {
    const { flightNumber } = req.query;
    console.log(flightNumber);

    if (!flightNumber) {
        return res.status(400).json({ error: "Flight number is required" });
    }

    const intentObj = {
        "Indigo 101": ["Indigo 101", "Indi 101", "Indgo 101", "Indi101", "Indigo101"],
        "air inidia 304": ["Air India 304", "AI 304", "AirIndia 304", "Air India flight 304", "AI flight 304"]
    }

    const data = matchIntent(flightNumber, intentObj);

    if (data.score > 50) {
        const flightDetails = {
            flightNumber: flightNumber,
            flightTime: "12:00AM",
            gateNumber: 5,
        };
        return res.status(200).json(flightDetails);
    }
    res.status(400).json({ message: "flight data not found" });
});

app.get("/hotel-booking", (req, res)=>{
    if((count % 2) === 0 ){
        return res.status(200).send({
            from : "19-march-2025",
            to : "25-march-2025",
            hotelName : "hotel taj mumbai"
        })
    }
    count++;
    return res.status(400).json({message : "Sorry I don't found any bookin in this number"});
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
