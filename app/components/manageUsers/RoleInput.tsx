interface RoleInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
  }
  
  const RoleInput: React.FC<RoleInputProps> = ({ value, onChange }) => {
    const roles = ["User", "Admin", "Director"];
  
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 p-1 rounded w-full text-black"
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    );
  };
  
  export default RoleInput;