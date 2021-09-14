const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { body, check, validationResult } = require('express-validator');
const methodOverride = require('method-override');

const product = require('./api/product');
app.use(express.json({ extended: false }));
app.use('/api/product', product);

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

// Setup Method Override
app.use(methodOverride('_method'));

// Setup EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Config flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Halaman home
app.get('/', (req, res) => {
  const mhs = [
    {
      nama: 'Meliodas',
      email: 'meliodas@gmail.com',
    },
    {
      nama: 'arthur',
      email: 'arthur@gmail.com',
    },
    {
      nama: 'merlin',
      email: 'merlin@gmail.com',
    },
  ];
  res.render('index', {
    nama: 'Alvin Adrianto',
    title: 'Halaman home',
    mhs,
    layout: 'layouts/main-layout',
  });
});

// Halaman about
app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'Halaman About',
  });
});

// Halaman contact
app.get('/contact', async (req, res) => {
  //   Contact.find().then((contact) => {
  //     res.send(contact);
  //   });

  const contacts = await Contact.find();

  res.render('contact', {
    layout: 'layouts/main-layout',
    title: 'Halaman Contact',
    contacts,
    msg: req.flash('msg'),
  });
});

// halaman form tambah data contact
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Form Tambah Data Contact',
    layout: 'layouts/main-layout',
  });
});

// proses tambah data contact
app.post(
  '/contact',
  [
    body('nama').custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
        throw new Error('Nama contact sudah terdaftar');
      }

      return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('noHP', 'No HP tidak valid').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (err, result) => {
        req.flash('msg', 'Data contact berhasil ditambahkan!');
        res.redirect('/contact');
      });
    }
  }
);

// proses delete contact
// app.get('/contact/delete/:nama', async (req, res) => {
//   const contact = await Contact.findOne({ nama: req.params.nama });

//   // jika contact tidak ada
//   if (!contact) {
//     res.status(404);
//     res.send(`<h1>404</h1>`);
//   } else {
//     Contact.deleteOne({ _id: contact._id }).then((result) => {
//       req.flash('msg', 'Data contact berhasil dihapus!');
//       res.redirect('/contact');
//     });
//   }
// });
app.delete('/contact', (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash('msg', 'Data contact berhasil dihapus!');
    res.redirect('/contact');
  });
});

// form ubah data contact
app.get('/contact/edit/:nama', async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render('edit-contact', {
    title: 'Form Ubah Data Contact',
    layout: 'layouts/main-layout',
    contact,
  });
});

// proses ubah data
app.put(
  '/contact',
  [
    body('nama').custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (value !== req.body.oldNama && duplikat) {
        throw new Error('Nama contact sudah terdaftar');
      }

      return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('noHP', 'No HP tidak valid').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('edit-contact', {
        title: 'Form Ubah Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            nama: req.body.nama,
            noHP: req.body.noHP,
            email: req.body.email,
          },
        }
      ).then((result) => {
        // kirimkan flash message
        req.flash('msg', 'Data contact berhasil diubah!');
        res.redirect('/contact');
      });
    }
  }
);

// halaman detail contact
app.get('/contact/:nama', async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render('detail', {
    layout: 'layouts/main-layout',
    title: 'Halaman Detail Contact',
    contact,
  });
});

app.listen(port, () => {
  console.log(`Mongo Contact App | listening at http://localhost:${port}...`);
});
