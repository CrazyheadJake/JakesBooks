import express from "express";
import cors from "cors";

import type { Request, Response } from "express";

const app = express();
app.use(cors()); // allow all origins (fine for dev)
app.use(express.json());
app.get("/api/message", (req: Request, res: Response) => {
    res.json({ text: "Hello from Express!" });
});

app.listen(3001, () => console.log("Server running on port 3001"));