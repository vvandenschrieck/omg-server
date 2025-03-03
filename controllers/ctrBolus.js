const Bolus = require("../models/modelBolus");
const seq = require("../config/config");
const sequelize = seq.sequelize;
const Sequelize = seq.Sequelize;
const passport = require("../app");
const {Op} = require("sequelize");

//////////////////////////////////////////////////////
/////////////// Routes controllers ///////////////////
//////////////////////////////////////////////////////


exports.getBolusWithFormattedDateAndTime = function (req, res) {
    try {
        passport.authenticate('local-jwt', {session: false}, function (err, user) {
            if (err) {
                return res.json({status: 'Authentication error', message: err});
            }
            if (!user) {
                return res.json({status: 'error', message: "Incorrect token"});
            }

            Bolus.findAll({
                attributes: [
                    [sequelize.fn('time_format', sequelize.col('datetime'), '%H:%i'), 'extractedTime'],
                    [sequelize.fn('date_format', sequelize.col('datetime'), '%Y-%m-%d'), 'extractedDate'],
                ],
                where: {
                    [Op.and]: [
                        {userId: user.id},
                        // {[Op.between]: [res.dataValues.fromTime, res.dataValues.toTime]},
                    ]
                },
                limit: 10000,
                order: sequelize.literal('updatedAt DESC')
            }).then((events) => {
                let bolusEvents = [];
                events.forEach((event) => {
                    let date = event.dataValues.extractedDate;
                    let time = event.dataValues.extractedTime;
                    bolusEvents.push({date: date, time: time});
                });
                res.status(200).json(bolusEvents);
            })
        })(req, res);
    } catch (e) {
        res.status(500).json(e);
    }
}
