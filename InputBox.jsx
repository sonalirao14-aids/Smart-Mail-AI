function InputBox({ email, setEmail, handleSubmit, loading }) {
  return (
    <div className="input-container">
      <textarea
        placeholder="Paste your email here..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Email"}
      </button>
    </div>
  );
}

export default InputBox;