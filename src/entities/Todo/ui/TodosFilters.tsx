import React, { useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  Input,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
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

const TodosFilters = () => {
  const filters = useAppSelector(selectFilters);
  const dispatch = useAppDispatch();
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const prefetchTodos = todoApiRTK.usePrefetch('getTodos');

  const nextFilters = useMemo(() => ({ ...filters, page: filters.page + 1 }), [filters]);

  const prevFilters = useMemo(
    () => ({ ...filters, page: Math.max(1, filters.page - 1) }),
    [filters]
  );

  // текущее состояние страницы (из RTK Query cache)
  const currentPageResult = useAppSelector(state =>
    todoApiRTK.endpoints.getTodos.select(filters)(state)
  );

  // next страница (из cache, если уже префетчили/открывали)
  const nextPageResult = useAppSelector(state =>
    todoApiRTK.endpoints.getTodos.select(nextFilters)(state)
  );

  // если next страница уже в кэше и она пустая — дальше нельзя
  const isNextKnownEmpty =
    nextPageResult.isSuccess && (nextPageResult.data?.length ?? 0) === 0;

  const isNextDisabled =
    isNextKnownEmpty ||
    // эвристика: если текущая страница успешна и она не полная — next точно нет
    (currentPageResult.isSuccess &&
      (currentPageResult.data?.length ?? 0) < filters.limit);

  // префетчим next (и опционально prev) при изменении страницы/фильтров
  useEffect(() => {
    // next
    if (!isNextKnownEmpty) {
      prefetchTodos(nextFilters, { force: false });
    }
    // prev (необязательно, но делает Prev мгновенным)
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

  // мемоизированная дебаунс-функция для поиска
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    dispatch(setSearch(value));
  }, 800);

  const handleFilterChange = (filter: 'true' | 'false' | 'all') => {
    dispatch(setPage(1));
    dispatch(setCompletedFilter(filter));
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocalSearch(v);
    dispatch(setPage(1));
    debouncedSetSearch(v);
  };

  const handleChangeLimit = (e: SelectChangeEvent<number>) => {
    dispatch(setLimit(e.target.value));
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

  const handleResetPage = () => {
    dispatch(setPage(1));
  };

  return (
    <>
      <Paper elevation={24} sx={{ padding: 4, margin: 2, marginTop: 4 }}>
        <Accordion>
          <AccordionSummary>Filters</AccordionSummary>
          <AccordionDetails>
            <Input
              value={localSearch}
              onChange={handleChangeSearch}
              placeholder="Search..."
            />
            <ButtonGroup>
              <Button
                onClick={() => handleFilterChange('true')}
                variant={filters.completed === 'true' ? 'contained' : 'outlined'}
              >
                Completed
              </Button>
              <Button
                onClick={() => handleFilterChange('false')}
                variant={filters.completed === 'false' ? 'contained' : 'outlined'}
              >
                In Progress
              </Button>
              <Button
                onClick={handleResetAll}
                variant={filters.completed === 'all' ? 'contained' : 'outlined'}
              >
                All
              </Button>
            </ButtonGroup>

            <Select
              value={filters.limit}
              variant="filled"
              onChange={e => {
                handleResetPage();
                handleChangeLimit(e as SelectChangeEvent<number>);
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <ButtonGroup>
            <Button onClick={handlePrevClick} disabled={filters.page === 1}>
              ...Previouse Page
            </Button>
            <Button onClick={handleNextClick} disabled={isNextDisabled}>
              Next Page...
            </Button>
          </ButtonGroup>
        </Accordion>
      </Paper>
    </>
  );
};

export default TodosFilters;
