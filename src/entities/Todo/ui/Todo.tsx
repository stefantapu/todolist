import { memo } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { NavLink } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { CheckTodoType, EditTodoType, TodoType } from '../model/todoType';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { Paper, Stack, TextField, useTheme, alpha, Button, Divider, Chip } from '@mui/material';
import { useSnackbar } from 'notistack';
import useEditMode from './useEditMode';
import {
  useCheckTodoMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
} from '../api/todoApi';
import { formatDistanceToNow } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Accept } from '../../App/ui/FileUploader';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

type TodoProps = {
  todo: TodoType;
  variant?: 'card' | 'fullpage';
  isOverlay?: boolean;
};

export const Todo = memo(({ todo, variant = 'card', isOverlay }: TodoProps) => {
  const theme = useTheme();
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: todo._id });

  const isFull = variant === 'fullpage';

  const style: React.CSSProperties = {
    transform: isOverlay ? undefined : CSS.Translate.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.4 : 1,
    zIndex: isOverlay ? 1000 : undefined,
    touchAction: 'none',
  };

  const { enqueueSnackbar } = useSnackbar();

  // RTK mutations (need to be called before using the hook's onSave)
  const [editTodoTitleAndDescription] = useEditTodoMutation();
  const [checkTodo] = useCheckTodoMutation();
  const [deleteTodoRTK] = useDeleteTodoMutation();

  const {
    editingField,
    editedTitle,
    editedDescription,
    setEditedTitle,
    setEditedDescription,
    startEditing,
    saveEditing,
    inputRef,
  } = useEditMode(todo.title, todo.description, async (title, description) => {
    const newTodo: EditTodoType = { title, description, _id: todo._id };
    await editTodoTitleAndDescription(newTodo).unwrap();
  });


  const handleSave = async () => {
    try {
      const res = await saveEditing();
      if (res === 'no-changes') {
        enqueueSnackbar('No changes', { variant: 'info' });
        return;
      }
      enqueueSnackbar('Saved!', { variant: 'success' });
    } catch (error) {
      console.error('Failed to edit todo:', error);
      enqueueSnackbar('Failed to save todo', { variant: 'error' });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodoRTK(id).unwrap();
      enqueueSnackbar('Task deleted!', { variant: 'success' });
    } catch (error) {
      console.error('Failed to delete todo:', error);
      enqueueSnackbar('Failed to delete todo', { variant: 'error' });
    }
  };

  const handleCompleted = async (completed: boolean) => {
    try {
      const newCompleted: CheckTodoType = {
        _id: todo._id,
        completed: completed,
      };
      checkTodo(newCompleted);
      if (completed) {
        enqueueSnackbar('Nice!', { variant: 'success' });
      } else {
        enqueueSnackbar('Updated!', { variant: 'default' });
      }
    } catch (error) {
      console.error('Failed to update completed state:', error);
      enqueueSnackbar('Failed to update todo', { variant: 'error' });
    }
  };

  const handleToggleCompleted = () => {
    const newCompleted = !todo.completed;
    handleCompleted(newCompleted);
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      onClick={(e) => {
          // Prevent click propagation if clicking on interactive elements
          if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('a')) {
              return;
          }
      }}
      sx={{
        width: '100%',
        height: isFull ? 'auto' : '100%',
        position: 'relative',
      }}
    >
      <Paper
        elevation={isOverlay ? 16 : 0}
        sx={{ 
            p: isFull ? 4 : 3, 
            height: '100%',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            border: '1px solid',
            borderColor: todo.completed 
                ? alpha(theme.palette.success.main, 0.3) 
                : alpha(theme.palette.divider, 0.6),
            transition: 'all 0.2s ease-in-out',
            boxShadow: isOverlay 
                ? theme.shadows[16] 
                : isFull 
                    ? theme.shadows[0] 
                    : '0 2px 12px ' + alpha(theme.palette.common.black, 0.04),
            '&:hover': {
                borderColor: theme.palette.primary.main,
                transform: !isFull && !isOverlay ? 'translateY(-4px)' : undefined,
                boxShadow: !isFull && !isOverlay ? theme.shadows[8] : undefined,
            },
            ...(todo.completed && {
                backgroundColor: alpha(theme.palette.success.main, 0.02),
            })
        }}
      >
        <Stack spacing={2} sx={{ height: '100%' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
                 <Checkbox 
                    checked={todo.completed} 
                    onClick={handleToggleCompleted} 
                    color="success"
                    sx={{
                        '&.Mui-checked': {
                            color: theme.palette.success.main,
                        },
                    }}
                />
                
                {editingField === 'title' ? (
                  <TextField
                    fullWidth
                    autoFocus
                    inputRef={inputRef}
                    value={editedTitle}
                    variant="standard"
                    onChange={e => setEditedTitle(e.target.value)}
                    onBlur={() => handleSave()}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSave();
                    }}
                    slotProps={{
                        input: {
                            disableUnderline: false,
                            sx: { fontSize: isFull ? '2rem' : '1.25rem', fontWeight: 600 }
                        }
                    }}
                  />
                ) : (
                    <Typography
                        variant={isFull ? 'h4' : 'h6'}
                        sx={{
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            color: todo.completed ? 'text.disabled' : 'text.primary',
                            width: '100%',
                            wordBreak: 'break-word',
                        }}
                        onDoubleClick={() => startEditing('title')}
                    >
                        {todo.title}
                    </Typography>
                )}
            </Box>

            <Box sx={{ display: 'flex', whiteSpace: 'nowrap' }}>
                {!isFull && (
                    <NavLink to={`/todo/${todo._id}`}>
                        <IconButton size="small" color="primary">
                            <OpenInNewIcon fontSize="small" />
                        </IconButton>
                    </NavLink>
                )}
            </Box>
          </Stack>

          <Divider sx={{ opacity: 0.5 }} />

          <Box sx={{ flexGrow: 1 }}>
            {editingField === 'description' ? (
              <TextField
                multiline
                fullWidth
                autoFocus
                minRows={3}
                value={editedDescription}
                variant="outlined"
                onChange={e => setEditedDescription(e.target.value)}
                onBlur={() => handleSave()}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.ctrlKey) handleSave();
                }}
                sx={{ 
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                        fontSize: '0.95rem',
                        lineHeight: 1.6
                    }
                }}
              />
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  minHeight: isFull ? 100 : 'auto',
                }}
                 onDoubleClick={() => startEditing('description')}
              >
                {todo.description || <Box component="span" sx={{ fontStyle: 'italic', opacity: 0.6 }}>No description provided</Box>}
              </Typography>
            )}
          </Box>

          <Stack direction="row" justifyContent="space-between" alignItems="center" pt={1}>
             <Chip 
                label={`Updated ${formatDistanceToNow(todo.updatedAt)} ago`} 
                size="small" 
                variant="outlined" 
                sx={{ fontSize: '0.75rem', opacity: 0.8 }}
             />
             
            <Stack direction="row" spacing={1}>
                 {isFull && (
                     <Button 
                        startIcon={editingField ? <SaveIcon /> : <EditIcon />}
                        size="small"
                        onClick={() => editingField ? handleSave() : startEditing('description')}
                     >
                         {editingField ? 'Save' : 'Edit'}
                     </Button>
                 )}
                <IconButton
                  aria-label="delete"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteTodo(todo._id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
      
      {isFull && (
        <Box sx={{ mt: 4 }}>
             <Typography variant="h6" fontWeight={700} gutterBottom>
                Attachments
             </Typography>
             <Accept />
        </Box>
      )}
    </Box>
  );
});
