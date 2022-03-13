const gulp = require('gulp')
const del = require('del')
const merge2 = require('merge2')
const gulpBabel = require('gulp-babel')
const getBabelConfig = require('./getBabelConfig.js')
const gulpTS = require('gulp-typescript');


function compileTS(){
  const target = 'lib'
  const tsStream = gulp.src(['**/*.ts', '!node_modules/**/*.*']).pipe(gulpTS({
    declaration: true
  }))

  const jsStream = tsStream.js.pipe(gulpBabel(getBabelConfig())).pipe(gulp.dest(target))
  const dtsStream = tsStream.dts.pipe(gulp.dest(target))
  return merge2([jsStream, dtsStream])
}


gulp.task('cleanLib', function cleanLib(){
  return del(['lib/**/*'])
})

gulp.task('moveCss', function moveCss(){
  return gulp.src(['**/**.css', '!node_modules/**/*.*']).pipe(gulp.dest('lib'))
})

gulp.task('compileTSToESM', function compileTSToESM(){
  return compileTS()
})

gulp.task('compileLib', gulp.series(['cleanLib', 'moveCss', 'compileTSToESM']))