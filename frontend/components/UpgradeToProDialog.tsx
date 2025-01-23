'use client';
// components/UpgradeToProDialog.tsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Crown, History } from "lucide-react"; // Import History icon

const UpgradeToProDialog = ({ onUpgrade }: { onUpgrade: () => void }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isProUser, setIsProUser] = useState(false); // Track if the user is Pro

  const handleUpgrade = () => {
    setIsProUser(true); // Mark user as Pro
    onUpgrade(); // Trigger the parent upgrade action
  };

  return (
    <>
      {/* Button to trigger the dialog */}
      <button
        className="text-primary hover:text-black transition flex items-center gap-2"
        onClick={() => setShowDialog(true)}
      >
        {isProUser ? (
          <>
            <History size={24} /> {/* Show History icon for Pro users */}
            <span className="text-lg font-semibold">See History</span>
          </>
        ) : (
          <>
            <Crown size={24} />
            <span className="text-lg font-semibold">Upgrade to Pro</span>
          </>
        )}
      </button>

      {/* Dialog for Pro Verification */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg mx-auto p-6 bg-gray-900 rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {isProUser ? "Welcome to Pro" : "Upgrade to Pro"}
            </DialogTitle>
            <DialogDescription className="text-white">
              {isProUser
                ? "You have successfully upgraded to Pro. Here is your fashion history!"
                : "This feature is available only for Pro users. Upgrade now to gain access to premium features."}
            </DialogDescription>
          </DialogHeader>

          {/* Conditionally render based on user upgrade status */}
          <div className="mt-4">
            {isProUser ? (
              <div>
                <h3 className="text-xl font-bold text-white">Your Fashion History</h3>
                <ul className="text-white mt-2">
                  <li>Upload 1: Trendy Casual Outfit</li>
                  <li>Upload 2: Formal Evening Wear</li>
                  <li>Upload 3: Sportswear</li>
                  {/* Add more history items dynamically here */}
                </ul>
              </div>
            ) : (
              <div className="flex justify-end gap-4 mt-4">
                <button
                  className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex items-center gap-2 py-2 px-4 bg-transparent text-white border border-transparent hover:border-white rounded-md transition"
                  onClick={handleUpgrade}
                >
                  <Crown className="w-5 h-5" />
                  <span className="text-lg font-semibold hover:text-white">
                    Upgrade
                  </span>
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpgradeToProDialog;
