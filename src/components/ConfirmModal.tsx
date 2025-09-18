"use client";

import React from "react";

interface ConfirmModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Sí, eliminar
          </button>
          <button
            onClick={onCancel}
            className="border px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
