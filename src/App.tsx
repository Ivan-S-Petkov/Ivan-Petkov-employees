import AppRouter from "./router/AppRouter";
import { EmployeesProvider } from "./context/EmployeesContext";

const App = () => {
  return (
    <EmployeesProvider>
      <AppRouter />
    </EmployeesProvider>
  );
};

export default App;