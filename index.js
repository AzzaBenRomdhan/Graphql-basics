import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';

//db
import db from './_db.js';

//types
import { typeDefs } from './schema.js' 
const resolvers = {
    Query: {
        games(){
            return db.games;
        },
        authors(){
            return db.authors;
        },
        reviews(){
            return db.reviews;
        },
        review(_, args){   //'_' est conventionnellement utilisé pour représenter le parent, mais ici, il n'est pas utilisé (il est souvent ignoré avec le soulignement `_`).
            // Le deuxième paramètre 'args' contient les arguments passés dans la requête GraphQL.
            //'args' contient les arguments passés dans la requête GraphQL
            return db.reviews.find((review) => review.id === args.id)
        },
        game(_, args){
            return db.games.find((game) => game.id === args.id)
        },
        author(_, args){
            return db.authors.find((author) => author.id === args.id)
        }
    },
    Game: { //récupére les reviews qui correspondent à l'id du game actuel ('parent.id')
    reviews(parent){    //'parent' est le jeu actuel sur lequel le résolveur est appliqué
        return db.reviews.filter((r) => r.game_id === parent.id) 
        //retourne les reviews ayant un game_id correspondant à l'id du game actuel ('parent.id') 

    }
    },
    Author: {
        reviews(parent){
            return db.reviews.filter((r) => r.author === parent)
        }
    },
    Review: {
      author(parent) {
        return db.authors.find((a) => a.id === parent.author_id)
      },
      game(parent) {
        return db.games.find((g) => g.id === parent.game_id)
      }
    },
    Mutation: {
        deleteGame(_, args){
            db.games = db.games.filter((g) => g.id !== args.id) 
            //using the filter method to create a new array of games that don't match the specified args.id.
            return db.games
        },
        addGame(_, args){
            let game = {
                ...args.game,      //The resolver is creating a new game object using the spread (...) operator to copy properties from args.game.
                id: Math.floor(Math.random()*10000).toString()
            }
            db.games.push(game)
            return game
        }, 
        updateGame(_, args){
            db.games = db.games.map((g) => {
                if(g.id === args.id){
                    return{...g, ...args.edits}
                }
                return g
            })
            return db.games.find((g) => g.id === args.id)
        }  
        /*
        The resolver uses the map method to iterate through each game (g) in the db.games array.
        For each game, it checks if the id of the game matches the id passed as an argument (args.id).
        If there is a match, it returns a new object using the spread (...) operator to merge the existing properties of the game (g) with the properties in args.edits. 
        This effectively updates the specified fields of the game.
        
        After updating the games, the resolver uses the find method to locate and return the specific game in db.games with the matching id.
        */
    }  
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const {url} = await startStandaloneServer(server, {
    listen: {port: 4000}
})

console.log('Server ready at port 4000');