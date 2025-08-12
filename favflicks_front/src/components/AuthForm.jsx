

const AuthForm = ({
  title,
  fields,
  values,
  onChange,
  onSubmit,
  error,
  isLoading
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#2a1f1f] p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          {fields.map(({ id, label, type = 'text' }) => (
            <div key={id} className="mb-4">
              <label htmlFor={id} className="block text-sm font-medium mb-1 text-white">
                {label}
              </label>
              <input
                type={type}
                id={id}
                value={values[id] || ''}
                onChange={onChange}
                className="w-full bg-[#3a2e2e] border border-[#4a3e3e] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : title}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;