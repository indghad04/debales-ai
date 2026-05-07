interface Widget {
  id: string;
  type: "stat" | "chart" | "table" | "alert";
  title: string;
  value?: string;
  description?: string;
  visible: boolean;
}

export default function DashboardWidget({ widget }: { widget: Widget }) {
  if (!widget.visible) return null;

  // Stat widget
  if (widget.type === "stat") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <p className="text-sm text-gray-500 mb-1">{widget.title}</p>
        <p className="text-3xl font-bold text-gray-800">{widget.value}</p>
        {widget.description && (
          <p className="text-xs text-gray-400 mt-2">{widget.description}</p>
        )}
      </div>
    );
  }

  // Chart widget
  if (widget.type === "chart") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-3">{widget.title}</p>
        {widget.description && (
          <p className="text-xs text-gray-400 mb-3">{widget.description}</p>
        )}
        {/* Simple bar chart simulation */}
        <div className="flex items-end gap-2 h-24">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-blue-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d} className="text-xs text-gray-400">{d}</span>
          ))}
        </div>
      </div>
    );
  }

  // Alert widget
  if (widget.type === "alert") {
    return (
      <div className="bg-green-50 rounded-xl border border-green-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <p className="text-sm font-medium text-green-700">{widget.title}</p>
        </div>
        {widget.value && (
          <p className="text-sm text-green-600">{widget.value}</p>
        )}
        {widget.description && (
          <p className="text-xs text-green-500 mt-1">{widget.description}</p>
        )}
      </div>
    );
  }

  // Table widget
  if (widget.type === "table") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-3">{widget.title}</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Value</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {["Item A", "Item B", "Item C"].map((item, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2 text-gray-700">{item}</td>
                <td className="py-2 text-gray-500">${(i + 1) * 100}</td>
                <td className="py-2">
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}