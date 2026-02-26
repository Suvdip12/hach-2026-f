import "./css/ErrorDisplay.css";

export const ErrorDisplay = ({ error }: { error: string }) => (
  <span className="error-text">{error}</span>
);
