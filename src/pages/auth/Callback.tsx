import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RetroUICard, RetroUICardContent, RetroUICardHeader, RetroUICardTitle } from "@/components/retroui/card";
import { getRedirectPath } from "@/lib/navigation";

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleCallback = () => {
      // Get token from URL query parameters
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      // Handle error case
      if (error) {
        setStatus("error");
        const errorMessages: Record<string, string> = {
          oauth_failed: "Google authentication failed. Please try again.",
          no_code: "No authorization code received from Google.",
          token_exchange_failed: "Failed to exchange authorization code.",
          no_access_token: "No access token received from Google.",
          userinfo_failed: "Failed to fetch user information.",
          no_email: "No email address found in your Google account.",
          network_error: "Network error occurred. Please check your connection.",
          config_error: "OAuth configuration error. Please contact support.",
          unexpected_error: "An unexpected error occurred. Please try again.",
        };
        setErrorMessage(errorMessages[error] || "Authentication failed. Please try again.");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
        return;
      }

      // Handle success case
      if (token) {
        try {
          // Store token in localStorage
          localStorage.setItem("auth_token", token);
          
          // Decode JWT to get user info (optional - for display purposes)
          const payload = JSON.parse(atob(token.split(".")[1]));
          
          // Store user info if needed
          if (payload.email) {
            localStorage.setItem("user_email", payload.email);
          }
          if (payload.name) {
            localStorage.setItem("user_name", payload.name);
          }

          setStatus("success");

          // Check for stored redirect intent from sessionStorage
          const storedRedirect = sessionStorage.getItem("auth_redirect");
          if (storedRedirect) {
            sessionStorage.removeItem("auth_redirect");
          }
          
          // Get redirect path from URL, sessionStorage, or default to home
          const urlRedirect = searchParams.get("redirect");
          const redirectTo = urlRedirect || storedRedirect || "/";

          // Redirect to intended destination after brief success message
          setTimeout(() => {
            navigate(redirectTo);
          }, 1500);
        } catch (err) {
          console.error("Error processing token:", err);
          setStatus("error");
          setErrorMessage("Failed to process authentication token.");
          setTimeout(() => {
            navigate("/auth/login");
          }, 3000);
        }
      } else {
        // No token and no error - invalid callback
        setStatus("error");
        setErrorMessage("Invalid authentication callback.");
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RetroUICard className="text-center">
          <RetroUICardHeader>
            <RetroUICardTitle className="text-3xl md:text-4xl mb-4">
              {status === "processing" && "Authenticating..."}
              {status === "success" && "Success! 🎉"}
              {status === "error" && "Oops! 😬"}
            </RetroUICardTitle>
          </RetroUICardHeader>

          <RetroUICardContent className="py-8">
            {status === "processing" && (
              <div className="flex flex-col items-center justify-center space-y-6">
                {/* Animated Loader */}
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 border-4 border-black bg-yellow-400 animate-spin" style={{ animationDuration: "2s" }}>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-2 bg-black"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-16 bg-black"></div>
                    </div>
                  </div>
                </div>

                <p className="text-lg font-bold text-gray-700">
                  Completing authentication...
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-24 h-24 bg-yellow-400 border-4 border-black flex items-center justify-center retroui-shadow">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-gray-700">
                  You're logged in! Redirecting...
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-24 h-24 bg-red-400 border-4 border-black flex items-center justify-center retroui-shadow">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-gray-700">
                  {errorMessage}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  Redirecting to login...
                </p>
              </div>
            )}
          </RetroUICardContent>
        </RetroUICard>
      </div>
    </div>
  );
};

export default Callback;
