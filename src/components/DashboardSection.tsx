import DashboardWidget from "./DashboardWidget";

interface Widget {
  id: string;
  type: "stat" | "chart" | "table" | "alert";
  title: string;
  value?: string;
  description?: string;
  order: number;
  visible: boolean;
}

interface Section {
  id: string;
  title: string;
  order: number;
  widgets: Widget[];
}

export default function DashboardSection({ section }: { section: Section }) {
  // Sort widgets by order
  const sortedWidgets = [...section.widgets].sort((a, b) => a.order - b.order);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
        {section.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedWidgets.map((widget) => (
          <DashboardWidget key={widget.id} widget={widget} />
        ))}
      </div>
    </div>
  );
}