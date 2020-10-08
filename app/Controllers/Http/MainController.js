'use strict'
const User = use('App/Models/User')
const Recipe = use('App/Models/Recipe')
const fetch = require('node-fetch')
const { validate } = use('Validator')

class MainController {

    async main({view, auth, request}) {
            return view.render('welcome')
    }
    //rehister view
    async  register({view}) {
        return view.render('register')
    }
    //adds a new user
    async addusers({view, request, session, response}) {
        const rules = {
            username: 'required',
            email: 'required',
            password: 'required'
        }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
        session
       .withErrors(validation.messages())
       .flashExcept(['password'])

       return response.redirect('back')
    }

        const user = new User()
        const users = request.collect(['username','password','email'])
        console.log(users)
        user.username = users[0].username
        user.password = users[0].password
        user.email = users[0].email
        user.save()
        return view.render('register')
    }
    //login view
    async  login({view}) {
        return view.render('login')
    }
    //login users
   async loginusers({view, request, auth, response,session}) {
    const rules = {
        email: 'required',
        password: 'required'
    }
    
    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
        session
       .withErrors(validation.messages())
       .flashExcept(['password'])

       return response.redirect('back')
    } else {
        const {email, password} = request.all()
        console.log({email, password})
        await auth.attempt(email,password)
        return response.redirect('/')
    }
    }
   async logout({auth, response}) {
        await auth.logout()
        return response.redirect('/')
    }

    async search({view, auth, request, response}) {
        let b
        const apiKey = 'e5a639234e60424284571c0b2ddf7179'
        const recipe = request.only(['recipe'])
          await fetch(`https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&number=15&query=${recipe.recipe}`)
          .then(response => response.json())
          .then( data => b = data.results)
          return response.send( view.render('welcome',{b}))
    }

    async recipelist({view, auth, request, response}) {
        //get recipe ids from database
        const apiKey = 'e5a639234e60424284571c0b2ddf7179'
        const arr = []
        const arrID = []
        const ids = await auth.user.recipe().fetch()
       const recipeids = await auth.user.recipe().fetch()
       for (let i = 0; i < recipeids.rows.length;i++) {
           await fetch(`https://api.spoonacular.com/recipes/${recipeids.rows[i].recipe_id}/information?apiKey=${apiKey}`)
          .then(response => response.json())
          .then( data => arr.push(data) )
          arrID.push(ids.rows[i].id)
       }
       console.log(arrID[0])
          return view.render('recipelist', {arr, arrID}, {arrID})
    }

    //adds recipe to the users recipe list
    async addrecipe({view, auth, request, response, session}) {
        if (auth.user) {
            const recipes = request.collect(['id'])
          const recipeids = recipes[0].id
          const recipeDataBase = new Recipe()
          const userId = auth.user.id
          recipeDataBase.user_id = userId
          recipeDataBase.recipe_id = recipeids
          recipeDataBase.save()
        } else {
            return response.redirect('/login')
        }
          
    }
    //removes recipe from recipe list
    async destroy({view, auth, request, response,params}) {
        // const x = await auth.user.recipe().fetch().rows[params].id
        // console.log(x.rows[0].id)
          const recipeDataBase = await Recipe.findOrFail(params.id)
         await recipeDataBase.delete()
         return response.redirect('back')
    }
}
//   `https://api.spoonacular.com/recipes/salmon/information?apiKey=${apiKey}`
module.exports = MainController
