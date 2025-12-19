import React, { useState, useEffect } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
  selectFilters,
  selectTodos,
  setCompletedFilter,
  setLimit,
  setPage,
  setSearch,
} from '../model/store/todosStore';
import { useDebouncedCallback } from 'use-debounce';
import { getNextPage } from '../api/todoApi';

const TodosFilters = () => {
  const filters = useAppSelector(selectFilters);
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const todosLenght = useAppSelector(selectTodos).length;
  const dispatch = useAppDispatch();
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  useEffect(() => {
    getNextPage(filters)
      .then(({ data }) => setIsNextDisabled(data.length === 0))
      .catch(() => setIsNextDisabled(true));
  }, [filters, filters.page]);

  // мемоизированная дебаунс-функция для поиска
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    dispatch(setSearch(value));
  }, 300);

  const handleFilterChange = (filter: 'true' | 'false' | 'all') => {
    dispatch(setCompletedFilter(filter));
  };

  // обновляем локальный стейт мгновенно и диспатчим в стор через дебаунс
  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocalSearch(v);
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
    if (todosLenght !== filters.limit) return;
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
                onClick={() => {
                  handleResetAll();
                }}
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
              ...Prev
            </Button>
            <Button onClick={handleNextClick} disabled={isNextDisabled}>
              Next...
            </Button>
          </ButtonGroup>
        </Accordion>
      </Paper>
    </>
  );
};

export default TodosFilters;
