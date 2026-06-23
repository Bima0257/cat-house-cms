const Input = ({ type = 'text', name, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className='w-full p-2 border rounded'
    />
  );
};

export default Input;
