const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': async (req, res) => {
        const movies = await db.Movie.findAll({
            include: [ "genre", "actors" ]
        })

        res.render('moviesList.ejs', {movies})

    },
    'detail': async (req, res) => {
        const movie = await db.Movie.findByPk(req.params.id)
        res.render('moviesDetail.ejs', {movie});

            // .then(movie => {
            // });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: async (req, res) => {
        const allGenres = await db.Genre.findAll({});

        res.render('moviesAdd', {
            allGenres
        })
        
    },
    create: async (req,res) => {
        await db.Movie.create( req.body );

        res.redirect('/movies')

    },
    edit: async (req,res) => {
        const Movie = await db.Movie.findByPk(req.params.id);

        const allGenres = await db.Genre.findAll();

        res.render('moviesEdit', {
            Movie,
            allGenres
        })
    },
    update: async (req,res) => {
        await db.Movie.update(req.body, { where: { id: req.params.id }});

        res.redirect('/movies')
    },
    delete: async (req,res) => {
        const deleteMovie = await db.Movie.findByPk(req.params.id);

        res.render('moviesDelete', {
            Movie: deleteMovie,
        })
    },
    destroy: async (req,res) => {
        await db.Movie.destroy({ where: { id: req.params.id }});

        res.redirect('/movies')
    }
}

module.exports = moviesController;