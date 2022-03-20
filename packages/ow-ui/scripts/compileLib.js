const gulp = require('gulp')
require('../gulpfile')

function compileLib(){
  const task = gulp.task('compileLib')
  console.log(1)
  if(!task){
    console.error('no task')
    return;
  }
  task.apply(gulp)
}

compileLib()