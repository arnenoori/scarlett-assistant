import { Popover, ArrowContainer, PopoverPosition } from "react-tiny-popover";
import { useRef, useState } from "react";

const Tooltip = ({
  tip,
  position_priority = "top",
}: {
  tip: React.ReactElement;
  position_priority?: PopoverPosition;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const isMouseOverButton = useRef(false);

  const positions: PopoverPosition[] = ["top", "bottom", "left", "right"];
  return (
    <Popover
      positions={[
        position_priority,
        ...positions.filter((value) => value != position_priority),
      ]}
      isOpen={isOpen || isInside}
      padding={10}
      content={({ position, childRect, popoverRect }) => (
        <div
          onMouseEnter={() => {
            setIsInside(true);
          }}
          onMouseLeave={async () => {
            setIsInside(false);
          }}
        >
          <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
            position={position}
            childRect={childRect}
            popoverRect={popoverRect}
            arrowColor={"orange"}
            arrowSize={10}
            arrowStyle={{ opacity: 0.7 }}
            className="popover-arrow-container"
            arrowClassName="popover-arrow"
          >
            {tip}
          </ArrowContainer>
        </div>
      )}
    >
      <button
        onMouseEnter={() => {
          isMouseOverButton.current = true;
          setIsOpen(true);
        }}
        onMouseLeave={async () => {
          isMouseOverButton.current = false;
          await new Promise((r) => setTimeout(r, 500));
          if (!isInside && !isMouseOverButton.current) {
            setIsOpen(false);
          }
        }}
        type="button"
      >
        <svg
          className="w-4 h-4 text-gray-400 hover:text-gray-500"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Show information</span>
      </button>
    </Popover>
  );
};

export default Tooltip;
