'use strict';

let assert = require('chai').assert,
    expect = require('chai').expect,
    should = require('chai').should,
    streamAssert = require('stream-assert'),
    studioPush = require('../index'),
    gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    properSettings = {
      studio: 'test.studio.crasman.fi',
      folders: [{
        folderId: 'foo',
        localFolder: 'tests/fixtures/dist/js'   
      }, {
        folderId: 'bar',
        localFolder: 'tests/fixtures/dist/css'
      }] 
    };

require('mocha-sinon');

function fixtures (glob) {
  return path.join(__dirname, 'fixtures', glob);
}


 describe('studioPush()', function() {
  this.timeout(5000);

  beforeEach(function() {
    var log = console.log;
    this.sinon.stub(console, 'log', function() {
      return log.apply(log, arguments);
    });
  });

  describe('### INIT ###', function () {
    it('should not start without settings object', function () {
      expect(studioPush).to.throw(Error, /Settings \(object\) missing/);
      expect(studioPush.bind(studioPush, 'test.js')).to.throw(Error, /Object expected/);
    });

    it('should not start without studio property set', function () {
      expect(studioPush.bind(studioPush, {folders: []})).to.throw(Error, /Settings: property 'studio' \(string\) missing/);
    });

    it('should not start without folders property set', function () {
      expect(studioPush.bind(studioPush, {studio: 'foo.bar.com'})).to.throw(Error, /Settings: property 'folders' \(Array<object>\) missing/);
    });

    it('should start with proper settings', function () {
      expect(studioPush.bind(studioPush, {studio: 'foo.bar.com', folders: []})).to.not.throw(Error);
    });


    /*
    it('should notify if no folders are found to upload', function (done) {
      gulp.src('.')
          .pipe(studioPush({studio: 'foo.bar.com', folders: []}))
          .on('end', function () {
            expect( console.log.calledOnce ).to.be.true;
            expect( console.log.calledWith('Good morning') ).to.be.true;
            done();
          })
          .on('error', function () {
            done();
          })
    });*/

    it('should notify if no folders are found to upload', function (done) {
      gulp.src('tests/fixtures/notfound', { buffer: false })
        .pipe(studioPush(properSettings))
        .on('data', function () {
          //done();
        })
        .on('end', function () {
          //expect( console.log.calledOnce ).to.be.true;
          expect( console.log.calledWith('[gulp-studio-push] No folders found to upload') ).to.be.true;
          done();
        })
    });
  });
 });  