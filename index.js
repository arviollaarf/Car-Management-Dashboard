// import atau panggil package2 yg kita mau pakai di aplikasi kita 
const { log } = require('console');
const express = require('express'); 
const path = require('path');
const { Op } = require('sequelize');

// manggil models di aplikasi kita 
const { cars } = require('./models'); 

// framework express = framework utk http server 
const app = express(); 
const PORT = 3000; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting view engine 
app.set("views", __dirname + "/views") 
app.set("view engine", "ejs") 
app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.render("index", {
        title: "FSW-2"
    })
})

// ini untuk page lihat semua cars dari database
app.get('/admin/cars', async (req, res) => {
    // get data dari database pake sequelize method findAll
    const data = await cars.findAll();

    // proses akhir = response yg render ejs file kalian
    res.render('cars/index', {
        data
    })
})


// render page create cars
app.get('/admin/cars/create', (req,res) => {
    res.render("cars/create")
})

// ini utk create cars baru
app.post('/cars', (req, res) => {
    // request body => req.body.name
    const { nama, harga, ukuran, image } = req.body

    // proses insert atau create data yg dari request body ke DB/tabel 
    // pakai sequelize method create utk proses data baru ke table/model nya
     cars.create({
        nama,
        harga,
        ukuran,
        image: req.body.size
    })
    res.redirect(201, "/admin/cars") 
})

// render page edit cars
app.get('/admin/cars/edit/:id', async (req,res) => {
    // proses ambil detail product sesuai id yg di params
    const data = await cars.findByPk(req.params.id)
    const carsDetail = data.dataValues
    res.render("cars/update", {
        carsDetail,
        ukuranOptions: ['small', 'medium', 'large']
    })
})

// ini utk edit cars 
app.post('/cars/edit/:id', (req, res) => {
    const { nama, harga, ukuran, image } = req.body
    const id = req.params.id
    cars.update({
        nama,
        harga,
        ukuran,
        image
    }, {
        where: {
            id
        }
    })
    
    res.redirect(200, "/admin/cars") 
})

// delete cars
app.get('/cars/delete/:id', async (req, res) => {
    const id = req.params.id
    cars.destroy({
        where: {
            id
        }
    })

    res.redirect(200, "/admin/cars")
})

app.listen(PORT, () => { 
    console.log(`App Running on localhost:${PORT}`) 
})
