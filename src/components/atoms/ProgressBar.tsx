type Props = {
  value: number;
  className?: string;
  bgColor?: string;
  bgOpacity?: string;
};

const ProgressBar = ({
  value,
  className = "",
  bgColor = "bg-primary",
  bgOpacity = "bg-primary/20",
}: Props) => {
  return (
    <div
      className={`${bgOpacity} relative h-2 w-full overflow-hidden rounded-full ${className}`}
    >
      <div
        className={`${bgColor} h-full transition-all`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default ProgressBar;
