"use strict";

angular.module("artApp")
    .service("AuthService", [
        "store", "$location", "lock", function (store, $location, lock) {
            return {
                isAuthenticated: function () {
                    var expiresAt = store.get("expires_at");

                    return new Date().getTime() < expiresAt;
                },

                createSession: function (authResult) {
                    var expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());

                    store.set("access_token", authResult.accessToken);
                    store.set("id_token", authResult.idToken);
                    store.set("expires_at", expiresAt);
                    store.set("profile", authResult.idTokenPayload);
                },

                logout: function () {
                    store.remove("access_token");
                    store.remove("id_token");
                    store.remove("expires_at");
                    store.remove("profile");
                    $location.path("/login");
                }
            };
        }
    ]);