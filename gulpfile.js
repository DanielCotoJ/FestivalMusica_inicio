const { src, dest, watch, parallel } = require("gulp");// gulp es el del package.json //aca se imporatn
//este archivo gul file es reutilizable

// CSS
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps');

// Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//JavaScript
const terser = require('gulp-terser-js');

function css(done) {
    //para compilar se ocupan 3 pasos
    src("src/scss/**/*.scss") //Identificar el archivo de SASS
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass()) //compilarlo 
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css")); //Almacenar en el disco duro
    done(); //callback que avisa a gulp cuando llegamos al final 
}

function imagenes(done) { //codigo convierte las imagenes a mas ligeras
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))

    done();
}

function versionWebp(done) {
    const opciones = {
        quality: 50
    }

    src('src/img/**/*.{png,jpg}')//identifica
        .pipe(webp(opciones))//compila
        .pipe(dest('build/img'))//almacena


    done();
}

function versionAvif(done) {
    const opciones = {
        quality: 50
    }

    src('src/img/**/*.{png,jpg}')//identifica
        .pipe(avif(opciones))//compila
        .pipe(dest('build/img'))//almacena


    done();
}
function javascript(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev(done) {
    watch("src/scss/**/*.scss", css);
    watch("src/js/**/*.js", javascript);

    done();
}

exports.css = css; //el css derecho es de la funcion
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);

