import { forwardRef } from 'react';

const Input = forwardRef(({ type = 'text', name, placeholder, value, onChange, icon: Icon, error, ...props }, ref) => {
  return (
    <div>
      {Icon && (
        <div className="relative">
          <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            ref={ref}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark text-body-main placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition ${error ? 'border-error-container' : ''}`}
            {...props}
          />
        </div>
      )}
      {!Icon && (
        <input
          ref={ref}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark text-body-main placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition ${error ? 'border-error-container' : ''}`}
          {...props}
        />
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
