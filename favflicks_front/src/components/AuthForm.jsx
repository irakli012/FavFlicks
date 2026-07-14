

const AuthForm = ({
  title,
  fields,
  values,
  onChange,
  onSubmit,
  error,
  isLoading,
  children
}) => {
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md animate-fade-in-up shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-8 text-white text-center tracking-tight">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-5">
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
                className="w-full bg-[#181111]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-red-700 focus:outline-none transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(232,38,38,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? 'Loading...' : title}
          </button>
        </form>
        {children}
      </div>
    </div>
  );
};

export default AuthForm;