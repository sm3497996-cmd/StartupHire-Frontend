import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import router from "./routes";

const App = () => (
    <ThemeProvider>
        <RouterProvider router={router} />
    </ThemeProvider>
);

export default App;
