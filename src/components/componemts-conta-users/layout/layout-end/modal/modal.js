"use client";

export default function Modal({ children, isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div style={overlayStyles} onClick={onClose}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const modalStyles = {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    width: "90%",
    maxWidth: "400px",
};
