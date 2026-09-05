const ErrorMessage = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}) => {
  return (
    <div className="error-state">

      <div className="error-state-icon">
        !
      </div>

      <h3>Something went wrong</h3>

      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;