/*require("dotenv").config();

const http = require("http");
const { neon } = require("@neondatabase/serverless");

export const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
  const result = await sql`SELECT version()`;
  const { version } = result[0];
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(version);
};*/

import "dotenv/config"; // ou import { config } from "dotenv"; config();

import http from "http";
import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(version);
  } catch (error) {
    console.error("Erro ao conectar ou consultar o banco de dados:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Erro interno do servidor");
  }
};


/*http.createServer(requestHandler).listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});*/