const path = require('path');
const db = require(path.join(process.cwd(), 'db'));

const route = path.join(process.env.BASE_ROUTE, path.basename(__filename).replace(path.extname(__filename), ''));

module.exports = server => {

    server.get(path.join(route, ':id/:hour'), async (req, res) => {
        res.contentType = 'application/json';
        const id = req.params.id;
        const hour = req.params.hour;

        try {
            const current_date = new Date().toISOString()
            const data = await db.query(`
				SELECT MAX(v_count)
				FROM
                (SELECT sensor_id, SUM(vehicle_count) as v_count
                FROM sensor_data
                WHERE (sensor_id IN (SELECT sensor_id FROM sensor WHERE road_id = $1)) AND 
				(DATE_PART('day', $2::timestamp - time::timestamp) * 24 + DATE_PART('hour', $2::timestamp - time::timestamp) < $3)
				GROUP BY sensor_id) as temp_table
            `, [id, current_date, hour]
            );

            res.send({ success: true, data: data.rows })
        }

        catch (error) {
            console.error(error.stack || error);
            res.send({ success: false, error: error });
        }
    });

    server.get(path.join(route, ':id/:hour/density'), async (req, res) => {
        res.contentType = 'application/json';
        const id = req.params.id;
        const hour = req.params.hour;

        try {
            const current_date = new Date().toISOString()
            const data = await db.query(`
				SELECT MAX(v_count)
				FROM
                (SELECT sensor_id, SUM(vehicle_count) as v_count
                FROM sensor_data
                WHERE (sensor_id IN (SELECT sensor_id FROM sensor WHERE road_id = $1)) AND 
				(DATE_PART('day', $2::timestamp - time::timestamp) * 24 + DATE_PART('hour', $2::timestamp - time::timestamp) < $3)
				GROUP BY sensor_id) as temp_table
            `, [id, current_date, hour]
            );

            res.send({ success: true, data: data.rows })
        }

        catch (error) {
            console.error(error.stack || error);
            res.send({ success: false, error: error });
        }
    });

    server.get(path.join(route, ':id/:hour1/:hour2/density'), async (req, res) => {
        res.contentType = 'application/json';
        const id = req.params.id;

        let hour1 = new Date();
        let hour2 = new Date();
        console.log(hour1);
        hour1.setHours(hour1.getHours() - req.params.hour1);
        hour2.setHours(hour2.getHours() - req.params.hour2);
        hour1 = hour1.toISOString();
        hour2 = hour2.toISOString();

        try {
            const data = await db.query(`
                SELECT sensor_id, SUM(vehicle_count) as v_count
                FROM sensor_data
                WHERE (sensor_id IN (SELECT sensor_id FROM sensor WHERE road_id = $1)) AND 
				(time BETWEEN $3::timestamp AND $2::timestamp)
				GROUP BY sensor_id
            `, [id, hour1, hour2]
            );

            res.send({ success: true, data: data.rows })
        }

        catch (error) {
            console.error(error.stack || error);
            res.send({ success: false, error: error });
        }
    });

    server.get(path.join(route, ':id/:date1/:date2/densityDate'), async (req, res) => {
        res.contentType = 'application/json';
        const id = req.params.id;

        const date1 = req.params.date1;
        const date2 = req.params.date2;

        try {
            const data = await db.query(`
                SELECT sensor_id, SUM(vehicle_count) as v_count
                FROM sensor_data
                WHERE (sensor_id IN (SELECT sensor_id FROM sensor WHERE road_id = $1)) AND 
				(time BETWEEN $2::timestamp AND $3::timestamp)
				GROUP BY sensor_id
            `, [id, date1, date2]
            );

            res.send({ success: true, data: data.rows })
        }

        catch (error) {
            console.error(error.stack || error);
            res.send({ success: false, error: error });
        }
    });

    server.get(path.join(route, ':id/:date1/:date2/densityDateSum'), async (req, res) => {
        res.contentType = 'application/json';
        const id = req.params.id;

        const date1 = req.params.date1;
        const date2 = req.params.date2;

        try {
            const data = await db.query(`
				SELECT MAX(v_count)
				FROM
                (SELECT sensor_id, SUM(vehicle_count) as v_count
                FROM sensor_data
                WHERE (sensor_id IN (SELECT sensor_id FROM sensor WHERE road_id = $1)) AND 
				(time BETWEEN $3::timestamp AND $2::timestamp)
				GROUP BY sensor_id) as temp_table
            `, [id, date1, date2]
            );

            res.send({ success: true, data: data.rows })
        }

        catch (error) {
            console.error(error.stack || error);
            res.send({ success: false, error: error });
        }
    });

    server.get(path.join(route, ':id/:hour1/:hour2/densitySensorID'), async (req, res) => {
        res.contentType = 'application/json';
        const id = req.params.id;

        let hour1 = new Date();
        let hour2 = new Date();
        console.log(hour1);
        hour1.setHours(hour1.getHours() - req.params.hour1);
        hour2.setHours(hour2.getHours() - req.params.hour2);
        hour1 = hour1.toISOString();
        hour2 = hour2.toISOString();

        try {
            const data = await db.query(`
                SELECT SUM(vehicle_count)
                FROM sensor_data
                WHERE sensor_id = $1 AND 
				time BETWEEN $3::timestamp AND $2::timestamp
            `, [id, hour1, hour2]
            );

            res.send({ success: true, data: data.rows })
        }

        catch (error) {
            console.error(error.stack || error);
            res.send({ success: false, error: error });
        }
    });

    server.get(path.join(route, ':id/week'), async (req, res) => {
        res.contentType = 'application/json';
        const id = req.params.id;

        try {
            const current_date = new Date().toISOString()
            const carsPerDay = [];
            for (let i = 1; i <= 7; i++) {
                const { rows } = await db.query(`
					SELECT MAX(v_count)
					FROM
					(SELECT sensor_id, SUM(vehicle_count) as v_count
					FROM sensor_data
					WHERE (sensor_id IN (SELECT sensor_id FROM sensor WHERE road_id = $1)) AND
					(DATE_PART('day', $2::timestamp - time::timestamp) * 24 + DATE_PART('hour', $2::timestamp - time::timestamp) > ${24 * (i - 1)}) AND
					(DATE_PART('day', $2::timestamp - time::timestamp) * 24 + DATE_PART('hour', $2::timestamp - time::timestamp) < ${24 * i})
					GROUP BY sensor_id) as temp_table
				`, [id, current_date]
                );
                carsPerDay.push(rows[0].max);
            }
            res.send({ success: true, data: carsPerDay })
        }

        catch (error) {
            console.error(error.stack || error);
            res.send({ success: false, error: error });
        }
    });
};