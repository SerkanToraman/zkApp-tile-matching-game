// index.ts
import { app } from "./api/server.js";

const PORT = 8585;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
