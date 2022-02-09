import { Routes, Route } from "react-router-dom";

import {
  Sidebar,
  Home,
  Currencies,
  Details,
  Exchanges,
  News,
} from "./components";

const App = () => {
  return (
    <div>
      <Sidebar />
      <div className="max-w-full mx-8 mt-24 md:ml-80 md:mt-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/currencies" element={<Currencies />} />
          <Route path="/currencies/:coinId" element={<Details />} />
          <Route path="/exchanges" element={<Exchanges />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default App;
