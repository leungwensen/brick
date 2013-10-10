/**
 * @description : validator
 * @filename    : brick.validator.js
 * @requires    : [brick.js]
 */
'use strict';

(function (BR, undefined) {
    BR.validator = BR.validator || {};

    /**
     * @description : isXxx, check if is Xxx.
     * @parameters  : {unknown} value, value to be tested.
     * @return      : {boolean} if test succeeded.
     * @syntax      : BR.validator.isXxx(value)
     */
    BR.validator.isArray = Array.isArray;
    BR.validator.isFunction = function (value) {
        return (typeof value === 'function');
    };
}(BR));
