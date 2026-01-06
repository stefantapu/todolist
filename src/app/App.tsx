import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import Todos from '../entities/Todo/ui/Todos.tsx';
import TodosFilters from '../entities/Todo/ui/TodosFilters.tsx';

function App() {
  return (
    <>
      <TodosFilters />
      <Todos />
    </>
  );
}

export default App;
