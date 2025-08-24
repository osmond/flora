import TaskList from '@/components/TaskList';
import { generateTasks } from '@/lib/tasks';

const samplePlants = [
  {
    id: '1',
    name: 'Monstera',
    waterEvery: '7 days',
    lastWateredAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: '2',
    name: 'Fiddle Leaf Fig',
    fertEvery: '30 days',
    lastFertilizedAt: new Date(Date.now() - 31 * 86400000).toISOString(),
  },
];

export default function TodayPage() {
  const tasks = generateTasks(samplePlants);
  return (
    <section className="p-4">
      <h1 className="mb-4 text-xl font-semibold">Today&apos;s Tasks</h1>
      <TaskList tasks={tasks} />
    </section>
  );
}
