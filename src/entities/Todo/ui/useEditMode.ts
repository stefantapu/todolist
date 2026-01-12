import { useEffect, useRef, useState } from 'react';

export type EditField = 'title' | 'description' | null;

export default function useEditMode(
  initialTitle: string,
  initialDescription: string,
  onSave: (title: string, description: string) => Promise<void>
) {
  const [editingField, setEditingField] = useState<EditField>(null);
  const [editedTitle, setEditedTitle] = useState(initialTitle);
  const [editedDescription, setEditedDescription] = useState(initialDescription);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setEditedTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    setEditedDescription(initialDescription);
  }, [initialDescription]);

  const startEditing = (field: Exclude<EditField, null>) => {
    if (field === 'title') setEditedTitle(initialTitle);
    else setEditedDescription(initialDescription);
    setEditingField(field);
  };

  const cancelEditing = () => {
    setEditedTitle(initialTitle);
    setEditedDescription(initialDescription);
    setEditingField(null);
  };

  const saveEditing = async (): Promise<'no-changes' | 'saved'> => {
    if (editedTitle === initialTitle && editedDescription === initialDescription) {
      setEditingField(null);
      return 'no-changes';
    }
    await onSave(editedTitle, editedDescription);
    setEditingField(null);
    return 'saved';
  };

  return {
    editingField,
    editedTitle,
    editedDescription,
    setEditedTitle,
    setEditedDescription,
    startEditing,
    cancelEditing,
    saveEditing,
    inputRef,
  } as const;
}
