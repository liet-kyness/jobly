"use strict"

const jsonschema = require('jsonschema');
const express = require('express');
const Job = require('../models/job');
const { ensureAdmin } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const jobNewSchema = require('../schemas/jobNew.json');
const jobUpdateSchema = require('../schemas/jobUpdate.json');
const jobSearchSchema = require('../schemas/jobSearch');

const router = express.Router({ mergeParams: true });

router.post('/', ensureAdmin, async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const job = await Job.create(req.body);
        return res.status(201).json({ job });
    }
    catch (err) {
        return next(err);
    }
});

router.get('/', async (req, res, next) => {
    const q = req.query;
    if (q.minSalary !== undefined) q.minSalary = +q.minSalary;
    q.hasEquity = q.hasEquity === "true";
    try {
        const validator = jsonschema.validate(q, jobSearchSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
    const jobs = await Job.findAll(q);
    return res.json({ jobs });
    }
    catch (err) {
        return next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const job = await Job.get(req.params.id);
        return res.json({ job });
    }
    catch (err) {
        return next(err);
    }
});

router.patch('/:id', ensureAdmin, async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, jobUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const job = await Job.update(req.params.id, req.body);
        return res.json({ job });
    }
    catch (err) {
        return next(err);
    }
});

router.delete('/:id', ensureAdmin, async (req, res, next) => {
    try {
        await Job.remove(req.params.id);
        return res.json({ removed: +req.params.id});
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;