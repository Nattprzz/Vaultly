import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { CategoryColorsProvider } from "./hooks/useCategoryColors";


function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <CategoryColorsProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <AppRoutes />
        </BrowserRouter>
      </CategoryColorsProvider>
    </I18nextProvider>
  );
}

export default App;
