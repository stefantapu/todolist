import type { TodoType } from './todoType';

export const mockTodos: TodoType[] = [
  {
    _id: '1',
    title: 'Buy groceries',
    order: 1,
    completed: false,
    description: 'Milk, bread, eggs, and coffee beans',
    createdAt: '2025-10-25T10:30:00Z',
    updatedAt: '2025-10-25T10:30:00Z',
  },
  {
    _id: '2',
    title: 'Finish React project',
    order: 2,
    completed: true,
    description: 'Complete authentication flow and polish UI',
    createdAt: '2025-10-20T09:00:00Z',
    updatedAt: '2025-10-24T16:00:00Z',
  },
  {
    _id: '3',
    title: 'Workout session',
    order: 3,
    completed: false,
    description: 'Leg day — squats, lunges, and stretching',
    createdAt: '2025-10-22T07:15:00Z',
    updatedAt: '2025-10-22T07:15:00Z',
  },
  {
    _id: '4',
    title: 'Read new JS articles',
    order: 4,
    completed: false,
    description: 'Check latest trends on React 19 and Vite performance updates',
    createdAt: '2025-10-23T18:45:00Z',
    updatedAt: '2025-10-23T18:45:00Z',
  },
  {
    _id: '5',
    title: 'Plan weekend trip',
    order: 5,
    completed: true,
    description:
      'Find a quiet place in the mountains, book Airbnb, prepare snacks',
    createdAt: '2025-10-19T14:20:00Z',
    updatedAt: '2025-10-25T11:10:00Z',
  },
];
