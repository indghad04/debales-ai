"use client";

interface Integrations {
  shopify: boolean;
  crm: boolean;
}

interface Props {
  integrations: Integrations;
  onToggle: (key: keyof Integrations) => void;
  disabled?: boolean;
}

export default function IntegrationToggle({
  integrations,
  onToggle,
  disabled,
}: Props) {
  return (
    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
      <p className="text-xs font-medium text-gray-500 mb-2">
        INTEGRATIONS
      </p>
      <div className="flex gap-3">
        {/* Shopify toggle */}
        <button
          onClick={() => onToggle("shopify")}
          disabled={disabled}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            integrations.shopify
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-gray-100 text-gray-500 border border-gray-200"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              integrations.shopify ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          Shopify
        </button>

        {/* CRM toggle */}
        <button
          onClick={() => onToggle("crm")}
          disabled={disabled}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            integrations.crm
              ? "bg-blue-100 text-blue-700 border border-blue-300"
              : "bg-gray-100 text-gray-500 border border-gray-200"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              integrations.crm ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
          CRM
        </button>
      </div>
    </div>
  );
}