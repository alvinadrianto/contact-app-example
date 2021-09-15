const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Alvin:<password>@cluster0.izqqv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
