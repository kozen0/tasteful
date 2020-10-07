'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RecipesSchema extends Schema {
  up () {
    this.create('recipes', (table) => {
      table.increments()
      table.integer('User_id').notNullable()
      table.integer('recipe_id').notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('recipes')
  }
}

module.exports = RecipesSchema
