export const typeDefs = `#graphql
type Game {
    id: ID! 
    title: String!
    platform: [String!]! 
    reviews: [Review!]!
}
type Review  {
    id: ID!
    rating: Int!
    content: String!
    game: Game!
    author: Author!
}
type Author  {
    id: ID!
    verified: Boolean!
    name: String!
    reviews: [Review!]
}
type Query {
    reviews: [Review]
    games: [Game]
    authors: [Author]
    review(id: ID!): Review
    game(id: ID!): Game
    author(id: ID!): Author 
}
type Mutation{
    deleteGame(id: ID): [Game]
    addGame(game: AddGameInput): Game
    updateGame(id:ID, edits: EditGameInput!): Game
}
input AddGameInput{
    title: String,
    platform: [String!]!
}
input EditGameInput{
    title: String,
    platform: [String!]!
}
`

/*
AddGameInput is an input type that defines the structure of the data that can be provided when adding a new game.
*/ 