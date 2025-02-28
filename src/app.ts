import express from 'express';
import { createBook, deleteBook, updateBook } from './controllers/BookController';
const app = express();
const port = 3000;

app.use(express.json());

// [Book]
app.post("/book", createBook);
app.delete("/book", deleteBook);
app.put("/book", updateBook);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

export default app;