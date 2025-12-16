export default function Input({ label, type = "text", icon: Icon, ...props }) {
    return (
        <div className="form-group">
            {label && <label>{label}{props.required && <span style={{ color: 'red' }}>*</span>}</label>}
            <div className="icon-input-wrapper">
                <input
                    type={type}
                    {...props}
                />
                {Icon && <div className="input-icon"><Icon size={20} /></div>}
            </div>
        </div>
    );
}
