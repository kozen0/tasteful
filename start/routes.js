'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.on('/').render('welcome')
Route.get('/', 'MainController.main')
Route.post('/search', 'MainController.search')
Route.get('/register', 'MainController.register')
Route.post('/register', 'MainController.addusers')
Route.get('/login', 'MainController.login')
Route.post('/login', 'MainController.loginusers').middleware(['guest'])
Route.get('/logout', 'MainController.logout')
Route.get('/recipelist', 'MainController.recipelist')
Route.post('/addrecipe', 'MainController.addrecipe')
Route.delete('/remove/:id', 'MainController.destroy')
