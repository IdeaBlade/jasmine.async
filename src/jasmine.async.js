// Jasmine.Async, v0.3.0
// Copyright (c)2012 Muted Solutions, LLC. All Rights Reserved.
// Distributed under MIT license
// http://github.com/derickbailey/jasmine.async
this.AsyncSpec = (function(global){

    // Private Methods
    // ---------------

    function runAsync( block, optionalTimeoutMessage, optionalTimeout) {
        return function(){
            var self = this;
            var done = false;
            var complete = function(){ done = true; };

            runs(function(){
                block.call(self, complete);
            });

            waitsFor(function(){
                return done;
            }, optionalTimeoutMessage, optionalTimeout);
        };
    }

    // Constructor Function
    // --------------------

    function AsyncSpec(spec){
        this.spec = spec;
    }

    // Public API
    // ----------
    /*
     * Execute an asynchronous function that runs before each spec.
     * @param {Function} block that takes a single parameter, the "done" function
     * @param {String} optionalTimeoutMessage to display if the block times out
     * @param {Number} optionalTimeout in milliseconds
     */
    AsyncSpec.prototype.beforeEach = function (block, optionalTimeoutMessage, optionalTimeout) {
        this.spec.beforeEach(runAsync(block, optionalTimeoutMessage, optionalTimeout));
    };

    /*
     * Execute an asynchronous function that runs after each spec.
     * @param {Function} block that takes a single parameter, the "done" function
     * @param {String} optionalTimeoutMessage to display if the block times out
     * @param {Number} optionalTimeout in milliseconds
     */
    AsyncSpec.prototype.afterEach = function (block, optionalTimeoutMessage, optionalTimeout) {
        this.spec.afterEach(runAsync(block, optionalTimeoutMessage, optionalTimeout));
    };

    /*
     * Execute an asynchronous spec (AKA test).
     * @param {String} description description of the spec
     * @param {Function} block Spec function. Takes a single parameter, the "done" function
     * @param {String} optionalTimeoutMessage to display if the spec times out
     * @param {Number} optionalTimeout in milliseconds
     */
    AsyncSpec.prototype.it = function (description, block, optionalTimeoutMessage, optionalTimeout) {
        // For some reason, `it` is not attached to the current
        // test suite, so it has to be called from the global
        // context.
        global.it(description, runAsync(block, optionalTimeoutMessage, optionalTimeout));
    };

    /* Disabled asynchronous spec.*/
    AsyncSpec.prototype.xit = xit;

    return AsyncSpec;
})(this);