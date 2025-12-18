import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  Input,
  MenuItem,
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
import { useDebounce } from 'use-debounce';

const TodosFilters = () => {
  const filters = useAppSelector(selectFilters);
  const todosLenght = useAppSelector(selectTodos).length;
  const dispatch = useAppDispatch();
  const handleFilterChange = (filter: 'true' | 'false' | 'all') => {
    dispatch(setCompletedFilter(filter));
  };
  const hanldeChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
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

  return (
    <>
      <Accordion>
        <AccordionSummary>Filters</AccordionSummary>
        <AccordionDetails>
          <Input
            value={filters.search || ''}
            onChange={hanldeChangeSearch}
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
              onClick={() => handleFilterChange('all')}
              variant={filters.completed === 'all' ? 'contained' : 'outlined'}
            >
              All
            </Button>
          </ButtonGroup>
          <Select value={filters.limit} variant="filled" onChange={handleChangeLimit}>
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
          <Button onClick={handleNextClick} disabled={todosLenght !== filters.limit}>
            Next..
          </Button>
        </ButtonGroup>
      </Accordion>
    </>
  );
};

export default TodosFilters;
