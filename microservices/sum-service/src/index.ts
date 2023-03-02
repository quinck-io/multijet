import { sum } from "@libs/utils";
import express from "express";

const app = express();
const port = 3000;

app.get("/sum", (req, res) => {
	const result = sum(5, 4);
	res.send({ value: result });
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
