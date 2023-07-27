import {App} from "./server";
const { PORT } = process.env;

App.listen(PORT || 3000, () => {
  console.log(`server running on port http://localhost:${PORT}`);
});
