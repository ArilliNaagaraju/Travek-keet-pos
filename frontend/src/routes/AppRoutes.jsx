import { useState } from "react";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Users/RegisterPage";
import UserRegisterPage from "../pages/Users/UserRegisterPage";
import AddCaravanPage from "../pages/Dashboard/AddCaravanPage";
import CaravanListingPage from "../pages/Dashboard/CaravanListingPage";
import CaravanDetailsPage from "../pages/Dashboard/CaravanDetailsPage";
import ComparePage from "../pages/Dashboard/ComparePage";
import BookingFlowPage from "../pages/Dashboard/BookingFlowPage";

export default function AppRoutes() {
  const [screen, setScreen] = useState("login");
  const [selectedCaravan, setSelectedCaravan] = useState(null);

  // Debugging log to see what's happening
  console.log("Current screen:", screen);

  const handleGoHome = () => setScreen("listing");

  if (screen === "login") {
    return (
      <LoginPage 
        onSignIn={() => setScreen("listing")} 
        onGoToRegister={() => setScreen("user-register")} 
      />
    );
  }
  
  if (screen === "user-register") {
    return (
      <UserRegisterPage 
        onRegisterSuccess={() => setScreen("register")} 
        onBackToLogin={() => setScreen("login")} 
      />
    );
  }

  if (screen === "register") {
    return <RegisterPage onCancel={() => setScreen("listing")} onSubmit={() => setScreen("caravan")} />;
  }

  if (screen === "caravan") {
    return <AddCaravanPage onCancel={() => setScreen("listing")} onSubmit={() => setScreen("listing")} />;
  }

  if (screen === "add-caravan") {
    return <AddCaravanPage onCancel={() => setScreen("listing")} onSubmit={() => setScreen("listing")} />;
  }

  if (screen === "listing") {
    return (
      <CaravanListingPage
        onSelectCaravan={(caravan) => {
          setSelectedCaravan(caravan);
          setScreen("details");
        }}
        onLogout={() => setScreen("login")}
        onAddCaravan={() => setScreen("add-caravan")}
      />
    );
  }

  if (screen === "details") {
    return (
      <CaravanDetailsPage
        caravan={selectedCaravan}
        onCompare={() => setScreen("compare")}
        onProceedBooking={() => setScreen("booking")}
        onGoHome={handleGoHome}
        onLogout={() => setScreen("login")}
        onAddCaravan={() => setScreen("add-caravan")}
      />
    );
  }

  if (screen === "compare") {
    return (
      <ComparePage
        selectedCaravan={selectedCaravan}
        onProceedBooking={() => setScreen("booking")}
        onGoHome={handleGoHome}
        onLogout={() => setScreen("login")}
        onAddCaravan={() => setScreen("add-caravan")}
      />
    );
  }

  if (screen === "booking") {
    return (
      <BookingFlowPage 
        caravan={selectedCaravan} 
        onFinish={handleGoHome} 
        onGoHome={handleGoHome} 
      />
    );
  }

  return <div>Screen not found: {screen}</div>;
}
