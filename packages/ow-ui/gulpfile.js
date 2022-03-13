const gulp = require('gulp')



gulp.task('compileLib', gulp.series([
  'cleanLib', 'moveCss', 'compileTSToESM'
]))