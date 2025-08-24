import TaskList from '@/components/TaskList';
import type { Task } from '@/types/task';

const sampleTasks: Task[] = [
  {
    id: '1',
    plantName: 'Monstera',
    type: 'water',
    due: new Date().toISOString(),
  },
  {
    id: '2',
    plantName: 'Fiddle Leaf Fig',
    type: 'fertilize',
    due: new Date().toISOString(),
  },
  {
    id: '3',
    plantName: 'Snake Plant',
    type: 'note',
    due: new Date(Date.now() + 86400000).toISOString(),
  },
];

export default function TodayPage() {
  return (
    <section className="p-4">
      <h1 className="mb-4 text-xl font-semibold">Today&apos;s Tasks</h1>
      <TaskList tasks={sampleTasks} />
    </section>
  );
}
