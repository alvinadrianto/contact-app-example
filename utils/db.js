const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/wpu', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// // Menambah 1 data
// const contact1 = new Contact({
//   nama: 'meliodas',
//   noHP: '123456789087',
//   email: 'meliodas@gmail.com',
// });

// // simpan ke collection
// contact1.save().then((result) => console.log(result));
