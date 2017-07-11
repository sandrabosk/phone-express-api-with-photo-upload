const express = require('express');
const mongoose = require('mongoose');

const Phone = require('../models/phone-model');

const router = express.Router();

const multer     = require('multer');
const upload     = multer({ dest: 'public/uploads/phone-pictures' });
// const cors         = require('cors');
const baseUrl = 'localhost:3000/'



// router.use(cors({origin: 'http://localhost:4200'}));

  // GET http://localhost:3000/api/phones
router.get('/api/phones', (req, res, next) => {
  Phone.find((err, phonesList) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json(phonesList);
  });
});

  // POST http://localhost:3000/api/phones
router.post('/api/phones', (req, res, next) => {
  const thePhone = new Phone({
    brand: req.body.brand,
    name: req.body.name,
    specs: req.body.specs,
    image: req.body.image
  });

  thePhone.save((err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'new Phone created!',
      id: thePhone._id
    });
  });
});


router.post('/api/upload', upload.single('file'), function(req, res) {
  console.log("API UPLOAD BEING CALLED-------------")
  console.log(req.body);
  console.log(req.file);
  console.log("/uploads/phone-pictures/"+req.file.filename);

  const phone = new Phone({
    name: req.body.name,
    brand: req.body.brand,
    image: "http://localhost:3000/uploads/phone-pictures/"+req.file.filename,
    specs:  []
  });
  phone.save((err) => {
    if (err) {
      return res.send(err);
    }
    return res.json({
      message: 'New Phone created!',
      phone: phone
    });
  });
});

router.get('/api/phones/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400)
       .json({ message: 'Specified id is not valid' });
    return;
  }

  Phone.findById(req.params.id, (err, thePhone) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json(thePhone);
  });
});

router.put('/api/phones/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400)
       .json({ message: 'Specified id is not valid' });
    return;
  }

  const updates = {
    brand: req.body.brand,
    name: req.body.name,
    specs: req.body.specs,
    image: req.body.image
  };

  Phone.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Phone updated successfully'
    });
  });
});

router.delete('/api/phones/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400)
       .json({ message: 'Specified id is not valid' });
    return;
  }

  Phone.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Phone has been removed!'
    });
  });
});


module.exports = router;
