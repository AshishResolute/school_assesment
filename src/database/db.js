import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const __dirname = path.dirname(currentFile);

dotenv.config({ path: path.join(__dirname, "../../.env") });

console.log(process.env.DB_HOST)

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:Number(process.env.DB_PORT)
});

let getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(
      `Database connected successfully at ${new Date().toLocaleString()};`,
    );
    connection.release();
  } catch (err) {
    console.error(err.message);
    console.error(
      `Database connection Failed! at ${new Date().toLocaleString()}`,
    );
  }
};
getConnection();

export default pool;
