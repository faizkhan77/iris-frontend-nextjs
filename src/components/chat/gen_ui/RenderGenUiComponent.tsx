import React from "react";

interface GenUiComponentProps {
  type: string;
  props?: Record<string, any>;
}

/**
 * RenderGenUiComponent dynamically renders a UI component
 * based on the type returned from the AI.
 */
const RenderGenUiComponent: React.FC<GenUiComponentProps> = ({
  type,
  props,
}) => {
  switch (type) {
    case "fundamental_analysis":
      return (
        <div className="p-2 bg-blue-100 rounded-md my-2">
          <h3 className="font-semibold">Fundamental Analysis</h3>
          {props?.summary && <p>{props.summary}</p>}
        </div>
      );

    case "chart":
      return (
        <div className="p-2 bg-green-100 rounded-md my-2">
          <h3 className="font-semibold">Chart Component</h3>
          {/* Example: Render chart with props.data */}
          {props?.data && <pre>{JSON.stringify(props.data, null, 2)}</pre>}
        </div>
      );

    case "loading":
      return (
        <div className="animate-pulse h-6 w-40 bg-gray-300 rounded-md my-2" />
      );

    // Add more component types here
    default:
      return (
        <div className="p-2 bg-gray-100 rounded-md my-2">
          Unknown component type: {type}
        </div>
      );
  }
};

export default RenderGenUiComponent;
