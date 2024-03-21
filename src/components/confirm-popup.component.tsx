import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Item {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  itemPrice: number;
}

interface ConfirmBoxProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  context: string;
  data?: Item[];
  totalAmount?: number;
}

const ConfirmBox: React.FC<ConfirmBoxProps> = ({
  open,
  onClose,
  onConfirm,
  context,
  data,
  totalAmount,
}) => {
  const handleConfirm = () => {
    onConfirm();
    printReceipt();
  };

  const handleClose = () => {
    onClose();
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="hideInPrint">
          Confirm Action
        </DialogTitle>
        <DialogContent>
          {data && data.length > 0 ? (
            <div style={{ fontFamily: "monospace" }}>
              <p id="alert-dialog-description" className="hideInPrint">
                Are you sure you want to {context}?
              </p>
              <div
                style={{
                  borderBottom: "1px solid black",
                  marginBottom: "8px",
                  width: "200px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>Item</span>
                  <span style={{ fontWeight: "bold" }}>Qty</span>
                  <span style={{ fontWeight: "bold" }}>Price</span>
                </div>
              </div>
              {data.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                  }}
                >
                  <span>{item.itemName}</span>
                  <span>{item.quantity}</span>
                  <span>${item.itemPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to {context}?
            </DialogContentText>
          )}
          {totalAmount && (
            <DialogContentText
              style={{
                fontFamily: "monospace",
                fontWeight: "bold",
                fontSize: "16px",
                marginTop: "8px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions className="hideInPrint">
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm & Print
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmBox;
