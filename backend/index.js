import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import dotenv from 'dotenv';
import { connectDB } from "./db/connectDB.js";

import passport from "passport";
import session from "express-session";
import connectMongo from  'connect-mongodb-session';

import { buildContext } from "graphql-passport";

import { configurePassport } from "./passport/passport.config.js";
import path from "path";


const __dirname =  path.resolve(); //means root of the application
dotenv.config();
configurePassport();

const app = express();
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error",(err) => console.log(err));

app.use(
  session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
      maxAge:1000*60*60*24*7,
      httpOnly:true
    },
    store:store
  }),
  passport.initialize(),
  passport.session()
);

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

 
await server.start();

app.use(
    '/graphql',
    cors({
      origin:"http://localhost:3000",
      credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req , res }) => buildContext({ req, res }),
    }),
  );

  // npm run build will build frontend application and it will be optimized version of the app
  app.use(express.static(path.join(__dirname,"frontend/dist")));

  app.get('*',(req,res) => {  
    res.sendFile(path.join(__dirname,"frontend/dist","index.html")); 
  })

  //In production dont run react application from frontend folder but using npm run build from root package.json
  //render.com  => backend and frontend under the same domain localhost:4000


await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
