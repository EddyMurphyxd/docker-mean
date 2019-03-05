const mongoose = require('mongoose');
const { Router } = require('express');

const router = Router();
const dbHost = 'mongodb://database/mean-docker';

mongoose.connect(dbHost, {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const User = mongoose.model('User', userSchema);

router.get('/', (req, res) => {
  res.send('api works :)');
});

router.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) res.status(500).send(err);

    res.status(200).json(users);
  });
});

router.get('/users/:id', (req, res) => {
  User.findById(req.param.id, (err, users) => {
    if (err) res.status(500).send(error)

    res.status(200).json(users);
  });
});

router.post('/users', (req, res) => {
  const user = new User({
    name: req.body.name,
    age: req.body.age
  });

  user.save(error => {
    if (error) res.status(500).send(error);

    res.status(201).json({
      message: 'User created successfully'
    });
  });
});

router.delete('/users/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id, err => {
    if (err) res.status(500).send(err);

    res.status(200).json({
      message: 'User deleted successfully'
    });
  });
});

module.exports = router;
