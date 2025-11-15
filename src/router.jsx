import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import WorkersPage from "./pages/Workers/WorkersPage";
import PermitsPage from "./pages/Permits/PermitsPage";
import TypesPage from "./pages/PermissionTypes/TypesPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="workers" element={<WorkersPage />} />
          <Route path="permits" element={<PermitsPage />} />
          <Route path="types" element={<TypesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
