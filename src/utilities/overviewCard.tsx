interface OverviewCardProps {
  title: string;
  value: string | number;
}

// Overview Card Component
export const OverviewCard = ({ title, value }: OverviewCardProps) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-48 text-center">
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
};
