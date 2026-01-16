import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  type SelectChangeEvent,
  InputAdornment,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
  selectFilters,
  setCompletedFilter,
  setLimit,
  setPage,
  setSearch,
} from '../model/store/todosStore';
import { todoApiRTK } from '../api/todoApi';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';

const TodosFilters = () => {
  const theme = useTheme();
  const filters = useAppSelector(selectFilters);
  const dispatch = useAppDispatch();
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const prefetchTodos = todoApiRTK.usePrefetch('getTodos');

  const nextFilters = useMemo(() => ({ ...filters, page: filters.page + 1 }), [filters]);
  const prevFilters = useMemo(
    () => ({ ...filters, page: Math.max(1, filters.page - 1) }),
    [filters]
  );

  const currentPageResult = useAppSelector(state =>
    todoApiRTK.endpoints.getTodos.select(filters)(state)
  );

  const nextPageResult = useAppSelector(state =>
    todoApiRTK.endpoints.getTodos.select(nextFilters)(state)
  );

  const isNextKnownEmpty =
    nextPageResult.isSuccess && (nextPageResult.data?.length ?? 0) === 0;

  const isNextDisabled =
    isNextKnownEmpty ||
    (currentPageResult.isSuccess &&
      (currentPageResult.data?.length ?? 0) < filters.limit);

  useEffect(() => {
    if (!isNextKnownEmpty) {
      prefetchTodos(nextFilters, { force: false });
    }
    if (filters.page > 1) {
      prefetchTodos(prevFilters, { force: false });
    }
  }, [
    filters.page,
    filters.limit,
    filters.completed,
    filters.search,
    isNextKnownEmpty,
    nextFilters,
    prevFilters,
    prefetchTodos,
  ]);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    dispatch(setSearch(value));
  }, 800);

  useEffect(() => {
    if (
      currentPageResult.isSuccess &&
      currentPageResult.data?.length === 0 &&
      filters.page > 1
    ) {
      dispatch(setPage(filters.page - 1));
    }
  }, [currentPageResult.isSuccess, currentPageResult.data?.length, filters.page, dispatch]);

  const handleFilterChange = (_e: React.SyntheticEvent, value: 'true' | 'false' | 'all') => {
    dispatch(setPage(1));
    dispatch(setCompletedFilter(value));
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocalSearch(v);
    dispatch(setPage(1));
    debouncedSetSearch(v);
  };

  const handleChangeLimit = (e: SelectChangeEvent<number>) => {
    dispatch(setLimit(e.target.value as number));
    dispatch(setPage(1));
  };

  const handlePrevClick = () => {
    if (filters.page === 1) return;
    dispatch(setPage(filters.page - 1));
  };

  const handleNextClick = () => {
    if (isNextDisabled) return;
    dispatch(setPage(filters.page + 1));
  };

  const handleResetAll = () => {
    setLocalSearch('');
    dispatch(setCompletedFilter('all'));
    dispatch(setSearch(undefined));
    dispatch(setPage(1));
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Filters
          </Typography>
        </Box>
        <Tooltip title="Reset filters">
          <IconButton size="small" onClick={handleResetAll} color="inherit" sx={{ opacity: 0.7 }}>
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <TextField
        fullWidth
        placeholder="Search tasks..."
        value={localSearch}
        onChange={handleChangeSearch}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        variant="outlined"
        size="small"
        sx={{
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.default, 0.5),
            }
        }}
      />

      <Box>
        <Typography variant="subtitle2" gutterBottom color="text.secondary" fontWeight={600}>
          Status
        </Typography>
        <Tabs
          value={filters.completed}
          onChange={handleFilterChange}
          variant="fullWidth"
          sx={{
            minHeight: 40,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 40,
              fontSize: '0.875rem',
            },
          }}
        >
          <Tab label="All" value="all" />
          <Tab label="Active" value="false" />
          <Tab label="Done" value="true" />
        </Tabs>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <ViewHeadlineIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                Items per page
            </Typography>
        </Box>
        <Select
          value={filters.limit}
          fullWidth
          size="small"
          onChange={handleChangeLimit}
          sx={{
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.default, 0.5),
          }}
        >
          <MenuItem value={6}>6 tasks</MenuItem>
          <MenuItem value={10}>10 tasks</MenuItem>
          <MenuItem value={20}>20 tasks</MenuItem>
        </Select>
      </Box>

      <Divider />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">
            PAGE
          </Typography>
          <Typography variant="h6" fontWeight={800} color="primary">
            {filters.page}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={handlePrevClick}
            disabled={filters.page === 1}
            startIcon={<NavigateBeforeIcon />}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            Prev
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleNextClick}
            disabled={isNextDisabled}
            endIcon={<NavigateNextIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: theme.shadows[2],
            }}
          >
            Next
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          p: 1.5,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.1),
        }}
      >
        <Typography variant="caption" color="text.secondary">
            Currently showing <strong>{currentPageResult.data?.length ?? 0}</strong> tasks. 
            {isNextDisabled ? ' You reached the end.' : ' More tasks available on the next page.'}
        </Typography>
      </Box>
    </Stack>
  );
};

export default TodosFilters;
