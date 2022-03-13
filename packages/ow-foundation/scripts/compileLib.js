const gulp = require('gulp')
require('../gulpfile')




function compileLib(){
  const compile = gulp.task('compileLib')
  if(compile === undefined){
    console.error('no task')
  }
  compile.apply(gulp)
}

compileLib()