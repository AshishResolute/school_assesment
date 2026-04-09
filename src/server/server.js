import { app } from "../routes/school.js";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const __dirname = path.dirname(currentFile);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const PORT = process.env.SERVER_PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server running at port:${PORT}`);
});
