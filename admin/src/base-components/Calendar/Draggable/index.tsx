import { createRef, useEffect, useRef } from "react";
import { Draggable as FullCalendarDraggable } from "@fullcalendar/interaction";

export interface DraggableProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"div"> {
  options: FullCalendarDraggable["settings"];
  key?: any; // Allow for key prop to force re-renders
}

function Draggable(props: DraggableProps) {
  const draggableRef = createRef<HTMLDivElement>();
  const draggableInstanceRef = useRef<FullCalendarDraggable | null>(null);

  useEffect(() => {
    if (draggableRef.current) {
      // Clean up previous instance if exists
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.destroy();
      }
      
      // Create new instance
      draggableInstanceRef.current = new FullCalendarDraggable(
        draggableRef.current, 
        props.options
      );
    }

    // Cleanup function for when component unmounts or dependencies change
    return () => {
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.destroy();
        draggableInstanceRef.current = null;
      }
    };
  }, [props.options, props.key]); // Use key instead of children for more explicit control

  return (
    <div ref={draggableRef} {...props}>
      {props.children}
    </div>
  );
}

Draggable.defaultProps = {
  options: {},
};

export default Draggable;