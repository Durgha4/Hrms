import { useEffect } from "react";
import { Check, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseDuration?: number;
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  autoCloseDuration = 2000 
}: SuccessModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [isOpen, onClose, autoCloseDuration]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      data-testid="modal-success-overlay"
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-8 relative animate-in fade-in scale-in duration-300"
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-success-content"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          data-testid="button-close-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6" data-testid="icon-success">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h2 
          className="text-2xl font-bold text-green-600 text-center mb-2"
          data-testid="text-success-title"
        >
          Asset Request Submitted
        </h2>

        {/* Subtitle */}
        <p 
          className="text-sm text-slate-600 text-center"
          data-testid="text-success-subtitle"
        >
          Your asset request has been submitted successfully
        </p>
      </div>
    </div>
  );
}
