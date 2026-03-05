"use client";

import { createContext, useContext, useState } from "react";

type CommentEditStateContextType = {
  isEditing: (commentId: string) => boolean;
  startEditing: (commentId: string) => void;
  stopEditing: (commentId: string) => void;
};

// Shared edit state for the comments list, keyed by comment id.
const CommentEditStateContext =
  createContext<CommentEditStateContextType | null>(null);

type CommentEditStateProviderProps = {
  children: React.ReactNode;
};

const CommentEditStateProvider = ({
  children,
}: CommentEditStateProviderProps) => {
  const [editingById, setEditingById] = useState<Record<string, boolean>>({});

  const isEditing = (commentId: string) => !!editingById[commentId];

  const startEditing = (commentId: string) => {
    setEditingById((previousState) => ({
      ...previousState,
      [commentId]: true,
    }));
  };

  const stopEditing = (commentId: string) => {
    setEditingById((previousState) => ({
      ...previousState,
      [commentId]: false,
    }));
  };

  return (
    <CommentEditStateContext.Provider
      value={{
        isEditing,
        startEditing,
        stopEditing,
      }}
    >
      {children}
    </CommentEditStateContext.Provider>
  );
};

export const useCommentEditState = () => {
  const context = useContext(CommentEditStateContext);

  if (!context) {
    // Helps catch accidental usage outside the provider.
    throw new Error(
      "useCommentEditState must be used within CommentEditStateProvider",
    );
  }

  return context;
};

export default CommentEditStateProvider;
