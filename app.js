const express = require("express");
const app = express();
require('dotenv').config();

////////////////// Cors //////////////////////////////
const cors = require('cors')
let corsOptions = {
    origin: '*',
    credentials: 'true'
}
app.use(cors(corsOptions));
//////////////////////////////////////////////////////

////////////////// Passport //////////////////////////
const passport = require("./config/passport")

app.use(passport.initialize({session: false}));
app.use(passport.session({session: false}));

module.exports = passport;
//////////////////////////////////////////////////////

///////////////// Body-parser ////////////////////////
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
app.use(bodyParser.json({limit: '500mb', extended: true}));
//////////////////////////////////////////////////////

///////////////// SYNC DB ////////////////////////////
const seq = require("./config/config");
seq.sequelize.sync()
    .then(() => {
        // seq.sequelize.query('ALTER TABLE data DROP CONSTRAINT id');
        // seq.sequelize.query('ALTER TABLE data ADD CONSTRAINT pk_user PRIMARY KEY (datetime, userId)');
        console.log("--\nDatabase synchronized\n--");
    })
    .catch((error) => console.log("An error occurred while Synchronization.\n", error));
//////////////////////////////////////////////////////

///////////////// Route modules //////////////////////
const routeUser = require("./routes/routeUser");
const routeTag = require("./routes/routeTag");
const routeData = require("./routes/routeData");
const routeDetectionRanges = require("./routes/routeDetectionRanges");
const routeBolus = require("./routes/routeBolus");

app.use("/api/tags", routeTag);
app.use("/api/users", routeUser);
app.use("/api/data", routeData);
app.use("/api/ranges", routeDetectionRanges);
app.use("/api/bolus", routeBolus);
//////////////////////////////////////////////////////


app.listen(3001, "localhost");
