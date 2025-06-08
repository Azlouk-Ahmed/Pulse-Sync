import clsx from "clsx";

type StatCardProps = {
  type: "appointments" | "pending" | "cancelled";
  count: number;
  label: string;
  icon: string;
};

export const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    <div
  className={clsx("stat-card", {
    "bg-[url('/assets/images/appointments-bg.png')]": type === "appointments",
    "bg-[url('/assets/images/pending-bg.png')]": type === "pending",
    "bg-[url('/assets/images/cancelled-bg.png')]": type === "cancelled",
  })}
    >
      <div className="flex items-center gap-4">
        <img src={icon} height={32} width={32} alt="appointments" className="size-8 w-fit" />
        <h2 className="text-32-bold">{count}</h2>
      </div>
      <p className="text-14-regular">{label}</p>
    </div>
  );
};