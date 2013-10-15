/**
 * @description : try to load original edition of global variables
 * @filename    : brick.origin.js
 * @requires    : [brick.js]
 */
'use strict';

(function (BR) {
    BR.origin = BR.origin || {};

    BR.origin.tryOneOf = BR.origin.tryOneOf || function (callbackList) {
        var i, callback, returnValue;

        for (i = 0; i < callbackList.length; i ++) {
            callback = callbackList[i];
            try {
                returnValue = callback();
                break;
            } catch (e) {
            }
        }
        return returnValue;
    };
}(BR));
