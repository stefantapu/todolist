import Box from '@mui/material/Box';
import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
  alpha,
  Card,
  Container,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  selectFilters,
} from '../model/store/todosStore';
import { useAppSelector } from '../../../app/store';
import { Todo } from './Todo';
import { useAddTodoMutation, useGetTodosQuery } from '../api/todoApi';
import { useSnackbar } from 'notistack';
import { selectUser } from '../../User/model/store/userStore';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import AddTaskIcon from '@mui/icons-material/AddTask';
import TodosFilters from './TodosFilters';

const Todos = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const user = useAppSelector(selectUser);
  const filters = useAppSelector(selectFilters);
  const {
    data,
    isFetching: isGettingTodos,
    isLoading: isGettingTodosInitial,
    isError: isGettingError,
    refetch,
  } = useGetTodosQuery(filters, { skip: !user?.access_token, pollingInterval: 150000 });

  const [
    addTodoToBackend,
    { isLoading: isAddingTodo, isError: isAddingError, isSuccess: isAddedSucces },
  ] = useAddTodoMutation();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');

  const [items, setItems] = useState(data ?? []);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    setItems(items => {
      if (!items) return items;

      const oldIndex = items.findIndex(i => i._id === active.id);
      const newIndex = items.findIndex(i => i._id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const isInitialLoading = isGettingTodosInitial && !data;
  const isError = isAddingError || isGettingError;

  useEffect(() => {
    const handleClearFields = () => {
      setNewTodoTitle('');
      setNewTodoDescription('');
    };
    if (isAddedSucces) {
      handleClearFields();
    }
  }, [isAddedSucces]);

  useEffect(() => {
    if (isError) {
      enqueueSnackbar('Error fetching todos', { variant: 'error' });
    }
  }, [enqueueSnackbar, isError]);

  if (isInitialLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100%', py: 4, backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : '#f8f9fa' }}>
      <Container maxWidth="xl">
        {/* Hero Input Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
           <Box
            sx={{
              position: 'absolute',
              top: -100,
              right: -50,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: alpha('#ffffff', 0.1),
              pointerEvents: 'none',
            }}
          />
          <Stack spacing={3} sx={{ position: 'relative', zIndex: 1, maxWidth: 800, mx: 'auto' }}>
            {/* <Typography variant="h4" fontWeight="800" textAlign="center">
              What needs to be done?
            </Typography> */}
            <Paper
              elevation={4}
              sx={{
                p: 2,
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  placeholder="Task Title"
                  variant="standard"
                  value={newTodoTitle}
                  onChange={e => setNewTodoTitle(e.target.value)}
                  slotProps={{
                    input: {
                        disableUnderline: true,
                        sx: { fontSize: '1.5rem', fontWeight: 600 }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  placeholder="Add a description..."
                  variant="standard"
                  multiline
                  maxRows={4}
                  value={newTodoDescription}
                  onChange={e => setNewTodoDescription(e.target.value)}
                  slotProps={{
                    input: {
                        disableUnderline: true,
                        sx: { fontSize: '1rem', color: 'text.primary' }
                    }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddTaskIcon />}
                    disabled={!newTodoTitle || isAddingTodo}
                    onClick={() => {
                        if (!user?.access_token) {
                          enqueueSnackbar('Please sign in to add tasks', { variant: 'warning' });
                          return;
                        }
                        addTodoToBackend({ title: newTodoTitle, description: newTodoDescription });
                    }}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 700,
                      boxShadow: theme.shadows[4],
                    }}
                  >
                    Add Task
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', lg: 'row' }, gap: 4 }}>
          {/* Main Todo List Area (2/3 width) */}
          <Box sx={{ flex: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                    Your Tasks
                </Typography>
                 
                <Button 
                    variant="text" 
                    onClick={refetch} 
                    disabled={isGettingTodos}
                    startIcon={isGettingTodos ? <CircularProgress size={16} /> : null}
                    sx={{ textTransform: 'none' }}
                >
                    {isGettingTodos ? 'Refreshing...' : 'Refresh List'}
                </Button>
            </Box>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToWindowEdges]}
            >
              <SortableContext
                items={items?.map(i => i._id) ?? []}
                strategy={rectSortingStrategy}
              >
                <Box 
                    sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                        gap: 2,
                        alignItems: 'start'
                    }}
                >
                  {items?.map(todo => (
                    <Todo todo={todo} key={todo._id} />
                  ))}
                </Box>
              </SortableContext>
              <DragOverlay adjustScale={true}>
                {activeId ? (
                  <Todo
                    todo={items.find(i => i._id === activeId)!}
                    variant="card"
                    isOverlay
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </Box>

          {/* Sidebar Filters (1/3 width) */}
          <Box sx={{ flex: 1, minWidth: { lg: 300 } }}>
            <Box sx={{ position: { lg: 'sticky' }, top: 24 }}>
                <Card 
                    elevation={0}
                    sx={{ 
                        p: 3, 
                        borderRadius: 3, 
                        border: '1px solid', 
                        borderColor: theme.palette.divider 
                    }}
                >
                  <TodosFilters />
                </Card>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Todos;
