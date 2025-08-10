"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fjnufloga%2FDocuments%2FHacknation%2Fprofai_mvp%2Fapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fjnufloga%2FDocuments%2FHacknation%2Fprofai_mvp%2Fapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fjnufloga%2FDocuments%2FHacknation%2Fprofai_mvp%2Fapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fjnufloga%2FDocuments%2FHacknation%2Fprofai_mvp%2Fapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_jnufloga_Documents_Hacknation_profai_mvp_app_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"/Users/jnufloga/Documents/Hacknation/profai_mvp/app/app/api/auth/[...nextauth]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_jnufloga_Documents_Hacknation_profai_mvp_app_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmpudWZsb2dhJTJGRG9jdW1lbnRzJTJGSGFja25hdGlvbiUyRnByb2ZhaV9tdnAlMkZhcHAlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGam51ZmxvZ2ElMkZEb2N1bWVudHMlMkZIYWNrbmF0aW9uJTJGcHJvZmFpX212cCUyRmFwcCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDdUM7QUFDcEg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcHAvP2YzOWQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2pudWZsb2dhL0RvY3VtZW50cy9IYWNrbmF0aW9uL3Byb2ZhaV9tdnAvYXBwL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF1cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9qbnVmbG9nYS9Eb2N1bWVudHMvSGFja25hdGlvbi9wcm9mYWlfbXZwL2FwcC9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fjnufloga%2FDocuments%2FHacknation%2Fprofai_mvp%2Fapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fjnufloga%2FDocuments%2FHacknation%2Fprofai_mvp%2Fapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNpQztBQUNRO0FBRXpDLE1BQU1FLFVBQVVGLGdEQUFRQSxDQUFDQyxrREFBV0E7QUFFTyIsInNvdXJjZXMiOlsid2VicGFjazovL2FwcC8uL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzP2M4YTQiXSwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgTmV4dEF1dGggZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aCc7XG5cbmNvbnN0IGhhbmRsZXIgPSBOZXh0QXV0aChhdXRoT3B0aW9ucyk7XG5cbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfTtcbiJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsImF1dGhPcHRpb25zIiwiaGFuZGxlciIsIkdFVCIsIlBPU1QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_db_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/db-utils */ \"(rsc)/./lib/db-utils.ts\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nconst authOptions = {\n    // Don't use PrismaAdapter for demo mode - it requires database\n    // adapter: PrismaAdapter(prisma),\n    session: {\n        strategy: \"jwt\"\n    },\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    return null;\n                }\n                console.log(\"\\uD83D\\uDD10 Attempting login for:\", credentials.email);\n                // Demo accounts - work without database\n                const demoAccounts = [\n                    {\n                        email: \"john@doe.com\",\n                        password: \"johndoe123\",\n                        id: \"demo_john_doe\",\n                        name: \"John Doe\",\n                        firstName: \"John\",\n                        lastName: \"Doe\"\n                    },\n                    {\n                        email: \"demo@profai.com\",\n                        password: \"profai2025\",\n                        id: \"demo_profai\",\n                        name: \"Demo User\",\n                        firstName: \"Demo\",\n                        lastName: \"User\"\n                    }\n                ];\n                // Check demo accounts first\n                const demoUser = demoAccounts.find((account)=>account.email.toLowerCase() === credentials.email.toLowerCase());\n                if (demoUser) {\n                    console.log(\"\\uD83C\\uDFAD Demo account detected:\", demoUser.email);\n                    if (demoUser.password === credentials.password) {\n                        console.log(\"✅ Demo login successful\");\n                        return {\n                            id: demoUser.id,\n                            email: demoUser.email,\n                            name: demoUser.name,\n                            firstName: demoUser.firstName,\n                            lastName: demoUser.lastName\n                        };\n                    } else {\n                        console.log(\"❌ Demo password incorrect\");\n                        return null;\n                    }\n                }\n                // Try database auth with timeout fallback\n                try {\n                    console.log(\"\\uD83D\\uDDC4️ Attempting database authentication...\");\n                    const user = await (0,_lib_db_utils__WEBPACK_IMPORTED_MODULE_2__.withDatabaseTimeout)(()=>_lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n                            where: {\n                                email: credentials.email\n                            }\n                        }), {\n                        timeoutMs: 8000,\n                        fallbackData: null\n                    });\n                    if (!user || !user.password) {\n                        console.log(\"❌ User not found in database\");\n                        return null;\n                    }\n                    const isValid = await bcryptjs__WEBPACK_IMPORTED_MODULE_3___default().compare(credentials.password, user.password);\n                    if (!isValid) {\n                        console.log(\"❌ Database password incorrect\");\n                        return null;\n                    }\n                    console.log(\"✅ Database authentication successful\");\n                    return {\n                        id: user.id,\n                        email: user.email,\n                        name: user.name,\n                        firstName: user.firstName,\n                        lastName: user.lastName\n                    };\n                } catch (dbError) {\n                    console.error(\"\\uD83D\\uDDC4️ Database authentication failed:\", dbError.message);\n                    console.log(\"⚠️ Falling back to demo mode - check credentials against demo accounts only\");\n                    return null;\n                }\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.firstName = user.firstName;\n                token.lastName = user.lastName;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token) {\n                session.user.id = token.id;\n                session.user.firstName = token.firstName;\n                session.user.lastName = token.lastName;\n            }\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/auth/signin\"\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFdBQVc7UUFDVCxNQUFNQyxLQUFJLEVBQUVDLEtBQUssRUFBRVosSUFBSSxFQUFFO1lBQ3ZCLElBQUlBLE1BQU07Z0JBQ1JZLE1BQU1uQixFQUFFLEdBQUdPLEtBQUtQLEVBQUU7Z0JBQ2xCbUIsTUFBTWxCLFNBQVMsR0FBR00sS0FBS04sU0FBUztnQkFDaENrQixNQUFNakIsUUFBUSxHQUFHSyxLQUFLTCxRQUFRO1lBQ2hDO1lBQ0EsT0FBT2lCO1FBQ1Q7UUFDQSxNQUFNaEMsU0FBUSxFQUFFQSxPQUFPLEVBQUVnQyxLQUFLLEVBQUU7WUFDOUIsSUFBSUEsT0FBTztnQkFDVGhDLFFBQVFvQixJQUFJLENBQUNQLEVBQUUsR0FBR21CLE1BQU1uQixFQUFFO2dCQUMxQmIsUUFBUW9CLElBQUksQ0FBQ04sU0FBUyxHQUFHa0IsTUFBTWxCLFNBQVM7Z0JBQ3hDZCxRQUFRb0IsSUFBSSxDQUFDTCxRQUFRLEdBQUdpQixNQUFNakIsUUFBUTtZQUN4QztZQUNBLE9BQU9mO1FBQ1Q7SUFDRjtJQUNBaUMsT0FBTztRQUNMQyxRQUFRO0lBQ1Y7SUFDQUMsUUFBUUMsUUFBUUMsR0FBRyxDQUFDQyxlQUFlO0FBQ3JDLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcHAvLi9saWIvYXV0aC50cz9iZjdlIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHMnO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvZGInO1xuaW1wb3J0IHsgd2l0aERhdGFiYXNlVGltZW91dCB9IGZyb20gJ0AvbGliL2RiLXV0aWxzJztcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnO1xuXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgLy8gRG9uJ3QgdXNlIFByaXNtYUFkYXB0ZXIgZm9yIGRlbW8gbW9kZSAtIGl0IHJlcXVpcmVzIGRhdGFiYXNlXG4gIC8vIGFkYXB0ZXI6IFByaXNtYUFkYXB0ZXIocHJpc21hKSxcbiAgc2Vzc2lvbjoge1xuICAgIHN0cmF0ZWd5OiAnand0JyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XG4gICAgICBuYW1lOiAnY3JlZGVudGlhbHMnLFxuICAgICAgY3JlZGVudGlhbHM6IHtcbiAgICAgICAgZW1haWw6IHsgbGFiZWw6ICdFbWFpbCcsIHR5cGU6ICdlbWFpbCcgfSxcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6ICdQYXNzd29yZCcsIHR5cGU6ICdwYXNzd29yZCcgfVxuICAgICAgfSxcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xuICAgICAgICBpZiAoIWNyZWRlbnRpYWxzPy5lbWFpbCB8fCAhY3JlZGVudGlhbHM/LnBhc3N3b3JkKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygn8J+UkCBBdHRlbXB0aW5nIGxvZ2luIGZvcjonLCBjcmVkZW50aWFscy5lbWFpbCk7XG5cbiAgICAgICAgLy8gRGVtbyBhY2NvdW50cyAtIHdvcmsgd2l0aG91dCBkYXRhYmFzZVxuICAgICAgICBjb25zdCBkZW1vQWNjb3VudHMgPSBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZW1haWw6ICdqb2huQGRvZS5jb20nLFxuICAgICAgICAgICAgcGFzc3dvcmQ6ICdqb2huZG9lMTIzJyxcbiAgICAgICAgICAgIGlkOiAnZGVtb19qb2huX2RvZScsXG4gICAgICAgICAgICBuYW1lOiAnSm9obiBEb2UnLFxuICAgICAgICAgICAgZmlyc3ROYW1lOiAnSm9obicsXG4gICAgICAgICAgICBsYXN0TmFtZTogJ0RvZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVtYWlsOiAnZGVtb0Bwcm9mYWkuY29tJyxcbiAgICAgICAgICAgIHBhc3N3b3JkOiAncHJvZmFpMjAyNScsXG4gICAgICAgICAgICBpZDogJ2RlbW9fcHJvZmFpJyxcbiAgICAgICAgICAgIG5hbWU6ICdEZW1vIFVzZXInLFxuICAgICAgICAgICAgZmlyc3ROYW1lOiAnRGVtbycsXG4gICAgICAgICAgICBsYXN0TmFtZTogJ1VzZXInXG4gICAgICAgICAgfVxuICAgICAgICBdO1xuXG4gICAgICAgIC8vIENoZWNrIGRlbW8gYWNjb3VudHMgZmlyc3RcbiAgICAgICAgY29uc3QgZGVtb1VzZXIgPSBkZW1vQWNjb3VudHMuZmluZChcbiAgICAgICAgICBhY2NvdW50ID0+IGFjY291bnQuZW1haWwudG9Mb3dlckNhc2UoKSA9PT0gY3JlZGVudGlhbHMuZW1haWwudG9Mb3dlckNhc2UoKVxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChkZW1vVXNlcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCfwn46tIERlbW8gYWNjb3VudCBkZXRlY3RlZDonLCBkZW1vVXNlci5lbWFpbCk7XG4gICAgICAgICAgaWYgKGRlbW9Vc2VyLnBhc3N3b3JkID09PSBjcmVkZW50aWFscy5wYXNzd29yZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ+KchSBEZW1vIGxvZ2luIHN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGlkOiBkZW1vVXNlci5pZCxcbiAgICAgICAgICAgICAgZW1haWw6IGRlbW9Vc2VyLmVtYWlsLFxuICAgICAgICAgICAgICBuYW1lOiBkZW1vVXNlci5uYW1lLFxuICAgICAgICAgICAgICBmaXJzdE5hbWU6IGRlbW9Vc2VyLmZpcnN0TmFtZSxcbiAgICAgICAgICAgICAgbGFzdE5hbWU6IGRlbW9Vc2VyLmxhc3ROYW1lLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ+KdjCBEZW1vIHBhc3N3b3JkIGluY29ycmVjdCcpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVHJ5IGRhdGFiYXNlIGF1dGggd2l0aCB0aW1lb3V0IGZhbGxiYWNrXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ/Cfl4TvuI8gQXR0ZW1wdGluZyBkYXRhYmFzZSBhdXRoZW50aWNhdGlvbi4uLicpO1xuICAgICAgICAgIFxuICAgICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCB3aXRoRGF0YWJhc2VUaW1lb3V0KFxuICAgICAgICAgICAgKCkgPT4gcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCB9IH0pLFxuICAgICAgICAgICAgeyB0aW1lb3V0TXM6IDgwMDAsIGZhbGxiYWNrRGF0YTogbnVsbCB9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmICghdXNlciB8fCAhdXNlci5wYXNzd29yZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ+KdjCBVc2VyIG5vdCBmb3VuZCBpbiBkYXRhYmFzZScpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgaXNWYWxpZCA9IGF3YWl0IGJjcnlwdC5jb21wYXJlKGNyZWRlbnRpYWxzLnBhc3N3b3JkLCB1c2VyLnBhc3N3b3JkKTtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfinYwgRGF0YWJhc2UgcGFzc3dvcmQgaW5jb3JyZWN0Jyk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zb2xlLmxvZygn4pyFIERhdGFiYXNlIGF1dGhlbnRpY2F0aW9uIHN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgICAgIG5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgICAgIGZpcnN0TmFtZTogdXNlci5maXJzdE5hbWUsXG4gICAgICAgICAgICBsYXN0TmFtZTogdXNlci5sYXN0TmFtZSxcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKGRiRXJyb3I6IGFueSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ/Cfl4TvuI8gRGF0YWJhc2UgYXV0aGVudGljYXRpb24gZmFpbGVkOicsIGRiRXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ+KaoO+4jyBGYWxsaW5nIGJhY2sgdG8gZGVtbyBtb2RlIC0gY2hlY2sgY3JlZGVudGlhbHMgYWdhaW5zdCBkZW1vIGFjY291bnRzIG9ubHknKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIF0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyIH0pIHtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZDtcbiAgICAgICAgdG9rZW4uZmlyc3ROYW1lID0gdXNlci5maXJzdE5hbWU7XG4gICAgICAgIHRva2VuLmxhc3ROYW1lID0gdXNlci5sYXN0TmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgc2Vzc2lvbi51c2VyLmlkID0gdG9rZW4uaWQgYXMgc3RyaW5nO1xuICAgICAgICBzZXNzaW9uLnVzZXIuZmlyc3ROYW1lID0gdG9rZW4uZmlyc3ROYW1lIGFzIHN0cmluZztcbiAgICAgICAgc2Vzc2lvbi51c2VyLmxhc3ROYW1lID0gdG9rZW4ubGFzdE5hbWUgYXMgc3RyaW5nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlc3Npb247XG4gICAgfVxuICB9LFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogJy9hdXRoL3NpZ25pbidcbiAgfSxcbiAgc2VjcmV0OiBwcm9jZXNzLmVudi5ORVhUQVVUSF9TRUNSRVQsXG59O1xuIl0sIm5hbWVzIjpbIkNyZWRlbnRpYWxzUHJvdmlkZXIiLCJwcmlzbWEiLCJ3aXRoRGF0YWJhc2VUaW1lb3V0IiwiYmNyeXB0IiwiYXV0aE9wdGlvbnMiLCJzZXNzaW9uIiwic3RyYXRlZ3kiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwiY29uc29sZSIsImxvZyIsImRlbW9BY2NvdW50cyIsImlkIiwiZmlyc3ROYW1lIiwibGFzdE5hbWUiLCJkZW1vVXNlciIsImZpbmQiLCJhY2NvdW50IiwidG9Mb3dlckNhc2UiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwidGltZW91dE1zIiwiZmFsbGJhY2tEYXRhIiwiaXNWYWxpZCIsImNvbXBhcmUiLCJkYkVycm9yIiwiZXJyb3IiLCJtZXNzYWdlIiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJwYWdlcyIsInNpZ25JbiIsInNlY3JldCIsInByb2Nlc3MiLCJlbnYiLCJORVhUQVVUSF9TRUNSRVQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db-utils.ts":
/*!*************************!*\
  !*** ./lib/db-utils.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   checkDatabaseHealth: () => (/* binding */ checkDatabaseHealth),\n/* harmony export */   createTempUser: () => (/* binding */ createTempUser),\n/* harmony export */   withDatabaseTimeout: () => (/* binding */ withDatabaseTimeout)\n/* harmony export */ });\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db */ \"(rsc)/./lib/db.ts\");\n// Utilities para manejo robusto de base de datos\n\nasync function withDatabaseTimeout(operation, options = {}) {\n    const { maxRetries = 2, timeoutMs = 10000, fallbackData } = options;\n    for(let attempt = 1; attempt <= maxRetries; attempt++){\n        try {\n            const result = await Promise.race([\n                operation(),\n                new Promise((_, reject)=>setTimeout(()=>reject(new Error(\"Database operation timeout\")), timeoutMs))\n            ]);\n            return result;\n        } catch (error) {\n            console.error(`🗄️ Database attempt ${attempt}/${maxRetries} failed:`, error.message);\n            if (attempt === maxRetries) {\n                if (fallbackData !== undefined) {\n                    console.log(\"⚠️ Using fallback data after all retries failed\");\n                    return fallbackData;\n                }\n                throw error;\n            }\n            // Wait before retry (exponential backoff)\n            await new Promise((resolve)=>setTimeout(resolve, Math.pow(2, attempt) * 1000));\n        }\n    }\n    throw new Error(\"Should not reach here\");\n}\nfunction createTempUser(data) {\n    return {\n        id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,\n        email: data.email,\n        name: data.name || `${data.firstName || \"\"} ${data.lastName || \"\"}`.trim() || \"Usuario ProfAI\",\n        firstName: data.firstName || null,\n        lastName: data.lastName || null,\n        learningStyle: {\n            visual: 0.7,\n            auditory: 0.5,\n            kinesthetic: 0.6\n        },\n        skillLevel: {\n            theory: \"beginner\",\n            tooling: \"beginner\",\n            prompting: \"beginner\"\n        },\n        emotionBaseline: {\n            confusion_threshold: 0.7,\n            frustration_threshold: 0.6,\n            engagement_baseline: 0.5\n        },\n        preferences: {\n            preferred_format: \"hybrid\",\n            language: \"es\",\n            pace: \"normal\",\n            difficulty_preference: \"adaptive\"\n        },\n        isTemporary: true,\n        createdAt: new Date(),\n        updatedAt: new Date()\n    };\n}\nasync function checkDatabaseHealth() {\n    try {\n        await withDatabaseTimeout(()=>_db__WEBPACK_IMPORTED_MODULE_0__.prisma.$queryRaw`SELECT 1`, {\n            timeoutMs: 5000\n        });\n        return true;\n    } catch (error) {\n        console.error(\"\\uD83D\\uDEA8 Database health check failed:\", error);\n        return false;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGItdXRpbHMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLGlEQUFpRDtBQUNuQjtBQVF2QixlQUFlQyxvQkFDcEJDLFNBQTJCLEVBQzNCQyxVQUFvQyxDQUFDLENBQUM7SUFFdEMsTUFBTSxFQUFFQyxhQUFhLENBQUMsRUFBRUMsWUFBWSxLQUFLLEVBQUVDLFlBQVksRUFBRSxHQUFHSDtJQUU1RCxJQUFLLElBQUlJLFVBQVUsR0FBR0EsV0FBV0gsWUFBWUcsVUFBVztRQUN0RCxJQUFJO1lBQ0YsTUFBTUMsU0FBUyxNQUFNQyxRQUFRQyxJQUFJLENBQUM7Z0JBQ2hDUjtnQkFDQSxJQUFJTyxRQUFlLENBQUNFLEdBQUdDLFNBQ3JCQyxXQUFXLElBQU1ELE9BQU8sSUFBSUUsTUFBTSxnQ0FBZ0NUO2FBRXJFO1lBRUQsT0FBT0c7UUFDVCxFQUFFLE9BQU9PLE9BQVk7WUFDbkJDLFFBQVFELEtBQUssQ0FBQyxDQUFDLHFCQUFxQixFQUFFUixRQUFRLENBQUMsRUFBRUgsV0FBVyxRQUFRLENBQUMsRUFBRVcsTUFBTUUsT0FBTztZQUVwRixJQUFJVixZQUFZSCxZQUFZO2dCQUMxQixJQUFJRSxpQkFBaUJZLFdBQVc7b0JBQzlCRixRQUFRRyxHQUFHLENBQUM7b0JBQ1osT0FBT2I7Z0JBQ1Q7Z0JBQ0EsTUFBTVM7WUFDUjtZQUVBLDBDQUEwQztZQUMxQyxNQUFNLElBQUlOLFFBQVFXLENBQUFBLFVBQVdQLFdBQVdPLFNBQVNDLEtBQUtDLEdBQUcsQ0FBQyxHQUFHZixXQUFXO1FBQzFFO0lBQ0Y7SUFFQSxNQUFNLElBQUlPLE1BQU07QUFDbEI7QUFFTyxTQUFTUyxlQUFlQyxJQUs5QjtJQUNDLE9BQU87UUFDTEMsSUFBSSxDQUFDLEtBQUssRUFBRUMsS0FBS0MsR0FBRyxHQUFHLENBQUMsRUFBRU4sS0FBS08sTUFBTSxHQUFHQyxRQUFRLENBQUMsSUFBSUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ25FQyxPQUFPUCxLQUFLTyxLQUFLO1FBQ2pCQyxNQUFNUixLQUFLUSxJQUFJLElBQUksQ0FBQyxFQUFFUixLQUFLUyxTQUFTLElBQUksR0FBRyxDQUFDLEVBQUVULEtBQUtVLFFBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxNQUFNO1FBQzlFRixXQUFXVCxLQUFLUyxTQUFTLElBQUk7UUFDN0JDLFVBQVVWLEtBQUtVLFFBQVEsSUFBSTtRQUMzQkUsZUFBZTtZQUNiQyxRQUFRO1lBQ1JDLFVBQVU7WUFDVkMsYUFBYTtRQUNmO1FBQ0FDLFlBQVk7WUFDVkMsUUFBUTtZQUNSQyxTQUFTO1lBQ1RDLFdBQVc7UUFDYjtRQUNBQyxpQkFBaUI7WUFDZkMscUJBQXFCO1lBQ3JCQyx1QkFBdUI7WUFDdkJDLHFCQUFxQjtRQUN2QjtRQUNBQyxhQUFhO1lBQ1hDLGtCQUFrQjtZQUNsQkMsVUFBVTtZQUNWQyxNQUFNO1lBQ05DLHVCQUF1QjtRQUN6QjtRQUNBQyxhQUFhO1FBQ2JDLFdBQVcsSUFBSTVCO1FBQ2Y2QixXQUFXLElBQUk3QjtJQUNqQjtBQUNGO0FBRU8sZUFBZThCO0lBQ3BCLElBQUk7UUFDRixNQUFNdkQsb0JBQW9CLElBQU1ELHVDQUFNQSxDQUFDeUQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQUVwRCxXQUFXO1FBQUs7UUFDOUUsT0FBTztJQUNULEVBQUUsT0FBT1UsT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsOENBQW9DQTtRQUNsRCxPQUFPO0lBQ1Q7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2FwcC8uL2xpYi9kYi11dGlscy50cz9jZDUwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFV0aWxpdGllcyBwYXJhIG1hbmVqbyByb2J1c3RvIGRlIGJhc2UgZGUgZGF0b3NcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJy4vZGInO1xuXG5leHBvcnQgaW50ZXJmYWNlIERhdGFiYXNlT3BlcmF0aW9uT3B0aW9ucyB7XG4gIG1heFJldHJpZXM/OiBudW1iZXI7XG4gIHRpbWVvdXRNcz86IG51bWJlcjtcbiAgZmFsbGJhY2tEYXRhPzogYW55O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2l0aERhdGFiYXNlVGltZW91dDxUPihcbiAgb3BlcmF0aW9uOiAoKSA9PiBQcm9taXNlPFQ+LFxuICBvcHRpb25zOiBEYXRhYmFzZU9wZXJhdGlvbk9wdGlvbnMgPSB7fVxuKTogUHJvbWlzZTxUPiB7XG4gIGNvbnN0IHsgbWF4UmV0cmllcyA9IDIsIHRpbWVvdXRNcyA9IDEwMDAwLCBmYWxsYmFja0RhdGEgfSA9IG9wdGlvbnM7XG4gIFxuICBmb3IgKGxldCBhdHRlbXB0ID0gMTsgYXR0ZW1wdCA8PSBtYXhSZXRyaWVzOyBhdHRlbXB0KyspIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgb3BlcmF0aW9uKCksXG4gICAgICAgIG5ldyBQcm9taXNlPG5ldmVyPigoXywgcmVqZWN0KSA9PiBcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHJlamVjdChuZXcgRXJyb3IoJ0RhdGFiYXNlIG9wZXJhdGlvbiB0aW1lb3V0JykpLCB0aW1lb3V0TXMpXG4gICAgICAgIClcbiAgICAgIF0pO1xuICAgICAgXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYPCfl4TvuI8gRGF0YWJhc2UgYXR0ZW1wdCAke2F0dGVtcHR9LyR7bWF4UmV0cmllc30gZmFpbGVkOmAsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgXG4gICAgICBpZiAoYXR0ZW1wdCA9PT0gbWF4UmV0cmllcykge1xuICAgICAgICBpZiAoZmFsbGJhY2tEYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygn4pqg77iPIFVzaW5nIGZhbGxiYWNrIGRhdGEgYWZ0ZXIgYWxsIHJldHJpZXMgZmFpbGVkJyk7XG4gICAgICAgICAgcmV0dXJuIGZhbGxiYWNrRGF0YTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gV2FpdCBiZWZvcmUgcmV0cnkgKGV4cG9uZW50aWFsIGJhY2tvZmYpXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgTWF0aC5wb3coMiwgYXR0ZW1wdCkgKiAxMDAwKSk7XG4gICAgfVxuICB9XG4gIFxuICB0aHJvdyBuZXcgRXJyb3IoJ1Nob3VsZCBub3QgcmVhY2ggaGVyZScpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGVtcFVzZXIoZGF0YToge1xuICBlbWFpbDogc3RyaW5nO1xuICBuYW1lPzogc3RyaW5nO1xuICBmaXJzdE5hbWU/OiBzdHJpbmc7XG4gIGxhc3ROYW1lPzogc3RyaW5nO1xufSkge1xuICByZXR1cm4ge1xuICAgIGlkOiBgdGVtcF8ke0RhdGUubm93KCl9XyR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpfWAsXG4gICAgZW1haWw6IGRhdGEuZW1haWwsXG4gICAgbmFtZTogZGF0YS5uYW1lIHx8IGAke2RhdGEuZmlyc3ROYW1lIHx8ICcnfSAke2RhdGEubGFzdE5hbWUgfHwgJyd9YC50cmltKCkgfHwgJ1VzdWFyaW8gUHJvZkFJJyxcbiAgICBmaXJzdE5hbWU6IGRhdGEuZmlyc3ROYW1lIHx8IG51bGwsXG4gICAgbGFzdE5hbWU6IGRhdGEubGFzdE5hbWUgfHwgbnVsbCxcbiAgICBsZWFybmluZ1N0eWxlOiB7XG4gICAgICB2aXN1YWw6IDAuNyxcbiAgICAgIGF1ZGl0b3J5OiAwLjUsXG4gICAgICBraW5lc3RoZXRpYzogMC42XG4gICAgfSxcbiAgICBza2lsbExldmVsOiB7XG4gICAgICB0aGVvcnk6ICdiZWdpbm5lcicsXG4gICAgICB0b29saW5nOiAnYmVnaW5uZXInLCBcbiAgICAgIHByb21wdGluZzogJ2JlZ2lubmVyJ1xuICAgIH0sXG4gICAgZW1vdGlvbkJhc2VsaW5lOiB7XG4gICAgICBjb25mdXNpb25fdGhyZXNob2xkOiAwLjcsXG4gICAgICBmcnVzdHJhdGlvbl90aHJlc2hvbGQ6IDAuNixcbiAgICAgIGVuZ2FnZW1lbnRfYmFzZWxpbmU6IDAuNVxuICAgIH0sXG4gICAgcHJlZmVyZW5jZXM6IHtcbiAgICAgIHByZWZlcnJlZF9mb3JtYXQ6ICdoeWJyaWQnLFxuICAgICAgbGFuZ3VhZ2U6ICdlcycsXG4gICAgICBwYWNlOiAnbm9ybWFsJyxcbiAgICAgIGRpZmZpY3VsdHlfcHJlZmVyZW5jZTogJ2FkYXB0aXZlJ1xuICAgIH0sXG4gICAgaXNUZW1wb3Jhcnk6IHRydWUsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKVxuICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hlY2tEYXRhYmFzZUhlYWx0aCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgdHJ5IHtcbiAgICBhd2FpdCB3aXRoRGF0YWJhc2VUaW1lb3V0KCgpID0+IHByaXNtYS4kcXVlcnlSYXdgU0VMRUNUIDFgLCB7IHRpbWVvdXRNczogNTAwMCB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCfwn5qoIERhdGFiYXNlIGhlYWx0aCBjaGVjayBmYWlsZWQ6JywgZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbInByaXNtYSIsIndpdGhEYXRhYmFzZVRpbWVvdXQiLCJvcGVyYXRpb24iLCJvcHRpb25zIiwibWF4UmV0cmllcyIsInRpbWVvdXRNcyIsImZhbGxiYWNrRGF0YSIsImF0dGVtcHQiLCJyZXN1bHQiLCJQcm9taXNlIiwicmFjZSIsIl8iLCJyZWplY3QiLCJzZXRUaW1lb3V0IiwiRXJyb3IiLCJlcnJvciIsImNvbnNvbGUiLCJtZXNzYWdlIiwidW5kZWZpbmVkIiwibG9nIiwicmVzb2x2ZSIsIk1hdGgiLCJwb3ciLCJjcmVhdGVUZW1wVXNlciIsImRhdGEiLCJpZCIsIkRhdGUiLCJub3ciLCJyYW5kb20iLCJ0b1N0cmluZyIsInN1YnN0ciIsImVtYWlsIiwibmFtZSIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwidHJpbSIsImxlYXJuaW5nU3R5bGUiLCJ2aXN1YWwiLCJhdWRpdG9yeSIsImtpbmVzdGhldGljIiwic2tpbGxMZXZlbCIsInRoZW9yeSIsInRvb2xpbmciLCJwcm9tcHRpbmciLCJlbW90aW9uQmFzZWxpbmUiLCJjb25mdXNpb25fdGhyZXNob2xkIiwiZnJ1c3RyYXRpb25fdGhyZXNob2xkIiwiZW5nYWdlbWVudF9iYXNlbGluZSIsInByZWZlcmVuY2VzIiwicHJlZmVycmVkX2Zvcm1hdCIsImxhbmd1YWdlIiwicGFjZSIsImRpZmZpY3VsdHlfcHJlZmVyZW5jZSIsImlzVGVtcG9yYXJ5IiwiY3JlYXRlZEF0IiwidXBkYXRlZEF0IiwiY2hlY2tEYXRhYmFzZUhlYWx0aCIsIiRxdWVyeVJhdyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/db-utils.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"query\",\n        \"error\",\n        \"warn\"\n    ] : 0,\n    datasources: {\n        db: {\n            url: process.env.DATABASE_URL\n        }\n    }\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTZDO0FBRTdDLE1BQU1DLGtCQUFrQkM7QUFJakIsTUFBTUMsU0FBU0YsZ0JBQWdCRSxNQUFNLElBQUksSUFBSUgsd0RBQVlBLENBQUM7SUFDL0RJLEtBQUtDLEtBQXlCLEdBQWdCO1FBQUM7UUFBUztRQUFTO0tBQU8sR0FBRyxDQUFTO0lBQ3BGQyxhQUFhO1FBQ1hDLElBQUk7WUFDRkMsS0FBS0gsUUFBUUksR0FBRyxDQUFDQyxZQUFZO1FBQy9CO0lBQ0Y7QUFDRixHQUFFO0FBRUYsSUFBSUwsSUFBeUIsRUFBY0osZ0JBQWdCRSxNQUFNLEdBQUdBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXBwLy4vbGliL2RiLnRzPzFkZjAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXG5cbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7XG4gIHByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoe1xuICBsb2c6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnID8gWydxdWVyeScsICdlcnJvcicsICd3YXJuJ10gOiBbJ2Vycm9yJ10sXG4gIGRhdGFzb3VyY2VzOiB7XG4gICAgZGI6IHtcbiAgICAgIHVybDogcHJvY2Vzcy5lbnYuREFUQUJBU0VfVVJMXG4gICAgfVxuICB9XG59KVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYVxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJsb2ciLCJwcm9jZXNzIiwiZGF0YXNvdXJjZXMiLCJkYiIsInVybCIsImVudiIsIkRBVEFCQVNFX1VSTCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/@panva","vendor-chunks/oidc-token-hash"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fjnufloga%2FDocuments%2FHacknation%2Fprofai_mvp%2Fapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fjnufloga%2FDocuments%2FHacknation%2Fprofai_mvp%2Fapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();