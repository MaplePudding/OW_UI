const path = require('path');
const gulp = require('gulp')
const del = require('del')
const gulpTS = require('gulp-typescript')
const merge2 = require('merge2');
const gulpBabel = require('gulp-babel')
const replace = require('gulp-replace');
const tsConfig = require('./tsconfig.json');
const getBabelConfig = require('./getBabelConfig');


gulp.task('cleanLib', function cleanLib(){
  return del(['lib/**/*'])
})

gulp.task('compileTSXToESM', function compileTSXToESM(){
  const tsxStream = gulp.src(['**/*.tsx', '**/*.ts', '!**/node_modules/**/*.*', '!**/_story/**/*.*', '!**/__test__/**/*.*'])        .pipe(gulpTS({
    ...tsConfig.compilerOptions,
    rootDir: path.join(__dirname, '..')
  }));
  const jsStream = tsxStream.js
    .pipe(gulpBabel(getBabelConfig()))
    .pipe(replace(/(import\s+)['"]@maplex\/ow-foundation\/([^'"]+)['"]/g, '$1\'@maplex/ow-foundation/lib/$2\''))
    .pipe(replace(/(import\s+)(.+)from\s+['"]@maplex\/ow-foundation\/(.+)['"]/g, '$1 $2 from\'@maplex/ow-foundation/lib/$3\''))
    .pipe(gulp.dest('lib/es'))
  const dtsStream = tsxStream.dts.pipe(gulp.dest('lib/es'))
  return merge2([jsStream, dtsStream])
})

gulp.task('compileLib', gulp.series([
  'cleanLib', 'compileTSXToESM'
]))