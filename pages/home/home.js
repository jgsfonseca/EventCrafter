// home.js

import { auth } from './firebase-config.js';

document.addEventListener("DOMContentLoaded", function () {
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log(` ${user.displayName || user.email}, you are now logged in.`);
        } else {
            console.log("No user is logged in.");
        }
    });
});
