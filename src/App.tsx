import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import KitPage from "./pages/Kit";
import KitDetailPage from "./pages/KitDetail";
import CheckoutPage from "./pages/Checkout";
import OrderSuccessPage from "./pages/OrderSuccess";
import OurStoryPage from "./pages/OurStory";
import FaqPage from "./pages/Faq";
import PoliciesPage from "./pages/Policies";
import ContactPage from "./pages/Contact";
import LoginPage from "./pages/Login";
import AdminPage from "./pages/Admin";
import PayPalReturnPage from "./pages/PayPalReturn";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/kit" element={<KitPage />} />
      <Route path="/kit/:slug" element={<KitDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/our-story" element={<OurStoryPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/policies" element={<PoliciesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/paypal-return" element={<PayPalReturnPage />} />
    </Routes>
  );
}
