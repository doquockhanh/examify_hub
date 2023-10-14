import React, { useState } from 'react';

interface ConfirmationPopupProps {
    message: string;
    onConfirm: Function;
    onCancel: Function;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ message, onConfirm, onCancel }) => {
    const [disableBtn, setDisableBtn] = useState(false)

    const confirm = () => {
        setDisableBtn(true);
        onConfirm();
    }

    const cancel = () => {
        setDisableBtn(true);
        onCancel();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-lg">
                <p className="mb-4 text-red-500">{message}</p>
                <button onClick={confirm} disabled={disableBtn} className="bg-blue-500 text-white px-4 py-2 mr-2 rounded">
                    Confirm
                </button>
                <button onClick={cancel} disabled={disableBtn} className="bg-red-500 text-white px-4 py-2 rounded">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
