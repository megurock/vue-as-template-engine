import gulp from 'gulp'
import gulpif from 'gulp-if'
import tap from 'gulp-tap'
import through2 from 'through2'
import pug from 'gulp-pug'
import prettify from 'gulp-prettify'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import path from 'path'

const src = [
  'src/**/*.pug',
  '!src/**/_*.pug',
]
const dest = 'dist'

/**
 *
 */
function compile(src) {
  console.log(`Compiling ${src}`)
  const extension = path.extname(src).toLocaleLowerCase();
  const isPug = extension === '.pug'
  return gulp.src(src, { base: './src' })
  .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulpif(isPug, pug()))
    .pipe(prettify())
    .pipe(gulp.dest(dest))
}
//
gulp.task('watch:pug', () => {
  gulp.watch(src, event => { compile(event.path) })
})
//
gulp.task('build:pug', () => {
  gulp.src(src).pipe(tap(({ path }) => 
    compile(path, true))
  )
  .pipe(through2.obj((file, enc, cb) => cb()))
})