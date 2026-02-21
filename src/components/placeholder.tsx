type PlaceholderProps = {
  label: string;
  icon?: React.ReactElement;
  button?: React.ReactElement;
};

const Placeholder = ({ label, icon, button }: PlaceholderProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-2">
      {icon && <span>{icon}</span>}
      <h1 className="font-semibold text-xl">{label}</h1>
      {button && <span>{button}</span>}
    </div>
  );
};

export default Placeholder;
