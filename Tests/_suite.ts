import ttm = require('vsts-task-lib/mock-test');
import assert = require('assert');
import path = require('path');

describe('Download Terraform Task Tests', function() {
    before(() => {});

    after(() => {});

    //failures - test cases for when the task should fail.

    it('should fail if missing input - directory', (done: MochaDone) => {        
        this.timeout(1000);

        let testPath = path.join(__dirname, "Failure", "missingInputDirectory.js");
        let testRunner = new ttm.MockTestRunner(testPath);

        testRunner.run();

        assert(!testRunner.succeeded, 'should have failed');
        assert.equal(testRunner.errorIssues.length, 1, "should have 1 error issue");
        
        assert.equal(testRunner.errorIssues[0], 'Error: Input required: TerraformDirectory', 'error issue output');               

        done(); 
    })

    it('should fail if missing input - terraform version', (done: MochaDone) => {        
        this.timeout(1000);

        let testPath = path.join(__dirname, "Failure", "missingTerraformVersion.js");
        let testRunner = new ttm.MockTestRunner(testPath);

        testRunner.run();

        assert(!testRunner.succeeded, 'should have failed');
        assert.equal(testRunner.errorIssues.length, 1, "should have 1 error issue");
        
        assert.equal(testRunner.errorIssues[0], 'Error: Input required: TerraformVersion', 'error issue output');               

        done(); 
    })

    //Success - test cases when the task should succeed.

    it('should not download or extract when files already exists', (done: MochaDone) => {        
        this.timeout(1000);

        let testPath = path.join(__dirname, "Success", "allFilesExist.js");
        let testRunner = new ttm.MockTestRunner(testPath);       

        testRunner.run();   

        assert(testRunner.succeeded, 'should have succeeded');

        assert.equal(testRunner.stdout.indexOf('mock download called.'), -1, "download was not called");
        assert.equal(testRunner.stdout.indexOf('mock extract called.'), -1, "extract was not called");

        done(); 
    })

    it('should not extract when zip exists but exe is missing', (done: MochaDone) => {        
        this.timeout(1000);

        let testPath = path.join(__dirname, "Success", "zipExists.js");
        let testRunner = new ttm.MockTestRunner(testPath);       

        testRunner.run();  

        assert(testRunner.succeeded, 'should have succeeded');

        assert.equal(testRunner.stdout.indexOf('mock download called.'), -1, "download was not called");
        assert(testRunner.stdout.indexOf('mock extract called.') >= 0 , "extract was called");

        done(); 
    })

    it('should download and extract when no files pre-exist', (done: MochaDone) => {        
        this.timeout(1000);

        let testPath = path.join(__dirname, "Success", "noFilesExist.js");
        let testRunner = new ttm.MockTestRunner(testPath);       

        testRunner.run();   


        assert(testRunner.succeeded, 'should have succeeded');

        assert(testRunner.stdout.indexOf('mock download called.') >= 0, "download was called");
        assert(testRunner.stdout.indexOf('mock extract called.') >= 0, "extract was called");

        done(); 
    })
});