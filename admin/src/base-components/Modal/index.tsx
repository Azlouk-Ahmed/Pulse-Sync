import { Fragment, useEffect, createRef, ReactNode } from "react";
import { Transition } from "@headlessui/react";
import { createPortal } from "react-dom";

interface ModalProps {
  show: boolean;
  onHidden?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  slideOver?: boolean;
  children?: ReactNode;
  static?: boolean;
  backdrop?: string;
  className?: string;
}

interface ModalHeaderProps {
  children?: ReactNode;
  className?: string;
}

interface ModalBodyProps {
  children?: ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children?: ReactNode;
  className?: string;
}

// Modal component
function Modal({
  show = false,
  onHidden,
  size = "md",
  slideOver = false,
  children,
  static: staticModal = false,
  backdrop = "bg-slate-900/50 dark:bg-darkmode-900/50",
  className = "",
}: ModalProps) {
  const modalRef = createRef<HTMLDivElement>();

  // Handle clicking outside modal
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      !staticModal &&
      modalRef.current &&
      !modalRef.current.contains(event.target as Node)
    ) {
      event.preventDefault();
      onHidden?.();
    }
  };

  // Handle ESC key
  const handleEscape = (event: KeyboardEvent) => {
    if (!staticModal && event.key === "Escape") {
      event.preventDefault();
      onHidden?.();
    }
  };

  // Add event listeners
  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEscape);
      document.body.classList.add("overflow-hidden");
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("overflow-hidden");
    };
  }, [show, staticModal]);

  // Define size classes
  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
  };

  // Portal for modal
  return createPortal(
    <Transition show={show} as={Fragment}>
      <div className="fixed inset-0 z-[60] overflow-y-auto">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`fixed inset-0 transition-opacity ${backdrop}`}></div>
        </Transition.Child>

        <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter={slideOver ? "transform transition ease-in-out duration-500" : "ease-out duration-300"}
            enterFrom={slideOver ? "translate-x-full" : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}
            enterTo={slideOver ? "translate-x-0" : "opacity-100 translate-y-0 sm:scale-100"}
            leave={slideOver ? "transform transition ease-in-out duration-500" : "ease-in duration-200"}
            leaveFrom={slideOver ? "translate-x-0" : "opacity-100 translate-y-0 sm:scale-100"}
            leaveTo={slideOver ? "translate-x-full" : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}
          >
            <div
              ref={modalRef}
              className={`
                inline-block text-left align-bottom transition-all 
                ${
                  slideOver
                    ? "fixed right-0 top-0 h-screen border-l border-slate-200/60 dark:border-darkmode-400 w-full sm:w-[400px]"
                    : "sm:my-8 sm:align-middle w-full sm:max-w-md"
                } 
                ${slideOver ? "" : sizeClasses[size]}
                ${className}
              `}
            >
              {children}
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>,
    document.body
  );
}

// Modal Header component
function ModalHeader({ children, className = "" }: ModalHeaderProps) {
  return (
    <div
      className={`flex items-center px-5 py-3 border-b border-slate-200/60 dark:border-darkmode-400 ${className}`}
    >
      {children}
    </div>
  );
}

// Modal Body component
function ModalBody({ children, className = "" }: ModalBodyProps) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

// Modal Footer component
function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return (
    <div
      className={`px-5 py-3 text-right border-t border-slate-200/60 dark:border-darkmode-400 ${className}`}
    >
      {children}
    </div>
  );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { Modal, ModalBody, ModalHeader as ModalHeader, ModalFooter as ModalFooter };