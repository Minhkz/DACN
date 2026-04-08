export default function SkeletonForm() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-10 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-10 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-20 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
