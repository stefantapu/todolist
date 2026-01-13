import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SortableItemProps = {
  item: {
    id: string;
    title: string;
  };
};

export function SortableItem({ item }: SortableItemProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: 12,
    marginBottom: 8,
    background: 'white',
    border: '1px solid #ccc',
    borderRadius: 6,
    cursor: 'grab',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        console.log('click:', item.title);
      }}
    >
      {item.title}
    </div>
  );
}
