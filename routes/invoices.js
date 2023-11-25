const express = require('express');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');

router.get('/invoices', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({ invoices: results.rows });
    } catch (e) {
        return next(e);
    }
});

router.get('/invoices/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
        }
        return res.send({ invoice: results.rows[0]} )
    } catch(e) {
        return next(e);
    }
});

router.post('/invoices', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2)
        RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt])
        return res.status(201).json({ invoice: results.rows[0] })
    } catch (e) {
        return next(e);
    }
});

router.put('/invoices/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { comp_code, amt } = req.body;
        const results = await db.query(`UPDATE invoices SET comp_code=$1, amt=$2 WHERE id=$3
        RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt, id])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't update invoices with id of ${id}`, 404)
        }
        return res.status(201).json({ invoice: results.rows[0] })

    } catch (e) {
        return next(e);
    }
});

router.delete('/invoices/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`DELETE FROM invoices WHERE id=$1`, [id])
        return res.send({ msg: 'deleted!'})
    } catch (e) {
        return next(e);
    }
})

module.exports = router;