import "./css/LoadingSpinner.css";

export const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="loading-spinner-container">
    <div className="loading-spinner"></div>
    <span>{message}</span>
  </div>
);
