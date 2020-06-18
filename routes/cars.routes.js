const express = require('express');
const router = express.Router();
const Car = require('../models/car.model');


// GETTING ALL - http://localhost:9090/formula1cars
router.get('/', async (req, res) => {

    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GETTING ONE - http://localhost:9090/formula1cars/
router.get('/:id', getCar, (req, res) => {
    res.json(res.car);
});


// ***** ADMIN *****


// CREATING ONE - http://localhost:9090/admin/formula1cars
router.post('/admin', async (req, res) => {

    const postedCar = new Car({
        car: req.body.car,
        team: req.body.team,
        year: req.body.year,
        motor: req.body.motor
    });

    try {
        const newCar = await postedCar.save();
        res.status(201).json(newCar);
    } catch (err) {
        res.status(400).json({ message: "Fail - something went wrong: " + err.message });
    }
});


// UPDATING ONE - http://localhost:9090/admin/formula1cars/
router.patch('/admin/:id', getCar, async (req, res) => {

    try {
        res.car.car = req.body.car;
        res.car.team = req.body.team;
        res.car.year = req.body.year;
        res.car.motor = req.body.motor;

        await res.car.save();
        res.status(200).json({ message: "The car has been changed" });
    } catch (err) {
        res.status(400).json({ message: "Fail - something went wrong: " + err.message });
    }
});


// DELETING ONE - http://localhost:9090/admin/formula1cars/
router.delete('/admin/:id', getCar, async (req, res) => {

    try {
        await res.car.remove();
        res.json({ message: "Deleted car" });
    } catch (err) {
        res.status(500).json({ message: err. message });
    }
});


async function getCar (req, res, next) {
    let choosenCar;

    try {
        choosenCar = await Car.findById(req.params.id);

        if (choosenCar == null) {
            return res.status(404).json({ message: "Can't find the car" });
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }

        res.car = choosenCar;
        next();
    };


module.exports = router;